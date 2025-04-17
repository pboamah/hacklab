import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function MessagesLoading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Users list skeleton */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader className="p-4">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <div className="h-[calc(100vh-300px)] overflow-auto">
              <div className="p-4 space-y-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-3 py-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          {/* Chat area skeleton */}
          <Card className="md:col-span-2 flex flex-col">
            <CardHeader className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>

            <div className="flex-1 p-4 h-[calc(100vh-400px)] overflow-auto">
              <div className="space-y-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                      <Skeleton className={`h-16 ${i % 2 === 0 ? "w-2/3" : "w-1/2"} rounded-lg`} />
                    </div>
                  ))}
              </div>
            </div>

            <CardContent className="p-4 border-t mt-auto">
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
