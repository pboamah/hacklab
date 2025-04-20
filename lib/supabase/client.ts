"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createContext, useContext, useEffect } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { createBrowserClient } from "@supabase/ssr"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"

// Define the MobX store for Supabase
class SupabaseStore {
  supabase: SupabaseClient<Database>
  isLoading: boolean = true
  isAuthenticated: boolean = false

  constructor() {
    this.supabase = createClientComponentClient<Database>()
    makeAutoObservable(this)
    this.initAuth()
  }

  async initAuth() {
    const { data } = await this.supabase.auth.getSession()
    this.isAuthenticated = !!data.session
    this.isLoading = false
  }

  setupAuthListener() {
    return this.supabase.auth.onAuthStateChange((event) => {
      this.isAuthenticated = event === "SIGNED_IN"
    })
  }
}

// Create a singleton instance of the store
const supabaseStore = new SupabaseStore()

// Create the context
type SupabaseContextType = {
  store: typeof supabaseStore
}

const Context = createContext<SupabaseContextType | undefined>(undefined)

// Create the provider component
export const SupabaseProvider = observer(({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  useEffect(() => {
    const { data: { subscription } } = supabaseStore.setupAuthListener()
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Context.Provider value={{ store: supabaseStore }}>
      {children}
    </Context.Provider>
  )
})

// Create the hook for consuming the context
export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}

// Create a browser client function
export function getBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
