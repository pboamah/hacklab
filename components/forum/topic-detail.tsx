"use client"

import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, ThumbsUp, Award, Flag, Share2, Reply, MoreHorizontal, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useForumStore } from "@/lib/store"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

interface TopicDetailProps {
  topicId: string
}

export const TopicDetail = observer(({ topicId }: TopicDetailProps) => {
  const forumStore = useForumStore()
  const { user } = useAuth()
  const [replyContent, setReplyContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    forumStore.fetchTopicById(topicId)
    forumStore.fetchTopicPosts(topicId)
  }, [forumStore, topicId])

  const topic = forumStore.currentTopic
  const posts = forumStore.getTopicPosts(topicId)

  const handleSubmitReply = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to reply",
        variant: "destructive",
      })
      return
    }

    if (!replyContent.trim()) return

    try {
      await forumStore.createPost({
        content: replyContent,
        topicId,
        parentId: replyingTo || undefined,
      })
      setReplyContent("")
      setReplyingTo(null)
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully",
      })
    } catch (error) {
      console.error("Error posting reply:", error)
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsSolution = async (postId: string) => {
    try {
      await forumStore.markPostAsSolution(postId, topicId)
      toast({
        title: "Solution marked",
        description: "This post has been marked as the solution",
      })
    } catch (error) {
      console.error("Error marking solution:", error)
      toast({
        title: "Error",
        description: "Failed to mark solution. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReactToPost = async (postId: string, reaction: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to react to posts",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if user already reacted with this reaction
      const post = posts.find((p) => p.id === postId)
      const hasReacted = post?.reactions.some((r: any) => r.user_id === user.id && r.reaction_type === reaction)

      if (hasReacted) {
        await forumStore.removeReaction(postId, reaction)
      } else {
        await forumStore.reactToPost(postId, reaction)
      }
    } catch (error) {
      console.error("Error reacting to post:", error)
      toast({
        title: "Error",
        description: "Failed to react to post. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (forumStore.isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardFooter>
        </Card>

        <Separator />

        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!topic) {
    return <div>Topic not found</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={topic.author?.avatar_url || "/placeholder.svg?height=40&width=40"}
                alt={topic.author?.full_name || "User"}
              />
              <AvatarFallback>{topic.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{topic.title}</h2>
              <p className="text-sm text-muted-foreground">
                Posted by {topic.author?.full_name || "Anonymous"} •{" "}
                {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>{topic.content}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleReactToPost(topic.id, "like")}>
              <ThumbsUp className="mr-2 h-4 w-4" />
              Like
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Eye className="mr-1 h-4 w-4" />
              {topic.view_count} views
            </Badge>
            <Badge variant="outline">
              <MessageSquare className="mr-1 h-4 w-4" />
              {posts.length} replies
            </Badge>
          </div>
        </CardFooter>
      </Card>

      <Separator />

      {posts.map((post) => (
        <Card key={post.id} className={post.is_solution ? "border-green-500" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={post.author?.avatar_url || "/placeholder.svg?height=40&width=40"}
                    alt={post.author?.full_name || "User"}
                  />
                  <AvatarFallback>{post.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author?.full_name || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              {post.is_solution && (
                <Badge variant="success" className="bg-green-500">
                  <Award className="mr-1 h-4 w-4" />
                  Solution
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p>{post.content}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(post.id)}>
                <Reply className="mr-1 h-4 w-4" />
                Reply
              </Button>
              <Button
                variant={
                  post.reactions.some((r: any) => r.user_id === user?.id && r.reaction_type === "like")
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                onClick={() => handleReactToPost(post.id, "like")}
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                {post.reactions.filter((r: any) => r.reaction_type === "like").length}
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user?.id === topic.author_id && !post.is_solution && (
                  <DropdownMenuItem onClick={() => handleMarkAsSolution(post.id)}>
                    <Award className="mr-2 h-4 w-4" />
                    Mark as Solution
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
          {replyingTo === post.id && (
            <div className="px-6 pb-6">
              <Textarea
                placeholder={`Reply to ${post.author?.full_name || "Anonymous"}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px] mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReply} disabled={!replyContent.trim()}>
                  Post Reply
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}

      {!replyingTo && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Post a Reply</h3>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmitReply} disabled={!replyContent.trim() || topic.is_locked}>
              {topic.is_locked ? "Topic is Locked" : "Post Reply"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
})
