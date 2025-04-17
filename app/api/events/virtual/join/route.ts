import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getServerSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    const supabase = getServerClient()

    // Verify the event exists and is virtual
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("is_virtual", true)
      .single()

    if (eventError) {
      return NextResponse.json({ error: "Event not found or not a virtual event" }, { status: 404 })
    }

    // Check if the user is already registered
    const { data: existing, error: existingError } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", session.user.id)
      .single()

    if (existing) {
      // User is already registered, update virtual attendance
      const { data, error } = await supabase
        .from("event_attendees")
        .update({
          status: "attending",
          virtual_join_time: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("event_id", eventId)
        .eq("user_id", session.user.id)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ attendance: data }, { status: 200 })
    } else {
      // Register user and mark as virtually attending
      const { data, error } = await supabase
        .from("event_attendees")
        .insert({
          event_id: eventId,
          user_id: session.user.id,
          status: "attending",
          virtual_join_time: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ attendance: data }, { status: 201 })
    }
  } catch (error: any) {
    console.error("Error joining virtual event:", error)
    return NextResponse.json({ error: error.message || "Failed to join virtual event" }, { status: 500 })
  }
}
