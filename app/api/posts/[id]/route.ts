import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/app/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = getServerClient()
    const { data: post, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:author_id(id, full_name, avatar_url, title),
        community:community_id(id, name)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Get likes
    const { data: likes, error: likesError } = await supabase
      .from("post_likes")
      .select("user_id")
      .eq("post_id", params.id)

    if (likesError) throw likesError

    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select(`
        *,
        author:author_id(id, full_name, avatar_url)
      `)
      .eq("post_id", params.id)
      .order("created_at", { ascending: true })

    if (commentsError) throw commentsError

    // Check if the current user has liked the post
    const liked = userId ? likes.some((like) => like.user_id === userId) : false

    return NextResponse.json(
      {
        post: {
          ...post,
          likes: likes || [],
          comments: comments || [],
          like_count: likes ? likes.length : 0,
          comment_count: comments ? comments.length : 0,
          liked,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = getServerClient()

    const { data: post, error } = await supabase
      .from("posts")
      .update({
        title: body.title,
        content: body.content,
        image_url: body.imageUrl,
        community_id: body.communityId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }

    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerClient()
    const { error } = await supabase.from("posts").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
