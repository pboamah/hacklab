"use client"

import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Heart, ThumbsUp, Laugh, Angry, Smile, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUserStore, useReactionStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import type { ReactionType } from "@/lib/store/reaction-store"

interface PostReactionsProps {
  postId: string
  commentCount?: number
  onCommentClick?: () => void
}

export const PostReactions = observer(({ postId, commentCount = 0, onCommentClick }: PostReactionsProps) => {
  const userStore = useUserStore()
  const reactionStore = useReactionStore()

  useEffect(() => {
    reactionStore.fetchReactions(postId)
  }, [reactionStore, postId])

  const handleReaction = async (type: ReactionType) => {
    if (!userStore.currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to react to posts",
        variant: "destructive",
      })
      return
    }

    try {
      await reactionStore.addReaction(postId, type)
    } catch (error) {
      console.error("Error handling reaction:", error)
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive",
      })
    }
  }

  const getReactionIcon = (type: ReactionType) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4" />
      case "love":
        return <Heart className="h-4 w-4" />
      case "laugh":
        return <Laugh className="h-4 w-4" />
      case "wow":
        return <Smile className="h-4 w-4" />
      case "angry":
        return <Angry className="h-4 w-4" />
      default:
        return <ThumbsUp className="h-4 w-4" />
    }
  }

  const reactions = reactionStore.getPostReactions(postId)
  const reactionCounts = reactionStore.getReactionCounts(postId)
  const totalReactions = reactionStore.getTotalReactionCount(postId)
  const userReaction = userStore.currentUser
    ? reactionStore.getUserReaction(postId, userStore.currentUser.id)?.type
    : undefined

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${userReaction ? "text-primary" : ""}`}
            disabled={reactionStore.isLoading}
          >
            {userReaction ? getReactionIcon(userReaction) : <ThumbsUp className="h-4 w-4" />}
            <span>{totalReactions > 0 ? totalReactions : ""}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${userReaction === "like" ? "bg-primary/20" : ""}`}
                    onClick={() => handleReaction("like")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like ({reactionCounts.like || 0})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${userReaction === "love" ? "bg-primary/20" : ""}`}
                    onClick={() => handleReaction("love")}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Love ({reactionCounts.love || 0})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${userReaction === "laugh" ? "bg-primary/20" : ""}`}
                    onClick={() => handleReaction("laugh")}
                  >
                    <Laugh className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Haha ({reactionCounts.laugh || 0})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${userReaction === "wow" ? "bg-primary/20" : ""}`}
                    onClick={() => handleReaction("wow")}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Wow ({reactionCounts.wow || 0})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${userReaction === "angry" ? "bg-primary/20" : ""}`}
                    onClick={() => handleReaction("angry")}
                  >
                    <Angry className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Angry ({reactionCounts.angry || 0})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={onCommentClick}>
        <MessageSquare className="h-4 w-4" />
        <span>{commentCount}</span>
      </Button>
    </div>
  )
})
