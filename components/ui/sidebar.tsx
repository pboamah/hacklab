"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group/sidebar relative flex h-full w-full flex-col gap-4 overflow-hidden border-r bg-background pb-10 transition-all duration-300 ease-in-out",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-14 items-center px-4", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-auto [&:has(+:focus-visible)]:border-b", className)} {...props} />
  ),
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center border-t p-4", className)} {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("py-2", className)} {...props} />,
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-2 text-xs font-medium text-muted-foreground", className)} {...props} />
  ),
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "group/button relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      isActive: {
        true: "bg-accent text-accent-foreground",
        false: "transparent",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
)

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"
    return <Comp ref={ref} className={cn(sidebarMenuButtonVariants({ isActive, className }))} {...props} />
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
)
SidebarInput.displayName = "SidebarInput"

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSidebarContext()

    return (
      <div
        ref={ref}
        className={cn(
          "absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize bg-transparent transition-all duration-300 ease-in-out hover:bg-accent active:bg-accent active:w-1",
          className,
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          const startX = e.clientX
          const sidebarWidth = e.currentTarget.parentElement?.getBoundingClientRect().width || 0

          const onMouseMove = (e: MouseEvent) => {
            if (e.clientX < 200) {
              setIsOpen(false)
              return
            }

            setIsOpen(true)
            const newWidth = sidebarWidth + (e.clientX - startX)
            if (e.currentTarget instanceof HTMLElement && e.currentTarget.parentElement) {
              e.currentTarget.parentElement.style.width = `${newWidth}px`
            }
          }

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
          }

          document.addEventListener("mousemove", onMouseMove)
          document.addEventListener("mouseup", onMouseUp)
        }}
        {...props}
      />
    )
  },
)
SidebarRail.displayName = "SidebarRail"

const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex h-screen w-full overflow-hidden">{children}</div>
    </SidebarContext.Provider>
  )
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSidebarContext()

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <path d="M9 3v18" />
        </svg>
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebarContext()

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-1 flex-col overflow-auto transition-[margin] duration-300 ease-in-out",
          isOpen ? "lg:ml-[240px]" : "lg:ml-0",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarInset.displayName = "SidebarInset"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarRail,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebarContext,
}
