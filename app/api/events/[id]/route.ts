import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerClient()
    const { data: event, error } = await supabase
      .from("events")
      .select(`
        *,
        organizer:organizer_id(id, full_name, avatar_url, title)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Get attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from("event_attendees")
      .select(`
        *,
        user:user_id(id, full_name, avatar_url, title)
      `)
      .eq("event_id", params.id)
      .limit(8)

    if (attendeesError) throw attendeesError

    // Format the response
    const formattedEvent = {
      ...event,
      attendees: attendees
        ? attendees.map((a) => ({
            id: a.user.id,
            name: a.user.full_name,
            avatar: a.user.avatar_url,
            title: a.user.title,
          }))
        : [],
      attendeeCount: attendees ? attendees.length : 0,
    }

    return NextResponse.json({ event: formattedEvent }, { status: 200 })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = getServerClient()

    const { data: event, error } = await supabase
      .from("events")
      .update({
        title: body.title,
        description: body.description,
        location: body.location,
        start_date: body.startDate,
        end_date: body.endDate,
        image_url: body.imageUrl,
        is_virtual: body.isVirtual,
        max_attendees: body.maxAttendees,
        category: body.category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }

    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerClient()
    const { error } = await supabase.from("events").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
