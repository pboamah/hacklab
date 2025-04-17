"use client"

import { observer } from "mobx-react-lite"
import Link from "next/link"
import { CalendarDays, MapPin, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface EventCardProps {
  event: any
  userId?: string
  isRegistered?: boolean
  isPast?: boolean
  onRegister?: () => Promise<boolean>
  onCancelRegistration?: () => Promise<boolean>
  isLoading?: boolean
}

const EventCard = observer(
  ({
    event,
    userId,
    isRegistered = false,
    isPast = false,
    onRegister,
    onCancelRegistration,
    isLoading = false,
  }: EventCardProps) => {
    const { toast } = useToast()
    const { user } = useAuth()

    const handleRegister = async () => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to register for events",
          variant: "destructive",
        })
        return
      }

      if (onRegister) {
        const success = await onRegister()
        if (success) {
          toast({
            title: "Registration successful",
            description: `You have successfully registered for ${event.name}.`,
          })
        }
      }
    }

    const handleCancelRegistration = async () => {
      if (!user) return

      if (onCancelRegistration) {
        const success = await onCancelRegistration()
        if (success) {
          toast({
            title: "Registration cancelled",
            description: `Your registration for ${event.name} has been cancelled.`,
          })
        }
      }
    }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    }

    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={event.image_url || `/placeholder.svg?height=140&width=400&text=${encodeURIComponent(event.name)}`}
            alt={event.name}
            className="h-[140px] w-full object-cover"
          />
          {isRegistered && <Badge className="absolute top-2 right-2 bg-primary">Registered</Badge>}
          {isPast && !isRegistered && <Badge className="absolute top-2 right-2 bg-secondary">Past</Badge>}
          {!isPast && !isRegistered && event.is_virtual && (
            <Badge className="absolute top-2 right-2 bg-blue-500">Virtual</Badge>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl line-clamp-1">{event.name}</CardTitle>
          <CardDescription>{event.organizer?.full_name || "Unknown Organizer"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-1 h-4 w-4" />
            {formatDate(event.start_date)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            {event.location || "TBD"}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            {event.attendees?.length || 0} attending
          </div>
        </CardContent>
        <CardFooter>
          {isPast ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/events/${event.id}`}>View Details</Link>
            </Button>
          ) : isRegistered ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleCancelRegistration} disabled={isLoading}>
                {isLoading ? "Processing..." : "Cancel"}
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={handleRegister} disabled={isLoading}>
              {isLoading ? "Processing..." : "Register"}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  },
)

export default EventCard
