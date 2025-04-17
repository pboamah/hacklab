"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getBrowserClient } from "@/lib/supabase"

interface SkillsInputProps {
  value: string[]
  onChange: (value: string[]) => void
  maxSkills?: number
}

export function SkillsInput({ value = [], onChange, maxSkills = 10 }: SkillsInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [availableSkills, setAvailableSkills] = useState<{ id: string; name: string }[]>([])
  const supabase = getBrowserClient()

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase.from("skills").select("id, name").order("name")

      if (!error && data) {
        setAvailableSkills(data)
      }
    }

    fetchSkills()
  }, [supabase])

  const handleSelect = (skill: string) => {
    if (value.includes(skill) || value.length >= maxSkills) return

    onChange([...value, skill])
    setInputValue("")
  }

  const handleRemove = (skill: string) => {
    onChange(value.filter((s) => s !== skill))
  }

  const handleCreateSkill = async () => {
    if (!inputValue.trim() || value.length >= maxSkills) return

    // Check if skill already exists
    const existingSkill = availableSkills.find((skill) => skill.name.toLowerCase() === inputValue.toLowerCase())

    if (existingSkill) {
      handleSelect(existingSkill.name)
      return
    }

    // Create new skill
    const { data, error } = await supabase
      .from("skills")
      .insert({ name: inputValue.trim() })
      .select("id, name")
      .single()

    if (!error && data) {
      setAvailableSkills([...availableSkills, data])
      handleSelect(data.name)
    }

    setInputValue("")
    setOpen(false)
  }

  const filteredSkills = availableSkills.filter(
    (skill) => !value.includes(skill.name) && skill.name.toLowerCase().includes(inputValue.toLowerCase()),
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
            {skill}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemove(skill)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {skill}</span>
            </Button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={value.length >= maxSkills}
          >
            {value.length >= maxSkills ? `Maximum of ${maxSkills} skills reached` : "Add skills..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search skills..." value={inputValue} onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty>
                <div className="py-2 px-4 text-sm">
                  <p>No skills found.</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={handleCreateSkill}>
                    Create "{inputValue}"
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredSkills.slice(0, 10).map((skill) => (
                  <CommandItem key={skill.id} value={skill.name} onSelect={() => handleSelect(skill.name)}>
                    {skill.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} of {maxSkills} skills selected
        </p>
      )}
    </div>
  )
}

export default SkillsInput
