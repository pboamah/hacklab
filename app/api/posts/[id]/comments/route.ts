import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerClient()
    const { data: comments, error } = await supabase
      .from("comments")
      .select(`
        *,
        author:author_id(id, full_name, avatar_url)
      `)
      .eq("post_id", params.id)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ comments }, { status: 200 })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { content, authorId } = await request.json()
    const supabase = getServerClient()

    if (!content || !authorId) {
      return NextResponse.json({ error: "Content and author ID are required" }, { status: 400 })
    }

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        content,
        post_id: params.id,
        author_id: authorId,
      })
      .select(`
        *,
        author:author_id(id, full_name, avatar_url)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
