# Hacklab Connect: Community Platform Project Prompt

## Project Overview

Create a comprehensive community platform called "Hacklab Connect" for tech professionals to connect, collaborate, and grow. The platform should enable users to join communities, participate in events, share posts, find jobs, and collaborate on hackathons.

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: shadcn/ui component library with Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context API and hooks
- **Form Handling**: React Hook Form with Zod validation

## Supabase Implementation

All Supabase interactions must be implemented through API routes, not directly from components. This ensures proper separation of concerns and better security.

### Supabase Setup

Create a utility file for Supabase client initialization:

\`\`\`typescript
// lib/supabase.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
export { createClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the browser
const createBrowserSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance for the browser
let browserClient: ReturnType<typeof createBrowserSupabaseClient> | undefined

export function getBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("getBrowserClient should only be called in the browser")
  }

  if (!browserClient) {
    browserClient = createBrowserSupabaseClient()
  }

  return browserClient
}

// Create a server client (for API routes and server components)
export function getServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Create a client for API routes
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}
