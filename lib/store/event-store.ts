import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"
// Add this import at the top of the file
import { awardPoints, PointsCategory } from "@/lib/gamification"

export interface Event {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  location: string
  is_virtual: boolean
  image_url?: string
  organizer_id: string
  community_id?: string
  max_attendees?: number
  price?: number
  registration_deadline?: string
  created_at: string
  updated_at: string
  attendees?: any[]
  organizer?: any
  isRegistered?: boolean
}

export class EventStore {
  events: Event[] = []
  upcomingEvents: Event[] = []
  pastEvents: Event[] = []
  registeredEvents: Event[] = []
  currentEvent: Event | null = null
  isLoading = false
  error: string | null = null
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  // Actions
  setEvents = (events: Event[]) => {
    this.events = events
  }

  setUpcomingEvents = (events: Event[]) => {
    this.upcomingEvents = events
  }

  setPastEvents = (events: Event[]) => {
    this.pastEvents = events
  }

  setRegisteredEvents = (events: Event[]) => {
    this.registeredEvents = events
  }

  setCurrentEvent = (event: Event | null) => {
    this.currentEvent = event
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchEvents = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const now = new Date().toISOString()

    try {
      // Fetch all events
      const { data: allEvents, error } = await supabase
        .from("events")
        .select(`
          *,
          organizer:users!organizer_id(*),
          attendees:event_attendees(user_id)
        `)
        .order("start_date", { ascending: true })

      if (error) throw error

      // Process events
      const processedEvents = allEvents.map((event) => ({
        ...event,
        isRegistered: event.attendees
          ? event.attendees.some((attendee: any) => attendee.user_id === this.rootStore.userStore.currentUser?.id)
          : false,
      }))

      // Split into upcoming and past events
      const upcoming = processedEvents.filter((event) => event.end_date >= now)
      const past = processedEvents.filter((event) => event.end_date < now)

      // Filter registered events
      const registered = processedEvents.filter((event) => event.isRegistered)

      runInAction(() => {
        this.setEvents(processedEvents)
        this.setUpcomingEvents(upcoming)
        this.setPastEvents(past)
        this.setRegisteredEvents(registered)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch events")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchEventById = async (id: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          organizer:users!organizer_id(*),
          attendees:event_attendees(*, user:users(*))
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      // Process the event
      const processedEvent = {
        ...data,
        isRegistered: data.attendees
          ? data.attendees.some((attendee: any) => attendee.user.id === this.rootStore.userStore.currentUser?.id)
          : false,
      }

      runInAction(() => {
        this.setCurrentEvent(processedEvent)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch event")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  registerForEvent = async (eventId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error, data: eventData } = await supabase.from("events").select(`name`).eq("id", eventId).single()

      if (error) throw error

      const { error: insertError } = await supabase.from("event_attendees").insert({
        event_id: eventId,
        user_id: this.rootStore.userStore.currentUser.id,
        status: "registered",
      })

      if (insertError) throw insertError

      runInAction(() => {
        // Update events lists
        const updateEvent = (event: Event) => {
          if (event.id === eventId) {
            return {
              ...event,
              isRegistered: true,
              attendees: [...(event.attendees || []), { user_id: this.rootStore.userStore.currentUser?.id }],
            }
          }
          return event
        }

        this.events = this.events.map(updateEvent)
        this.upcomingEvents = this.upcomingEvents.map(updateEvent)
        this.pastEvents = this.pastEvents.map(updateEvent)

        // Add to registered events
        const eventToAdd = this.events.find((e) => e.id === eventId)
        if (eventToAdd && !this.registeredEvents.some((e) => e.id === eventId)) {
          this.registeredEvents = [...this.registeredEvents, { ...eventToAdd, isRegistered: true }]
        }

        // Update current event if viewing
        if (this.currentEvent?.id === eventId) {
          this.currentEvent = {
            ...this.currentEvent,
            isRegistered: true,
            attendees: [
              ...(this.currentEvent.attendees || []),
              { user: this.rootStore.userStore.currentUser, user_id: this.rootStore.userStore.currentUser?.id },
            ],
          }
        }
      })

      // Inside the registerForEvent method, after successful registration:
      // Add this code before the return statement
      const userId = this.rootStore.userStore.currentUser.id
      await awardPoints(userId, PointsCategory.EVENT_ATTENDANCE, `Registered for event: ${eventData.name}`)

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to register for event")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  cancelRegistration = async (eventId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase
        .from("event_attendees")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", this.rootStore.userStore.currentUser.id)

      if (error) throw error

      runInAction(() => {
        // Update events lists
        const updateEvent = (event: Event) => {
          if (event.id === eventId) {
            return {
              ...event,
              isRegistered: false,
              attendees: (event.attendees || []).filter(
                (attendee: any) => attendee.user_id !== this.rootStore.userStore.currentUser?.id,
              ),
            }
          }
          return event
        }

        this.events = this.events.map(updateEvent)
        this.upcomingEvents = this.upcomingEvents.map(updateEvent)
        this.pastEvents = this.pastEvents.map(updateEvent)

        // Remove from registered events
        this.registeredEvents = this.registeredEvents.filter((e) => e.id !== eventId)

        // Update current event if viewing
        if (this.currentEvent?.id === eventId) {
          this.currentEvent = {
            ...this.currentEvent,
            isRegistered: false,
            attendees: (this.currentEvent.attendees || []).filter(
              (attendee: any) => attendee.user.id !== this.rootStore.userStore.currentUser?.id,
            ),
          }
        }
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to cancel registration")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createEvent = async (eventData: Partial<Event>) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("events")
        .insert({
          ...eventData,
          organizer_id: this.rootStore.userStore.currentUser.id,
        })
        .select()
        .single()

      if (error) throw error

      // Add creator as an attendee
      const { error: attendeeError } = await supabase.from("event_attendees").insert({
        event_id: data.id,
        user_id: this.rootStore.userStore.currentUser.id,
        status: "registered",
      })

      if (attendeeError) throw attendeeError

      const newEvent = {
        ...data,
        organizer: this.rootStore.userStore.currentUser,
        isRegistered: true,
        attendees: [{ user_id: this.rootStore.userStore.currentUser.id }],
      }

      runInAction(() => {
        // Add to appropriate lists
        const now = new Date().toISOString()
        this.events = [newEvent, ...this.events]

        if (newEvent.end_date >= now) {
          this.upcomingEvents = [newEvent, ...this.upcomingEvents]
        } else {
          this.pastEvents = [newEvent, ...this.pastEvents]
        }

        this.registeredEvents = [newEvent, ...this.registeredEvents]
      })

      return newEvent
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create event")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
