"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User, LogOut, Settings, MessageSquare, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/mobile-nav"
import { LogoutButton } from "@/components/logout-button"
import { useAuth } from "@/contexts/auth-context"
import { NotificationCenter } from "@/components/notification-center"
import { PointsDisplay } from "@/components/gamification/points-display"

interface DashboardHeaderProps {
  heading: string
  text: string
  children?: React.ReactNode
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ heading, text, children }) => {
  const { user } = useAuth()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">{heading}</h1>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {children}
          {user ? (
            <>
              <Link href="/gamification">
                <PointsDisplay variant="compact" className="mr-2 hidden md:flex" />
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="mr-2">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
              <NotificationCenter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                      <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/gamification">
                      <Award className="mr-2 h-4 w-4" />
                      <span>Gamification</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutButton>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </LogoutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
