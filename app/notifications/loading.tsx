import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsLoading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="flex gap-2 mb-6">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>

          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
