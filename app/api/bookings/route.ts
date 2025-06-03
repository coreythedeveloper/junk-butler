import { type NextRequest } from "next/server"

// Feature flag for Workiz integration
const WORKIZ_ENABLED = process.env.WORKIZ_ENABLED === "true"

// Workiz API configuration
const WORKIZ_API_KEY = process.env.WORKIZ_API_KEY
const WORKIZ_API_URL = "https://api.workiz.com/api/v1"

// Mock function to simulate booking creation
async function createMockBooking(bookingData: any) {
  // Generate a random booking ID
  const mockBookingId = `B${Math.floor(Math.random() * 100000)}`
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Log the booking data for debugging
  console.log("Mock booking created:", {
    id: mockBookingId,
    ...bookingData
  })

  return {
    success: true,
    booking_id: mockBookingId,
    message: "Booking successfully created (Mock)"
  }
}

// Function to create booking in Workiz
async function createWorkizBooking(bookingData: any) {
  // Format the data for Workiz API
  const workizJobData = {
    client: {
      first_name: bookingData.firstName,
      last_name: bookingData.lastName,
      email: bookingData.email,
      phone: bookingData.phone,
      address: {
        street: bookingData.address,
        city: bookingData.city,
        state: bookingData.state,
        zip: bookingData.zipCode
      }
    },
    job: {
      service_type: "Junk Removal",
      scheduled_date: bookingData.date,
      scheduled_time_slot: bookingData.timeSlot,
      description: `Items: ${bookingData.items.join(", ")}\nSpecial Instructions: ${bookingData.specialInstructions}`,
      estimated_price: bookingData.price,
      status: "scheduled"
    }
  }

  // Send the job to Workiz
  const response = await fetch(`${WORKIZ_API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${WORKIZ_API_KEY}`
    },
    body: JSON.stringify(workizJobData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create booking in Workiz")
  }

  const result = await response.json()

  return {
    success: true,
    booking_id: result.job_id,
    message: "Booking successfully created in Workiz"
  }
}

export async function POST(req: NextRequest) {
  try {
    const bookingData = await req.json()

    // Use Workiz if enabled, otherwise use mock implementation
    const result = WORKIZ_ENABLED 
      ? await createWorkizBooking(bookingData)
      : await createMockBooking(bookingData)

    return Response.json(result)

  } catch (error) {
    console.error("Booking creation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create booking"
      },
      { status: 500 }
    )
  }
} 