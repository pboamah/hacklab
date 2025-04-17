"use client"

import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VirtualEventRoom } from "@/components/virtual-event-room"
import { DashboardShell } from "@/components/dashboard-shell"
import { useEventStore } from "@/lib/store/root-store"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const VirtualEventPage = observer(({ params }: { params: { id: string } }) => {
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

  useEffect(() => {
    // Check if the event is virtual and the user is registered
    if (eventStore.currentEvent) {
      if (!eventStore.currentEvent.is_virtual) {
        toast({
          title: "Not a virtual event",
          description: "This event does not have a virtual component",
          variant: "destructive",
        })
        router.push(`/events/${eventId}`)
      } else if (!eventStore.currentEvent.isRegistered) {
        toast({
          title: "Registration required",
          description: "You need to register for this event to join the virtual room",
          variant: "destructive",
        })
        router.push(`/events/${eventId}`)
      }
    }
  }, [eventStore.currentEvent, router, eventId, toast])

  if (!user) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg mb-4">Please log in to access the virtual event</p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </DashboardShell>
    )
  }

  if (!eventStore.currentEvent || eventStore.isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <p>Loading virtual event...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/events/${eventId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{eventStore.currentEvent.name} - Virtual Room</h1>
        </div>

        <VirtualEventRoom eventId={eventId} />
      </div>
    </DashboardShell>
  )
})

export default VirtualEventPage
