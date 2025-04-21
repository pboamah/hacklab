import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/lib/store/store-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hacklab Connect",
  description: "A community platform for hackathons and tech events",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <StoreProvider>
            <AuthProvider>{children}</AuthProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
