import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase/client"
import type { RootStore } from "./root-store"

export type ReactionType = "like" | "love" | "laugh" | "wow" | "sad" | "angry"

export interface Reaction {
  id: string
  user_id: string
  post_id: string
  type: ReactionType
  created_at: string
}

export class ReactionStore {
  reactions: Map<string, Reaction[]> = new Map() // postId -> reactions
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

  setReactions = (postId: string, reactions: Reaction[]) => {
    this.reactions.set(postId, reactions)
  }

  // Async actions
  fetchReactions = async (postId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const { data, error } = await supabase
        .from("post_reactions")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setReactions(postId, data || [])
      })

      return data || []
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

  addReaction = async (postId: string, type: ReactionType) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const userId = this.rootStore.userStore.currentUser.id

      // Check if user already reacted
      const existingReactions = this.reactions.get(postId) || []
      const existingReaction = existingReactions.find((r) => r.user_id === userId)

      // If user already reacted with this type, remove the reaction
      if (existingReaction && existingReaction.type === type) {
        const { error } = await supabase.from("post_reactions").delete().eq("id", existingReaction.id)

        if (error) throw error

        runInAction(() => {
          const updatedReactions = existingReactions.filter((r) => r.id !== existingReaction.id)
          this.setReactions(postId, updatedReactions)
        })

        return null
      }
      // If user already reacted but with different type, update the reaction
      else if (existingReaction) {
        const { data, error } = await supabase
          .from("post_reactions")
          .update({ type })
          .eq("id", existingReaction.id)
          .select()
          .single()

        if (error) throw error

        runInAction(() => {
          const updatedReactions = existingReactions.map((r) => (r.id === existingReaction.id ? data : r))
          this.setReactions(postId, updatedReactions)
        })

        return data
      }
      // If user hasn't reacted yet, add new reaction
      else {
        const { data, error } = await supabase
          .from("post_reactions")
          .insert({
            post_id: postId,
            user_id: userId,
            type,
          })
          .select()
          .single()

        if (error) throw error

        runInAction(() => {
          this.setReactions(postId, [...existingReactions, data])
        })

        return data
      }
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to add reaction")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  // Computed properties
  getPostReactions = (postId: string) => {
    return this.reactions.get(postId) || []
  }

  getUserReaction = (postId: string, userId: string) => {
    const reactions = this.getPostReactions(postId)
    return reactions.find((r) => r.user_id === userId)
  }

  getReactionCounts = (postId: string) => {
    const reactions = this.getPostReactions(postId)
    return reactions.reduce(
      (acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1
        return acc
      },
      {} as Record<ReactionType, number>,
    )
  }

  getTotalReactionCount = (postId: string) => {
    return this.getPostReactions(postId).length
  }
}
