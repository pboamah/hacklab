import { makeObservable, observable, action, runInAction } from "mobx"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../../types/supabase"

interface Hackathon {
  id: string
  title: string
  description: string
  event_id: string
  start_date: string
  end_date: string
  registration_deadline: string
  max_team_size: number
  min_team_size: number
  status: string
  created_at: string
  updated_at: string
}

interface HackathonState {
  hackathons: Hackathon[]
  currentHackathon: Hackathon | null
  loading: boolean
  error: string | null
}

export class HackathonStore {
  state: HackathonState = {
    hackathons: [],
    currentHackathon: null,
    loading: false,
    error: null,
  }

  constructor() {
    makeObservable(this, {
      state: observable,
      fetchHackathons: action,
      fetchHackathonById: action,
      createHackathon: action,
      updateHackathon: action,
      deleteHackathon: action,
      resetCurrentHackathon: action,
      resetError: action,
    })
  }

  // Fetch all hackathons
  async fetchHackathons() {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("hackathons").select("*").order("created_at", { ascending: false })

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.hackathons = data || []
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

  // Fetch a single hackathon by ID
  async fetchHackathonById(id: string) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("hackathons").select("*").eq("id", id).single()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.currentHackathon = data
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

  // Create a new hackathon
  async createHackathon(hackathon: Omit<Hackathon, "id" | "created_at" | "updated_at">) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("hackathons").insert([hackathon]).select()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else if (data && data.length > 0) {
          this.state.hackathons = [data[0], ...this.state.hackathons]
          this.state.currentHackathon = data[0]
        }
        this.state.loading = false
      })

      return { data, error }
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
      return { data: null, error }
    }
  }

  // Update an existing hackathon
  async updateHackathon(id: string, updates: Partial<Hackathon>) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("hackathons").update(updates).eq("id", id).select()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else if (data && data.length > 0) {
          this.state.hackathons = this.state.hackathons.map((h) => (h.id === id ? { ...h, ...data[0] } : h))
          if (this.state.currentHackathon?.id === id) {
            this.state.currentHackathon = data[0]
          }
        }
        this.state.loading = false
      })

      return { data, error }
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
      return { data: null, error }
    }
  }

  // Delete a hackathon
  async deleteHackathon(id: string) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { error } = await supabase.from("hackathons").delete().eq("id", id)

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.hackathons = this.state.hackathons.filter((h) => h.id !== id)
          if (this.state.currentHackathon?.id === id) {
            this.state.currentHackathon = null
          }
        }
        this.state.loading = false
      })

      return { error }
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
      return { error }
    }
  }

  // Reset current hackathon
  resetCurrentHackathon() {
    this.state.currentHackathon = null
  }

  // Reset error
  resetError() {
    this.state.error = null
  }
}

export const hackathonStore = new HackathonStore()
