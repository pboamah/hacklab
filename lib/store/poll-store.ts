import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface Poll {
  id: string
  title: string
  description?: string
  author_id: string
  community_id?: string
  created_at: string
  expires_at?: string
  is_multiple_choice: boolean
  is_anonymous: boolean
  status: "active" | "closed" | "draft"
  total_votes: number
  author?: any
  options?: PollOption[]
}

export interface PollOption {
  id: string
  poll_id: string
  text: string
  vote_count: number
  percentage?: number
}

export interface PollVote {
  id: string
  poll_id: string
  option_id: string
  user_id: string
  created_at: string
}

export class PollStore {
  polls: Poll[] = []
  communityPolls: Record<string, Poll[]> = {}
  currentPoll: Poll | null = null
  userVotes: Record<string, string[]> = {} // pollId -> optionIds
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
  setPolls = (polls: Poll[]) => {
    this.polls = polls
  }

  setCommunityPolls = (communityId: string, polls: Poll[]) => {
    this.communityPolls = {
      ...this.communityPolls,
      [communityId]: polls,
    }
  }

  setCurrentPoll = (poll: Poll | null) => {
    this.currentPoll = poll
  }

  setUserVotes = (pollId: string, optionIds: string[]) => {
    this.userVotes = {
      ...this.userVotes,
      [pollId]: optionIds,
    }
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Computed values
  hasVoted = (pollId: string): boolean => {
    return !!this.userVotes[pollId]?.length
  }

  getUserVoteOptions = (pollId: string): string[] => {
    return this.userVotes[pollId] || []
  }

  // Async actions
  fetchPolls = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("polls")
        .select(`
        *,
        author:users!author_id(*),
        options:poll_options(*)
      `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Calculate percentages for each option
      const pollsWithPercentages = data?.map((poll) => {
        const options = poll.options?.map((option) => ({
          ...option,
          percentage: poll.total_votes > 0 ? Math.round((option.vote_count / poll.total_votes) * 100) : 0,
        }))

        return {
          ...poll,
          options,
        }
      })

      runInAction(() => {
        this.setPolls(pollsWithPercentages || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch polls")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchCommunityPolls = async (communityId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("polls")
        .select(`
        *,
        author:users!author_id(*),
        options:poll_options(*)
      `)
        .eq("community_id", communityId)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Calculate percentages for each option
      const pollsWithPercentages = data?.map((poll) => {
        const options = poll.options?.map((option) => ({
          ...option,
          percentage: poll.total_votes > 0 ? Math.round((option.vote_count / poll.total_votes) * 100) : 0,
        }))

        return {
          ...poll,
          options,
        }
      })

      runInAction(() => {
        this.setCommunityPolls(communityId, pollsWithPercentages || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch community polls")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchPollById = async (pollId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("polls")
        .select(`
        *,
        author:users!author_id(*),
        options:poll_options(*)
      `)
        .eq("id", pollId)
        .single()

      if (error) throw error

      // Calculate percentages for each option
      const options = data.options?.map((option) => ({
        ...option,
        percentage: data.total_votes > 0 ? Math.round((option.vote_count / data.total_votes) * 100) : 0,
      }))

      const pollWithPercentages = {
        ...data,
        options,
      }

      runInAction(() => {
        this.setCurrentPoll(pollWithPercentages)
      })

      // Fetch user votes if logged in
      if (this.rootStore.userStore.currentUser) {
        await this.fetchUserVotes(pollId)
      }
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch poll")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchUserVotes = async (pollId: string) => {
    if (!this.rootStore.userStore.currentUser) return

    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("poll_votes")
        .select("option_id")
        .eq("poll_id", pollId)
        .eq("user_id", this.rootStore.userStore.currentUser.id)

      if (error) throw error

      const optionIds = data.map((vote) => vote.option_id)

      runInAction(() => {
        this.setUserVotes(pollId, optionIds)
      })
    } catch (error) {
      console.error("Failed to fetch user votes:", error)
    }
  }

  votePoll = async (pollId: string, optionId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      // Check if user has already voted in a single-choice poll
      if (this.currentPoll && !this.currentPoll.is_multiple_choice && this.hasVoted(pollId)) {
        throw new Error("You have already voted in this poll")
      }

      // Add vote
      const { error } = await supabase.from("poll_votes").insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: this.rootStore.userStore.currentUser.id,
      })

      if (error) throw error

      // Update option vote count
      await supabase.rpc("increment_poll_option_votes", { option_id: optionId })

      // Update poll total votes
      await supabase.rpc("increment_poll_total_votes", { poll_id: pollId })

      // Update local state
      if (this.currentPoll?.id === pollId) {
        runInAction(() => {
          // Update total votes
          this.currentPoll = {
            ...this.currentPoll!,
            total_votes: this.currentPoll!.total_votes + 1,
          }

          // Update option vote count and percentages
          if (this.currentPoll?.options) {
            const updatedOptions = this.currentPoll.options.map((option) => {
              if (option.id === optionId) {
                const newVoteCount = option.vote_count + 1
                return {
                  ...option,
                  vote_count: newVoteCount,
                }
              }
              return option
            })

            // Recalculate percentages
            const updatedOptionsWithPercentages = updatedOptions.map((option) => ({
              ...option,
              percentage:
                this.currentPoll!.total_votes > 0
                  ? Math.round((option.vote_count / this.currentPoll!.total_votes) * 100)
                  : 0,
            }))

            this.currentPoll = {
              ...this.currentPoll!,
              options: updatedOptionsWithPercentages,
            }
          }

          // Update user votes
          const currentVotes = this.userVotes[pollId] || []
          this.setUserVotes(pollId, [...currentVotes, optionId])
        })
      }

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to vote in poll")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createPoll = async (pollData: {
    title: string
    description?: string
    options: string[]
    isMultipleChoice: boolean
    isAnonymous: boolean
    expiresAt?: Date
    communityId?: string
  }) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      // Create poll
      const { data, error } = await supabase
        .from("polls")
        .insert({
          title: pollData.title,
          description: pollData.description,
          author_id: this.rootStore.userStore.currentUser.id,
          community_id: pollData.communityId,
          is_multiple_choice: pollData.isMultipleChoice,
          is_anonymous: pollData.isAnonymous,
          expires_at: pollData.expiresAt?.toISOString(),
          status: "active",
        })
        .select()
        .single()

      if (error) throw error

      // Create options
      const optionsData = pollData.options.map((text) => ({
        poll_id: data.id,
        text,
      }))

      const { data: optionsResult, error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsData)
        .select()

      if (optionsError) throw optionsError

      const newPoll = {
        ...data,
        author: this.rootStore.userStore.currentUser,
        options: optionsResult,
      }

      runInAction(() => {
        // Update polls list
        this.polls = [newPoll, ...this.polls]

        // Update community polls if applicable
        if (pollData.communityId && this.communityPolls[pollData.communityId]) {
          this.communityPolls = {
            ...this.communityPolls,
            [pollData.communityId]: [newPoll, ...this.communityPolls[pollData.communityId]],
          }
        }
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create poll")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  closePoll = async (pollId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase.from("polls").update({ status: "closed" }).eq("id", pollId)

      if (error) throw error

      // Update local state
      if (this.currentPoll?.id === pollId) {
        runInAction(() => {
          this.currentPoll = {
            ...this.currentPoll!,
            status: "closed",
          }
        })
      }

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to close poll")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
