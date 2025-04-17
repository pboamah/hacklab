import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchLoading() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-40 mb-6" />

          <div className="flex gap-2 mb-8">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="flex gap-2 mb-6">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
          </div>

          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
