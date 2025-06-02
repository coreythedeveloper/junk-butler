import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"

// Allow streaming responses up to 60 seconds
export const maxDuration = 60

// The system prompt that defines Junksworth's personality and behavior
const SYSTEM_PROMPT = `You are Junksworth, a sassy, witty, and mildly exasperated butler for Junk Butler, a junk removal service. Your personality is a blend of dry humor inspired by Futurama, with a touch of playful arrogance—like you're the smartest one in the room but still charmingly helpful. You're a chatbot agent tasked with guiding customers through creating a custom estimate for junk removal. Your tone is professional but laced with humor; you're not a jerk, but you've got an edge and don't suffer fools gladly. Responses should be concise, on-brand, and engaging, with humorous quips when appropriate but not in every sentence. Avoid long-winded replies and focus on efficiency while maintaining character.

**Guidelines:**
- **Personality**: Act like a brilliant butler who finds customers' junk mildly annoying but amusing. Use dry wit, clever analogies, and occasional sarcasm, but balance it with genuine helpfulness. Think Bender's snark mixed with Fry's charm from Futurama.
- **Tone**: Sassy and confident, with a playful edge. You're not condescending, but you might poke fun at the absurdity of the junk (e.g., "An anvil? Planning a cartoon heist?"). Keep it light and fun, never mean-spirited.
- **Response Length**: Keep answers short and to the point, as a chatbot should be. Aim for 2-4 sentences unless more detail is needed, with a quip or joke when it fits naturally.
- **Task**: Guide customers to provide details (e.g., type/amount of junk, location, access challenges, preferred pickup time) to create a custom estimate. Ask clear, specific questions to gather info efficiently.
- **Humor Triggers**: Inject humor when responding to unusual junk, vague answers, or when prompting for more details. Avoid forcing jokes in every response—let them land naturally.
- **Professionalism**: Stay on-brand for Junk Butler. Offer clear next steps, avoid overly casual slang, and ensure the customer feels supported, not mocked.
- **Introduction**: In your *first message only*, introduce yourself as Junksworth, Junk Butler's butler, and set the tone. Subsequent messages should feel like a fluid conversation, without reintroducing yourself.
- **Final Response**: Once all necessary details are gathered (junk type, quantity, location, access details, disposal needs, preferred pickup time), provide a response formatted as a JSON object for the API to build the estimate UI. This response should *not* be visible to the user and should include: item details, estimated cost, location, access notes, and requested pickup time. Do *not* include humorous quips in the JSON response.

**Current Context** (update as needed):
- If the customer has provided details (e.g., "king-sized mattress in basement, steep stairs, straight shot, Cincinnati address"), acknowledge them and ask follow-up questions (e.g., about pickup time) to complete the estimate.
- If the customer asks about cost, note that it depends on specifics and prompt for more details to ensure accuracy.`

// Mock response function for when the API key is not available or when there's an error
async function getMockResponse(messages: any[]) {
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
    } else if (userMessage.includes("mattress")) {
      responseContent =
        "A mattress, you say? The final resting place of countless dreams and nightmares. To properly estimate this bedtime story's removal, I'll need to know: is it twin, queen, or king-sized? And where is this sleep rectangle currently located? Any stairs or tight doorways in its escape route?"
    } else if (userMessage.includes("address") || userMessage.includes("location")) {
      responseContent =
        "Ah, location details! The 'where' in our little junk removal drama. I've noted your address. Any particular access challenges I should be aware of? Secret passages? Moats filled with alligators? Narrow hallways that would make a supermodel feel claustrophobic?"
    } else if (userMessage.includes("stairs") || userMessage.includes("steps")) {
      responseContent =
        "Steep stairs, you say? The plot thickens! And you'd like this mattress exorcism performed early next week? Let me check my calendar... I can offer Monday or Tuesday between 9am-12pm or 1pm-4pm. Which time slot would suit your schedule better?"
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
      }, 10) // Faster streaming (10ms instead of 20ms)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}

export async function POST(req: Request) {
  try {
    // Extract the messages from the body of the request
    const { messages } = await req.json()
    console.log("🛠️ [API] Received messages:", messages)

    // Log message count and last message for debugging
    console.log(
      `API route received ${messages.length} messages, last one: ${
        messages.length > 0 ? messages[messages.length - 1].role : "none"
      }`,
    )

    // Check if XAI_API_KEY is available
    const apiKey = process.env.XAI_PAID_API_KEY || process.env.XAI_API_KEY || process.env.GROQ_API_KEY
    console.log("🔐 [API] Using API key:", apiKey ? "Defined" : "Missing")
    if (!apiKey) {
      console.warn("No API key is defined in environment variables, using mock implementation")
      return getMockResponse(messages)
    }

    // Set a timeout for the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("API request timed out")), 15000)
    })

    // Call the language model with the system prompt and user messages
    const resultPromise = streamText({
      model: xai("grok-3-mini"),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7, // Add some creativity to Junksworth's responses
      maxTokens: 800, // Increased token limit for paid account
    })

    // Race the API call against the timeout
    const result = (await Promise.race([resultPromise, timeoutPromise])) as any

    // Check if the result is valid
    if (!result || typeof result.toDataStreamResponse !== "function") {
      console.error("Invalid response from AI service:", result)
      return getMockResponse(messages)
    }

    console.log("API route streaming response started")

    // Respond with the stream
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("API route error:", error)

    // Provide more detailed error information
    let errorMessage = "An unexpected error occurred"
    if (error instanceof Error) {
      errorMessage = error.message

      // Check for specific error types
      if (errorMessage.includes("API key") || errorMessage.includes("timed out")) {
        console.warn("API error detected, falling back to mock implementation")
        return getMockResponse([{ role: "user", content: "Hello" }])
      } else if (errorMessage.includes("network")) {
        errorMessage = "Network error: Unable to connect to AI service"
      }
    }

    // Try to use the mock implementation as a fallback
    try {
      console.warn("Attempting to use mock implementation as fallback")
      return getMockResponse([{ role: "user", content: "Hello" }])
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError)

      // If all else fails, return a JSON error
      return new Response(
        JSON.stringify({
          error: errorMessage,
          details: error instanceof Error ? error.stack : String(error),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }
  }
}
