"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserPlus, Loader2, RefreshCw, Download, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface WaitinglistItem {
  id: string
  name: string
  email: string
  company?: string
  joinedAt: string
  status: string
  [key: string]: any
}

export default function WaitinglistPage() {
  const [waitinglistItems, setWaitinglistItems] = useState<WaitinglistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [exportFileName, setExportFileName] = useState("")
  const itemsPerPage = 50

  useEffect(() => {
    const fetchWaitinglist = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try multiple possible collection names
        const possibleCollections = ["waitlist", "users", "waitlistUsers", "waitinglist", "applications"]
        
        let querySnapshot = null
        let collectionName = ""
        
        // Try each collection name until we find one with data
        for (const collName of possibleCollections) {
          try {
            const collectionRef = collection(db, collName)
            querySnapshot = await getDocs(collectionRef)
            
            if (querySnapshot.size > 0) {
              collectionName = collName
              break
            }
          } catch (err) {
            // Collection doesn't exist or error
          }
        }
        
        // If we didn't find data, try waitlist with orderBy as fallback
        if (!querySnapshot || querySnapshot.size === 0) {
          const waitlistRef = collection(db, "waitlist")
          try {
            const q = query(waitlistRef, orderBy("joinedAt", "desc"))
            querySnapshot = await getDocs(q)
            collectionName = "waitlist"
          } catch (orderError) {
            querySnapshot = await getDocs(waitlistRef)
            collectionName = "waitlist"
          }
        }
        
        if (!querySnapshot) {
          throw new Error("Could not connect to Firestore. Please check your connection.")
        }
        
        const items: WaitinglistItem[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          
          // Format the date if it's a Firestore timestamp
          let joinedAt = data.joinedAt || data.createdAt || data.date
          if (joinedAt) {
            if (joinedAt?.toDate) {
              joinedAt = joinedAt.toDate().toISOString().split('T')[0]
            } else if (joinedAt?.seconds) {
              joinedAt = new Date(joinedAt.seconds * 1000).toISOString().split('T')[0]
            } else if (typeof joinedAt === 'string') {
              joinedAt = joinedAt.split('T')[0]
            }
          } else {
            joinedAt = new Date().toISOString().split('T')[0]
          }
          
          items.push({
            id: doc.id,
            name: data.name || data.fullName || data.firstName || "Unknown",
            email: data.email || "",
            company: data.company || data.companyName || data.organization || "",
            joinedAt: joinedAt,
            status: data.status || "pending",
            ...data
          })
        })
        
        setWaitinglistItems(items)
      } catch (err: any) {
        setError(
          err?.message || 
          "Failed to load waiting list data. Please check your Firestore connection and make sure the collection 'waitlist' exists."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchWaitinglist()
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleExportCSV = async () => {
    setExportDialogOpen(true)
    setExportSuccess(false)
    
    // Create CSV content - only name and email
    const headers = ["Name", "Email"]
    const rows = waitinglistItems.map(item => [
      item.name,
      item.email
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n")
    
    const fileName = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`
    setExportFileName(fileName)
    
    // Small delay to show the dialog
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Create and download file
    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setExportSuccess(true)
    } catch (err) {
      setExportSuccess(false)
      setError("Failed to export CSV file")
      setExportDialogOpen(false)
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(waitinglistItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = waitinglistItems.slice(startIndex, endIndex)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading waiting list...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Waiting List</h1>
            <p className="text-muted-foreground">
              Manage and review applications from interested parties.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitinglistItems.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Waiting List Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Review and manage waiting list applications ({waitinglistItems.length} total)
              {totalPages > 1 && ` - Showing ${startIndex + 1}-${Math.min(endIndex, waitinglistItems.length)} of ${waitinglistItems.length}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {waitinglistItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No applications found in the waiting list.</p>
                <p className="text-sm mt-2">The code will check these collections: waitlist, users, waitlistUsers, waitinglist, applications</p>
                <p className="text-xs mt-1">Check your browser console for which collections were tried.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt={item.name} />
                          <AvatarFallback>
                            {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.email}</p>
                          {item.company && (
                            <p className="text-sm text-muted-foreground">{item.company}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {exportSuccess ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Export Successful
                </>
              ) : (
                "Exporting CSV"
              )}
            </DialogTitle>
            <DialogDescription>
              {exportSuccess ? (
                <>
                  Your CSV file has been downloaded successfully.
                  <br />
                  <span className="font-mono text-sm mt-2 block">{exportFileName}</span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing your CSV file for download...
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {exportSuccess ? (
              <Button onClick={() => setExportDialogOpen(false)}>Close</Button>
            ) : (
              <Button variant="outline" disabled>
                Exporting...
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
