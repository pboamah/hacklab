"use client"

import { observer } from "mobx-react-lite"
import { GroupList } from "@/components/group/group-list"
import { DashboardShell } from "@/components/dashboard-shell"

const GroupsPage = observer(() => {
  return (
    <DashboardShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Groups</h1>
        <GroupList />
      </div>
    </DashboardShell>
  )
})

export default GroupsPage
