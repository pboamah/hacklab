"use client"

import type React from "react"

import { useEffect, useState } from "react"

// This hook can be used to detect if a component is being rendered on the client
export function useIsClientComponent() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

// This component can be used to wrap code that should only run on the client
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const isClient = useIsClientComponent()

  if (!isClient) {
    return null
  }

  return <>{children}</>
}
