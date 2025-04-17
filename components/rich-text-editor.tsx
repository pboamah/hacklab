"use client"

import type React from "react"

import { useState } from "react"
import { Bold, Italic, List, ListOrdered, Link, Image, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 })

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    })
  }

  const insertMarkdown = (markdownBefore: string, markdownAfter = "") => {
    const newValue =
      value.substring(0, selection.start) +
      markdownBefore +
      value.substring(selection.start, selection.end) +
      markdownAfter +
      value.substring(selection.end)

    onChange(newValue)
  }

  const formatText = (type: string) => {
    switch (type) {
      case "bold":
        insertMarkdown("**", "**")
        break
      case "italic":
        insertMarkdown("*", "*")
        break
      case "ul":
        insertMarkdown("- ")
        break
      case "ol":
        insertMarkdown("1. ")
        break
      case "link":
        insertMarkdown("[", "](https://)")
        break
      case "image":
        insertMarkdown("![alt text](", ")")
        break
      default:
        break
    }
  }

  return (
    <div className="border rounded-md">
      <div className="bg-muted/50 p-2 flex flex-wrap gap-1 items-center">
        <Button variant="ghost" size="icon" onClick={() => formatText("bold")} className="h-8 w-8">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => formatText("italic")} className="h-8 w-8">
          <Italic className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button variant="ghost" size="icon" onClick={() => formatText("ul")} className="h-8 w-8">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => formatText("ol")} className="h-8 w-8">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button variant="ghost" size="icon" onClick={() => formatText("link")} className="h-8 w-8">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => formatText("image")} className="h-8 w-8">
          <Image className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToggleGroup type="single" defaultValue="left">
          <ToggleGroupItem value="left" size="sm" className="h-8 w-8">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" size="sm" className="h-8 w-8">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" size="sm" className="h-8 w-8">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Tabs defaultValue="write" onValueChange={setActiveTab}>
        <div className="px-4 py-2 border-b">
          <TabsList className="grid w-40 grid-cols-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="p-0 m-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleTextareaSelect}
            placeholder="Write your content here using Markdown..."
            className="min-h-[200px] border-0 focus-visible:ring-0 rounded-none p-4"
          />
        </TabsContent>

        <TabsContent value="preview" className="p-4 m-0 min-h-[200px] prose-sm max-w-none">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, "<br />") }} />
          ) : (
            <p className="text-muted-foreground">Nothing to preview</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
