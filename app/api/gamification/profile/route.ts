import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getServerSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || session.user.id

    const supabase = getServerClient()

    // Get user points
    const { data: pointsData, error: pointsError } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (pointsError && pointsError.code !== "PGRST116") {
      throw pointsError
    }

    // Get user badges with badge details
    const { data: badgesData, error: badgesError } = await supabase
      .from("user_badges")
      .select(`
        *,
        badge:badges(*)
      `)
      .eq("user_id", userId)

    if (badgesError) {
      throw badgesError
    }

    // Get recent achievements
    const { data: achievementsData, error: achievementsError } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    if (achievementsError) {
      throw achievementsError
    }

    // Calculate level based on points
    const totalPoints = pointsData?.total_points || 0
    const level = Math.floor(totalPoints / 100) + 1
    const nextLevelPoints = level * 100

    const profile = {
      user_id: userId,
      total_points: totalPoints,
      level,
      next_level_points: nextLevelPoints,
      badges: badgesData || [],
      recent_achievements: achievementsData || [],
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching gamification profile:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch gamification profile" }, { status: 500 })
  }
}
