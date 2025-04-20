import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createClient()

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        console.error("Error exchanging code for session:", error)
        // Redirect to an error page with more details
        return NextResponse.redirect(`${origin}/auth-error?error=${error.message}`)
      }
    } catch (error: any) {
      console.error("Error in auth callback:", error)
      // Redirect to an error page with more details
      return NextResponse.redirect(`${origin}/auth-error?error=${error.message}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-error`)
}
