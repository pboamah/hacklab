import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface AdminStats {
  userCount: number
  communityCount: number
  eventCount: number
  reportCount: number
  userGrowth: any[]
  recentActivity: any[]
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  avatar_url?: string
  joined_date: string
}

export interface AdminReport {
  id: string
  reason: string
  content_type: string
  content_id: string
  reported_by: string
  content_author: string
  content: string
  severity: string
  status: string
  date: string
  reporter_comment?: string
}

export class AdminStore {
  stats: AdminStats | null = null
  users: AdminUser[] = []
  reports: AdminReport[] = []
  isLoading = false
  error: string | null = null
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  // Actions
  setStats = (stats: AdminStats) => {
    this.stats = stats
  }

  setUsers = (users: AdminUser[]) => {
    this.users = users
  }

  setReports = (reports: AdminReport[]) => {
    this.reports = reports
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchAdminStats = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      // Fetch user count
      const { count: userCount, error: userError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })

      if (userError) throw userError

      // Fetch community count
      const { count: communityCount, error: communityError } = await supabase
        .from("communities")
        .select("*", { count: "exact", head: true })

      if (communityError) throw communityError

      // Fetch event count
      const { count: eventCount, error: eventError } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })

      if (eventError) throw eventError

      // Fetch report count
      const { count: reportCount, error: reportError } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      if (reportError) throw reportError

      // Fetch recent activity (simplified for now)
      const { data: recentActivity, error: activityError } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (activityError) throw activityError

      // Mock user growth data for now
      const userGrowth = [
        { date: "2025-01", count: 120 },
        { date: "2025-02", count: 180 },
        { date: "2025-03", count: 240 },
        { date: "2025-04", count: 320 },
      ]

      const stats: AdminStats = {
        userCount: userCount || 0,
        communityCount: communityCount || 0,
        eventCount: eventCount || 0,
        reportCount: reportCount || 0,
        userGrowth,
        recentActivity: recentActivity || [],
      }

      runInAction(() => {
        this.setStats(stats)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch admin stats")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchAdminUsers = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) throw error

      // Process users
      const processedUsers = data.map((user) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role || "user",
        status: user.status || "active",
        avatar_url: user.avatar_url,
        joined_date: new Date(user.created_at).toLocaleDateString(),
      }))

      runInAction(() => {
        this.setUsers(processedUsers)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch admin users")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchAdminReports = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          reporter:users!reported_by(*),
          content_author:users!content_author_id(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Process reports
      const processedReports = data.map((report) => ({
        id: report.id,
        reason: report.reason,
        content_type: report.content_type,
        content_id: report.content_id,
        reported_by: report.reporter.full_name,
        content_author: report.content_author.full_name,
        content: report.content,
        severity: report.severity,
        status: report.status,
        date: new Date(report.created_at).toLocaleDateString(),
        reporter_comment: report.reporter_comment,
      }))

      runInAction(() => {
        this.setReports(processedReports)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch admin reports")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  approveReport = async (reportId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: "resolved", resolution: "approved" })
        .eq("id", reportId)

      if (error) throw error

      runInAction(() => {
        this.reports = this.reports.map((report) => {
          if (report.id === reportId) {
            return {
              ...report,
              status: "resolved",
            }
          }
          return report
        })
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to approve report")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  removeReportedContent = async (reportId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      // First get the report to know what content to remove
      const { data: report, error: reportError } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single()

      if (reportError) throw reportError

      // Remove the content based on its type
      let contentError
      if (report.content_type === "post") {
        const { error } = await supabase.from("posts").delete().eq("id", report.content_id)
        contentError = error
      } else if (report.content_type === "comment") {
        const { error } = await supabase.from("post_comments").delete().eq("id", report.content_id)
        contentError = error
      } else if (report.content_type === "user") {
        const { error } = await supabase.from("users").update({ status: "suspended" }).eq("id", report.content_id)
        contentError = error
      }

      if (contentError) throw contentError

      // Update the report status
      const { error } = await supabase
        .from("reports")
        .update({ status: "resolved", resolution: "removed" })
        .eq("id", reportId)

      if (error) throw error

      runInAction(() => {
        this.reports = this.reports.map((report) => {
          if (report.id === reportId) {
            return {
              ...report,
              status: "resolved",
            }
          }
          return report
        })
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to remove reported content")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
