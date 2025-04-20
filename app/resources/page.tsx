import { observer } from "mobx-react-lite"
import { ResourceList } from "@/components/resource/resource-list"
import { DashboardShell } from "@/components/dashboard-shell"

const ResourcesPage = observer(() => {
  return (
    <DashboardShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Resources</h1>
        <ResourceList />
      </div>
    </DashboardShell>
  )
})

export default ResourcesPage
