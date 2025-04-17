import { NextResponse } from "next/server"
import { generateBadgeSvg, getBadgeColors } from "@/lib/badge-generator"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name") || "Badge"
    const colorIndex = Number.parseInt(searchParams.get("colorIndex") || "0", 10)

    const colors = getBadgeColors()
    const color = colors[colorIndex % colors.length]

    const svgContent = generateBadgeSvg(name, color)

    return new Response(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error: any) {
    console.error("Error generating badge:", error)
    return NextResponse.json({ error: error.message || "Failed to generate badge" }, { status: 500 })
  }
}
