"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MobileNav } from "@/components/mobile-nav"
import { ChatFlow } from "@/components/chat-flow"
import { BookingForm } from "@/components/booking-form"
import { BottomNav } from "@/components/bottom-nav"

type Step = "chat" | "booking"

export default function RequestPage() {
  const [currentStep, setCurrentStep] = useState<Step>("chat")
  const [estimateData, setEstimateData] = useState<{
    items: string[]
    quantity: "single" | "multiple"
    photos: string[]
    price: number
    resale: boolean
    location: string
    access_notes: string
    pickup_time: string
    contact_info: {
      name: string
      phone: string
      email: string
    }
  } | null>(null)

  const handleChatComplete = (data: {
    items: string[]
    quantity: "single" | "multiple"
    photos: string[]
    price: number
    resale: boolean
    location: string
    access_notes: string
    pickup_time: string
    contact_info: {
      name: string
      phone: string
      email: string
    }
  }) => {
    setEstimateData(data)
    setCurrentStep("booking")
  }

  const handleBookingComplete = () => {
    // In a real app, this would save the booking and redirect to a confirmation page
    window.location.href = "/account"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MobileNav />

      <main className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Get an Instant Estimate</h1>

        {currentStep === "chat" && (
          <Card>
            <CardContent className="p-6">
              <ChatFlow onComplete={handleChatComplete} />
            </CardContent>
          </Card>
        )}

        {currentStep === "booking" && estimateData && (
          <BookingForm estimateData={estimateData} onComplete={handleBookingComplete} />
        )}
      </main>
      <BottomNav />
    </div>
  )
}
