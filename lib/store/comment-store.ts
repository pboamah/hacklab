import { makeAutoObservable, runInAction } from "mobx"
import type { RootStore } from "./index"

export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  parentId?: string
  entityType: "post" | "event" | "hackathon" | "project" | "resource"
  entityId: string
  createdAt: string
  updatedAt: string
  reactions?: { [key: string]: number }
  replies?: Comment[]
}

export class CommentStore {
  comments: Record<string, Comment[]> = {} // entityId -> comments
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
  setComments = (entityId: string, comments: Comment[]) => {
    this.comments[entityId] = comments
  }

  addComment = (entityId: string, comment: Comment) => {
    if (!this.comments[entityId]) {
      this.comments[entityId] = []
    }

    if (comment.parentId) {
      // Add as a reply to parent comment
      this.comments[entityId] = this.comments[entityId].map((c) => {
        if (c.id === comment.parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), comment],
          }
        }
        return c
      })
    } else {
      // Add as a top-level comment
      this.comments[entityId].push(comment)
    }
  }

  updateComment = (entityId: string, commentId: string, content: string) => {
    this.comments[entityId] = this.comments[entityId].map((c) => {
      if (c.id === commentId) {
        return { ...c, content, updatedAt: new Date().toISOString() }
      }

      // Check in replies
      if (c.replies) {
        const updatedReplies = c.replies.map((r) => {
          if (r.id === commentId) {
            return { ...r, content, updatedAt: new Date().toISOString() }
          }
          return r
        })
        return { ...c, replies: updatedReplies }
      }

      return c
    })
  }

  deleteComment = (entityId: string, commentId: string) => {
    // Remove top-level comment
    this.comments[entityId] = this.comments[entityId].filter((c) => c.id !== commentId)

    // Or remove from replies
    this.comments[entityId] = this.comments[entityId].map((c) => {
      if (c.replies) {
        return {
          ...c,
          replies: c.replies.filter((r) => r.id !== commentId),
        }
      }
      return c
    })
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchComments = async (entityType: string, entityId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockComments: Comment[] = [
        {
          id: "1",
          content: "This is a great post!",
          authorId: "user1",
          authorName: "John Doe",
          authorAvatar: "/avatars/01.png",
          entityType: "post" as const,
          entityId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reactions: { "👍": 5, "❤️": 2 },
          replies: [
            {
              id: "2",
              content: "I agree with you!",
              authorId: "user2",
              authorName: "Jane Smith",
              authorAvatar: "/avatars/02.png",
              parentId: "1",
              entityType: "post" as const,
              entityId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              reactions: { "👍": 1 },
            },
          ],
        },
        {
          id: "3",
          content: "Looking forward to more content like this.",
          authorId: "user3",
          authorName: "Bob Johnson",
          authorAvatar: "/avatars/03.png",
          entityType: "post" as const,
          entityId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reactions: { "👍": 3 },
        },
      ]

      runInAction(() => {
        this.setComments(entityId, mockComments)
      })

      return mockComments
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

  createComment = async (entityType: string, entityId: string, content: string, parentId?: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content,
        authorId: "current-user",
        authorName: "Current User",
        authorAvatar: "/avatars/04.png",
        parentId,
        entityType: entityType as any,
        entityId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reactions: {},
      }

      runInAction(() => {
        this.addComment(entityId, newComment)
      })

      return newComment
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create comment")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  updateCommentContent = async (entityId: string, commentId: string, content: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      runInAction(() => {
        this.updateComment(entityId, commentId, content)
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to update comment")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  removeComment = async (entityId: string, commentId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      runInAction(() => {
        this.deleteComment(entityId, commentId)
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to delete comment")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
