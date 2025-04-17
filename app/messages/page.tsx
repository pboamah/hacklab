"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { Send, Search } from "lucide-react"
import { observer } from "mobx-react-lite"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useMessageStore, useUserStore } from "@/lib/store/root-store"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

const MessagesPage = observer(() => {
  const messageStore = useMessageStore()
  const userStore = useUserStore()
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (userStore.currentUser) {
        await messageStore.fetchConversations()
      }
    }
    fetchData()
  }, [messageStore, userStore.currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messageStore.activeMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !messageStore.activeConversationUserId) return

    try {
      await messageStore.sendMessage(messageStore.activeConversationUserId, newMessage)
      setNewMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredConversations = searchQuery
    ? messageStore.conversations.filter((conversation) =>
        conversation.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messageStore.conversations

  if (!userStore.currentUser) {
    return (
      <DashboardShell>
        <div className="container py-10">
          <Card className="w-full">
            <CardContent className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <h3 className="text-lg font-medium">Please log in</h3>
                <p className="text-muted-foreground">You need to be logged in to access messages</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Users list */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-xl">Messages</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-300px)]">
              {messageStore.isLoading && messageStore.conversations.length === 0 ? (
                <div className="p-4 space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No conversations found</div>
              ) : (
                <div>
                  {filteredConversations.map((conversation) => (
                    <div key={conversation.user.id}>
                      <button
                        className={`w-full p-4 text-left hover:bg-accent/50 transition-colors flex items-center gap-3 ${
                          messageStore.activeConversationUserId === conversation.user.id ? "bg-accent" : ""
                        }`}
                        onClick={() => messageStore.setActiveConversation(conversation.user.id)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage
                              src={conversation.user.avatar_url || "/placeholder.svg"}
                              alt={conversation.user.full_name}
                            />
                            <AvatarFallback>{conversation.user.full_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">{conversation.user.full_name}</p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(conversation.lastMessage.created_at), {
                                  addSuffix: true,
                                })}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.content}</p>
                          )}
                        </div>
                      </button>
                      <Separator />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Chat area */}
          <Card className="md:col-span-2 flex flex-col">
            {messageStore.activeConversation ? (
              <>
                <CardHeader className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={messageStore.activeConversation.user.avatar_url || "/placeholder.svg"}
                        alt={messageStore.activeConversation.user.full_name}
                      />
                      <AvatarFallback>{messageStore.activeConversation.user.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{messageStore.activeConversation.user.full_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {messageStore.activeConversation.user.last_seen
                          ? `Last seen ${formatDistanceToNow(new Date(messageStore.activeConversation.user.last_seen), { addSuffix: true })}`
                          : "Community Member"}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <ScrollArea className="flex-1 p-4 h-[calc(100vh-400px)]">
                  <div className="space-y-4">
                    {messageStore.activeMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === userStore.currentUser?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender_id === userStore.currentUser?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <CardContent className="p-4 border-t mt-auto">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" disabled={messageStore.isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
})

export default MessagesPage
