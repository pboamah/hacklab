"use client"

import { useState } from "react"
import { Github, Globe, Linkedin, Twitter } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SocialMediaInputsProps {
  values: {
    website?: string
    twitter?: string
    linkedin?: string
    github?: string
  }
  onChange: (values: any) => void
}

export function SocialMediaInputs({ values, onChange }: SocialMediaInputsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateUrl = (url: string, field: string) => {
    if (!url) return true

    try {
      // Add protocol if missing
      const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`
      new URL(urlWithProtocol)

      // Update with protocol if it was missing
      if (url !== urlWithProtocol) {
        onChange({ ...values, [field]: urlWithProtocol })
      }

      return true
    } catch (e) {
      setErrors({ ...errors, [field]: "Please enter a valid URL" })
      return false
    }
  }

  const handleChange = (field: string, value: string) => {
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }

    onChange({ ...values, [field]: value })
  }

  const handleBlur = (field: string) => {
    if (values[field as keyof typeof values]) {
      validateUrl(values[field as keyof typeof values] as string, field)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="website" className="flex items-center gap-2">
          <Globe className="h-4 w-4" /> Website
        </Label>
        <div className="relative">
          <Input
            id="website"
            placeholder="https://yourwebsite.com"
            value={values.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            onBlur={() => handleBlur("website")}
            className={errors.website ? "border-red-500" : ""}
          />
          {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter" className="flex items-center gap-2">
          <Twitter className="h-4 w-4" /> Twitter
        </Label>
        <div className="relative">
          <Input
            id="twitter"
            placeholder="https://twitter.com/username"
            value={values.twitter || ""}
            onChange={(e) => handleChange("twitter", e.target.value)}
            onBlur={() => handleBlur("twitter")}
            className={errors.twitter ? "border-red-500" : ""}
          />
          {errors.twitter && <p className="text-xs text-red-500 mt-1">{errors.twitter}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin" className="flex items-center gap-2">
          <Linkedin className="h-4 w-4" /> LinkedIn
        </Label>
        <div className="relative">
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/username"
            value={values.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            onBlur={() => handleBlur("linkedin")}
            className={errors.linkedin ? "border-red-500" : ""}
          />
          {errors.linkedin && <p className="text-xs text-red-500 mt-1">{errors.linkedin}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="github" className="flex items-center gap-2">
          <Github className="h-4 w-4" /> GitHub
        </Label>
        <div className="relative">
          <Input
            id="github"
            placeholder="https://github.com/username"
            value={values.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            onBlur={() => handleBlur("github")}
            className={errors.github ? "border-red-500" : ""}
          />
          {errors.github && <p className="text-xs text-red-500 mt-1">{errors.github}</p>}
        </div>
      </div>
    </div>
  )
}

export default SocialMediaInputs
