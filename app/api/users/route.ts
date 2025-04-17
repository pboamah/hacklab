import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/in-memory-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (email) {
      const user = db.getUserByEmail(email)

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json({ user }, { status: 200 })
    }

    const users = db.getAllUsers()
    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.displayName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email is already in use
    const existingUser = db.getUserByEmail(body.email)
    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 400 })
    }

    const newUser = db.createUser({
      firstName: body.firstName,
      lastName: body.lastName,
      displayName: body.displayName,
      email: body.email,
      bio: body.bio || "",
      location: body.location,
      avatar: body.avatar,
      skills: body.skills || [],
      social: body.social || {},
      settings: body.settings || {
        notifications: {
          email: {
            communityUpdates: true,
            eventReminders: true,
            directMessages: true,
          },
          push: false,
          frequency: "daily",
        },
        appearance: {
          theme: "system",
          fontSize: "medium",
        },
      },
    })

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
