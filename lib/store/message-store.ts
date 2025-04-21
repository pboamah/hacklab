import { makeAutoObservable, runInAction } from "mobx"
import type { RootStore } from "./index"

export interface Message {
  id: string
  conversationId: string
  senderId: string
  recipientId: string
  content: string
  read: boolean
  createdAt: string
  attachments?: {
    id: string
    type: "image" | "file"
    url: string
    name: string
  }[]
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

export class MessageStore {
  conversations: Conversation[] = []
  messages: Record<string, Message[]> = {} // conversationId -> messages
  currentConversation: string | null = null
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
  setConversations = (conversations: Conversation[]) => {
    this.conversations = conversations
  }

  setMessages = (conversationId: string, messages: Message[]) => {
    this.messages[conversationId] = messages
  }

  setCurrentConversation = (conversationId: string | null) => {
    this.currentConversation = conversationId
  }

  addMessage = (message: Message) => {
    const { conversationId } = message

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = []
    }

    this.messages[conversationId].push(message)

    // Update conversation last message and unread count
    this.conversations = this.conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: message,
          updatedAt: message.createdAt,
          unreadCount:
            message.senderId !== this.rootStore.userStore.currentUser?.id ? conv.unreadCount + 1 : conv.unreadCount,
        }
      }
      return conv
    })
  }

  markConversationAsRead = (conversationId: string) => {
    // Mark all messages as read
    if (this.messages[conversationId]) {
      this.messages[conversationId] = this.messages[conversationId].map((msg) => ({
        ...msg,
        read: true,
      }))
    }

    // Update conversation unread count
    this.conversations = this.conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
        }
      }
      return conv
    })
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Computed
  get totalUnreadCount() {
    return this.conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }

  // Async actions
  fetchConversations = async () => {
    if (!this.rootStore.userStore.currentUser) return []

    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const currentUserId = this.rootStore.userStore.currentUser.id

      // Mock data
      const mockConversations: Conversation[] = [
        {
          id: "1",
          participants: [currentUserId, "2"],
          lastMessage: {
            id: "msg1",
            conversationId: "1",
            senderId: "2",
            recipientId: currentUserId,
            content: "Hey, how's it going?",
            read: false,
            createdAt: new Date().toISOString(),
          },
          unreadCount: 1,
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          participants: [currentUserId, "3"],
          lastMessage: {
            id: "msg2",
            conversationId: "2",
            senderId: currentUserId,
            recipientId: "3",
            content: "Looking forward to the hackathon!",
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          unreadCount: 0,
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]

      runInAction(() => {
        this.setConversations(mockConversations)
      })

      return mockConversations
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

  fetchMessages = async (conversationId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const currentUserId = this.rootStore.userStore.currentUser?.id
      const conversation = this.conversations.find((c) => c.id === conversationId)

      if (!conversation) throw new Error("Conversation not found")

      const otherParticipantId = conversation.participants.find((p) => p !== currentUserId)

      // Mock data
      const mockMessages: Message[] = [
        {
          id: "msg1",
          conversationId,
          senderId: otherParticipantId!,
          recipientId: currentUserId!,
          content: "Hey, how's it going?",
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: "msg2",
          conversationId,
          senderId: currentUserId!,
          recipientId: otherParticipantId!,
          content: "Good! Working on the hackathon project. You?",
          read: true,
          createdAt: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
        },
        {
          id: "msg3",
          conversationId,
          senderId: otherParticipantId!,
          recipientId: currentUserId!,
          content: "Same here! Need any help with your project?",
          read: false,
          createdAt: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
        },
      ]

      runInAction(() => {
        this.setMessages(conversationId, mockMessages)
        this.setCurrentConversation(conversationId)
      })

      return mockMessages
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

  sendMessage = async (conversationId: string, content: string, attachments?: any[]) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const currentUserId = this.rootStore.userStore.currentUser.id
      const conversation = this.conversations.find((c) => c.id === conversationId)

      if (!conversation) throw new Error("Conversation not found")

      const recipientId = conversation.participants.find((p) => p !== currentUserId)!

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: currentUserId,
        recipientId,
        content,
        read: false,
        createdAt: new Date().toISOString(),
        attachments: attachments?.map((att, i) => ({
          id: `att-${Date.now()}-${i}`,
          type: att.type,
          url: att.url,
          name: att.name,
        })),
      }

      runInAction(() => {
        this.addMessage(newMessage)
      })

      return newMessage
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

  markAsRead = async (conversationId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      runInAction(() => {
        this.markConversationAsRead(conversationId)
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to mark messages as read")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createConversation = async (participantId: string, initialMessage: string) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const currentUserId = this.rootStore.userStore.currentUser.id

      // Check if conversation already exists
      const existingConversation = this.conversations.find(
        (c) => c.participants.includes(currentUserId) && c.participants.includes(participantId),
      )

      if (existingConversation) {
        // Send message to existing conversation
        await this.sendMessage(existingConversation.id, initialMessage)
        return existingConversation
      }

      // Create new conversation
      const newConversationId = `conv-${Date.now()}`
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId: newConversationId,
        senderId: currentUserId,
        recipientId: participantId,
        content: initialMessage,
        read: false,
        createdAt: new Date().toISOString(),
      }

      const newConversation: Conversation = {
        id: newConversationId,
        participants: [currentUserId, participantId],
        lastMessage: newMessage,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      }

      runInAction(() => {
        this.conversations = [newConversation, ...this.conversations]
        this.messages[newConversationId] = [newMessage]
        this.currentConversation = newConversationId
      })

      return newConversation
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create conversation")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
