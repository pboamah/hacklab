import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth routes - redirect to dashboard if already authenticated
  if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return response
  }

  // Protected routes - redirect to login if not authenticated
  const protectedRoutes = [
    "/dashboard",
    "/events/create",
    "/posts/create",
    "/communities/create",
    "/settings",
    "/profile",
    "/hackathons/submit",
    "/hackathons/teams/create",
    "/admin",
  ]

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/events/create/:path*",
    "/posts/create/:path*",
    "/communities/create/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/hackathons/submit/:path*",
    "/hackathons/teams/create/:path*",
    "/admin/:path*",
  ],
}
