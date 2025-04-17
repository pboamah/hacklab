"use client"

import type React from "react"

import { observer } from "mobx-react-lite"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Users, BookOpen, Briefcase, Trophy, MessageSquare, Bell, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"

interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MobileNav = observer(({ className, ...props }: MobileNavProps) => {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className={cn("flex flex-col h-full", className)} {...props}>
      <div className="px-2 py-2">
        <Link href="/" className="flex items-center pl-2">
          <span className="font-bold">Community Platform</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Main</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname?.startsWith("/events") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/events">
                <CalendarDays className="mr-2 h-4 w-4" />
                Events
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/communities") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/communities">
                <Users className="mr-2 h-4 w-4" />
                Communities
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/resources") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/resources">
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/jobs") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Jobs
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/hackathons") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/hackathons">
                <Trophy className="mr-2 h-4 w-4" />
                Hackathons
              </Link>
            </Button>
          </div>
        </div>
        {user && (
          <div className="px-2 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Personal</h2>
            <div className="space-y-1">
              <Button
                asChild
                variant={pathname === "/messages" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/notifications" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/gamification" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/gamification">
                  <Award className="mr-2 h-4 w-4" />
                  Gamification
                </Link>
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
})
