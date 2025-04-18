import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  receiver?: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

export interface Conversation {
  user: {
    id: string
    full_name: string
    avatar_url?: string
    last_seen?: string
  }
  lastMessage?: Message
  unreadCount: number
}

export class MessageStore {
  messages: Map<string, Message[]> = new Map() // userId -> messages
  conversations: Conversation[] = []
  activeConversationUserId: string | null = null
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
  setActiveConversation = (userId: string | null) => {
    this.activeConversationUserId = userId
    if (userId) {
      this.fetchMessages(userId)
    }
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchConversations = async () => {
    if (!this.rootStore.userStore.currentUser) return

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const currentUserId = this.rootStore.userStore.currentUser.id

    try {
      // Get all messages where the current user is either sender or receiver
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id, 
          content, 
          created_at, 
          is_read,
          sender_id, 
          sender:sender_id(id, full_name, avatar_url),
          receiver_id, 
          receiver:receiver_id(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Group messages by conversation partner
      const conversationMap = new Map<string, { messages: Message[]; user: any }>()

      data.forEach((message: any) => {
        const partnerId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id
        const partner = message.sender_id === currentUserId ? message.receiver : message.sender

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            messages: [],
            user: partner,
          })
        }

        conversationMap.get(partnerId)!.messages.push(message)
      })

      // Transform to conversations array
      const conversations: Conversation[] = []

      conversationMap.forEach((value, key) => {
        const unreadCount = value.messages.filter((m) => m.receiver_id === currentUserId && !m.is_read).length

        conversations.push({
          user: value.user,
          lastMessage: value.messages[0],
          unreadCount,
        })
      })

      runInAction(() => {
        this.conversations = conversations
      })

      return conversations
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch conversations")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchMessages = async (userId: string) => {
    if (!this.rootStore.userStore.currentUser) return

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const currentUserId = this.rootStore.userStore.currentUser.id

    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
        id, 
        content, 
        created_at, 
        is_read,
        sender_id, 
        sender:users!sender_id(id, full_name, avatar_url),
        receiver_id, 
        receiver:receiver_id(id, full_name, avatar_url)
      `)
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`,
        )
        .order("created_at", { ascending: true })

      if (error) throw error

      runInAction(() => {
        this.messages.set(userId, data)
      })

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", userId)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false)

      // Update unread count in conversations
      this.updateUnreadCount(userId, 0)

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch messages")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  sendMessage = async (receiverId: string, content: string) => {
    if (!this.rootStore.userStore.currentUser || !content.trim()) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const currentUserId = this.rootStore.userStore.currentUser.id

    try {
      const newMessage = {
        sender_id: currentUserId,
        receiver_id: receiverId,
        content: content.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("messages").insert(newMessage).select("*").single()

      if (error) throw error

      // Add sender and receiver info
      const enrichedMessage = {
        ...data,
        sender: {
          id: currentUserId,
          full_name: this.rootStore.userStore.currentUser.full_name,
          avatar_url: this.rootStore.userStore.currentUser.avatar_url,
        },
        receiver: await this.rootStore.userStore.fetchUserById(receiverId),
      }

      runInAction(() => {
        // Update messages
        const existingMessages = this.messages.get(receiverId) || []
        this.messages.set(receiverId, [...existingMessages, enrichedMessage])

        // Update conversations
        const existingConversationIndex = this.conversations.findIndex((c) => c.user.id === receiverId)

        if (existingConversationIndex >= 0) {
          this.conversations[existingConversationIndex].lastMessage = enrichedMessage
        } else {
          this.conversations.push({
            user: enrichedMessage.receiver,
            lastMessage: enrichedMessage,
            unreadCount: 0,
          })
        }
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to send message")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  updateUnreadCount = (userId: string, count: number) => {
    const conversationIndex = this.conversations.findIndex((c) => c.user.id === userId)
    if (conversationIndex >= 0) {
      this.conversations[conversationIndex].unreadCount = count
    }
  }

  // Computed properties
  get activeConversation() {
    return this.activeConversationUserId
      ? this.conversations.find((c) => c.user.id === this.activeConversationUserId) || null
      : null
  }

  get activeMessages() {
    return this.activeConversationUserId ? this.messages.get(this.activeConversationUserId) || [] : []
  }

  get totalUnreadCount() {
    return this.conversations.reduce((total, conversation) => total + conversation.unreadCount, 0)
  }
}
