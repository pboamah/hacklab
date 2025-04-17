import { ResourceList } from "@/components/resource/resource-list"
import { DashboardShell } from "@/components/dashboard-shell"

export default function ResourcesPage() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Resources</h1>
        <ResourceList />
      </div>
    </DashboardShell>
  )
}
