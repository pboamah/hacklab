import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreateHackathonLoading() {
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
              <Skeleton className="h-40 w-full" />
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
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
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
              <Skeleton className="h-40 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-40" />
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
