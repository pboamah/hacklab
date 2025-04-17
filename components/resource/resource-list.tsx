"use client"

import { useEffect } from "react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { FileText, Download, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useResourceStore } from "@/lib/store/root-store"
import { useAuth } from "@/contexts/auth-context"

interface ResourceListProps {
  communityId?: string
}

export const ResourceList = observer(({ communityId }: ResourceListProps) => {
  const resourceStore = useResourceStore()
  const { user } = useAuth()

  useEffect(() => {
    resourceStore.fetchResources()
  }, [resourceStore])

  const resources = resourceStore.resources

  if (resourceStore.isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No Resources Found</CardTitle>
          <CardDescription>There are no resources available at the moment.</CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <Button asChild>
              <Link href={communityId ? `/communities/${communityId}/resources/create` : "/resources/create"}>
                Share Resource
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Link href={`/resources/${resource.id}`} className="hover:underline">
                  {resource.title}
                </Link>
              </CardTitle>
              <Badge variant="outline">{resource.type}</Badge>
            </div>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <FileText className="mr-1 h-4 w-4" />
                {resource.category}
              </div>
              <div className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                {resource.view_count} views
              </div>
              <div className="flex items-center">
                <Download className="mr-1 h-4 w-4" />
                {resource.download_count} downloads
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/resources/${resource.id}`}>View Resource</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
})
