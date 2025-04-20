"use client"

import { makeAutoObservable, runInAction } from "mobx"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../../types/supabase"

export type ReactionType = "like" | "love" | "laugh" | "wow" | "angry"

interface Reaction {
  id: string
  user_id: string
  content_type: string
  content_id: string
  reaction_type: ReactionType
  created_at: string
}

interface ReactionCount {
  content_id: string
  reaction_type: ReactionType
  count: number
}

interface ReactionState {
  reactions: Record<string, Reaction[]>
  reactionCounts: Record<string, ReactionCount[]>
  loading: boolean
  error: string | null
}

export class ReactionStore {
  state: ReactionState = {
    reactions: {},
    reactionCounts: {},
    loading: false,
    error: null,
  }

  constructor() {
    makeAutoObservable(this)
  }

  // Fetch reactions for a specific content
  async fetchReactions(contentType: string, contentId: string) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase
        .from("reactions")
        .select("*")
        .eq("content_type", contentType)
        .eq("content_id", contentId)

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.reactions[contentId] = data || []
        }
        this.state.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
    }
  }

  // Fetch reaction counts for a specific content
  async fetchReactionCounts(contentType: string, contentId: string) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase
        .from("reactions")
        .select("reaction_type, count(*)")
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .group("reaction_type")

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.reactionCounts[contentId] = data.map((item) => ({
            content_id: contentId,
            reaction_type: item.reaction_type as ReactionType,
            count: Number.parseInt(item.count as unknown as string, 10),
          }))
        }
        this.state.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
    }
  }

  // Add a reaction
  async addReaction(reaction: Omit<Reaction, "id" | "created_at">) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()

      // Check if user already reacted with the same reaction type
      const { data: existingReaction, error: checkError } = await supabase
        .from("reactions")
        .select("*")
        .eq("content_type", reaction.content_type)
        .eq("content_id", reaction.content_id)
        .eq("user_id", reaction.user_id)
        .eq("reaction_type", reaction.reaction_type)
        .maybeSingle()

      if (checkError) {
        throw new Error(checkError.message)
      }

      // If reaction already exists, remove it (toggle behavior)
      if (existingReaction) {
        const { error: deleteError } = await supabase.from("reactions").delete().eq("id", existingReaction.id)

        if (deleteError) {
          throw new Error(deleteError.message)
        }

        runInAction(() => {
          // Update local state
          const contentReactions = this.state.reactions[reaction.content_id] || []
          this.state.reactions[reaction.content_id] = contentReactions.filter((r) => r.id !== existingReaction.id)

          // Update counts
          const contentCounts = this.state.reactionCounts[reaction.content_id] || []
          const countIndex = contentCounts.findIndex((c) => c.reaction_type === reaction.reaction_type)

          if (countIndex !== -1) {
            const newCount = contentCounts[countIndex].count - 1
            if (newCount > 0) {
              contentCounts[countIndex].count = newCount
            } else {
              contentCounts.splice(countIndex, 1)
            }
            this.state.reactionCounts[reaction.content_id] = contentCounts
          }
        })
      } else {
        // Add new reaction
        const { data, error } = await supabase.from("reactions").insert([reaction]).select()

        if (error) {
          throw new Error(error.message)
        }

        runInAction(() => {
          // Update local state
          const contentReactions = this.state.reactions[reaction.content_id] || []
          this.state.reactions[reaction.content_id] = [...contentReactions, data[0]]

          // Update counts
          const contentCounts = this.state.reactionCounts[reaction.content_id] || []
          const countIndex = contentCounts.findIndex((c) => c.reaction_type === reaction.reaction_type)

          if (countIndex !== -1) {
            contentCounts[countIndex].count += 1
          } else {
            contentCounts.push({
              content_id: reaction.content_id,
              reaction_type: reaction.reaction_type,
              count: 1,
            })
          }
          this.state.reactionCounts[reaction.content_id] = contentCounts
        })
      }

      this.state.loading = false
      return { success: true }
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
      return { success: false, error }
    }
  }

  // Check if user has reacted with a specific reaction type
  hasUserReacted(contentId: string, userId: string, reactionType: ReactionType): boolean {
    const contentReactions = this.state.reactions[contentId] || []
    return contentReactions.some((r) => r.user_id === userId && r.reaction_type === reactionType)
  }

  // Get reaction count for a specific reaction type
  getReactionCount(contentId: string, reactionType: ReactionType): number {
    const contentCounts = this.state.reactionCounts[contentId] || []
    const count = contentCounts.find((c) => c.reaction_type === reactionType)
    return count ? count.count : 0
  }

  // Get all reactions for a post
  getPostReactions(postId: string): Reaction[] {
    return this.state.reactions[postId] || []
  }

  // Get reaction counts for a post
  getReactionCounts(postId: string): Record<ReactionType, number> {
    const counts: Record<ReactionType, number> = {
      like: 0,
      love: 0,
      laugh: 0,
      wow: 0,
      angry: 0,
    }

    const reactionCounts = this.state.reactionCounts[postId] || []
    reactionCounts.forEach((reaction) => {
      counts[reaction.reaction_type] = reaction.count
    })

    return counts
  }

  // Get total reaction count for a post
  getTotalReactionCount(postId: string): number {
    const reactionCounts = this.state.reactionCounts[postId] || []
    return reactionCounts.reduce((total, reaction) => total + reaction.count, 0)
  }

  // Get user's reaction to a post
  getUserReaction(postId: string, userId: string): Reaction | undefined {
    const reactions = this.state.reactions[postId] || []
    return reactions.find((reaction) => reaction.user_id === userId)
  }

  // Reset error
  resetError() {
    this.state.error = null
  }
}

// Export the ReactionStore instance
export const reactionStore = new ReactionStore()
