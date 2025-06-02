"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MobileNav } from "@/components/mobile-nav"
import { ChatFlow } from "@/components/chat-flow"
import { EstimateResult } from "@/components/estimate-result"
import { BookingForm } from "@/components/booking-form"
import { BottomNav } from "@/components/bottom-nav"

type Step = "chat" | "estimate" | "booking"

export default function RequestPage() {
  const [currentStep, setCurrentStep] = useState<Step>("chat")
  const [estimateData, setEstimateData] = useState<{
    items: string[]
    quantity: "single" | "multiple"
    photos: string[]
    price: number
    resale: boolean
  } | null>(null)

  const handleChatComplete = (data: {
    items: string[]
    quantity: "single" | "multiple"
    photos: string[]
    resale: boolean
  }) => {
    // Calculate a mock price based on the data
    const basePrice = data.quantity === "single" ? 50 : 100
    const itemsPrice = data.items.length * 25
    const totalPrice = basePrice + itemsPrice

    setEstimateData({
      ...data,
      price: totalPrice,
    })

    setCurrentStep("estimate")
  }

  const handleEstimateAccepted = () => {
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

        {currentStep === "estimate" && estimateData && (
          <EstimateResult
            data={estimateData}
            onAccept={handleEstimateAccepted}
            onRestart={() => setCurrentStep("chat")}
          />
        )}

        {currentStep === "booking" && estimateData && (
          <BookingForm estimateData={estimateData} onComplete={handleBookingComplete} />
        )}
      </main>
      <BottomNav />
    </div>
  )
}
