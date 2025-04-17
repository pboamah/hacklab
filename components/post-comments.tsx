"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { formatDistanceToNow } from "date-fns"
import { Reply } from "lucide-react"
import { useCommentStore, useUserStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import type { Comment } from "@/lib/store/comment-store"

interface PostCommentsProps {
  postId: string
}

export const PostComments = observer(({ postId }: PostCommentsProps) => {
  const commentStore = useCommentStore()
  const userStore = useUserStore()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    commentStore.fetchComments(postId)
  }, [commentStore, postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userStore.currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) return

    try {
      await commentStore.addComment(postId, newComment)
      setNewComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!userStore.currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to reply",
        variant: "destructive",
      })
      return
    }

    if (!replyContent.trim()) return

    try {
      await commentStore.addComment(postId, replyContent, parentId)
      setReplyingTo(null)
      setReplyContent("")
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully",
      })
    } catch (error) {
      console.error("Error adding reply:", error)
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  const comments = commentStore.getPostComments(postId)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Comments ({commentStore.getCommentCount(postId)})</h3>

      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={commentStore.isLoading || !newComment.trim()}>
            {commentStore.isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      <Separator />

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyingTo={setReplyingTo}
              setReplyContent={setReplyContent}
              onSubmitReply={handleSubmitReply}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
})

interface CommentItemProps {
  comment: Comment
  replyingTo: string | null
  replyContent: string
  setReplyingTo: (id: string | null) => void
  setReplyContent: (content: string) => void
  onSubmitReply: (parentId: string) => void
  level?: number
}

const CommentItem = observer(
  ({
    comment,
    replyingTo,
    replyContent,
    setReplyingTo,
    setReplyContent,
    onSubmitReply,
    level = 0,
  }: CommentItemProps) => {
    const commentStore = useCommentStore()
    const isReplying = replyingTo === comment.id

    const formattedDate = comment.created_at
      ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
      : "recently"

    return (
      <div className={`space-y-4 ${level > 0 ? "ml-8 pl-4 border-l" : ""}`}>
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={comment.user?.avatar_url || "/placeholder.svg?height=40&width=40"}
              alt={comment.user?.full_name || "User"}
            />
            <AvatarFallback>{comment.user?.full_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{comment.user?.full_name || "Anonymous User"}</span>
                <span className="text-xs text-muted-foreground ml-2">{formattedDate}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </div>
            <p className="text-sm">{comment.content}</p>

            {isReplying && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder={`Reply to ${comment.user?.full_name || "Anonymous"}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSubmitReply(comment.id)}
                    disabled={commentStore.isLoading || !replyContent.trim()}
                  >
                    {commentStore.isLoading ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4 mt-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replyingTo={replyingTo}
                replyContent={replyContent}
                setReplyingTo={setReplyingTo}
                setReplyContent={setReplyContent}
                onSubmitReply={onSubmitReply}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  },
)
