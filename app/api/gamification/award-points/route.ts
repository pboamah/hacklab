import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getServerSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { points, description, type } = body

    if (!points || !description || !type) {
      return NextResponse.json({ error: "points, description, and type are required" }, { status: 400 })
    }

    const userId = session.user.id
    const supabase = getServerClient()

    // Add points to user's total
    const { error: pointsError } = await supabase.rpc("add_user_points", {
      user_id_param: userId,
      points_to_add: points,
    })

    if (pointsError) throw pointsError

    // Record the achievement
    const { data: achievement, error: achievementError } = await supabase
      .from("user_achievements")
      .insert({
        user_id: userId,
        type,
        points,
        description,
      })
      .select()
      .single()

    if (achievementError) throw achievementError

    // Create a notification
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "points",
      content: `You earned ${points} points for: ${description}`,
    })

    // Check for badges
    const { data: pointsData } = await supabase
      .from("user_points")
      .select("total_points")
      .eq("user_id", userId)
      .single()

    if (pointsData) {
      const totalPoints = pointsData.total_points

      // Get user's current badges
      const { data: userBadges } = await supabase.from("user_badges").select("badge_id").eq("user_id", userId)
      const userBadgeIds = new Set(userBadges?.map((badge) => badge.badge_id) || [])

      // Get badges that user might qualify for
      const { data: availableBadges } = await supabase
        .from("badges")
        .select("*")
        .lte("points_value", totalPoints)
        .order("points_value", { ascending: true })

      if (availableBadges) {
        // Award badges user doesn't already have
        for (const badge of availableBadges) {
          if (!userBadgeIds.has(badge.id)) {
            const { error } = await supabase.from("user_badges").insert({
              user_id: userId,
              badge_id: badge.id,
            })

            if (!error) {
              // Create notification for the new badge
              await supabase.from("notifications").insert({
                user_id: userId,
                type: "badge",
                content: `You earned the ${badge.name} badge!`,
                related_id: badge.id,
              })
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, achievement }, { status: 200 })
  } catch (error: any) {
    console.error("Error awarding points:", error)
    return NextResponse.json({ error: error.message || "Failed to award points" }, { status: 500 })
  }
}
