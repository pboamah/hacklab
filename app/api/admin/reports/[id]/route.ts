import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: report, error } = await supabase
      .from("content_reports")
      .select(`
        *,
        reported_by:users!reported_by_id (*),
        content_author:users!content_author_id (*)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ report }, { status: 200 })
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Update report status
    const { data: report, error } = await supabase
      .from("content_reports")
      .update({
        status: body.status,
        resolution_notes: body.resolution_notes,
        resolved_by: session.user.id,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If the report is approved, we might want to take action on the content
    if (body.status === "approved") {
      // Handle content removal based on content_type
      if (report[0].content_type === "post") {
        await supabase
          .from("posts")
          .update({ is_removed: true, removed_reason: "Violated community guidelines" })
          .eq("id", report[0].content_id)
      } else if (report[0].content_type === "comment") {
        await supabase
          .from("comments")
          .update({ is_removed: true, removed_reason: "Violated community guidelines" })
          .eq("id", report[0].content_id)
      }
    }

    return NextResponse.json({ report: report[0] }, { status: 200 })
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
