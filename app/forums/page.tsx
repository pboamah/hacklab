import { ForumList } from "@/components/forum/forum-list"
import { DashboardShell } from "@/components/dashboard-shell"

export default function ForumsPage() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Forums</h1>
        <ForumList />
      </div>
    </DashboardShell>
  )
}
