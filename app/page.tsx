"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"

type Entry = {
  id: string
  name: string
  email: string
  company?: string
  joinedAt?: any
  source: "waitlist" | "pitches"
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        // Fetch waitlist
        const waitRef = collection(db, "waitlist")
        let waitSnap
        try {
          waitSnap = await getDocs(query(waitRef, orderBy("joinedAt", "desc")))
        } catch {
          waitSnap = await getDocs(waitRef)
        }

        const waitItems: Entry[] = []
        waitSnap.forEach((doc) => {
          const d = doc.data() as any
          waitItems.push({
            id: doc.id,
            name: d.name || "Unknown",
            email: d.email || "",
            company: d.company,
            joinedAt: d.joinedAt,
            source: "waitlist",
          })
        })

        // Do not include pitches in the dashboard (treat as 0)
        setItems(waitItems)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const stats = useMemo(() => {
    const total = items.length
    const todayIso = new Date().toISOString().split("T")[0]
    const isToday = (val: any) => {
      if (!val) return false
      try {
        if (typeof val === "string") return val.startsWith(todayIso)
        if (val?.toDate) return val.toDate().toISOString().startsWith(todayIso)
        if (val?.seconds) return new Date(val.seconds * 1000).toISOString().startsWith(todayIso)
      } catch {}
      return false
    }
    const today = items.filter((i) => isToday(i.joinedAt)).length
    const waitTotal = items.filter((i) => i.source === "waitlist").length
    const pitchTotal = 0
    const gmail = items.filter((i) => i.email.toLowerCase().includes("@gmail.com")).length
    const outlook = items.filter((i) => i.email.toLowerCase().includes("@outlook.com") || i.email.toLowerCase().includes("@hotmail.com") || i.email.toLowerCase().includes("@live.com")).length
    const icloud = items.filter((i) => i.email.toLowerCase().includes("@icloud.com") || i.email.toLowerCase().includes("@me.com") || i.email.toLowerCase().includes("@mac.com")).length
    return { total, today, gmail, outlook, icloud, waitTotal, pitchTotal }
  }, [items])

  return (
    <DashboardLayout>
      <div className="space-y-6 px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground hidden sm:block">Overview of your waiting list.</p>
          {user && (
            <div className="mt-2">
              <p className="text-sm font-medium">Logged in as: <span className="text-primary">{user.email}</span></p>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <CardDescription className="hidden sm:block">All time</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <CardDescription className="hidden sm:block">Since 00:00</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.waitTotal}</div>
              <CardDescription className="hidden sm:block">Total waitlist entries</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pitches</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pitchTotal}</div>
              <CardDescription className="hidden sm:block">Total pitches</CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Latest entries</CardTitle>
            <CardDescription>Most recent 5 from waitlist and pitches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items
                .slice()
                .sort((a, b) => {
                  const toMs = (v: any) => {
                    if (!v) return 0
                    try {
                      if (typeof v === "string") return Date.parse(v) || 0
                      if (v?.toDate) return v.toDate().getTime()
                      if (v?.seconds) return v.seconds * 1000
                    } catch {}
                    return 0
                  }
                  return toMs(b.joinedAt) - toMs(a.joinedAt)
                })
                .slice(0, 5)
                .map((u) => (
                <div key={u.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate max-w-full">{u.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[80vw] sm:max-w-[40vw]">{u.email} • {u.source}</span>
                  </div>
                </div>
              ))}
              {!loading && items.length === 0 && (
                <div className="text-sm text-muted-foreground">No data yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
