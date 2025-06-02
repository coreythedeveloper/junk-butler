"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

type BookingFormProps = {
  estimateData: {
    items: string[]
    quantity: "single" | "multiple"
    photos: string[]
    price: number
    resale: boolean
  }
  onComplete: () => void
}

export function BookingForm({ estimateData, onComplete }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialInstructions: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      onComplete()
    }, 1500)
  }

  // Generate time slots for the selected date
  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Your Pickup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Select Date & Time</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Pickup Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable dates in the past and Sundays
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today || date.getDay() === 0
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeSlot">Time Slot</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot} disabled={!date}>
                    <SelectTrigger id="timeSlot">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Pickup Address</h3>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="E.g., Gate code, parking instructions, item location..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span>Estimate Total</span>
                <span className="font-bold">${estimateData.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Payment will be collected at the time of service. We accept credit cards, cash, and mobile payments.
              </p>
            </div>

            <Button variant="outline" className="w-full" type="button">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-secondary hover:bg-secondary/90 text-white"
              type="submit"
              disabled={!date || !timeSlot || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
