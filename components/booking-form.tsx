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
import { CalendarIcon, CreditCard, CheckCircle, MapPin, Clock, User, Truck, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

type BookingFormProps = {
  estimateData: {
    items: string[]
    quantity: "single" | "multiple"
    photos: string[]
    price: number
    resale: boolean
    location: string
    access_notes: string
    pickup_date: string // ISO format date string
    pickup_time_slot: string // Predefined time slot
    contact_info: {
      name: string
      phone: string
      email: string
    }
  }
  onComplete: () => void
}

// Map of item values to readable labels
const itemLabels: Record<string, string> = {
  furniture: "Furniture",
  appliances: "Appliances",
  electronics: "Electronics",
  yard_waste: "Yard Waste",
  construction: "Construction Debris",
  household: "Household Items",
  other: "Other Items",
}

export function BookingForm({ estimateData, onComplete }: BookingFormProps) {
  console.log("BookingForm received estimateData:", estimateData);

  // Available time slots
  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  // Initialize date from ISO string
  const initializeDate = (dateStr: string) => {
    console.log("Initializing date from:", dateStr);
    try {
      const parsed = new Date(dateStr);
      const isValid = !isNaN(parsed.getTime());
      console.log("Parsed date result:", isValid ? parsed : "Invalid date");
      return isValid ? parsed : undefined;
    } catch (error) {
      console.error("Error parsing date:", error);
      return undefined;
    }
  };

  // Initialize time slot
  const initializeTimeSlot = (slot: string) => {
    console.log("Initializing time slot from:", slot);
    const isValid = timeSlots.includes(slot);
    console.log("Time slot valid:", isValid);
    return isValid ? slot : "";
  };

  // Initialize states with the provided values
  const [date, setDate] = useState<Date | undefined>(() => {
    const initialDate = initializeDate(estimateData.pickup_date);
    console.log("Initial date state:", initialDate);
    return initialDate;
  });
  
  const [timeSlot, setTimeSlot] = useState<string>(() => {
    const initialTimeSlot = initializeTimeSlot(estimateData.pickup_time_slot);
    console.log("Initial time slot state:", initialTimeSlot);
    return initialTimeSlot;
  });
  
  // Parse location into address components
  const parseLocation = (location: string) => {
    try {
      // Remove any extra whitespace and split by commas
      const parts = location.split(/,\s*/).map(part => part.trim());
      
      let address = parts[0] || "";
      let city = "";
      let state = "";
      let zipCode = "";

      // Look for ZIP code pattern in any part
      const zipPattern = /\b\d{5}\b/;
      parts.forEach(part => {
        const zipMatch = part.match(zipPattern);
        if (zipMatch) {
          zipCode = zipMatch[0];
          // Remove ZIP from the part
          part = part.replace(zipPattern, "").trim();
        }
      });

      // Look for state abbreviation pattern
      const statePattern = /\b[A-Z]{2}\b/;
      parts.forEach((part, index) => {
        const stateMatch = part.match(statePattern);
        if (stateMatch) {
          state = stateMatch[0];
          // If this part only contains the state (and maybe ZIP), use previous part as city
          if (part.replace(statePattern, "").replace(zipPattern, "").trim() === "") {
            city = parts[index - 1] || "";
          }
        }
      });

      // If city wasn't found in state parsing, use the second part if available
      if (!city && parts.length > 1) {
        city = parts[1];
      }

      return {
        address,
        city,
        state,
        zipCode
      };
    } catch (error) {
      console.error("Error parsing location:", error);
      return {
        address: "",
        city: "",
        state: "",
        zipCode: ""
      };
    }
  };

  // Parse the location
  const parsedLocation = parseLocation(estimateData.location);
  
  // Pre-fill form data with estimate data
  const [formData, setFormData] = useState({
    firstName: estimateData.contact_info.name.split(' ')[0] || "",
    lastName: estimateData.contact_info.name.split(' ').slice(1).join(' ') || "",
    email: estimateData.contact_info.email || "",
    phone: estimateData.contact_info.phone || "",
    address: parsedLocation.address,
    city: parsedLocation.city,
    state: parsedLocation.state,
    zipCode: parsedLocation.zipCode,
    specialInstructions: estimateData.access_notes || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Combine all form data
      const bookingData = {
        ...formData,
        date: date ? format(date, "yyyy-MM-dd") : "",
        timeSlot,
        items: estimateData.items,
        price: estimateData.price,
        photos: estimateData.photos
      }

      // Submit to our API endpoint
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to create booking")
      }

      // Show success message
      toast({
        title: "Booking Confirmed!",
        description: "Your pickup has been scheduled. Check your email for details.",
        duration: 5000
      })

      // Complete the booking process
      onComplete()
    } catch (error) {
      console.error("Booking submission error:", error)
      
      // Show error message
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    console.log("Date changed to:", newDate);
    setDate(newDate);
  };

  // Handle time slot change
  const handleTimeSlotChange = (newSlot: string) => {
    console.log("Time slot changed to:", newSlot);
    setTimeSlot(newSlot);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Estimate Summary Card */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Your Estimate is Ready!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Estimate Details</h3>
                <div className="text-2xl font-bold text-primary">${estimateData.price.toFixed(2)}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Items to Remove</h4>
                  <p className="text-sm">{estimateData.items.map(item => itemLabels[item] || item).join(", ")}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {estimateData.quantity === "single" ? "Single Item" : "Multiple Items"}
                  </p>
                </div>

                {estimateData.resale && (
                  <div className="bg-green-50 p-3 rounded-md text-sm text-green-700">
                    <p className="font-medium">Resale Benefit</p>
                    <p>You'll receive 40% of the sale price if we successfully resell your item(s).</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Includes loading, transportation, and proper disposal</span>
                </div>
              </div>
            </div>

            {estimateData.photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {estimateData.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt="Item photo"
                    className="w-20 h-20 object-cover rounded-md border border-border"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scheduling Card */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule Your Pickup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Select Date & Time</h3>
              </div>

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
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => {
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
                  <Select value={timeSlot} onValueChange={handleTimeSlotChange}>
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
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Contact Information</h3>
              </div>

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
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Pickup Address</h3>
              </div>

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
              <Label htmlFor="specialInstructions">Special Instructions</Label>
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

        {/* Payment Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span>Total Due at Pickup</span>
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
