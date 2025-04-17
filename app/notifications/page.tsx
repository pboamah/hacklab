"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, Heart, MessageSquare, UserPlus, Calendar, Award } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBrowserClient } from "@/lib/supabase"

type Notification = {
  id: string
  type: string
  content: string
  isRead: boolean
  createdAt: string
  relatedId?: string
  user?: {
    id: string
    name: string
    image?: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)

    try {
      const supabase = getBrowserClient()

      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id,
          type,
          content,
          is_read,
          created_at,
          related_id,
          user:user_id(id, name, image)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      if (data) {
        const formattedNotifications = data.map((notification) => ({
          id: notification.id,
          type: notification.type,
          content: notification.content,
          isRead: notification.is_read,
          createdAt: notification.created_at,
          relatedId: notification.related_id,
          user: notification.user
            ? {
                id: notification.user.id,
                name: notification.user.name,
                image: notification.user.image,
              }
            : undefined,
        }))

        setNotifications(formattedNotifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const supabase = getBrowserClient()

      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id)

      if (error) throw error

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const supabase = getBrowserClient()

      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("is_read", false)

      if (error) throw error

      // Update local state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />
      case "comment":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "achievement":
        return <Award className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.isRead)
        : notifications.filter((n) => n.type === activeTab)

  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="like">Likes</TabsTrigger>
              <TabsTrigger value="comment">Comments</TabsTrigger>
              <TabsTrigger value="follow">Follows</TabsTrigger>
              <TabsTrigger value="event">Events</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/4"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No notifications to display</p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card key={notification.id} className={notification.isRead ? "bg-card" : "bg-accent/20"}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 mb-1">
                              {notification.user && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={notification.user.image} alt={notification.user.name} />
                                  <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )}
                              <p className="font-medium">{notification.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-8 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}
