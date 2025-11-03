import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Megaphone } from "lucide-react"

export default function PitchesPage() {

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pitches</h1>
          <p className="text-muted-foreground">
            Review and manage startup pitches submitted by founders.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pitches</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No pitches found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

