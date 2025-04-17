import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerClient()
    const { data: community, error } = await supabase
      .from("communities")
      .select(`
        *,
        creator:creator_id(id, full_name, avatar_url, title),
        members:community_members(
          id, 
          user_id,
          role,
          user:user_id(id, full_name, avatar_url, title)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    // Get posts for this community
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        content,
        created_at,
        author:author_id(id, full_name, avatar_url, title)
      `)
      .eq("community_id", params.id)
      .order("created_at", { ascending: false })
      .limit(5)

    if (postsError) throw postsError

    // Get events for this community
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        location,
        is_virtual,
        attendees:event_attendees(user_id)
      `)
      .eq("community_id", params.id)
      .gte("end_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(3)

    if (eventsError) throw eventsError

    // Transform events to include attendee count
    const transformedEvents = events.map((event) => ({
      ...event,
      attendeeCount: event.attendees ? event.attendees.length : 0,
      attendees: undefined,
    }))

    // Format the response
    const formattedCommunity = {
      ...community,
      memberCount: community.members ? community.members.length : 0,
      discussions: posts || [],
      events: transformedEvents || [],
      leaders: community.members
        .filter((member) => member.role === "admin" || member.role === "moderator")
        .map((member) => ({
          name: member.user.full_name,
          avatar: member.user.avatar_url,
          role: member.role === "admin" ? "Community Admin" : "Moderator",
        })),
      activeMembers: community.members
        .filter((member) => member.user)
        .map((member) => ({
          name: member.user.full_name,
          avatar: member.user.avatar_url,
        }))
        .slice(0, 8),
      // Add some mock related communities for now
      relatedCommunities: [
        {
          name: "Frontend Developers",
          avatar: "/placeholder.svg?height=40&width=40&text=FD",
          memberCount: 980,
        },
        {
          name: "JavaScript Enthusiasts",
          avatar: "/placeholder.svg?height=40&width=40&text=JS",
          memberCount: 1450,
        },
        {
          name: "Web Performance",
          avatar: "/placeholder.svg?height=40&width=40&text=WP",
          memberCount: 675,
        },
      ],
    }

    return NextResponse.json({ community: formattedCommunity }, { status: 200 })
  } catch (error) {
    console.error("Error fetching community:", error)
    return NextResponse.json({ error: "Failed to fetch community" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = getServerClient()

    const { data: community, error } = await supabase
      .from("communities")
      .update({
        name: body.name,
        description: body.description,
        image_url: body.imageUrl,
        category: body.category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update community" }, { status: 500 })
    }

    return NextResponse.json({ community }, { status: 200 })
  } catch (error) {
    console.error("Error updating community:", error)
    return NextResponse.json({ error: "Failed to update community" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerClient()
    const { error } = await supabase.from("communities").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: "Failed to delete community" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting community:", error)
    return NextResponse.json({ error: "Failed to delete community" }, { status: 500 })
  }
}
