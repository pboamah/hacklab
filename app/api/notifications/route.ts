import { NextResponse } from "next/server"
import { getServerClient } from "@/app/lib/auth"
import { getServerSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const unreadOnly = searchParams.get("unread") === "true"

    const supabase = getServerClient()

    let query = supabase
      .from("notifications")
      .select(`
        *,
        sender:sender_id(id, full_name, avatar_url)
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (unreadOnly) {
      query = query.eq("is_read", false)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ notifications: data }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { user_id, type, content, related_id, sender_id } = body

    if (!user_id || !type || !content) {
      return NextResponse.json({ error: "user_id, type, and content are required" }, { status: 400 })
    }

    // Check if sender is admin when sending to other users
    if (user_id !== session.user.id) {
      const supabase = getServerClient()
      const { data: userData } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

      if (!userData?.is_admin) {
        return NextResponse.json({ error: "Unauthorized to send notifications to other users" }, { status: 403 })
      }
    }

    const supabase = getServerClient()

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id,
        type,
        content,
        related_id,
        sender_id: sender_id || session.user.id,
        is_read: false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ notification: data }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: error.message || "Failed to create notification" }, { status: 500 })
  }
}
