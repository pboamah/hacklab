import { makeAutoObservable, runInAction } from "mobx"
import type { RootStore } from "./index"

export interface User {
  id: string
  email: string
  fullName: string
  username?: string
  avatarUrl?: string
  bio?: string
  role: "user" | "admin" | "moderator"
  createdAt: string
  lastActive?: string
}

export class UserStore {
  users: User[] = []
  currentUser: User | null = null
  isLoading = false
  error: string | null = null
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
    })

    // Initialize with a mock current user
    this.currentUser = {
      id: "1",
      email: "john@example.com",
      fullName: "John Doe",
      username: "johndoe",
      avatarUrl: "/avatars/01.png",
      bio: "Software developer and hackathon enthusiast",
      role: "user",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    }
  }

  // Actions
  setUsers = (users: User[]) => {
    this.users = users
  }

  setCurrentUser = (user: User | null) => {
    this.currentUser = user
  }

  updateCurrentUser = (userData: Partial<User>) => {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...userData }
    }
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchUsers = async (query?: string, limit = 10) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockUsers: User[] = [
        {
          id: "1",
          email: "john@example.com",
          fullName: "John Doe",
          username: "johndoe",
          avatarUrl: "/avatars/01.png",
          bio: "Software developer and hackathon enthusiast",
          role: "user",
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        },
        {
          id: "2",
          email: "jane@example.com",
          fullName: "Jane Smith",
          username: "janesmith",
          avatarUrl: "/avatars/02.png",
          bio: "UX designer and community builder",
          role: "moderator",
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        },
        {
          id: "3",
          email: "admin@example.com",
          fullName: "Admin User",
          username: "admin",
          avatarUrl: "/avatars/03.png",
          bio: "Platform administrator",
          role: "admin",
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        },
      ]

      // Filter by query if provided
      let filteredUsers = mockUsers
      if (query) {
        const lowerQuery = query.toLowerCase()
        filteredUsers = mockUsers.filter(
          (user) =>
            user.fullName.toLowerCase().includes(lowerQuery) ||
            user.username?.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery),
        )
      }

      runInAction(() => {
        this.setUsers(filteredUsers.slice(0, limit))
      })

      return filteredUsers
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch users")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchUserById = async (userId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data - find user in existing users or create a new mock
      let user = this.users.find((u) => u.id === userId)

      if (!user) {
        user = {
          id: userId,
          email: `user${userId}@example.com`,
          fullName: `User ${userId}`,
          username: `user${userId}`,
          avatarUrl: `/avatars/0${(Number.parseInt(userId) % 4) + 1}.png`,
          role: "user",
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        }
      }

      return user
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch user")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  updateUser = async (userId: string, userData: Partial<User>) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update in users list
      runInAction(() => {
        this.users = this.users.map((user) => {
          if (user.id === userId) {
            return { ...user, ...userData }
          }
          return user
        })

        // Update current user if it's the same
        if (this.currentUser && this.currentUser.id === userId) {
          this.currentUser = { ...this.currentUser, ...userData }
        }
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to update user")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
