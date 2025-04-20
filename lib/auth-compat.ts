import { isClient } from "./is-client"
import { getCookieCompat } from "./headers-compat"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../types/supabase"
import { jwtDecode } from "jwt-decode"

// Create a compatible version of getUser that works in both Pages and App Router
export async function getUserCompat() {
  // Create Supabase client
  const supabase = createClientComponentClient<Database>()

  if (isClient) {
    // On client-side, use Supabase client methods
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.user || null
  } else {
    // On server-side, use cookie method
    const token = getCookieCompat("supabase-auth-token")

    if (!token) return null

    try {
      // Parse the JWT to get user info
      const decoded = jwtDecode(token)
      return decoded?.sub ? { id: decoded.sub } : null
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  }
}
