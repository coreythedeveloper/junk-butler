"use client"

import type React from "react"
import type { Message as AiMessage, CreateMessage } from "ai"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Camera, Upload, Send, Paperclip, Smile, Bot, ArrowRight, AlertCircle, RefreshCw, ArrowUp } from "lucide-react"
import { useChat } from "ai/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"

// Extend the AI SDK types
type ExtendedMessage = (AiMessage | CreateMessage) & {
  type?: "system" | "user" | "ai"
  options?: {
    value: string
    label: string
  }[]
  isGuided?: boolean
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
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [guidedMessageIds, setGuidedMessageIds] = useState<Set<string>>(new Set())
  const [chatData, setChatData] = useState({
    quantity: "" as "single" | "multiple",
    items: [] as string[],
    photos: [] as string[],
    resale: false,
    location: "",
    accessNotes: "",
    pickupTime: "",
  })
  const [isAIMode, setIsAIMode] = useState(false)
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Predefined item types for selection
  const itemTypes = [
    { value: "furniture", label: "Furniture" },
    { value: "appliances", label: "Appliances" },
    { value: "electronics", label: "Electronics" },
    { value: "yard_waste", label: "Yard Waste" },
    { value: "construction", label: "Construction Debris" },
    { value: "household", label: "Household Items" },
    { value: "other", label: "Other" },
  ]

  // Update the useChat hook to use our extended type
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
      try {
        if (message.content.includes("{") && message.content.includes("}")) {
          const jsonMatch = message.content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0])
            const formattedData = formatEstimateData(jsonData)
            
            // Update chat data
            setChatData(prev => ({
              ...prev,
              ...formattedData
            }))

            // If we have all required data, trigger the estimate completion
            if (isEstimateComplete(formattedData)) {
              onComplete(formattedData)
            }
          }
        }
        setRetryCount(0)
        setIsRetrying(false)
      } catch (error) {
        console.error("Error parsing JSON from AI response:", error)
      }
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

  // Helper function to add a guided message
  const appendGuidedMessage = (message: { role: "user" | "assistant", content: string }) => {
    const id = Date.now().toString()
    setGuidedMessageIds(prev => new Set(prev).add(id))
    appendAiMessage({ ...message, id })
  }

  // Initialize chat with welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setAiMessages([])
      setCurrentStep(1)
      appendGuidedMessage({
        role: "assistant",
        content: "Are you removing one item or multiple items?"
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Helper function to check if we have all required data for an estimate
  const isEstimateComplete = (data: any) => {
    const requiredFields = ['items', 'quantity', 'location', 'accessNotes', 'pickupTime']
    return requiredFields.every(field => data[field] && data[field] !== '')
  }

  // Helper function to format data for estimate result
  const formatEstimateData = (data: any) => {
    // Extract price from either estimated_cost or a calculated value
    const price = data.estimated_cost || data.price || calculateDefaultPrice(data)

    return {
      items: data.items || [],
      quantity: data.quantity || "single",
      photos: data.photos || [],
      price,
      resale: data.resale || false,
      location: data.location || "",
      accessNotes: data.access_notes || data.accessNotes || "",
      pickupTime: data.requested_pickup_time || data.pickupTime || ""
    }
  }

  // Helper function to calculate a default price based on items and quantity
  const calculateDefaultPrice = (data: any) => {
    const basePrice: Record<string, number> = {
      furniture: 150,
      appliances: 200,
      electronics: 100,
      yard_waste: 120,
      construction: 250,
      household: 100,
      other: 150,
    }

    if (data.quantity === "single") {
      const itemType = data.items[0] as string
      return basePrice[itemType] || 150
    }

    // For multiple items, sum up base prices and add complexity factor
    return data.items.reduce((total: number, item: string) => {
      return total + (basePrice[item] || 150)
    }, 0)
  }

  const handleQuantitySelection = (value: "single" | "multiple") => {
    setChatData(prev => ({ ...prev, quantity: value }))
    appendGuidedMessage({ 
      role: "user", 
      content: value === "single" ? "Single Item" : "Multiple Items"
    })
    
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      appendGuidedMessage({
        role: "assistant",
        content: "What type of items are you removing? (Select all that apply)"
      })
      setCurrentStep(2)
    }, 800)
  }

  const handleItemTypeSelection = (value: string) => {
    const selectedItem = itemTypes.find((item) => item.value === value)
    if (selectedItem && !chatData.items.includes(value)) {
      setChatData(prev => ({
        ...prev,
        items: [...prev.items, value]
      }))
      appendGuidedMessage({ role: "user", content: `Added: ${selectedItem.label}` })
    }
  }

  const handleContinueAfterItems = () => {
    if (chatData.items.length === 0) {
      appendGuidedMessage({
        role: "assistant",
        content: "Please select at least one item type."
      })
      return
    }

    const itemLabels = chatData.items.map(value => itemTypes.find(item => item.value === value)?.label || value)
    appendGuidedMessage({ 
      role: "user", 
      content: `Selected items: ${itemLabels.join(", ")}`
    })

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      appendGuidedMessage({
        role: "assistant",
        content: "Could you upload a photo of the item(s)? This helps us provide an accurate estimate."
      })
      setCurrentStep(3)
    }, 800)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const fileURLs = fileArray.map((file) => URL.createObjectURL(file))

    setChatData(prev => ({
      ...prev,
      photos: [...prev.photos, ...fileURLs],
    }))

    const photoMessage = `I've uploaded ${files.length} photo${files.length > 1 ? 's' : ''} of the items.`
    appendGuidedMessage({ 
      role: "user", 
      content: photoMessage
    })

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      appendGuidedMessage({
        role: "assistant",
        content: "Would you like us to attempt to resell your item(s)? You'll receive a portion of the sale price if we're successful."
      })
      setCurrentStep(4)
    }, 800)
  }

  const handleResaleSelection = (value: "yes" | "no") => {
    const wantsResale = value === "yes"
    setChatData(prev => ({
      ...prev,
      resale: wantsResale
    }))

    appendGuidedMessage({ 
      role: "user", 
      content: wantsResale ? "Yes, try to resell" : "No, just remove them"
    })

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      appendGuidedMessage({
        role: "assistant",
        content: "What's your location and are there any access challenges we should know about?"
      })
      setCurrentStep(5)
    }, 800)
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    const messageText = aiInput.trim()
    if (!messageText) return

    // If this is the first free-form message, switch to AI mode
    if (!isAIMode) {
      setIsAIMode(true)
      const context = JSON.stringify(chatData)
      appendAiMessage({ 
        role: "system", 
        content: `Current estimate data: ${context}. Please continue gathering any missing information naturally.`
      })
    }

    appendAiMessage({ role: "user", content: messageText })
    handleAiInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleEmojiSelect = (emoji: string) => {
    handleAiInputChange({ target: { value: aiInput + emoji } } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  // Render functions for guided experience
  const renderOptions = () => {
    if (!isAIMode) {
      switch (currentStep) {
        case 1:
          return (
            <div className="flex flex-wrap gap-2 mt-3">
              <Button variant="outline" onClick={() => handleQuantitySelection("single")}>Single Item</Button>
              <Button variant="outline" onClick={() => handleQuantitySelection("multiple")}>Multiple Items</Button>
            </div>
          )
        case 2:
          return (
            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {itemTypes.map((option) => (
                  <Button
                    key={option.value}
                    variant={chatData.items.includes(option.value) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleItemTypeSelection(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Button onClick={handleContinueAfterItems}>Continue</Button>
            </div>
          )
        case 4:
          return (
            <div className="flex flex-wrap gap-2 mt-3">
              <Button variant="outline" onClick={() => handleResaleSelection("yes")}>Yes, try to resell</Button>
              <Button variant="outline" onClick={() => handleResaleSelection("no")}>No, just remove them</Button>
            </div>
          )
        default:
          return null
      }
    }
    return null
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
        {/* Chat Messages */}
        {aiMessages
          .filter(message => 
            message.content.trim() !== "" && 
            message.role !== "system" &&
            (!message.content.toString().includes("{") || message.role === "user") // Hide JSON responses
          )
          .map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && !guidedMessageIds.has(message.id) && (
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
                <div>
                  <p>{message.content}</p>
                  {message.role === "assistant" && renderOptions()}
                  {message.role === "user" && message.content.includes("uploaded") && (
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
                  )}
                </div>
              </div>
            </div>
          ))}

        {/* Typing indicator */}
        {(isTyping || isAiLoading || isRetrying) && (
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

      {/* Photo Upload UI for Step 3 */}
      {currentStep === 3 && !isAIMode && (
        <div className="mt-auto mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
          </div>
        </div>
      )}

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
