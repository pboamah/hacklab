"use client"

import React from "react"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../types/supabase"

// This function should be used in Client Components
export async function getClientUser() {
  const supabase = createClientComponentClient<Database>()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user || null
}

// Hook for getting the current user in a client component
export function useUser() {
  const supabase = createClientComponentClient<Database>()
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  return { user, loading }
}
