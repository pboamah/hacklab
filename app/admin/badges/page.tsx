"use client"

import dynamic from "next/dynamic"
import { SupabaseProvider } from "@/lib/supabase/client"

const BadgesAdminPageClient = dynamic(() => import("./badges-admin-page"), {
  ssr: false,
})

export default function BadgesAdminPage() {
  return (
    <SupabaseProvider>
      <BadgesAdminPageClient />
    </SupabaseProvider>
  )
}
