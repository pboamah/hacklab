import { PollList } from "@/components/poll/poll-list"
import { DashboardShell } from "@/components/dashboard-shell"

export default function PollsPage() {
  return (
    <DashboardShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Polls</h1>
        <PollList />
      </div>
    </DashboardShell>
  )
}
