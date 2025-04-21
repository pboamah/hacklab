"use client"

import Link from "next/link"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AuthCallbackProps = {}

const AuthCallback = ({}: AuthCallbackProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true)
      const code = searchParams.get("code")
      if (code) {
        const supabase = getBrowserClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error("Error in auth callback:", error)
          setError(error.message)
        } else {
          router.push("/dashboard")
        }
      } else {
        setError("No code provided")
      }
      setLoading(false)
    }

    verifyAuth()
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Callback</CardTitle>
          <CardDescription>Verifying your authentication...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p>Verifying your authentication...</p>
          ) : error ? (
            <>
              <p className="text-red-500">Error: {error}</p>
              <Button asChild>
                <Link href="/login">Back to Login</Link>
              </Button>
            </>
          ) : (
            <p>Redirecting to dashboard...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallback
