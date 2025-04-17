import { DashboardShell } from "@/components/dashboard-shell"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BadgesAdminLoading() {
  return (
    <DashboardShell>
      <AdminLayout>
        <div className="container py-10">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    </DashboardShell>
  )
}
