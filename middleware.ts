import { type NextRequest, NextResponse } from "next/server"
import { headersStore } from "./lib/store/headers-store"

export function middleware(req: NextRequest) {
  // Initialize the headers store with the request
  headersStore.initializeFromServerRequest(req)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
