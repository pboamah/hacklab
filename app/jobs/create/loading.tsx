import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function JobCreateLoading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
