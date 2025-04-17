"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface EventRegistrationButtonProps {
  eventId: string
  isRegistered: boolean
  isPast: boolean
  isFull: boolean
  isOrganizer: boolean
  userId?: string
}

export default function EventRegistrationButton({
  eventId,
  isRegistered,
  isPast,
  isFull,
  isOrganizer,
  userId,
}: EventRegistrationButtonProps) {
  const [isAttending, setIsAttending] = useState(isRegistered)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleRegister = async () => {
    if (!userId) {
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/attend`, {
        method: isAttending ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update registration")
      }

      setIsAttending(!isAttending)
      toast({
        title: isAttending ? "Registration canceled" : "Successfully registered",
        description: isAttending
          ? "You have canceled your registration for this event."
          : "You have successfully registered for this event.",
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isPast) {
    return (
      <Button disabled className="w-full">
        Event has ended
      </Button>
    )
  }

  if (isOrganizer) {
    return (
      <Button disabled className="w-full">
        You are the organizer
      </Button>
    )
  }

  if (isFull && !isAttending) {
    return (
      <Button disabled className="w-full">
        Event is full
      </Button>
    )
  }

  return (
    <Button
      variant={isAttending ? "outline" : "default"}
      className="w-full"
      onClick={handleRegister}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : isAttending ? "Cancel Registration" : "Register for Event"}
    </Button>
  )
}
