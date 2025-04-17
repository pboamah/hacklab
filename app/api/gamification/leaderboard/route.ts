import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const supabase = getServerClient()

    const { data, error } = await supabase
      .from("user_points")
      .select(`
        user_id,
        total_points,
        users:user_id(id, full_name, avatar_url)
      `)
      .order("total_points", { ascending: false })
      .limit(limit)

    if (error) throw error

    // Format the response
    const leaderboard = data.map((item) => ({
      user_id: item.user_id,
      user_name: item.users?.full_name || "Unknown User",
      avatar_url: item.users?.avatar_url,
      total_points: item.total_points,
      level: Math.floor(item.total_points / 100) + 1,
    }))

    return NextResponse.json({ leaderboard }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch leaderboard" }, { status: 500 })
  }
}
