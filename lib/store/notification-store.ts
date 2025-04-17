import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface Notification {
  id: string
  user_id: string
  type: string
  content: string
  related_id?: string
  is_read: boolean
  created_at: string
  updated_at: string
  sender?: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

export class NotificationStore {
  notifications: Notification[] = []
  unreadCount = 0
  isLoading = false
  error: string | null = null
  rootStore: RootStore
  hasSubscription = false
  realtimeChannel: any = null

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
      realtimeChannel: false,
    })
  }

  // Actions
  setNotifications = (notifications: Notification[]) => {
    this.notifications = notifications
    this.unreadCount = notifications.filter((n) => !n.is_read).length
  }

  setUnreadCount = (count: number) => {
    this.unreadCount = count
  }

  addNotification = (notification: Notification) => {
    this.notifications = [notification, ...this.notifications]
    if (!notification.is_read) {
      this.unreadCount += 1
    }
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchNotifications = async () => {
    if (!this.rootStore.userStore.currentUser) return

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const userId = this.rootStore.userStore.currentUser.id

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      runInAction(() => {
        this.setNotifications(data || [])
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch notifications")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchUnreadCount = async () => {
    if (!this.rootStore.userStore.currentUser) return 0

    const supabase = getBrowserClient()
    const userId = this.rootStore.userStore.currentUser.id

    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false)

      if (error) throw error

      runInAction(() => {
        this.setUnreadCount(count || 0)
      })

      return count
    } catch (error: any) {
      console.error("Failed to fetch unread count:", error)
      return 0
    }
  }

  markAsRead = async (notificationId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq("id", notificationId)

      if (error) throw error

      runInAction(() => {
        this.notifications = this.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification,
        )
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to mark notification as read")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  markAllAsRead = async () => {
    if (!this.rootStore.userStore.currentUser) return false
    if (this.unreadCount === 0) return true

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const userId = this.rootStore.userStore.currentUser.id

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("is_read", false)

      if (error) throw error

      runInAction(() => {
        this.notifications = this.notifications.map((notification) => ({ ...notification, is_read: true }))
        this.unreadCount = 0
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to mark all notifications as read")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  deleteNotification = async (notificationId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

      if (error) throw error

      runInAction(() => {
        const removed = this.notifications.find((n) => n.id === notificationId)
        this.notifications = this.notifications.filter((n) => n.id !== notificationId)
        if (removed && !removed.is_read) {
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to delete notification")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  setupRealtimeSubscription = () => {
    if (!this.rootStore.userStore.currentUser || this.hasSubscription) return

    const supabase = getBrowserClient()
    const userId = this.rootStore.userStore.currentUser.id

    try {
      // Set up realtime subscription
      const channel = supabase
        .channel(`user-notifications-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const notification = payload.new as Notification
            this.addNotification(notification)
          },
        )
        .subscribe()

      runInAction(() => {
        this.hasSubscription = true
        this.realtimeChannel = channel
      })
    } catch (error) {
      console.error("Failed to set up realtime subscription:", error)
    }
  }

  cleanupRealtimeSubscription = () => {
    if (this.realtimeChannel) {
      const supabase = getBrowserClient()
      supabase.removeChannel(this.realtimeChannel)

      runInAction(() => {
        this.hasSubscription = false
        this.realtimeChannel = null
      })
    }
  }
}
