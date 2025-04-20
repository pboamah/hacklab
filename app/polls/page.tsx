"use client"

import { observer } from "mobx-react-lite"
import { PollList } from "@/components/poll/poll-list"
import { DashboardShell } from "@/components/dashboard-shell"

const PollsPage = observer(() => {
  return (
    <DashboardShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Polls</h1>
        <PollList />
      </div>
    </DashboardShell>
  )
})

export default PollsPage
