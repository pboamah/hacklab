"use client"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { ForumList } from "@/components/forum/forum-list"
import { DashboardShell } from "@/components/dashboard-shell"
import { useForumStore } from "@/lib/store/root-store"

const ForumsPage = observer(() => {
  const forumStore = useForumStore()

  useEffect(() => {
    forumStore.fetchCategories()
  }, [forumStore])

  return (
    <DashboardShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Forums</h1>
        <ForumList />
      </div>
    </DashboardShell>
  )
})

export default ForumsPage
