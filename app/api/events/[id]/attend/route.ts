import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/app/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const supabase = getServerClient()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if user is already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from("event_attendees")
      .select("id")
      .eq("event_id", params.id)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingRegistration) {
      return NextResponse.json(
        {
          message: "User is already registered for this event",
          registration: existingRegistration,
        },
        { status: 200 },
      )
    }

    // Check if event is at capacity
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("max_attendees")
      .eq("id", params.id)
      .single()

    if (eventError) throw eventError

    if (event.max_attendees) {
      const { count, error: countError } = await supabase
        .from("event_attendees")
        .select("id", { count: "exact" })
        .eq("event_id", params.id)

      if (countError) throw countError

      if (count >= event.max_attendees) {
        return NextResponse.json({ error: "Event is at full capacity" }, { status: 400 })
      }
    }

    // Register user for event
    const { data: registration, error } = await supabase
      .from("event_attendees")
      .insert({
        event_id: params.id,
        user_id: userId,
        status: "registered",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    console.error("Error registering for event:", error)
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const supabase = getServerClient()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("event_attendees").delete().eq("event_id", params.id).eq("user_id", userId)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error cancelling event registration:", error)
    return NextResponse.json({ error: "Failed to cancel event registration" }, { status: 500 })
  }
}
