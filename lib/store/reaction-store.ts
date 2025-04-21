"use client"

import { makeAutoObservable } from "mobx"

export type ReactionType = "like" | "love" | "laugh" | "wow" | "angry"

interface Reaction {
  id: string
  postId: string
  userId: string
  reactionType: ReactionType
  createdAt: string
}

export class ReactionStore {
  reactions: Reaction[] = []
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setReactions = (reactions: Reaction[]) => {
    this.reactions = reactions
  }

  setLoading = (isLoading: boolean) => {
    this.isLoading = isLoading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  async fetchReactions(postId: string) {
    this.setLoading(true)
    this.setError(null)

    try {
      // Mock data for demo purposes
      const mockReactions: Reaction[] = [
        {
          id: "1",
          postId: postId,
          userId: "user1",
          reactionType: "like",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          postId: postId,
          userId: "user2",
          reactionType: "love",
          createdAt: new Date().toISOString(),
        },
      ]

      this.setReactions(mockReactions)
    } catch (error: any) {
      this.setError(error.message || "Failed to fetch reactions")
    } finally {
      this.setLoading(false)
    }
  }

  async addReaction(postId: string, reactionType: ReactionType) {
    this.setLoading(true)
    this.setError(null)

    try {
      // Mock implementation
      const newReaction: Reaction = {
        id: Date.now().toString(),
        postId: postId,
        userId: "current-user-id", // Replace with actual user ID
        reactionType: reactionType,
        createdAt: new Date().toISOString(),
      }

      this.reactions = [...this.reactions, newReaction]
    } catch (error: any) {
      this.setError(error.message || "Failed to add reaction")
    } finally {
      this.setLoading(false)
    }
  }

  async removeReaction(postId: string, reactionType: ReactionType) {
    this.setLoading(true)
    this.setError(null)

    try {
      // Mock implementation
      this.reactions = this.reactions.filter(
        (reaction) => !(reaction.postId === postId && reaction.reactionType === reactionType),
      )
    } catch (error: any) {
      this.setError(error.message || "Failed to remove reaction")
    } finally {
      this.setLoading(false)
    }
  }

  getPostReactions(postId: string): Reaction[] {
    return this.reactions.filter((reaction) => reaction.postId === postId)
  }

  getUserReaction(postId: string, userId: string): Reaction | undefined {
    return this.reactions.find((reaction) => reaction.postId === postId && reaction.userId === userId)
  }

  getReactionCounts(postId: string): { [key in ReactionType]?: number } {
    const counts: { [key in ReactionType]?: number } = {}
    this.getPostReactions(postId).forEach((reaction) => {
      counts[reaction.reactionType] = (counts[reaction.reactionType] || 0) + 1
    })
    return counts
  }

  getTotalReactionCount(postId: string): number {
    return this.getPostReactions(postId).length
  }
}
