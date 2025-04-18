"use client"

import Link from "next/link"
import { observer } from "mobx-react-lite"
import { ArrowRight, Calendar, Clock, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCommunityStore } from "@/lib/store/root-store"
import { useEffect } from "react"
import { HeroImageGenerator } from "@/app/components/ai/hero-image-generator"

const Home = observer(() => {
  const communityStore = useCommunityStore()

  useEffect(() => {
    communityStore.fetchCommunities()
  }, [communityStore])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Hacklab</span>
            <span>Connect</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/communities" className="text-sm font-medium transition-colors hover:text-primary">
              Communities
            </Link>
            <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary">
              Events
            </Link>
            <Link href="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
              Jobs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Connect with the tech community
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join events, find jobs, and connect with like-minded professionals in the tech industry.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/communities">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Explore Communities
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <HeroImageGenerator />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to connect, learn, and grow in the tech community
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">Communities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join open communities or request to join closed ones. Connect with peers, share knowledge, and
                    collaborate.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/communities" className="text-sm text-primary hover:underline">
                    Explore Communities
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Calendar className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Discover upcoming events, register for webinars, and track your participation history.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/events" className="text-sm text-primary hover:underline">
                    View Events
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Clock className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay updated with the latest posts from your communities and connections.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/timeline" className="text-sm text-primary hover:underline">
                    View Timeline
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Hacklab Connect. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
})

export default Home
