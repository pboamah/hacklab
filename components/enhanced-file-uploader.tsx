"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Image, File, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface EnhancedFileUploaderProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  previewUrl?: string
  label?: string
  description?: string
  buttonText?: string
  isUploading?: boolean
}

export function EnhancedFileUploader({
  onFileSelect,
  onFileRemove,
  accept = "image/*",
  maxSize = 5, // Default 5MB
  className,
  previewUrl,
  label = "Upload a file",
  description = "Drag and drop or click to upload",
  buttonText = "Select File",
  isUploading = false,
}: EnhancedFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(previewUrl || null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const isImage = accept.includes("image")
  const maxSizeBytes = maxSize * 1024 * 1024 // Convert MB to bytes

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: `File size should not exceed ${maxSize}MB`,
        variant: "destructive",
      })
      return false
    }

    // Check file type
    if (accept !== "*" && !accept.includes("*")) {
      const fileType = file.type
      const acceptTypes = accept.split(",").map((type) => type.trim())
      const isValidType = acceptTypes.some((type) => {
        if (type.includes("*")) {
          const mainType = type.split("/")[0]
          return fileType.startsWith(mainType)
        }
        return type === fileType
      })

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `File must be of type: ${accept}`,
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    if (!validateFile(file)) return

    setFileName(file.name)
    onFileSelect(file)

    // Create preview for images
    if (isImage) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setFileName(null)
    if (inputRef.current) inputRef.current.value = ""
    if (onFileRemove) onFileRemove()
  }

  const getFileIcon = () => {
    if (accept.includes("image")) return <Image className="h-8 w-8" />
    if (accept.includes("pdf")) return <FileText className="h-8 w-8" />
    return <File className="h-8 w-8" />
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      {preview || fileName ? (
        <div className="relative rounded-md border border-border p-2">
          {preview && isImage ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2">
              {getFileIcon()}
              <span className="text-sm font-medium">{fileName}</span>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 rounded-full bg-background/80"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-md border border-dashed border-border p-6 transition-colors",
            isDragging && "border-primary bg-muted",
            "cursor-pointer",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="rounded-full bg-muted p-2">
              <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{description}</p>
              <p className="text-xs text-muted-foreground">
                {isImage ? "PNG, JPG or GIF" : "Any file"} up to {maxSize}MB
              </p>
            </div>
            <Button type="button" variant="secondary" size="sm" disabled={isUploading}>
              {isUploading ? "Uploading..." : buttonText}
            </Button>
          </div>
          <Input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  )
}
