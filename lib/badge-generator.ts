export function generateBadgeSvg(name: string, color = "#4f46e5"): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="${color}" opacity="0.2" />
      <circle cx="50" cy="50" r="40" fill="${color}" opacity="0.4" />
      <circle cx="50" cy="50" r="35" fill="${color}" />
      <text x="50" y="58" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
    </svg>
  `
}

export function getBadgeColors(): string[] {
  return [
    "#4f46e5", // indigo
    "#0ea5e9", // sky
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
  ]
}

export function generateBadgeUrl(name: string, index = 0): string {
  const colors = getBadgeColors()
  const color = colors[index % colors.length]

  const svgContent = generateBadgeSvg(name, color)
  const encodedSvg = encodeURIComponent(svgContent)

  return `data:image/svg+xml,${encodedSvg}`
}
