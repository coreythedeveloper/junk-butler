// This is a mock implementation that can be used for testing if the real API is not available
// To use this, rename this file to route.ts (after backing up the original)

export async function POST(req: Request) {
  try {
    // Extract the messages from the body of the request
    const { messages } = await req.json()

    console.log("Mock API route received messages:", JSON.stringify(messages).slice(0, 200) + "...")

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a mock response
    const lastMessage = messages[messages.length - 1]
    let responseContent = ""

    if (lastMessage.role === "user") {
      const userMessage = lastMessage.content.toLowerCase()

      if (userMessage.includes("hello") || userMessage.includes("hi")) {
        responseContent =
          "Greetings, human! I'm Junksworth, your personal junk removal butler. What treasures are you looking to part with today?"
      } else if (userMessage.includes("furniture") || userMessage.includes("couch") || userMessage.includes("sofa")) {
        responseContent =
          "Ah, furniture! The silent witnesses to your questionable Netflix binges. A couch, is it? Do tell me more about this soon-to-be-departed sitting apparatus. Size? Condition? Any mysterious stains I should be aware of? *adjusts monocle*"
      } else if (userMessage.includes("price") || userMessage.includes("cost") || userMessage.includes("estimate")) {
        responseContent =
          "Eager to discuss finances, I see! For a precise estimate, I'll need more details about your junk situation. What items are we talking about? Where are they located? The more specifics you provide, the more accurate my pricing powers become."
      } else {
        responseContent =
          "Fascinating! Tell me more about these items you wish to banish from your life. The more details you provide, the better I can estimate the cost of making them... disappear. *dramatic butler gesture*"
      }
    }

    // Create a ReadableStream to simulate streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send the response character by character to simulate streaming
        const characters = responseContent.split("")
        let i = 0

        const interval = setInterval(() => {
          if (i < characters.length) {
            controller.enqueue(encoder.encode(characters[i]))
            i++
          } else {
            clearInterval(interval)
            controller.close()
          }
        }, 20)
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Mock API route error:", error)
    return new Response(JSON.stringify({ error: "An error occurred in the mock API" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
