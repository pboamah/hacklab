import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/in-memory-db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedUser = db.updateUserSettings(params.id, body)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
  }
}
