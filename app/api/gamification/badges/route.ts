import { NextResponse } from "next/server"
import { getServerClient } from "@/app/lib/auth"

export async function GET() {
  try {
    const supabase = getServerClient()

    const { data, error } = await supabase.from("badges").select("*").order("points_value", { ascending: true })

    if (error) throw error

    return NextResponse.json({ badges: data }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching badges:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch badges" }, { status: 500 })
  }
}
