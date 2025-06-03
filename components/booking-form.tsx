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

type BookingFormProps = {
  estimateData: {
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
  // Available time slots
  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  // Try to parse the pickup time into a date and time slot
  const parsePickupDateTime = (pickupTime: string) => {
    console.log("Parsing pickup time:", pickupTime);

    try {
      if (!pickupTime) {
        console.log("No pickup time provided");
        return { date: undefined, timeSlot: "" };
      }

      let parsedDate: Date | undefined;
      let timeSlot = "";

      // First try to extract a time slot from the string
      const timeSlotMatch = pickupTime.toLowerCase().match(/(morning|afternoon|evening|\d{1,2}(?::\d{2})?\s*(?:am|pm)(?:\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))?)/i);
      console.log("Time slot match:", timeSlotMatch);

      if (timeSlotMatch) {
        const matchedTime = timeSlotMatch[0].toLowerCase();
        console.log("Matched time:", matchedTime);

        // Map the matched time to our available time slots
        if (matchedTime.includes("morning") || matchedTime.includes("am")) {
          timeSlot = "8:00 AM - 10:00 AM";
        } else if (matchedTime.includes("afternoon") || matchedTime.includes("pm")) {
          timeSlot = "12:00 PM - 2:00 PM";
        } else if (matchedTime.includes("evening")) {
          timeSlot = "4:00 PM - 6:00 PM";
        }

        // Try to match specific time ranges
        if (matchedTime.includes("-")) {
          const slots = {
            "8:00 AM - 10:00 AM": ["8", "8:00", "8am", "8:00am"],
            "10:00 AM - 12:00 PM": ["10", "10:00", "10am", "10:00am"],
            "12:00 PM - 2:00 PM": ["12", "12:00", "12pm", "12:00pm"],
            "2:00 PM - 4:00 PM": ["2", "2:00", "2pm", "2:00pm"],
            "4:00 PM - 6:00 PM": ["4", "4:00", "4pm", "4:00pm"]
          };
          
          for (const [slot, patterns] of Object.entries(slots)) {
            if (patterns.some(pattern => matchedTime.includes(pattern))) {
              timeSlot = slot;
              break;
            }
          }
        }
      }

      // Try to parse the date
      let dateText = pickupTime;
      if (timeSlotMatch) {
        dateText = pickupTime.replace(timeSlotMatch[0], "").trim();
      }
      console.log("Date text to parse:", dateText);

      // Try various date formats
      const dateFormats = [
        // Try exact date strings first
        (text: string) => {
          const date = new Date(text);
          return isNaN(date.getTime()) ? undefined : date;
        },
        // Try MM/DD/YYYY
        (text: string) => {
          const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
          if (match) {
            const date = new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
            return isNaN(date.getTime()) ? undefined : date;
          }
          return undefined;
        },
        // Try YYYY-MM-DD
        (text: string) => {
          const match = text.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
          if (match) {
            const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
            return isNaN(date.getTime()) ? undefined : date;
          }
          return undefined;
        },
        // Try natural language
        (text: string) => {
          const lowerText = text.toLowerCase();
          const today = new Date();
          if (lowerText.includes("tomorrow")) {
            const date = new Date(today);
            date.setDate(today.getDate() + 1);
            return date;
          } else if (lowerText.includes("next")) {
            const date = new Date(today);
            date.setDate(today.getDate() + 7);
            return date;
          }
          return undefined;
        }
      ];

      // Try each date format
      for (const format of dateFormats) {
        parsedDate = format(dateText);
        if (parsedDate) {
          console.log("Successfully parsed date:", parsedDate);
          break;
        }
      }

      // Ensure the date is valid and set to noon
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        parsedDate.setHours(12, 0, 0, 0);
      } else {
        console.log("Failed to parse date");
        parsedDate = undefined;
      }

      console.log("Final parsed result:", { date: parsedDate, timeSlot });
      return { date: parsedDate, timeSlot };
    } catch (error) {
      console.error("Error in parsePickupDateTime:", error);
      return { date: undefined, timeSlot: "" };
    }
  };

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

  // Parse the pickup date and time
  const { date: parsedDate, timeSlot: initialTimeSlot } = parsePickupDateTime(estimateData.pickup_time || "");
  console.log("Initial parse results:", { parsedDate, initialTimeSlot });
  
  // Initialize state with parsed values, using undefined as fallback
  const [date, setDate] = useState<Date | undefined>(() => {
    const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
    console.log("Setting initial date:", validDate);
    return validDate;
  });
  
  const [timeSlot, setTimeSlot] = useState<string>(() => {
    const validTimeSlot = initialTimeSlot && timeSlots.includes(initialTimeSlot) ? initialTimeSlot : "";
    console.log("Setting initial time slot:", validTimeSlot);
    return validTimeSlot;
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      onComplete()
    }, 1500)
  }

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
                  <div className="relative">
                    <Input
                      type="text"
                      id="date"
                      value={date ? format(date, "PPP") : ""}
                      readOnly
                      className="pr-10"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "absolute right-0 top-0 h-full px-3 py-2 w-fit border-0",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          <span className="sr-only">Open calendar</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeSlot">Time Slot</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="timeSlot"
                      value={timeSlot}
                      readOnly
                      className="pr-10"
                    />
                    <Select value={timeSlot} onValueChange={setTimeSlot} disabled={!date}>
                      <SelectTrigger className="absolute right-0 top-0 h-full px-3 py-2 w-fit border-0">
                        <Clock className="h-4 w-4" />
                        <span className="sr-only">Select time</span>
                      </SelectTrigger>
                      <SelectContent align="end">
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
