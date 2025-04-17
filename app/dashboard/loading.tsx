import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-64 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle>
                    <Skeleton className="h-6 w-40" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-4 w-32" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <div className="mt-6">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-10 rounded-full" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-10" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
