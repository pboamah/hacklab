"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getBrowserClient } from "@/lib/supabase"

type SearchResult = {
  id: string
  type: "user" | "community" | "event" | "post" | "job" | "resource"
  title: string
  description?: string
  image?: string
  url: string
  date?: string
  tags?: string[]
  author?: {
    name: string
    image?: string
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialType = searchParams.get("type") || "all"

  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState(initialType)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialType as string)
    }
  }, [initialQuery, initialType])

  const performSearch = async (searchQuery: string, type: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)

    try {
      const supabase = getBrowserClient()
      let searchResults: SearchResult[] = []

      // Search users
      if (type === "all" || type === "users") {
        const { data: users } = await supabase
          .from("users")
          .select("id, name, username, image, bio")
          .ilike("name", `%${searchQuery}%`)
          .or(`username.ilike.%${searchQuery}%`)
          .limit(10)

        if (users) {
          const userResults = users.map((user) => ({
            id: user.id,
            type: "user" as const,
            title: user.name,
            description: user.bio || `@${user.username}`,
            image: user.image,
            url: `/profile/${user.username}`,
          }))
          searchResults = [...searchResults, ...userResults]
        }
      }

      // Search communities
      if (type === "all" || type === "communities") {
        const { data: communities } = await supabase
          .from("communities")
          .select("id, name, description, image")
          .ilike("name", `%${searchQuery}%`)
          .or(`description.ilike.%${searchQuery}%`)
          .limit(10)

        if (communities) {
          const communityResults = communities.map((community) => ({
            id: community.id,
            type: "community" as const,
            title: community.name,
            description: community.description,
            image: community.image,
            url: `/communities/${community.id}`,
          }))
          searchResults = [...searchResults, ...communityResults]
        }
      }

      // Search events
      if (type === "all" || type === "events") {
        const { data: events } = await supabase
          .from("events")
          .select("id, name, description, image, start_date, end_date")
          .ilike("name", `%${searchQuery}%`)
          .or(`description.ilike.%${searchQuery}%`)
          .limit(10)

        if (events) {
          const eventResults = events.map((event) => ({
            id: event.id,
            type: "event" as const,
            title: event.name,
            description: event.description,
            image: event.image,
            url: `/events/${event.id}`,
            date: new Date(event.start_date).toLocaleDateString(),
          }))
          searchResults = [...searchResults, ...eventResults]
        }
      }

      // Search posts
      if (type === "all" || type === "posts") {
        const { data: posts } = await supabase
          .from("posts")
          .select("id, content, image, created_at, users(name, image)")
          .ilike("content", `%${searchQuery}%`)
          .limit(10)

        if (posts) {
          const postResults = posts.map((post) => ({
            id: post.id,
            type: "post" as const,
            title: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
            description: post.content,
            image: post.image,
            url: `/posts/${post.id}`,
            date: new Date(post.created_at).toLocaleDateString(),
            author: {
              name: post.users?.name || "Unknown",
              image: post.users?.image,
            },
          }))
          searchResults = [...searchResults, ...postResults]
        }
      }

      // Search jobs
      if (type === "all" || type === "jobs") {
        const { data: jobs } = await supabase
          .from("jobs")
          .select("id, title, company, description, location, is_remote, type, cover_image")
          .ilike("title", `%${searchQuery}%`)
          .or(`description.ilike.%${searchQuery}%`)
          .or(`company.ilike.%${searchQuery}%`)
          .limit(10)

        if (jobs) {
          const jobResults = jobs.map((job) => ({
            id: job.id,
            type: "job" as const,
            title: job.title,
            description: `${job.company} • ${job.location}${job.is_remote ? " (Remote)" : ""}`,
            image: job.cover_image,
            url: `/jobs/${job.id}`,
            tags: [job.type],
          }))
          searchResults = [...searchResults, ...jobResults]
        }
      }

      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, activeTab)

    // Update URL with search params
    const url = new URL(window.location.href)
    url.searchParams.set("q", query)
    url.searchParams.set("type", activeTab)
    window.history.pushState({}, "", url.toString())
  }

  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Search</h1>

          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for people, communities, events, posts..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="users">People</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {results.length === 0 && !isLoading && initialQuery && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No results found for "{initialQuery}"</p>
                </div>
              )}

              {results.length === 0 && !isLoading && !initialQuery && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Enter a search term to find results</p>
                </div>
              )}

              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-1/3"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {results.map((result) => (
                <Link href={result.url} key={`${result.type}-${result.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4">
                      {result.image ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={result.image} alt={result.title} />
                          <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <CardTitle className="text-lg">{result.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline">{result.type}</Badge>
                          {result.date && <span className="text-xs">{result.date}</span>}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    {result.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>
                      </CardContent>
                    )}

                    {(result.tags || result.author) && (
                      <CardFooter>
                        <div className="flex flex-wrap gap-2 items-center text-sm">
                          {result.author && (
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={result.author.image} alt={result.author.name} />
                                <AvatarFallback>{result.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{result.author.name}</span>
                            </div>
                          )}

                          {result.tags &&
                            result.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                </Link>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}
