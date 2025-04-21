"use client"

import { CardFooter } from "@/components/ui/card"

import { useEffect } from "react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { MessageSquare, Plus, Users, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useForumStore } from "@/lib/store/root-store"
import { useAuth } from "@/contexts/auth-context"

interface ForumListProps {
  communityId?: string
}

export const ForumList = observer(({ communityId }: ForumListProps) => {
  const forumStore = useForumStore()
  const { user } = useAuth()

  useEffect(() => {
    if (communityId) {
      forumStore.fetchCommunityForums(communityId)
    } else {
      forumStore.fetchForums()
    }
  }, [forumStore, communityId])

  const forums = communityId ? forumStore.communityForums[communityId] || [] : forumStore.forums

  if (forumStore.isLoading) {
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
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!forumStore.isLoading && (!forums || forums.length === 0)) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No Forums Found</CardTitle>
          <CardDescription>There are no forums available at the moment.</CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <Button asChild>
              <Link href={communityId ? `/communities/${communityId}/forums/create` : "/forums/create"}>
                <Plus className="mr-2 h-4 w-4" />
                Create Forum
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {forums &&
        forums.map((forum) => (
          <Card key={forum.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  <Link href={`/forums/${forum.id}`} className="hover:underline">
                    {forum.name}
                  </Link>
                </CardTitle>
                <Badge variant="outline">{forum.topic_count} topics</Badge>
              </div>
              <CardDescription>{forum.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  {forum.post_count} posts
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  Active users
                </div>
                {forum.last_activity && (
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Last activity {formatDistanceToNow(new Date(forum.last_activity), { addSuffix: true })}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/forums/${forum.id}`}>View Forum</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  )
})
