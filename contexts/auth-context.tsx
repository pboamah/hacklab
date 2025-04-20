"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getBrowserClient } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import type { AuthError } from "@supabase/gotrue-js"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/lib/store/root-store"

type AuthContextType = {
  user: User | null
  loading: boolean
  session: Session | null
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; data: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  githubSignIn: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  session: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  githubSignIn: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const userStore = useUserStore()
  const supabase = getBrowserClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      setLoading(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
        setSession(session)
        if (session?.user) {
          await userStore.fetchCurrentUser()
          localStorage.setItem("sb-user", JSON.stringify(session.user))
        }
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setLoading(false)
      }
    }

    // Load user from local storage on initial load
    const storedUser = localStorage.getItem("sb-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      userStore.fetchCurrentUser()
    } else {
      getUser()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setSession(session)
      if (session?.user) {
        await userStore.fetchCurrentUser()
        localStorage.setItem("sb-user", JSON.stringify(session.user))
      } else {
        localStorage.removeItem("sb-user")
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
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "",
          },
        },
      })
      return { data, error }
    } catch (error: any) {
      return { error: error.message, data: null }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("sb-user")
    router.push("/login")
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const githubSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast({
          title: "Github signin failed",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, session, signIn, signUp, signOut, resetPassword, githubSignIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
