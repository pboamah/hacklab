"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, this would check with Supabase or another auth provider
        // For now, we'll simulate a logged-in user
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUser({
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        })
      } catch (error) {
        console.error("Auth error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would authenticate with Supabase or another auth provider
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: "1",
        name: "John Doe",
        email,
      })
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // In a real app, this would sign out with Supabase or another auth provider
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
