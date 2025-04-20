import { makeObservable, observable, action, runInAction } from "mobx"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../../types/supabase"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  created_at: string
  updated_at: string
}

interface Report {
  id: string
  reporter_id: string
  reported_id: string
  content_type: string
  content_id: string
  reason: string
  status: string
  created_at: string
  updated_at: string
}

interface AdminState {
  users: User[]
  reports: Report[]
  loading: boolean
  error: string | null
  stats: {
    totalUsers: number
    activeUsers: number
    totalCommunities: number
    totalEvents: number
    totalHackathons: number
    totalJobs: number
  }
}

export class AdminStore {
  state: AdminState = {
    users: [],
    reports: [],
    loading: false,
    error: null,
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      totalCommunities: 0,
      totalEvents: 0,
      totalHackathons: 0,
      totalJobs: 0,
    },
  }

  constructor() {
    makeObservable(this, {
      state: observable,
      fetchUsers: action,
      fetchReports: action,
      updateUser: action,
      updateReport: action,
      fetchStats: action,
      resetError: action,
    })
  }

  // Fetch all users
  async fetchUsers() {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.users = data || []
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

  // Fetch all reports
  async fetchReports() {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false })

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.reports = data || []
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

  // Update user role or status
  async updateUser(id: string, updates: Partial<User>) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("users").update(updates).eq("id", id).select()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else if (data && data.length > 0) {
          this.state.users = this.state.users.map((u) => (u.id === id ? { ...u, ...data[0] } : u))
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

  // Update report status
  async updateReport(id: string, status: string) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("reports").update({ status }).eq("id", id).select()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else if (data && data.length > 0) {
          this.state.reports = this.state.reports.map((r) => (r.id === id ? { ...r, status: data[0].status } : r))
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

  // Fetch platform statistics
  async fetchStats() {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()

      // Fetch total users
      const { count: totalUsers, error: usersError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })

      // Fetch active users (users who logged in within the last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: activeUsers, error: activeUsersError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gt("last_login", thirtyDaysAgo.toISOString())

      // Fetch total communities
      const { count: totalCommunities, error: communitiesError } = await supabase
        .from("communities")
        .select("*", { count: "exact", head: true })

      // Fetch total events
      const { count: totalEvents, error: eventsError } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })

      // Fetch total hackathons
      const { count: totalHackathons, error: hackathonsError } = await supabase
        .from("hackathons")
        .select("*", { count: "exact", head: true })

      // Fetch total jobs
      const { count: totalJobs, error: jobsError } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })

      runInAction(() => {
        if (usersError || activeUsersError || communitiesError || eventsError || hackathonsError || jobsError) {
          this.state.error = "Error fetching statistics"
        } else {
          this.state.stats = {
            totalUsers: totalUsers || 0,
            activeUsers: activeUsers || 0,
            totalCommunities: totalCommunities || 0,
            totalEvents: totalEvents || 0,
            totalHackathons: totalHackathons || 0,
            totalJobs: totalJobs || 0,
          }
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

  // Reset error
  resetError() {
    this.state.error = null
  }
}

export const adminStore = new AdminStore()
