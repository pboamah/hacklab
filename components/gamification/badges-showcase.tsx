"use client"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useGamificationStore } from "@/lib/store/root-store"

interface BadgesShowcaseProps {
  userId?: string
  limit?: number
  showEmpty?: boolean
  className?: string
}

export const BadgesShowcase = observer(
  ({ userId, limit = 5, showEmpty = true, className = "" }: BadgesShowcaseProps) => {
    const gamificationStore = useGamificationStore()

    useEffect(() => {
      if (!gamificationStore.profile) {
        gamificationStore.fetchUserGamificationProfile()
      }
    }, [gamificationStore])

    if (gamificationStore.isLoading) {
      return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full" />
          ))}
        </div>
      )
    }

    if (!gamificationStore.profile?.badges || gamificationStore.profile.badges.length === 0) {
      if (!showEmpty) return null

      return <div className={`text-center text-sm text-muted-foreground p-4 ${className}`}>No badges earned yet</div>
    }

    const displayBadges = gamificationStore.profile.badges
      .slice(0, limit)
      .map((badgeEntry) => badgeEntry.badge)
      .filter(Boolean)

    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <TooltipProvider>
          {displayBadges.map((badge) => (
            <Tooltip key={badge?.id}>
              <TooltipTrigger asChild>
                <div
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center cursor-help"
                  style={{
                    backgroundImage: badge?.image_url ? `url(${badge.image_url})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!badge?.image_url && <span className="text-xs font-bold">{badge?.name?.substring(0, 2)}</span>}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="text-sm font-semibold">{badge?.name}</div>
                <div className="text-xs">{badge?.description}</div>
              </TooltipContent>
            </Tooltip>
          ))}

          {gamificationStore.profile.badges.length > limit && (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              +{gamificationStore.profile.badges.length - limit}
            </div>
          )}
        </TooltipProvider>
      </div>
    )
  },
)
