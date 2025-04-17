import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface UserProfile {
  id: string
  full_name: string
  username?: string
  email?: string
  avatar_url?: string
  bio?: string
  title?: string
  location?: string
  current_job_role?: string
  current_workplace?: string
  favorite_programming_language?: string
  favorite_tech_stack?: string
  skills?: string[]
  social?: {
    website?: string
    github?: string
    twitter?: string
    linkedin?: string
  }
  created_at?: string
  updatedAt?: string
}

export class ProfileStore {
  profiles: Map<string, UserProfile> = new Map() // userId -> profile
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

  setProfile = (userId: string, profile: UserProfile) => {
    this.profiles.set(userId, profile)
  }

  // Async actions
  fetchProfile = async (userId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

      if (error) throw error

      runInAction(() => {
        this.setProfile(userId, data)
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch profile")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()

      // Check if a profile already exists for the user
      const { data: existingProfile, error: existingProfileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (existingProfileError && existingProfileError.code !== "PGRST116") {
        // If there's an error other than "no data found", throw it
        throw existingProfileError
      }

      if (!existingProfile) {
        // If the profile doesn't exist, create a new one
        const { data: newProfile, error: newProfileError } = await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            ...updates,
          })
          .select()
          .single()

        if (newProfileError) throw newProfileError

        runInAction(() => {
          this.setProfile(userId, newProfile)
        })

        return newProfile
      } else {
        // If the profile exists, update it
        const { data, error } = await supabase.from("profiles").update(updates).eq("user_id", userId).select().single()

        if (error) throw error

        runInAction(() => {
          this.setProfile(userId, data)
        })

        return data
      }
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to update profile")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  uploadAvatar = async (userId: string, file: File) => {
    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const fileName = `avatar-${userId}-${Date.now()}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName)
      const publicUrl = urlData.publicUrl

      // Update profile with the new avatar URL
      await this.updateProfile(userId, { avatar_url: publicUrl })

      return publicUrl
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to upload avatar")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  // Computed properties
  getProfile = (userId: string) => {
    return this.profiles.get(userId)
  }
}
