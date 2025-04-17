import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getServerSession } from "@/lib/auth"

export async function POST() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getServerClient()

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user.id)
      .eq("is_read", false)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json({ error: error.message || "Failed to mark all notifications as read" }, { status: 500 })
  }
}
