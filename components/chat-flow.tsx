"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Camera, Upload, Send, Paperclip, Smile, Bot, ArrowRight, AlertCircle, RefreshCw, ArrowUp } from "lucide-react"
import { useChat } from "ai/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"

type Message = {
  id: string
  type: "system" | "user" | "ai"
  content: string | React.ReactNode
  options?: {
    value: string
    label: string
  }[]
  role?: "user" | "assistant" // For AI SDK compatibility
}

type ChatFlowProps = {
  onComplete: (data: {
    items: string[]
    quantity: "single" | "multiple"
    photos: string[]
    resale: boolean
  }) => void
}

// Common emojis for quick access
const commonEmojis = [
  "👍",
  "👎",
  "😊",
  "😂",
  "😍",
  "🙏",
  "👋",
  "🤔",
  "👌",
  "🙌",
  "🔥",
  "❤️",
  "✅",
  "⭐",
  "🎉",
  "👏",
  "😁",
  "😉",
  "🤷‍♂️",
  "🤷‍♀️",
  "🙂",
  "😎",
  "👀",
  "💯",
]

export function ChatFlow({ onComplete }: ChatFlowProps) {
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatData, setChatData] = useState({
    quantity: "" as "single" | "multiple",
    items: [] as string[],
    photos: [] as string[],
    resale: false,
  })
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set up AI chat
  const {
    messages: aiMessages,
    input: aiInput,
    handleInputChange: handleAiInputChange,
    isLoading: isAiLoading,
    append: appendAiMessage,
    error: aiError,
    setMessages: setAiMessages,
    reload: reloadMessages,
  } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      // Try to parse structured data from AI response
      try {
        if (message.content.includes("{") && message.content.includes("}")) {
          const jsonMatch = message.content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0])
            // Update chat data based on AI response
            setChatData(prev => ({
              ...prev,
              ...jsonData
            }))
          }
        }
      } catch (error) {
        console.error("Error parsing JSON from AI response:", error)
      }
      setRetryCount(0)
      setIsRetrying(false)
    },
    onError: (error) => {
      let errorMsg = "Sorry, I'm having trouble connecting to my brain right now."
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMsg = "My AI brain is not properly configured. Please contact support."
        } else if (error.message.includes("network")) {
          errorMsg = "I'm having trouble connecting to my AI brain. Please check your internet connection."
        } else if (error.message.includes("empty")) {
          errorMsg = "I received an empty response. This might be due to reaching my conversation limits."
        }
      }
      if (retryCount < 3) {
        setRetryCount((prev) => prev + 1)
        setIsRetrying(true)
        setTimeout(() => {
          reloadMessages()
          setIsRetrying(false)
        }, 2000)
      } else {
        setAiErrorMessage(errorMsg)
        setIsRetrying(false)
      }
    },
  })

  // Initialize chat with welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setAiMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: "Ah, splendid timing—I'm Junksworth, your ever-reliable butler for banishing junk. Let's get the lowdown: What type of items are we dealing with, and how much is there? Oh, and don't forget to mention your location, any access hurdles, and your ideal pickup time."
      }])
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [aiMessages])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    const messageText = aiInput.trim()
    if (!messageText) return

    try {
      console.log("Sending message to AI:", messageText)
      appendAiMessage({ role: "user", content: messageText })
      // Clear input after sending
      handleAiInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)
    } catch (error) {
      console.error("Error sending message to AI:", error)
      setAiErrorMessage("I'm having trouble processing that. Please try again.")
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Convert FileList to array and create URLs for preview
    const fileArray = Array.from(files)
    const fileURLs = fileArray.map((file) => URL.createObjectURL(file))

    setChatData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...fileURLs],
    }))

    // Send a message about the uploaded photos
    const photoMessage = `I've uploaded ${files.length} photo${files.length > 1 ? 's' : ''} of the items.`
    appendAiMessage({ role: "user", content: photoMessage })
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleEmojiSelect = (emoji: string) => {
    handleAiInputChange({ target: { value: aiInput + emoji } } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="flex flex-col h-[60vh] md:h-[70vh] pb-4 md:pb-0">
      {/* AI Error Alert */}
      {aiErrorMessage && (
        <Alert variant="destructive" className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <div>
                <AlertTitle>AI Chat Unavailable</AlertTitle>
                <AlertDescription>{aiErrorMessage}</AlertDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => reloadMessages()} disabled={isRetrying} className="ml-2">
              {isRetrying ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </>
              )}
            </Button>
          </div>
        </Alert>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {/* Render chat messages */}
        {aiMessages.filter(message => message.content.trim() !== "").map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="mr-2 flex-shrink-0">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img src="/images/avatar.png" alt="Junksworth" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 chat-bubble-animation ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {message.role === "user" && message.content.includes("uploaded") ? (
                <div>
                  <p>{message.content}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {chatData.photos.map((url, photoIndex) => (
                      <img
                        key={photoIndex}
                        src={url}
                        alt="Uploaded item"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {(isAiLoading || isRetrying) && (
          <div className="flex justify-start">
            <div className="mr-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img src="/images/avatar.png" alt="Junksworth" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input UI */}
      <form onSubmit={handleSendMessage} className="mt-auto border-t pt-3">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                <Smile className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Insert emoji</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" side="top" align="start">
              <div className="grid grid-cols-8 gap-2">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="inline-flex h-8 w-8 items-start justify-center rounded-md text-lg hover:bg-muted"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full"
            onClick={handleAttachmentClick}
          >
            <Paperclip className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Attach file</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />

          <div className="relative flex-1">
            <div className="border-input bg-background focus-within:ring-ring/10 relative flex items-center rounded-[16px] border px-4 py-1.5 pr-10 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0 min-h-[42px]">
              <AutoResizeTextarea
                placeholder="Type a message..."
                value={aiInput}
                onChange={(value) => handleAiInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                onEnter={handleSendMessage}
                className="resize-none overflow-hidden placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none py-1 leading-6"
              />
              <Button
                type="submit"
                size="icon"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground px-3 absolute top-3 right-2 size-6 rounded-full"
                disabled={!aiInput.trim() || isAiLoading || isRetrying}
              >
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
