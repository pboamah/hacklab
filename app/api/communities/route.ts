import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50

    const supabase = getServerClient()

    let query = supabase.from("communities").select(`
        *,
        creator:creator_id(id, full_name, avatar_url),
        members:community_members(user_id)
      `)

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data: communities, error } = await query.order("created_at", { ascending: false }).limit(limit)

    if (error) throw error

    // Transform data to match the expected format
    const transformedCommunities = communities.map((community) => ({
      ...community,
      memberCount: community.members ? community.members.length : 0,
      members: undefined, // Remove the members array to avoid sending too much data
    }))

    return NextResponse.json({ communities: transformedCommunities }, { status: 200 })
  } catch (error) {
    console.error("Error fetching communities:", error)
    return NextResponse.json({ error: "Failed to fetch communities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getServerClient()

    // Validate required fields
    if (!body.name || !body.description || !body.creatorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: community, error } = await supabase
      .from("communities")
      .insert({
        name: body.name,
        description: body.description,
        image_url: body.imageUrl,
        creator_id: body.creatorId,
        category: body.category,
      })
      .select()
      .single()

    if (error) throw error

    // Add creator as a member with admin role
    const { error: memberError } = await supabase.from("community_members").insert({
      community_id: community.id,
      user_id: body.creatorId,
      role: "admin",
    })

    if (memberError) throw memberError

    return NextResponse.json({ community }, { status: 201 })
  } catch (error) {
    console.error("Error creating community:", error)
    return NextResponse.json({ error: "Failed to create community" }, { status: 500 })
  }
}
