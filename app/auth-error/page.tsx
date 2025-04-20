"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was an error during the authentication process.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Please check the following:
            <ul className="list-disc pl-5">
              <li>Make sure your email address is verified.</li>
              <li>Ensure that you have a valid account.</li>
              <li>Check your internet connection.</li>
            </ul>
          </p>
          <p>If the problem persists, please contact support.</p>
          <Button asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
