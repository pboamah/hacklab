"use client"

import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const { signOut, isLoading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isLoading} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  )
}

// For backward compatibility with default imports
export default LogoutButton
