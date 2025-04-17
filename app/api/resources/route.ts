import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/in-memory-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get("communityId")

    let resources
    if (communityId) {
      resources = db.getResourcesByCommunity(communityId)
    } else {
      resources = db.getAllResources()
    }

    return NextResponse.json({ resources }, { status: 200 })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.category || !body.createdBy || !body.communityId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Ensure at least a URL or file is provided
    if (!body.url && !body.fileUrl) {
      return NextResponse.json({ error: "Either a URL or file must be provided" }, { status: 400 })
    }

    const newResource = db.createResource({
      title: body.title,
      description: body.description || "",
      url: body.url,
      fileUrl: body.fileUrl,
      category: body.category,
      tags: body.tags || [],
      createdBy: body.createdBy,
      communityId: body.communityId,
    })

    return NextResponse.json({ resource: newResource }, { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 })
  }
}
