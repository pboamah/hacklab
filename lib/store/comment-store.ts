import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase/client"
import type { RootStore } from "./root-store"
import { awardPoints, PointsCategory } from "@/lib/gamification"

export interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_id?: string
  content: string
  created_at: string
  updated_at?: string
  user?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  replies?: Comment[]
}

export class CommentStore {
  comments: Map<string, Comment[]> = new Map() // postId -> comments
  isLoading = false
  error: string | null = null
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
    })
  }

  // Actions
  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  setComments = (postId: string, comments: Comment[]) => {
    this.comments.set(postId, comments)
  }

  // Async actions
  fetchComments = async (postId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:user_id (id, full_name, avatar_url)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

      if (error) throw error

      // Organize comments into a tree structure
      const commentMap = new Map<string, Comment>()
      const rootComments: Comment[] = []

      // First pass: add all comments to the map
      data.forEach((comment: any) => {
        const formattedComment: Comment = {
          ...comment,
          replies: [],
        }
        commentMap.set(comment.id, formattedComment)
      })

      // Second pass: organize into tree structure
      data.forEach((comment: any) => {
        if (comment.parent_id) {
          const parentComment = commentMap.get(comment.parent_id)
          if (parentComment && parentComment.replies) {
            parentComment.replies.push(commentMap.get(comment.id)!)
          }
        } else {
          rootComments.push(commentMap.get(comment.id)!)
        }
      })

      runInAction(() => {
        this.setComments(postId, rootComments)
      })

      return rootComments
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch comments")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  addComment = async (postId: string, content: string, parentId?: string) => {
    if (!this.rootStore.userStore.currentUser || !content.trim()) return null

    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const userId = this.rootStore.userStore.currentUser.id

      const newComment = {
        post_id: postId,
        user_id: userId,
        parent_id: parentId || null,
        content: content.trim(),
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("comments").insert(newComment).select("*").single()

      if (error) throw error

      // Add user info to the comment
      const enrichedComment: Comment = {
        ...data,
        user: {
          id: userId,
          full_name: this.rootStore.userStore.currentUser.full_name,
          avatar_url: this.rootStore.userStore.currentUser.avatar_url,
        },
        replies: [],
      }

      runInAction(() => {
        const existingComments = this.getPostComments(postId)

        if (parentId) {
          // Add as a reply to a parent comment
          const updatedComments = this.addReplyToComment(existingComments, parentId, enrichedComment)
          this.setComments(postId, updatedComments)
        } else {
          // Add as a root comment
          this.setComments(postId, [...existingComments, enrichedComment])
        }
      })

      await awardPoints(userId, PointsCategory.COMMENT, `Commented on a post`)

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to add comment")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  // Helper method to add a reply to a nested comment
  private addReplyToComment = (comments: Comment[], parentId: string, newReply: Comment): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        }
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: this.addReplyToComment(comment.replies, parentId, newReply),
        }
      }
      return comment
    })
  }

  // Computed properties
  getPostComments = (postId: string) => {
    return this.comments.get(postId) || []
  }

  getCommentCount = (postId: string) => {
    const comments = this.getPostComments(postId)
    let count = comments.length

    // Count all nested replies
    const countReplies = (replies?: Comment[]) => {
      if (!replies) return 0
      let replyCount = replies.length
      for (const reply of replies) {
        replyCount += countReplies(reply.replies)
      }
      return replyCount
    }

    for (const comment of comments) {
      count += countReplies(comment.replies)
    }

    return count
  }
}
