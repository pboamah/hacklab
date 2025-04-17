import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getServerSession } from "@/lib/auth"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const supabase = createClient()

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        full_name: body.full_name,
        bio: body.bio,
        location: body.location,
        title: body.title,
        skills: body.skills,
        social: body.social,
        current_job_role: body.current_job_role,
        current_workplace: body.current_workplace,
        favorite_programming_language: body.favorite_programming_language,
        favorite_tech_stack: body.favorite_tech_stack,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating profile:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
