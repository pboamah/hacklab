import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function GamificationLoading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between mb-6">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-10" />
                  </div>

                  <Skeleton className="h-5 w-32 mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-10 rounded-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="leaderboard">
            <TabsList className="mb-6">
              <TabsTrigger value="leaderboard" disabled>
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="badges" disabled>
                Available Badges
              </TabsTrigger>
            </TabsList>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-10 w-10 rounded-full" />
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
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}
