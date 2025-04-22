"use client"

import type { ReactNode } from "react"
import { ResponsiveHeader } from "@/components/responsive-header"
import { MobileNav } from "@/components/mobile-nav"

export interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <ResponsiveHeader />
      <MobileNav />
      {/*  Header will be rendered here by each page */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl py-6 md:py-12 lg:py-24">{children}</div>
      </main>
    </div>
  )
}

export default DashboardShell
