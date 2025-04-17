import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { eventCreateSchema } from "@/lib/validations/admin"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const communityId = searchParams.get("communityId")

    let query = supabase.from("events").select(`
        *,
        organizer:users!organizer_id (*),
        community:communities (*)
      `)

    if (status === "upcoming") {
      query = query.gte("start_date", new Date().toISOString())
    } else if (status === "past") {
      query = query.lt("end_date", new Date().toISOString())
    } else if (status === "ongoing") {
      const now = new Date().toISOString()
      query = query.lte("start_date", now).gte("end_date", now)
    }

    if (communityId) {
      query = query.eq("community_id", communityId)
    }

    const { data: events, error } = await query.order("start_date", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    const validationResult = eventCreateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    // Create event in database
    const { data: event, error } = await supabase
      .from("events")
      .insert({
        name: body.name,
        description: body.description,
        start_date: body.start_date,
        end_date: body.end_date,
        location: body.location,
        is_virtual: body.is_virtual,
        image: body.image,
        organizer_id: body.organizer_id || session.user.id,
        community_id: body.community_id,
        type: body.type,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ event: event[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
