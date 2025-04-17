"use client"

import { useEffect } from "react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { BarChart2, Plus, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { usePollStore } from "@/lib/store/root-store"
import { useAuth } from "@/contexts/auth-context"

interface PollListProps {
  communityId?: string
}

export const PollList = observer(({ communityId }: PollListProps) => {
  const pollStore = usePollStore()
  const { user } = useAuth()

  useEffect(() => {
    if (communityId) {
      pollStore.fetchCommunityPolls(communityId)
    } else {
      pollStore.fetchPolls()
    }
  }, [pollStore, communityId])

  const polls = communityId ? pollStore.communityPolls[communityId] || [] : pollStore.polls

  if (pollStore.isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (polls.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No Polls Found</CardTitle>
          <CardDescription>There are no polls available at the moment.</CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <Button asChild>
              <Link href={communityId ? `/communities/${communityId}/polls/create` : "/polls/create"}>
                <Plus className="mr-2 h-4 w-4" />
                Create Poll
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <Card key={poll.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Link href={`/polls/${poll.id}`} className="hover:underline">
                  {poll.title}
                </Link>
              </CardTitle>
              <Badge variant={poll.status === "active" ? "default" : "secondary"}>
                {poll.status === "active" ? "Active" : "Closed"}
              </Badge>
            </div>
            {poll.description && <CardDescription>{poll.description}</CardDescription>}
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              {poll.options?.slice(0, 3).map((option) => (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                    <span>
                      {option.vote_count} votes ({option.percentage}%)
                    </span>
                  </div>
                  <Progress value={option.percentage} className="h-2" />
                </div>
              ))}
              {poll.options && poll.options.length > 3 && (
                <div className="text-sm text-muted-foreground text-center">
                  + {poll.options.length - 3} more options
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <BarChart2 className="mr-1 h-4 w-4" />
                {poll.total_votes} votes
              </div>
              {poll.expires_at && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Expires {formatDistanceToNow(new Date(poll.expires_at), { addSuffix: true })}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/polls/${poll.id}`}>View Poll</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
})
