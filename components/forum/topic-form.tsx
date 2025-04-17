"use client"

import type React from "react"

import { useState } from "react"
import { observer } from "mobx-react-lite"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { useForumStore } from "@/lib/store"
import { EnhancedRichTextEditor } from "@/components/enhanced-rich-text-editor"

interface TopicFormProps {
  forumId: string
  onSuccess?: (topicId: string) => void
}

export const TopicForm = observer(({ forumId, onSuccess }: TopicFormProps) => {
  const forumStore = useForumStore()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    try {
      const topic = await forumStore.createTopic({
        title,
        content,
        forumId,
        isPinned,
      })

      if (topic) {
        toast({
          title: "Topic created",
          description: "Your topic has been created successfully",
        })
        setTitle("")
        setContent("")
        setIsPinned(false)
        setTags([])
        if (onSuccess) {
          onSuccess(topic.id)
        }
      } else {
        throw new Error("Failed to create topic")
      }
    } catch (error) {
      console.error("Error creating topic:", error)
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    const normalizedTag = tagInput.trim().toLowerCase()
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter topic title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <EnhancedRichTextEditor
              id="content"
              value={content}
              onChange={(value) => setContent(value)}
              placeholder="Write your topic content here..."
              minHeight={250}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="pinned" checked={isPinned} onCheckedChange={(checked) => setIsPinned(!!checked)} />
            <Label htmlFor="pinned">Pin this topic</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Topic"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
})
