import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string; userId: string } }) {
  try {
    const body = await request.json()
    const supabase = getServerClient()

    if (!body.role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    const { data: member, error } = await supabase
      .from("community_members")
      .update({
        role: body.role,
      })
      .eq("community_id", params.id)
      .eq("user_id", params.userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update member role" }, { status: 500 })
    }

    return NextResponse.json({ member }, { status: 200 })
  } catch (error) {
    console.error("Error updating member role:", error)
    return NextResponse.json({ error: "Failed to update member role" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; userId: string } }) {
  try {
    const supabase = getServerClient()
    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", params.id)
      .eq("user_id", params.userId)

    if (error) {
      return NextResponse.json({ error: "Failed to remove member" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 })
  }
}
