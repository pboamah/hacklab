"use client"

import { observer } from "mobx-react-lite"
import { useState, useEffect } from "react"
import { Monitor, Users, MessageSquare, Send, Mic, MicOff, Video, VideoOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useEventStore } from "@/lib/store/root-store"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface VirtualEventRoomProps {
  eventId: string
}

export const VirtualEventRoom = observer(({ eventId }: VirtualEventRoomProps) => {
  const eventStore = useEventStore()
  const { user } = useAuth()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [messages, setMessages] = useState<
    Array<{
      id: string
      sender: { id: string; name: string; avatar?: string }
      content: string
      timestamp: string
    }>
  >([])
  const [participants, setParticipants] = useState<
    Array<{
      id: string
      name: string
      avatar?: string
      isPresenting?: boolean
      hasAudio?: boolean
      hasVideo?: boolean
    }>
  >([])

  useEffect(() => {
    if (eventId) {
      eventStore.fetchEventById(eventId)

      // Join the virtual event
      const joinVirtualEvent = async () => {
        try {
          const response = await fetch("/api/events/virtual/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId }),
          })

          if (!response.ok) {
            throw new Error("Failed to join virtual event")
          }

          // Mock data for demo (in a real app, this would come from a realtime connection)
          setParticipants([
            { id: "1", name: "John Doe", avatar: "/placeholder.svg", hasAudio: true, hasVideo: true },
            { id: "2", name: "Jane Smith", avatar: "/placeholder.svg", hasAudio: false, hasVideo: true },
            {
              id: "3",
              name: "Bob Johnson",
              avatar: "/placeholder.svg",
              isPresenting: true,
              hasAudio: true,
              hasVideo: false,
            },
            { id: "4", name: "Alice Williams", avatar: "/placeholder.svg", hasAudio: true, hasVideo: true },
          ])

          setMessages([
            {
              id: "1",
              sender: { id: "1", name: "John Doe", avatar: "/placeholder.svg" },
              content: "Hello everyone!",
              timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            },
            {
              id: "2",
              sender: { id: "2", name: "Jane Smith", avatar: "/placeholder.svg" },
              content: "Hi! Excited for this event.",
              timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
            },
            {
              id: "3",
              sender: { id: "3", name: "Bob Johnson", avatar: "/placeholder.svg" },
              content: "I'll be sharing my screen in a moment.",
              timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
            },
          ])
        } catch (error) {
          console.error("Error joining virtual event:", error)
          toast({
            title: "Error",
            description: "Failed to join virtual event room",
            variant: "destructive",
          })
        }
      }

      joinVirtualEvent()
    }

    // Cleanup function
    return () => {
      // In a real app, we would disconnect from the virtual event
    }
  }, [eventId, eventStore, toast])

  const handleSendMessage = () => {
    if (!message.trim() || !user) return

    // In a real app, this would send to a WebSocket or similar
    const newMessage = {
      id: Date.now().toString(),
      sender: {
        id: user.id,
        name: user.full_name,
        avatar: user.avatar_url,
      },
      content: message,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")
  }

  const toggleAudio = () => {
    // In a real app, this would toggle the actual audio stream
    setAudioEnabled(!audioEnabled)
    toast({
      title: audioEnabled ? "Microphone off" : "Microphone on",
      description: audioEnabled ? "You are now muted" : "You are now unmuted",
    })
  }

  const toggleVideo = () => {
    // In a real app, this would toggle the actual video stream
    setVideoEnabled(!videoEnabled)
    toast({
      title: videoEnabled ? "Camera off" : "Camera on",
      description: videoEnabled ? "Your camera is now off" : "Your camera is now on",
    })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!eventStore.currentEvent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading virtual event room...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              <span>{eventStore.currentEvent.title} - Live Stream</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-md flex items-center justify-center relative">
              <div className="text-white text-center">
                {participants.find((p) => p.isPresenting) ? (
                  <p>Screen sharing is active</p>
                ) : (
                  <p>Waiting for presenter to share screen...</p>
                )}
              </div>

              {/* Participant videos would appear here in a real implementation */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                {participants.slice(0, 4).map((participant) => (
                  <div key={participant.id} className="h-20 w-36 bg-gray-800 rounded overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute bottom-1 left-1 right-1 flex justify-between text-white text-xs">
                      <span className="truncate max-w-[80%]">{participant.name}</span>
                      <div className="flex gap-1">
                        {participant.hasAudio === false && <MicOff className="h-3 w-3" />}
                        {participant.hasVideo === false && <VideoOff className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <Button variant={audioEnabled ? "default" : "outline"} size="sm" onClick={toggleAudio}>
                {audioEnabled ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                {audioEnabled ? "Mute" : "Unmute"}
              </Button>
              <Button variant={videoEnabled ? "default" : "outline"} size="sm" onClick={toggleVideo}>
                {videoEnabled ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
                {videoEnabled ? "Stop Video" : "Start Video"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>{eventStore.currentEvent.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="chat">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Participants ({participants.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="p-0 border rounded-md mt-2">
            <div className="h-[400px] flex flex-col">
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-2">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={msg.sender.avatar || "/placeholder.svg"} alt={msg.sender.name} />
                        <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-sm">{msg.sender.name}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                        </div>
                        <p className="text-sm mt-1">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              <div className="p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="p-0 border rounded-md mt-2">
            <ScrollArea className="h-[400px] p-3">
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{participant.name}</p>
                      {participant.isPresenting && <p className="text-xs text-muted-foreground">Presenting</p>}
                    </div>
                    <div className="flex gap-1">
                      {participant.hasAudio === false && <MicOff className="h-4 w-4 text-muted-foreground" />}
                      {participant.hasVideo === false && <VideoOff className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
})
