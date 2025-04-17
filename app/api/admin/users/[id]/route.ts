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

    const { data: userData, error } = await supabase
      .from("users")
      .select(`
        *,
        profiles (*),
        social_media (*),
        education (*),
        work_history (*),
        user_skills (
          *,
          skills (*)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ user: userData }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user:", error)
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

    // Update user in database
    const { data: userData, error } = await supabase
      .from("users")
      .update({
        name: body.name,
        username: body.username,
        email: body.email,
        image: body.image,
        country: body.country,
        phone: body.phone,
        gender: body.gender,
        bio: body.bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: userData[0] }, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(params.id)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Delete user from database
    // Note: This might not be necessary if you have cascade delete set up in your database
    const { error } = await supabase.from("users").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
