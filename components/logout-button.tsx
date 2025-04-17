"use client"

import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function LogoutButton() {
  const { signOut, isLoading } = useAuth()

  return (
    <Button variant="ghost" size="sm" onClick={signOut} disabled={isLoading} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  )
}

// For backward compatibility with default imports
export default LogoutButton
