import { Skeleton } from "@/components/ui/skeleton"
import DashboardShell from "@/components/dashboard-shell"

export default function CreatePostLoading() {
  return (
    <DashboardShell>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>

        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-72 mb-6" />

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-64 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
