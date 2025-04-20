import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <Skeleton className="mx-auto h-10 w-40" />
            <Skeleton className="mx-auto h-4 w-64 mt-4" />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
