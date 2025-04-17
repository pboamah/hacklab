import { NextResponse } from "next/server"
import { initializeStorage } from "@/lib/storage"

export async function POST() {
  try {
    await initializeStorage()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error initializing storage:", error)
    return NextResponse.json({ error: "Failed to initialize storage" }, { status: 500 })
  }
}
