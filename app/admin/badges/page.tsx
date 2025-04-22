"use client"

import dynamic from "next/dynamic"
import { SupabaseProvider } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import DashboardShell from "@/components/dashboard-shell"

const BadgesAdminPageClient = dynamic(() => import("./badges-admin-page"), {
  ssr: false,
})

export default function BadgesAdminPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <DashboardShell>
      {isClient ? (
        <SupabaseProvider>
          <BadgesAdminPageClient />
        </SupabaseProvider>
      ) : null}
    </DashboardShell>
  )
}
