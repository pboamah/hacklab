"use client"

import { useEffect } from "react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { Users, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroupStore } from "@/lib/store/root-store"
import { useAuth } from "@/contexts/auth-context"

interface GroupListProps {
  communityId?: string
}

export const GroupList = observer(({ communityId }: GroupListProps) => {
  const groupStore = useGroupStore()
  const { user } = useAuth()

  useEffect(() => {
    if (communityId) {
      groupStore.fetchCommunityGroups(communityId)
    } else {
      groupStore.fetchGroups()
    }
  }, [groupStore, communityId])

  const groups = communityId ? groupStore.communityGroups[communityId] || [] : groupStore.groups

  if (groupStore.isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No Groups Found</CardTitle>
          <CardDescription>There are no groups available at the moment.</CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <Button asChild>
              <Link href={communityId ? `/communities/${communityId}/groups/create` : "/groups/create"}>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Link href={`/groups/${group.id}`} className="hover:underline">
                  {group.name}
                </Link>
              </CardTitle>
              <Badge variant="outline">{group.member_count} members</Badge>
            </div>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {group.member_count} members
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/groups/${group.id}`}>View Group</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
})
