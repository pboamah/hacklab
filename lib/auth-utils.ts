import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/cookies"
import type { Database } from "../types/supabase"

// This function should only be used in Server Components
export async function getServerUser() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user || null
}
