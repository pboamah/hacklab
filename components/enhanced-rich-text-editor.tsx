"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile,
  Underline,
  Strikethrough,
  Table,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface EnhancedRichTextEditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  toolbar?: boolean
  preview?: boolean
  mentions?: { id: string; name: string; avatar?: string }[]
}

export function EnhancedRichTextEditor({
  id,
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = 200,
  maxHeight,
  toolbar = true,
  preview = true,
  mentions = [],
}: EnhancedRichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 })
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [mentionPickerOpen, setMentionPickerOpen] = useState(false)
  const [mentionSearch, setMentionSearch] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Common emojis for quick access
  const commonEmojis = ["😊", "👍", "👎", "❤️", "🙏", "👀", "🔥", "🎉", "😂", "🤔", "😎", "👋", "✅", "❌", "⭐", "💯"]

  useEffect(() => {
    // Focus the textarea when switching to write tab
    if (activeTab === "write" && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [activeTab])

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    })
  }

  const insertText = (before: string, after = "") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const newValue =
      value.substring(0, selection.start) +
      before +
      value.substring(selection.start, selection.end) +
      after +
      value.substring(selection.end)

    onChange(newValue)

    // Set new cursor position for better UX
    const newCursorPos = selection.start + before.length + (selection.end - selection.start) + after.length

    // Use setTimeout to ensure the textarea is updated before setting selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const formatText = (type: string) => {
    const selectedText = value.substring(selection.start, selection.end)

    switch (type) {
      case "bold":
        insertText("**", "**")
        break
      case "italic":
        insertText("*", "*")
        break
      case "underline":
        insertText("<u>", "</u>")
        break
      case "strikethrough":
        insertText("~~", "~~")
        break
      case "code":
        if (selectedText.includes("\n")) {
          insertText("```\n", "\n```")
        } else {
          insertText("`", "`")
        }
        break
      case "h1":
        insertText("# ")
        break
      case "h2":
        insertText("## ")
        break
      case "h3":
        insertText("### ")
        break
      case "ul":
        insertText("- ")
        break
      case "ol":
        insertText("1. ")
        break
      case "quote":
        insertText("> ")
        break
      case "link":
        setLinkText(selectedText)
        setLinkDialogOpen(true)
        break
      case "image":
        setImageDialogOpen(true)
        break
      case "table":
        setTableDialogOpen(true)
        break
      default:
        break
    }
  }

  const insertLink = () => {
    const linkMarkdown = `[${linkText || "link text"}](${linkUrl})`
    insertText(linkMarkdown, "")
    setLinkDialogOpen(false)
    setLinkUrl("")
    setLinkText("")
  }

  const insertImage = () => {
    const imageMarkdown = `![${imageAlt || "image"}](${imageUrl})`
    insertText(imageMarkdown, "")
    setImageDialogOpen(false)
    setImageUrl("")
    setImageAlt("")
  }

  const insertTable = () => {
    let tableMarkdown = "\n"

    // Header row
    tableMarkdown += "|"
    for (let i = 0; i < tableCols; i++) {
      tableMarkdown += ` Header ${i + 1} |`
    }
    tableMarkdown += "\n"

    // Separator row
    tableMarkdown += "|"
    for (let i = 0; i < tableCols; i++) {
      tableMarkdown += " --- |"
    }
    tableMarkdown += "\n"

    // Data rows
    for (let row = 0; row < tableRows; row++) {
      tableMarkdown += "|"
      for (let col = 0; col < tableCols; col++) {
        tableMarkdown += ` Cell ${row + 1},${col + 1} |`
      }
      tableMarkdown += "\n"
    }

    insertText(tableMarkdown, "")
    setTableDialogOpen(false)
    setTableRows(3)
    setTableCols(3)
  }

  const insertEmoji = (emoji: string) => {
    insertText(emoji, "")
    setEmojiPickerOpen(false)
  }

  const insertMention = (mention: { id: string; name: string }) => {
    insertText(`@${mention.name}`, "")
    setMentionPickerOpen(false)
    setMentionSearch("")
  }

  const filteredMentions = mentions.filter((mention) =>
    mention.name.toLowerCase().includes(mentionSearch.toLowerCase()),
  )

  const renderMarkdown = () => {
    // Basic markdown to HTML conversion for preview
    // In a real implementation, use a proper markdown library
    const html = value
      .replace(/\n/g, "<br />")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" style="max-width: 100%;" />')
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/^- (.*?)$/gm, "<ul><li>$1</li></ul>")
      .replace(/^[0-9]+\. (.*?)$/gm, "<ol><li>$1</li></ol>")
      .replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>")

    return html
  }

  return (
    <div className="border rounded-md">
      {toolbar && (
        <div className="bg-muted/50 p-2 flex flex-wrap gap-1 items-center border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heading1 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => formatText("h1")}>
                <Heading1 className="h-4 w-4 mr-2" />
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => formatText("h2")}>
                <Heading2 className="h-4 w-4 mr-2" />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => formatText("h3")}>
                <Heading3 className="h-4 w-4 mr-2" />
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => formatText("bold")} className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("italic")} className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("underline")} className="h-8 w-8">
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("strikethrough")} className="h-8 w-8">
            <Strikethrough className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Button variant="ghost" size="icon" onClick={() => formatText("ul")} className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("ol")} className="h-8 w-8">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("quote")} className="h-8 w-8">
            <Quote className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("code")} className="h-8 w-8">
            <Code className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Button variant="ghost" size="icon" onClick={() => formatText("link")} className="h-8 w-8">
            <Link className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("image")} className="h-8 w-8">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("table")} className="h-8 w-8">
            <Table className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMentionPickerOpen(true)} className="h-8 w-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0 -4 8" />
            </svg>
          </Button>

          <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-8 gap-2">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="text-lg hover:bg-accent p-1 rounded"
                    onClick={() => insertEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

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
      )}

      {preview ? (
        <Tabs defaultValue="write" onValueChange={setActiveTab}>
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-40 grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="write" className="p-0 m-0">
            <Textarea
              id={id}
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onSelect={handleTextareaSelect}
              placeholder={placeholder}
              className="min-h-[200px] border-0 focus-visible:ring-0 rounded-none p-4"
              style={{
                minHeight: `${minHeight}px`,
                maxHeight: maxHeight ? `${maxHeight}px` : undefined,
                resize: maxHeight ? "vertical" : undefined,
              }}
            />
          </TabsContent>

          <TabsContent value="preview" className="p-4 m-0 min-h-[200px] prose-sm max-w-none">
            {/* Use a proper markdown library here */}
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown() }} />
            ) : (
              <p className="text-muted-foreground">Nothing to preview</p>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onSelect={handleTextareaSelect}
          placeholder={placeholder}
          className="min-h-[200px] border-0 focus-visible:ring-0 rounded-none p-4"
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: maxHeight ? `${maxHeight}px` : undefined,
            resize: maxHeight ? "vertical" : undefined,
          }}
        />
      )}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-text" className="text-right">
                Text
              </Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-url" className="text-right">
                URL
              </Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={insertLink} disabled={!linkUrl}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image-url" className="text-right">
                URL
              </Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image-alt" className="text-right">
                Alt Text
              </Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={insertImage} disabled={!imageUrl}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Dialog */}
      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="table-rows" className="text-right">
                Rows
              </Label>
              <Input
                id="table-rows"
                type="number"
                min="1"
                max="10"
                value={tableRows}
                onChange={(e) => setTableRows(Number.parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="table-cols" className="text-right">
                Columns
              </Label>
              <Input
                id="table-cols"
                type="number"
                min="1"
                max="10"
                value={tableCols}
                onChange={(e) => setTableCols(Number.parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={insertTable}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mention Picker */}
      <Popover open={mentionPickerOpen} onOpenChange={setMentionPickerOpen}>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2">
            <Input
              placeholder="Search users..."
              value={mentionSearch}
              onChange={(e) => setMentionSearch(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-[200px] overflow-y-auto">
              {filteredMentions.length > 0 ? (
                filteredMentions.map((mention) => (
                  <button
                    key={mention.id}
                    className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-md text-left"
                    onClick={() => insertMention(mention)}
                  >
                    {mention.avatar ? (
                      <img
                        src={mention.avatar || "/placeholder.svg"}
                        alt={mention.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                        {mention.name.charAt(0)}
                      </div>
                    )}
                    <span>{mention.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">No users found</p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
