import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/in-memory-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resource = db.getResourceById(params.id)

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ resource }, { status: 200 })
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedResource = db.updateResource(params.id, body)

    if (!updatedResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ resource: updatedResource }, { status: 200 })
  } catch (error) {
    console.error("Error updating resource:", error)
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = db.deleteResource(params.id)

    if (!success) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 })
  }
}
