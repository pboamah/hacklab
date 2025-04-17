import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getServerSession } from "@/lib/auth"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { is_read } = body

    if (is_read === undefined) {
      return NextResponse.json({ error: "is_read field is required" }, { status: 400 })
    }

    const supabase = getServerClient()

    // First check if the notification belongs to the user
    const { data: notificationData, error: fetchError } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (fetchError) throw fetchError

    if (notificationData.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to update this notification" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("notifications")
      .update({
        is_read,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ notification: data }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: error.message || "Failed to update notification" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getServerClient()

    // First check if the notification belongs to the user
    const { data: notificationData, error: fetchError } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (fetchError) throw fetchError

    if (notificationData.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to delete this notification" }, { status: 403 })
    }

    const { error } = await supabase.from("notifications").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: error.message || "Failed to delete notification" }, { status: 500 })
  }
}
