import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getServerSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const supabase = getServerClient()
    const { data: userData } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (!userData?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, description, requirement, points_value } = body

    if (!id || !name || !description || !requirement || points_value === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate badge image if not provided
    let image_url = body.image_url
    if (!image_url) {
      // Get the badge index for color selection
      const { data: badgeCount } = await supabase.from("badges").select("id", { count: "exact" })
      const colorIndex = badgeCount?.length || 0

      // Generate a badge SVG URL
      image_url = `/api/gamification/badges/generate?name=${encodeURIComponent(name)}&colorIndex=${colorIndex}`
    }

    // Update the badge
    const { data, error } = await supabase
      .from("badges")
      .update({
        name,
        description,
        requirement,
        points_value,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ badge: data }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating badge:", error)
    return NextResponse.json({ error: error.message || "Failed to update badge" }, { status: 500 })
  }
}
