import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function createClient(request?: NextRequest) {
  const cookieStore = cookies()

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        if (request) {
          // This runs in middleware
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set(name, value, options)
          return response
        } else {
          // This runs in a Server Action or Route Handler
          cookieStore.set({ name, value, ...options })
          return NextResponse.next()
        }
      },
      remove(name: string, options: any) {
        if (request) {
          // This runs in middleware
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete(name)
          return response
        } else {
          // This runs in a Server Action or Route Handler
          cookieStore.delete(name)
          return NextResponse.next()
        }
      },
    },
  })

  return supabase
}

export async function getServerSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
