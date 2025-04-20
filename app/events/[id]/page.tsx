"use client"

import { CardFooter } from "@/components/ui/card"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarDays, MapPin, Users, ArrowLeft, Video } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventStore } from "@/lib/store/root-store"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { SeoMetadata } from "@/components/seo-metadata"

const EventPage = observer(({ params }: { params: { id: string } }) => {
  const eventStore = useEventStore()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const eventId = params.id

  useEffect(() => {
    if (eventId) {
      eventStore.fetchEventById(eventId)
    }
  }, [eventId, eventStore])

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (eventStore.currentEvent) {
      const success = await eventStore.registerForEvent(eventStore.currentEvent.id)
      if (success) {
        toast({
          title: "Registration successful",
          description: `You have successfully registered for ${eventStore.currentEvent.name}.`,
        })
      }
    }
  }

  const handleCancelRegistration = async () => {
    if (!user || !eventStore.currentEvent) return

    const success = await eventStore.cancelEventRegistration(eventStore.currentEvent.id)
    if (success) {
      toast({
        title: "Registration cancelled",
        description: `Your registration for ${eventStore.currentEvent.name} has been cancelled.`,
      })
    }
  }

  if (eventStore.isLoading) {
    return (
      <DashboardShell>
        <div className="container py-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (!eventStore.currentEvent) {
    return (
      <DashboardShell>
        <div className="container py-10">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Event not found</p>
                <Button asChild className="mt-4">
                  <Link href="/events">Back to Events</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const event = eventStore.currentEvent
  const isRegistered = event.isRegistered
  const isPast = new Date(event.end_date) < new Date()
  const isVirtual = event.is_virtual

  return (
    <>
      <SeoMetadata
        title={`${event.name} - Community Platform`}
        description={event.description?.substring(0, 160) || `Join us for ${event.name}`}
        url={`/events/${event.id}`}
        imageUrl={event.image_url}
        type="event"
        publishedDate={event.created_at}
        keywords={["event", "community", event.name, event.location || "virtual event"]}
        author={event.organizer?.full_name}
      />

      <DashboardShell>
        <div className="container py-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="icon" asChild>
                <Link href="/events">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">{event.name}</h1>
            </div>

            <Card>
              <div className="relative">
                <img
                  src={
                    event.image_url || `/placeholder.svg?height=300&width=800&text=${encodeURIComponent(event.name)}`
                  }
                  alt={event.name}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {isRegistered && <Badge className="bg-primary">Registered</Badge>}
                  {isPast && <Badge variant="secondary">Past Event</Badge>}
                  {isVirtual && <Badge className="bg-blue-500">Virtual</Badge>}
                </div>
              </div>

              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">{event.name}</CardTitle>
                    <CardDescription>
                      Organized by{" "}
                      <Link href={`/profile/${event.organizer?.id}`} className="hover:underline">
                        {event.organizer?.full_name || "Unknown Organizer"}
                      </Link>
                    </CardDescription>
                  </div>

                  {!isPast && (
                    <div className="flex gap-2">
                      {isRegistered ? (
                        <>
                          {isVirtual && (
                            <Button asChild>
                              <Link href={`/events/${event.id}/virtual`}>
                                <Video className="mr-2 h-4 w-4" />
                                Join Virtual Event
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" onClick={handleCancelRegistration}>
                            Cancel Registration
                          </Button>
                        </>
                      ) : (
                        <Button onClick={handleRegister}>Register Now</Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.start_date), "PPP")}
                        {event.start_time && `, ${event.start_time}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {event.is_virtual ? "Virtual Event" : event.location || "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Attendees</p>
                      <p className="text-sm text-muted-foreground">{event.attendees?.length || 0} registered</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <Tabs defaultValue="about">
                  <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="attendees">Attendees</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="pt-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p>{event.description}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="attendees" className="pt-4">
                    {event.attendees && event.attendees.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {event.attendees.map((attendee) => (
                          <div key={attendee.id} className="flex flex-col items-center text-center">
                            <Avatar className="h-16 w-16 mb-2">
                              <AvatarImage src={attendee.avatar_url || "/placeholder.svg"} alt={attendee.full_name} />
                              <AvatarFallback>{attendee.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">{attendee.full_name}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No attendees yet</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/events`}>Back to Events</Link>
                  </Button>
                  {event.calendar_link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={event.calendar_link} target="_blank" rel="noopener noreferrer">
                        Add to Calendar
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/events/${event.id}/share`}>Share Event</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </>
  )
})

export default EventPage
