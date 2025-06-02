"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, MapPin } from "lucide-react"

export function ServiceAreaChecker() {
  const [zipCode, setZipCode] = useState("")
  const [result, setResult] = useState<"available" | "unavailable" | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  // Mock service area check - in a real app, this would call an API
  const checkServiceArea = () => {
    if (!zipCode || zipCode.length !== 5) return

    setIsChecking(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes: even zip codes are available, odd are unavailable
      const isAvailable = Number.parseInt(zipCode) % 2 === 0
      setResult(isAvailable ? "available" : "unavailable")
      setIsChecking(false)
    }, 1000)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Enter ZIP code"
            value={zipCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5)
              setZipCode(value)
              if (result) setResult(null)
            }}
            className="pl-10 py-6 text-lg"
          />
        </div>
        <Button
          onClick={checkServiceArea}
          disabled={zipCode.length !== 5 || isChecking}
          className="bg-brand-dark hover:bg-brand-dark/90 py-6 px-6"
        >
          {isChecking ? "Checking..." : "Check Availability"}
        </Button>
      </div>

      {result && (
        <div
          className={`mt-4 p-5 rounded-lg flex items-center gap-3 transition-all duration-300 ${
            result === "available"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result === "available" ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
              <div>
                <p className="font-bold">Great news! We serve your area.</p>
                <p className="text-sm">We can schedule a pickup as soon as tomorrow.</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Sorry, we don't serve your area yet.</p>
                <p className="text-sm">Join our waitlist and we'll notify you when we expand to your location.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
