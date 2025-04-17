"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Share2 } from "lucide-react"
import { toast } from "sonner"
import { observer } from "mobx-react-lite"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { PostReactions } from "@/components/post-reactions"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { UserProfile } from "@/components/user-profile"
import { PostComments } from "@/components/post-comments"
import { useCommentStore } from "@/lib/store"

interface PostCardProps {
  post: any
}

export const PostCard = observer(({ post }: PostCardProps) => {
  const { user } = useAuth()
  const commentStore = useCommentStore()
  const [showComments, setShowComments] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`)
    toast.success("Link copied", {
      description: "Post link has been copied to clipboard",
    })
  }

  const handleReport = () => {
    toast.info("Report submitted", {
      description: "Thank you for reporting this content. Our team will review it.",
    })
  }

  const formattedDate = post.created_at
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
    : "recently"

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 pb-4">
        <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
          <DialogTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage
                src={post.author?.avatar_url || "/placeholder.svg?height=40&width=40"}
                alt={post.author?.full_name || "User"}
              />
              <AvatarFallback>{post.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            {post.author?.id && <UserProfile userId={post.author.id} />}
          </DialogContent>
        </Dialog>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => setShowUserProfile(true)} className="font-semibold hover:underline">
                {post.author?.full_name || "Anonymous User"}
              </button>
              <div className="text-xs text-muted-foreground">
                {post.author?.title || "Community Member"} • {formattedDate}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>Share</DropdownMenuItem>
                <DropdownMenuItem>Save</DropdownMenuItem>
                {user?.id === post.author_id && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleReport} className="text-red-500">
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link href={`/posts/${post.id}`}>
            <h3 className="font-semibold hover:underline">{post.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
        </div>
      </CardHeader>
      {post.image_url && (
        <CardContent className="px-4 pb-4 pt-0">
          <Link href={`/posts/${post.id}`}>
            <div className="overflow-hidden rounded-md">
              <img
                src={post.image_url || "/placeholder.svg"}
                alt={post.title}
                className="aspect-video w-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </Link>
        </CardContent>
      )}
      <CardFooter className="border-t px-4 py-3 flex flex-col">
        <div className="flex items-center gap-4 w-full">
          <PostReactions
            postId={post.id}
            commentCount={commentStore.getCommentCount(post.id)}
            onCommentClick={() => setShowComments(!showComments)}
          />
          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t w-full">
            <PostComments postId={post.id} />
          </div>
        )}
      </CardFooter>
    </Card>
  )
})

export default PostCard
