"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getBrowserClient } from "@/lib/supabase"
import { useUserStore } from "@/lib/store/root-store"

type AuthContextType = {
  user: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const userStore = useUserStore()
  const supabase = getBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      setLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          await userStore.fetchCurrentUser()
        }
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await userStore.fetchCurrentUser()
      } else {
        userStore.setCurrentUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, userStore])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      return { data, error }
    } catch (error) {
      return { error, data: null }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
