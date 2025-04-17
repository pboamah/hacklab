"use client"

import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import { Bell, X, CheckCheck } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotificationStore } from "@/lib/store/root-store"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const NotificationCenter = observer(() => {
  const [isOpen, setIsOpen] = useState(false)
  const notificationStore = useNotificationStore()

  useEffect(() => {
    notificationStore.fetchUnreadCount()

    // Set up realtime notification subscription
    notificationStore.setupRealtimeSubscription()

    return () => {
      notificationStore.cleanupRealtimeSubscription()
    }
  }, [notificationStore])

  const handleOpen = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      notificationStore.fetchNotifications()
    }
  }

  const handleMarkAllRead = async () => {
    await notificationStore.markAllAsRead()
  }

  const handleMarkAsRead = async (id: string) => {
    await notificationStore.markAsRead(id)
  }

  const handleDelete = async (id: string) => {
    await notificationStore.deleteNotification(id)
  }

  const getNotificationIcon = (type: string) => {
    // Icon logic will be moved to a separate component
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationStore.unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {notificationStore.unreadCount > 99 ? "99+" : notificationStore.unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {notificationStore.unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          {notificationStore.isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-3 w-1/4 rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notificationStore.notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No notifications to display</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {notificationStore.notifications.map((notification) => (
                <Card key={notification.id} className={!notification.is_read ? "bg-accent/20" : ""}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {notification.sender ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={notification.sender.avatar_url || "/placeholder.svg"}
                              alt={notification.sender.full_name}
                            />
                            <AvatarFallback>{notification.sender.full_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm break-words">{notification.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1 h-auto text-xs mt-1"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0 opacity-50 hover:opacity-100"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="px-4 py-3 border-t flex justify-center">
          <Button variant="outline" asChild className="w-full">
            <a href="/notifications">View All Notifications</a>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
})
