import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfileLoading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-40 mb-6" />

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="gamification">
            <TabsList className="mb-6">
              <TabsTrigger value="gamification">Gamification</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="gamification">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}
