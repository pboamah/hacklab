import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month" // day, week, month, year

    // Get user count
    const { count: userCount, error: userError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    // Get new users in period
    let timeAgo
    const now = new Date()
    if (period === "day") {
      timeAgo = new Date(now.setDate(now.getDate() - 1)).toISOString()
    } else if (period === "week") {
      timeAgo = new Date(now.setDate(now.getDate() - 7)).toISOString()
    } else if (period === "month") {
      timeAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString()
    } else {
      timeAgo = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()
    }

    const { count: newUserCount, error: newUserError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", timeAgo)

    if (newUserError) {
      return NextResponse.json({ error: newUserError.message }, { status: 400 })
    }

    // Get community count
    const { count: communityCount, error: communityError } = await supabase
      .from("communities")
      .select("*", { count: "exact", head: true })

    if (communityError) {
      return NextResponse.json({ error: communityError.message }, { status: 400 })
    }

    // Get event count
    const { count: eventCount, error: eventError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 400 })
    }

    // Get upcoming events
    const { count: upcomingEventCount, error: upcomingEventError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("start_date", new Date().toISOString())

    if (upcomingEventError) {
      return NextResponse.json({ error: upcomingEventError.message }, { status: 400 })
    }

    // Get post count
    const { count: postCount, error: postError } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 400 })
    }

    // Get new posts in period
    const { count: newPostCount, error: newPostError } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", timeAgo)

    if (newPostError) {
      return NextResponse.json({ error: newPostError.message }, { status: 400 })
    }

    // Get open report count
    const { count: openReportCount, error: openReportError } = await supabase
      .from("content_reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (openReportError) {
      return NextResponse.json({ error: openReportError.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        analytics: {
          users: {
            total: userCount,
            new: newUserCount,
          },
          communities: {
            total: communityCount,
          },
          events: {
            total: eventCount,
            upcoming: upcomingEventCount,
          },
          posts: {
            total: postCount,
            new: newPostCount,
          },
          reports: {
            open: openReportCount,
          },
          period,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
