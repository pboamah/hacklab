import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/app/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const supabase = getServerClient()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if user already liked the post
    const { data: existingLike, error: checkError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", params.id)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingLike) {
      return NextResponse.json(
        {
          message: "User already liked this post",
          like: existingLike,
        },
        { status: 200 },
      )
    }

    // Add like
    const { data: like, error } = await supabase
      .from("post_likes")
      .insert({
        post_id: params.id,
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ like }, { status: 201 })
  } catch (error) {
    console.error("Error liking post:", error)
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const supabase = getServerClient()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("post_likes").delete().eq("post_id", params.id).eq("user_id", userId)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error unliking post:", error)
    return NextResponse.json({ error: "Failed to unlike post" }, { status: 500 })
  }
}
