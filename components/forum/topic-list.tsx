"use client"

import { useEffect } from "react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { MessageSquare, Eye, Clock, Pin, Lock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useForumStore } from "@/lib/store"

interface TopicListProps {
  forumId: string
}

export const TopicList = observer(({ forumId }: TopicListProps) => {
  const forumStore = useForumStore()

  useEffect(() => {
    forumStore.fetchForumById(forumId)
    forumStore.fetchForumTopics(forumId)
  }, [forumStore, forumId])

  const forum = forumStore.currentForum
  const topics = forumStore.getForumTopics(forumId)

  if (forumStore.isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!forum) {
    return <div>Forum not found</div>
  }

  if (topics.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No Topics Found</CardTitle>
          <CardDescription>There are no topics in this forum yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={`/forums/${forumId}/topics/create`}>Start a New Topic</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <Card key={topic.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={topic.author?.avatar_url || "/placeholder.svg?height=40&width=40"}
                    alt={topic.author?.full_name || "User"}
                  />
                  <AvatarFallback>{topic.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Link href={`/forums/${forumId}/topics/${topic.id}`} className="hover:underline">
                      {topic.title}
                    </Link>
                    {topic.is_pinned && <Pin className="ml-2 h-4 w-4 text-muted-foreground" />}
                    {topic.is_locked && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>
                    Posted by {topic.author?.full_name || "Anonymous"} •{" "}
                    {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                  </CardDescription>
                </div>
              </div>
              {topic.is_pinned && <Badge variant="secondary">Pinned</Badge>}
              {topic.is_locked && <Badge variant="outline">Locked</Badge>}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-muted-foreground line-clamp-2">{topic.content}</p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  {topic.reply_count} replies
                </div>
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {topic.view_count} views
                </div>
                {topic.last_reply_at && (
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Last reply {formatDistanceToNow(new Date(topic.last_reply_at), { addSuffix: true })}
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/forums/${forumId}/topics/${topic.id}`}>View Topic</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
})
