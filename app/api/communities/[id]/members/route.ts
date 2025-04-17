import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerClient()
    const { data: members, error } = await supabase
      .from("community_members")
      .select(`
        *,
        user:user_id(id, full_name, avatar_url, title)
      `)
      .eq("community_id", params.id)

    if (error) throw error

    return NextResponse.json({ members }, { status: 200 })
  } catch (error) {
    console.error("Error fetching community members:", error)
    return NextResponse.json({ error: "Failed to fetch community members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = getServerClient()

    if (!body.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if user is already a member
    const { data: existingMember, error: checkError } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", params.id)
      .eq("user_id", body.userId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingMember) {
      return NextResponse.json(
        {
          message: "User is already a member of this community",
          member: existingMember,
        },
        { status: 200 },
      )
    }

    const { data: member, error } = await supabase
      .from("community_members")
      .insert({
        community_id: params.id,
        user_id: body.userId,
        role: body.role || "member",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error("Error adding community member:", error)
    return NextResponse.json({ error: "Failed to add community member" }, { status: 500 })
  }
}
