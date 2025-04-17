import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface User {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
  points?: number
  level?: number
  badges?: string[]
  role?: string
}

export class UserStore {
  currentUser: User | null = null
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
  setCurrentUser = (user: User | null) => {
    this.currentUser = user
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchCurrentUser = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        runInAction(() => {
          this.setCurrentUser(null)
        })
        return
      }

      const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (error) throw error

      runInAction(() => {
        this.setCurrentUser(data)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch current user")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  updateProfile = async (profileData: {
    username?: string
    full_name?: string
    bio?: string
    avatar_url?: string
  }) => {
    if (!this.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("users")
        .update(profileData)
        .eq("id", this.currentUser.id)
        .select()
        .single()

      if (error) throw error

      runInAction(() => {
        this.setCurrentUser({
          ...this.currentUser!,
          ...data,
        })
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to update profile")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
