import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
