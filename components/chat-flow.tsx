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
    price: number
    resale: boolean
    location: string
    access_notes: string
    pickup_date: string
    pickup_time_slot: string
    contact_info: {
      name: string
      phone: string
      email: string
    }
  }) => void
}

type EstimateData = {
  item_details: {
    type: string | string[]
    quantity: number
  }
  estimated_cost: number
  location: string
  access_notes: string
  requested_pickup_time: string // Using the field from the system prompt
  contact_info: {
    name: string
    phone: string
    email: string
  }
  photos_provided: boolean
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
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [chatData, setChatData] = useState({
    quantity: "" as "single" | "multiple",
    items: [] as string[],
    photos: [] as string[],
    resale: false,
    price: 0,
    location: "",
    access_notes: "",
    pickup_date: "",
    pickup_time_slot: "",
    contact_info: {
      name: "",
      phone: "",
      email: ""
    }
  })
  const [mode, setMode] = useState<"guided" | "ai">("guided")
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [showEstimate, setShowEstimate] = useState(false)
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set up AI chat using the AI SDK with retry capability
  // xAI compatibility: useChat API with new working setup
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
      // Defensive: xAI returns {id, role, content}
      if (!message.content || message.content.trim() === "") {
        // Fallback for empty AI message
        const fallbackMessage = {
          id: `fallback-${Date.now()}`,
          role: "assistant" as const,
          content:
            "I seem to be having trouble formulating a response. Let me try again. What details can you provide about your junk removal needs?",
        }
        setAiMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== message.id)
          return [...filtered, fallbackMessage]
        })
        return
      }
      setRetryCount(0)
      setIsRetrying(false)
      // Try to parse JSON (optional, for future)
      try {
        if (message.content.includes("{") && message.content.includes("}")) {
          const jsonMatch = message.content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0])
            // Optionally use jsonData
            // console.log("Estimate data received:", jsonData)
          }
        }
      } catch (error) {
        // console.error("Error parsing JSON from AI response:", error)
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
        setMessages((prev) => [
          ...prev,
          {
            id: `system-retry-${Date.now()}`,
            type: "system",
            content: `Connection hiccup! Retrying... (Attempt ${retryCount + 1}/3)`,
          },
        ])
        setTimeout(() => {
          reloadMessages()
          setIsRetrying(false)
        }, 2000)
      } else {
        setAiErrorMessage(errorMsg)
        setIsRetrying(false)
        if (mode === "ai") {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-error-${Date.now()}`,
              type: "system",
              content:
                "I'm having trouble with my AI capabilities right now. Let's continue with the guided estimate instead.",
            },
          ])
          setMode("guided")
        }
      }
    },
  })

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

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    scrollToBottom()
  }, [messages, aiMessages, isTyping, isAiLoading, isRetrying])

  // Initialize chat with welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === "guided") {
        setMessages([
          {
            id: "welcome",
            type: "system",
            content: "Are you removing one item or multiple items?",
            options: [
              { value: "single", label: "Single Item" },
              { value: "multiple", label: "Multiple Items" },
            ],
          },
        ])
        setCurrentStep(1)
      }
    }, 300) // Faster initial load

    return () => clearTimeout(timer)
  }, [mode])

  const switchToAiMode = () => {
    try {
      console.log("Switching to AI mode")
      setMode("ai")

      // Clear any previous AI error message
      setAiErrorMessage(null)
      setRetryCount(0)

      // Reset AI messages to start fresh and add initial message
      setAiMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: "Ah, splendid timing—I'm Junksworth, your ever-reliable butler for banishing junk. Let's get the lowdown: What type of items are we dealing with, and how much is there? Oh, and don't forget to mention your location, any access hurdles, and your ideal pickup time."
      }])

      // Clear input after switching modes
      setCurrentInput("")
    } catch (error) {
      console.error("Error starting AI chat:", error)
      setAiErrorMessage("Failed to initialize AI chat. Let's continue with the guided flow instead.")
      setMode("guided")
    }
  }

  const handleQuantitySelection = (value: string) => {
    setChatData((prev) => ({ ...prev, quantity: value as "single" | "multiple" }))

    setMessages((prev) => [
      ...prev,
      {
        id: `user-quantity-${Date.now()}`,
        type: "user",
        content: value === "single" ? "Single Item" : "Multiple Items",
      },
    ])

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `item-type-question-${Date.now()}`,
          type: "system",
          content: "What type of items are you removing? (Select all that apply)",
          options: itemTypes,
        },
      ])
      setCurrentStep(2)
    }, 800) // Faster response
  }

  const handleItemTypeSelection = (value: string) => {
    const selectedItem = itemTypes.find((item) => item.value === value)

    if (selectedItem && !chatData.items.includes(value)) {
      setChatData((prev) => ({
        ...prev,
        items: [...prev.items, value],
      }))

      setMessages((prev) => [
        ...prev,
        {
          id: `user-item-${Date.now()}`,
          type: "user",
          content: `Added: ${selectedItem.label}`,
        },
      ])
    }
  }

  const handleContinueAfterItems = () => {
    if (chatData.items.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "system",
          content: "Please select at least one item type.",
        },
      ])
      return
    }

    const itemLabels = chatData.items.map((value) => itemTypes.find((item) => item.value === value)?.label || value)

    setMessages((prev) => [
      ...prev,
      {
        id: `items-summary-${Date.now()}`,
        type: "system",
        content: `You've selected: ${itemLabels.join(", ")}`,
      },
    ])

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `photo-request-${Date.now()}`,
          type: "system",
          content: "Great! Could you upload a photo of the item(s)? This helps us provide an accurate estimate.",
        },
      ])
      setCurrentStep(3)
    }, 800) // Faster response
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

    setMessages((prev) => [
      ...prev,
      {
        id: `user-photo-${Date.now()}`,
        type: "user",
        content: (
          <div className="flex flex-wrap gap-2">
            {fileURLs.map((url, index) => (
              <img
                key={index}
                src={url || "/placeholder.svg"}
                alt="Uploaded item"
                className="w-20 h-20 object-cover rounded-md"
              />
            ))}
          </div>
        ),
      },
    ])

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `resale-question-${Date.now()}`,
          type: "system",
          content:
            "Would you like us to attempt to resell your item(s)? You'll receive a portion of the sale price if we're successful.",
          options: [
            { value: "yes", label: "Yes, try to resell" },
            { value: "no", label: "No, just remove them" },
          ],
        },
      ])
      setCurrentStep(4)
    }, 1000) // Slightly faster response
  }

  const handleResaleSelection = (value: string) => {
    const wantsResale = value === "yes"

    setChatData((prev) => ({
      ...prev,
      resale: wantsResale,
    }))

    setMessages((prev) => [
      ...prev,
      {
        id: `user-resale-${Date.now()}`,
        type: "user",
        content: wantsResale ? "Yes, try to resell" : "No, just remove them",
      },
    ])

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `final-${Date.now()}`,
          type: "system",
          content: "Thank you for providing all the information! I'm generating your estimate now...",
        },
      ])

      // Complete the chat flow after a short delay
      setTimeout(() => {
        onComplete({
          ...chatData,
          resale: wantsResale,
          // Set a default price for the guided flow
          price: 75,
          // Set placeholder values for the new fields if they're empty
          location: chatData.location || "Not specified",
          access_notes: chatData.access_notes || "No special access notes",
          pickup_date: chatData.pickup_date || "To be scheduled",
          pickup_time_slot: chatData.pickup_time_slot || "To be scheduled",
          contact_info: {
            name: chatData.contact_info.name || "Not provided",
            phone: chatData.contact_info.phone || "Not provided",
            email: chatData.contact_info.email || "Not provided"
          }
        })
      }, 1500)
    }, 800)
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    const messageText = mode === "ai" ? aiInput.trim() : currentInput.trim()
    if (!messageText) return

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: `user-message-${Date.now()}`,
        type: "user",
        content: messageText,
      },
    ])

    // If we're in the guided flow and the user sends a custom message, switch to AI mode
    if (mode === "guided" && currentStep > 0) {
      console.log("Switching to AI mode due to custom message")
      setMode("ai")

      // Initialize AI chat with the user's message
      try {
        console.log("Initializing AI chat with message:", messageText)
        // Set initial AI messages with welcome and user message
        setAiMessages([
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Ah, splendid timing—I'm Junksworth, your ever-reliable butler for banishing junk. Let's get the lowdown: What type of items are we dealing with, and how much is there? Oh, and don't forget to mention your location, any access hurdles, and your ideal pickup time."
          },
          {
            id: (Date.now() + 1).toString(),
            role: "user",
            content: messageText
          }
        ])
        // Clear input after sending
        setCurrentInput("")
      } catch (error) {
        console.error("Error initializing AI chat:", error)
        // If AI chat fails, stay in guided mode
        setMode("guided")
        setMessages((prev) => [
          ...prev,
          {
            id: `system-response-${Date.now()}`,
            type: "system",
            content: "I'm having trouble with my AI capabilities right now. Let's continue with the guided estimate.",
          },
        ])
      }
    } else if (mode === "ai") {
      // In AI mode, use the AI SDK to handle the message
      try {
        console.log("Sending message to AI:", messageText)
        appendAiMessage({ role: "user", content: messageText })
        // Clear input after sending
        handleAiInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)
      } catch (error) {
        console.error("Error sending message to AI:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: `system-error-${Date.now()}`,
            type: "system",
            content: "I'm having trouble processing that. Let's continue with the guided estimate instead.",
          },
        ])
        setMode("guided")
      }
    } else {
      // Regular guided mode message
      setCurrentInput("")

      // Simulate butler response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: `system-response-${Date.now()}`,
            type: "system",
            content: "Thanks for your message! I'll help you with that request.",
          },
        ])
      }, 1000)
    }
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleEmojiSelect = (emoji: string) => {
    if (mode === "ai") {
      handleAiInputChange({ target: { value: aiInput + emoji } } as React.ChangeEvent<HTMLInputElement>)
    } else {
      setCurrentInput((prev) => prev + emoji)
    }
  }

  const renderMessageContent = (message: Message) => {
    if (typeof message.content === "string") {
      return <p>{message.content}</p>
    }
    return message.content
  }

  const renderMessageOptions = (message: Message) => {
    if (!message.options) return null

    if (currentStep === 1) {
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {message.options.map((option) => (
            <Button key={option.value} variant="outline" onClick={() => handleQuantitySelection(option.value)}>
              {option.label}
            </Button>
          ))}
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="mt-3 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {message.options.map((option) => (
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
    }

    if (currentStep === 4) {
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {message.options.map((option) => (
            <Button key={option.value} variant="outline" onClick={() => handleResaleSelection(option.value)}>
              {option.label}
            </Button>
          ))}
        </div>
      )
    }

    return null
  }

  // Function to retry AI connection
  const handleRetryConnection = () => {
    setAiErrorMessage(null)
    setRetryCount(0)
    setIsRetrying(true)

    // Add a retry message
    setMessages((prev) => [
      ...prev,
      {
        id: `system-retry-manual-${Date.now()}`,
        type: "system",
        content: "Reconnecting to my AI brain...",
      },
    ])

    // Wait a moment and retry
    setTimeout(() => {
      console.log("Manually retrying AI connection...")
      if (mode === "ai") {
        reloadMessages()
      } else {
        switchToAiMode()
      }
      setIsRetrying(false)
    }, 1500)
  }

  // Function to reset conversation and start fresh
  const handleResetConversation = () => {
    if (mode === "ai") {
      setAiMessages([])
      appendAiMessage({
        role: "assistant",
        content:
          "I've reset our conversation to avoid hitting my limits. Let's start fresh! What junk can I help you remove today?",
      })
    }
  }

  // Function to try parsing JSON from a message
  const tryParseJSON = (text: string): EstimateData | null => {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return null
      
      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate the parsed object has the required structure
      if (
        parsed &&
        parsed.item_details &&
        parsed.estimated_cost &&
        parsed.location &&
        parsed.access_notes &&
        parsed.requested_date &&
        parsed.requested_time_slot &&
        parsed.contact_info &&
        typeof parsed.photos_provided === 'boolean'
      ) {
        return parsed as EstimateData
      }
    } catch (error) {
      console.error("Error parsing JSON:", error)
    }
    return null
  }

  // Handle AI message completion
  useEffect(() => {
    if (mode === "ai" && aiMessages.length > 0) {
      const lastMessage = aiMessages[aiMessages.length - 1];
      console.log("New AI message received:", lastMessage);
      
      if (lastMessage.role === "assistant") {
        // Try to extract JSON from the message
        const jsonMatch = lastMessage.content.match(/\{[\s\S]*\}/);
        console.log("JSON match found:", jsonMatch ? "yes" : "no");
        
        if (jsonMatch) {
          try {
            const jsonData = JSON.parse(jsonMatch[0]) as EstimateData;
            console.log("Parsed AI response data:", jsonData);
            console.log("Pickup time from AI:", jsonData.requested_pickup_time);
            
            // Remove the JSON message from aiMessages
            setAiMessages(prev => prev.filter(m => m.id !== lastMessage.id));
            
            // Add a clean message without the JSON
            const cleanMessage = lastMessage.content.replace(/\{[\s\S]*\}/, '').trim();
            console.log("Clean message (without JSON):", cleanMessage);
            
            if (cleanMessage) {
              setAiMessages(prev => [...prev, {
                id: lastMessage.id,
                role: "assistant",
                content: cleanMessage
              }]);
            }

            // Try to parse the pickup time into date and time slot
            const pickupTime = jsonData.requested_pickup_time;
            console.log("Processing pickup time:", pickupTime);

            // Simple time slot detection
            let timeSlot = "";
            const timeSlots = [
              "8:00 AM - 10:00 AM",
              "10:00 AM - 12:00 PM",
              "12:00 PM - 2:00 PM",
              "2:00 PM - 4:00 PM",
              "4:00 PM - 6:00 PM",
            ];

            // First try to extract the time
            const timeMatch = pickupTime.match(/(\d{1,2})(?::\d{2})?\s*(am|pm)/i);
            console.log("Time match:", timeMatch);

            if (timeMatch) {
              const hour = parseInt(timeMatch[1]);
              const meridian = timeMatch[2].toLowerCase();
              console.log("Parsed time:", { hour, meridian });

              // Map the hour to a time slot
              const militaryHour = meridian === "pm" && hour !== 12 ? hour + 12 : hour;
              console.log("Military hour:", militaryHour);

              if (militaryHour >= 8 && militaryHour < 10) {
                timeSlot = "8:00 AM - 10:00 AM";
              } else if (militaryHour >= 10 && militaryHour < 12) {
                timeSlot = "10:00 AM - 12:00 PM";
              } else if (militaryHour >= 12 && militaryHour < 14) {
                timeSlot = "12:00 PM - 2:00 PM";
              } else if (militaryHour >= 14 && militaryHour < 16) {
                timeSlot = "2:00 PM - 4:00 PM";
              } else if (militaryHour >= 16 && militaryHour < 18) {
                timeSlot = "4:00 PM - 6:00 PM";
              }
            } else {
              // Fallback to time of day words
              if (pickupTime.toLowerCase().includes("morning")) {
                timeSlot = "8:00 AM - 10:00 AM";
              } else if (pickupTime.toLowerCase().includes("afternoon")) {
                timeSlot = "12:00 PM - 2:00 PM";
              } else if (pickupTime.toLowerCase().includes("evening")) {
                timeSlot = "4:00 PM - 6:00 PM";
              }
            }

            console.log("Selected time slot:", timeSlot);

            // Try to extract a date
            let pickupDate = "";
            try {
              // Remove the time portion
              const dateText = pickupTime.split(/\s*at\s*/)[0].trim();
              console.log("Date text to parse:", dateText);
              
              // Try parsing with Date
              const parsedDate = new Date(dateText);
              if (!isNaN(parsedDate.getTime())) {
                pickupDate = parsedDate.toISOString().split('T')[0];
                console.log("Successfully parsed date:", pickupDate);
              } else {
                console.log("Failed to parse date directly");
                
                // Try parsing month, day, year format
                const dateMatch = dateText.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
                if (dateMatch) {
                  const [_, month, day, year] = dateMatch;
                  const monthIndex = new Date(`${month} 1`).getMonth();
                  if (!isNaN(monthIndex)) {
                    const newDate = new Date(parseInt(year), monthIndex, parseInt(day));
                    if (!isNaN(newDate.getTime())) {
                      pickupDate = newDate.toISOString().split('T')[0];
                      console.log("Successfully parsed date from parts:", pickupDate);
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Error parsing date:", error);
            }

            console.log("Extracted date and time:", { pickupDate, timeSlot });

            // Convert AI data to match the booking form format
            const formData = {
              items: Array.isArray(jsonData.item_details.type) 
                ? jsonData.item_details.type 
                : [jsonData.item_details.type],
              quantity: jsonData.item_details.quantity === 1 ? "single" as const : "multiple" as const,
              photos: [] as string[],
              price: jsonData.estimated_cost,
              resale: false,
              location: jsonData.location,
              access_notes: jsonData.access_notes,
              pickup_date: pickupDate,
              pickup_time_slot: timeSlot,
              contact_info: jsonData.contact_info
            };
            
            console.log("Data being sent to booking form:", formData);
            onComplete(formData);
          } catch (error) {
            console.error("Error processing AI response:", error);
            console.log("Raw message content:", lastMessage.content);
          }
        }
      }
    }
  }, [aiMessages, mode, onComplete]);

  return (
    <div className="flex flex-col h-[60vh] md:h-[70vh] pb-4 md:pb-0">
      {/* AI Error Alert with Retry Button */}
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
            <Button variant="outline" size="sm" onClick={handleRetryConnection} disabled={isRetrying} className="ml-2">
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
        {/* Render guided mode messages */}
        {mode === "guided" &&
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "system" && (
                <div className="mr-2 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img src="/images/avatar.png" alt="Junk Butler" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 chat-bubble-animation ${
                  message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {renderMessageContent(message)}
                {renderMessageOptions(message)}
              </div>
            </div>
          ))}

        {/* Render AI mode messages */}
        {mode === "ai" &&
          aiMessages.filter(message => message.content.trim() !== "").map((message, index) => (
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
                <p>{message.content}</p>
              </div>
            </div>
          ))}

        {/* Typing indicator */}
        {(isTyping || isAiLoading || isRetrying) && (
          <div className="flex justify-start">
            <div className="mr-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img src="/images/avatar.png" alt="Junk Butler" className="h-full w-full object-cover" />
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

      {mode === "guided" && currentStep === 3 && (
        <div className="mt-auto mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => document.getElementById("photo-upload")?.click()}
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => document.getElementById("photo-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
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
                value={mode === "ai" ? aiInput : currentInput}
                onChange={mode === "ai" ? 
                  (value) => handleAiInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>) : 
                  (value) => setCurrentInput(value)
                }
                onEnter={handleSendMessage}
                className="resize-none overflow-hidden placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none py-1 leading-6"
              />
              <Button
                type="submit"
                size="icon"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground px-3 absolute top-3 right-2 size-6 rounded-full"
                disabled={(mode === "ai" ? !aiInput.trim() : !currentInput.trim()) || isAiLoading || isRetrying}
              >
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mode switcher and reset button */}
        <div className="flex justify-center mt-3 gap-2">
          {currentStep > 0 && !aiErrorMessage && !isRetrying && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => {
                console.log("Switching mode from", mode, "to", mode === "guided" ? "ai" : "guided")
                if (mode === "guided") {
                  switchToAiMode()
                } else {
                  setMode("guided")
                }
              }}
              disabled={isAiLoading || isRetrying}
            >
              <Bot className="h-3 w-3 mr-1" />
              {mode === "guided" ? "Chat with Junksworth" : "Return to Guided Flow"}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}

          {mode === "ai" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={handleResetConversation}
              disabled={isAiLoading || isRetrying}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset Conversation
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
