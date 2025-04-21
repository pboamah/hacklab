import { makeAutoObservable, runInAction } from "mobx"
import type { RootStore } from "./index"

export interface Reaction {
  id: string
  entityId: string
  entityType: "post" | "comment" | "event" | "project"
  userId: string
  type: string // emoji or reaction type
  createdAt: string
}

export interface ReactionCount {
  entityId: string
  type: string
  count: number
  userReacted: boolean
}

export class ReactionStore {
  reactions: Record<string, ReactionCount[]> = {} // entityId -> reaction counts
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
  setReactions = (entityId: string, reactions: ReactionCount[]) => {
    this.reactions[entityId] = reactions
  }

  updateReaction = (entityId: string, type: string, increment: boolean) => {
    if (!this.reactions[entityId]) {
      this.reactions[entityId] = []
    }

    const existingReaction = this.reactions[entityId].find((r) => r.type === type)

    if (existingReaction) {
      // Update existing reaction
      this.reactions[entityId] = this.reactions[entityId].map((r) => {
        if (r.type === type) {
          return {
            ...r,
            count: increment ? r.count + 1 : Math.max(0, r.count - 1),
            userReacted: increment,
          }
        }
        return r
      })
    } else if (increment) {
      // Add new reaction type
      this.reactions[entityId].push({
        entityId,
        type,
        count: 1,
        userReacted: true,
      })
    }
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchReactions = async (entityType: string, entityId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockReactions: ReactionCount[] = [
        { entityId, type: "👍", count: 5, userReacted: false },
        { entityId, type: "❤️", count: 3, userReacted: true },
        { entityId, type: "🎉", count: 2, userReacted: false },
        { entityId, type: "🚀", count: 1, userReacted: false },
      ]

      runInAction(() => {
        this.setReactions(entityId, mockReactions)
      })

      return mockReactions
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch reactions")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  toggleReaction = async (entityType: string, entityId: string, type: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // Check if user has already reacted with this type
      const userReacted = this.reactions[entityId]?.find((r) => r.type === type)?.userReacted || false

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      runInAction(() => {
        this.updateReaction(entityId, type, !userReacted)
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to toggle reaction")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
