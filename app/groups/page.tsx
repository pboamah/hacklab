import { GroupList } from "@/components/group/group-list"
import { DashboardShell } from "@/components/dashboard-shell"

export default function GroupsPage() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Groups</h1>
        <GroupList />
      </div>
    </DashboardShell>
  )
}
