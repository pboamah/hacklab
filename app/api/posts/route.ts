import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get("communityId")
    const authorId = searchParams.get("authorId")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20

    const supabase = getServerClient()

    let query = supabase.from("posts").select(`
        *,
        author:author_id(id, full_name, avatar_url, title),
        community:community_id(id, name),
        post_likes(user_id),
        comments(id)
      `)

    if (communityId) {
      query = query.eq("community_id", communityId)
    }

    if (authorId) {
      query = query.eq("author_id", authorId)
    }

    const { data: posts, error } = await query.order("created_at", { ascending: false }).limit(limit)

    if (error) throw error

    // Transform posts to include like_count and comment_count
    const transformedPosts = posts.map((post) => ({
      ...post,
      like_count: post.post_likes ? post.post_likes.length : 0,
      comment_count: post.comments ? post.comments.length : 0,
      // Remove the arrays to avoid sending too much data
      post_likes: undefined,
      comments: undefined,
    }))

    return NextResponse.json({ posts: transformedPosts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getServerClient()

    // Validate required fields
    if (!body.title || !body.content || !body.authorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        title: body.title,
        content: body.content,
        image_url: body.imageUrl,
        author_id: body.authorId,
        community_id: body.communityId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
