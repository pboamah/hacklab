"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [color, setColor] = useState(value || "#000000")
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setColor(value)
  }, [value])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    onChange(newColor)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newColor = e.target.value

    // Add # if missing
    if (newColor.length > 0 && !newColor.startsWith("#")) {
      newColor = `#${newColor}`
    }

    // Validate hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor) || newColor === "#") {
      setColor(newColor)
      if (newColor !== "#") {
        onChange(newColor)
      }
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-10"
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: color }} />
              <span>{color}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="flex flex-col gap-2">
            <div className="w-full h-32 rounded-md overflow-hidden">
              <input
                ref={inputRef}
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-full h-full cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: color }} />
              <Input value={color} onChange={handleInputChange} className="flex-1" placeholder="#000000" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
