"use client"

import dynamic from "next/dynamic"

const BadgesAdminPageClient = dynamic(() => import("./badges-admin-page"), {
  ssr: false,
})

export default function BadgesAdminPage() {
  return <BadgesAdminPageClient />
}
