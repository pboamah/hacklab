import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/app/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get("communityId")
    const upcoming = searchParams.get("upcoming") === "true"
    const past = searchParams.get("past") === "true"
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50

    const supabase = getServerClient()

    let query = supabase.from("events").select(`
        *,
        organizer:organizer_id(id, full_name, avatar_url, title),
        attendees:event_attendees(user_id)
      `)

    if (communityId) {
      query = query.eq("community_id", communityId)
    }

    if (upcoming) {
      query = query.gte("start_date", new Date().toISOString())
    }

    if (past) {
      query = query.lt("end_date", new Date().toISOString())
    }

    const { data: events, error } = await query.order("start_date", { ascending: upcoming }).limit(limit)

    if (error) throw error

    // Transform events to include attendee count
    const transformedEvents = events.map((event) => ({
      ...event,
      attendeeCount: event.attendees ? event.attendees.length : 0,
      attendees: undefined, // Remove the attendees array to avoid sending too much data
    }))

    return NextResponse.json({ events: transformedEvents }, { status: 200 })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getServerClient()

    // Validate required fields
    if (!body.title || !body.description || !body.startDate || !body.endDate || !body.organizerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title: body.title,
        description: body.description,
        location: body.location,
        start_date: body.startDate,
        end_date: body.endDate,
        image_url: body.imageUrl,
        organizer_id: body.organizerId,
        community_id: body.communityId,
        is_virtual: body.isVirtual || false,
        max_attendees: body.maxAttendees,
        category: body.category,
      })
      .select()
      .single()

    if (error) throw error

    // Register the organizer as an attendee
    const { error: attendeeError } = await supabase.from("event_attendees").insert({
      event_id: event.id,
      user_id: body.organizerId,
      status: "attending",
    })

    if (attendeeError) throw attendeeError

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
