"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, DollarSign, Clock, MapPin, Info, Ruler, Eye, Calendar, AlertTriangle, Share2 } from "lucide-react"
import { formatDistanceToNow, format, addDays } from "date-fns"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

// This would normally come from a database or API
const getItemById = (id: string | number) => {
  // Convert id to number if it's a string
  const numId = typeof id === "string" ? Number.parseInt(id, 10) : id

  // Mock data - this would be replaced with actual data fetching
  const items = [
    {
      id: 1,
      title: "Vintage Wooden Desk",
      description:
        "Solid wood desk in good condition. Some minor scratches but structurally sound. This beautiful vintage desk features dovetail joints and solid oak construction. The desk has three drawers for storage and a spacious work surface. It would make a perfect addition to a home office or study area.",
      price: 120,
      originalPrice: 120,
      image: "/placeholder.svg?height=400&width=600",
      additionalImages: [
        "/placeholder.svg?height=200&width=200&text=Angle+1",
        "/placeholder.svg?height=200&width=200&text=Angle+2",
        "/placeholder.svg?height=200&width=200&text=Drawer+Detail",
      ],
      category: "furniture",
      condition: "good",
      listedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      nextMarkdownDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
      markdownStage: 0, // 0 = original price, 1 = first markdown, 2 = second markdown, 3 = final markdown
      dimensions: '48"W x 24"D x 30"H',
      location: "San Francisco, CA",
      seller: "Junk Butler",
      views: 24,
      materials: "Solid oak",
      brand: "Unknown (Vintage)",
      estimatedAge: "Approximately 40 years",
      features: ["Three drawers", "Dovetail joints", "Brass hardware"],
      flaws: ["Minor scratches on surface", "Small dent on right side"],
    },
    {
      id: 2,
      title: 'Samsung 55" TV',
      description:
        "Working Samsung TV with remote. 2018 model with 4K resolution. This Samsung Smart TV is in excellent condition with minimal use. Features include 4K Ultra HD resolution, built-in streaming apps, and HDR support. Comes with original remote and power cable. Perfect for a living room or bedroom setup.",
      price: 153,
      originalPrice: 180,
      image: "/placeholder.svg?height=400&width=600",
      additionalImages: [
        "/placeholder.svg?height=200&width=200&text=Side+View",
        "/placeholder.svg?height=200&width=200&text=Remote",
        "/placeholder.svg?height=200&width=200&text=Ports",
      ],
      category: "electronics",
      condition: "excellent",
      listedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      nextMarkdownDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // in 18 days
      markdownStage: 1, // First markdown applied (15%)
      dimensions: '55" diagonal, 48"W x 28"H x 3"D',
      location: "Oakland, CA",
      seller: "Junk Butler",
      views: 42,
      model: "UN55NU7100",
      brand: "Samsung",
      year: "2018",
      features: ["4K Ultra HD", "Smart TV functionality", "HDR support", "3 HDMI ports"],
      flaws: ["Minor scratch on bezel (not visible when mounted)"],
    },
    {
      id: 3,
      title: "Leather Sofa",
      description:
        "Brown leather sofa. Some wear on the cushions but no tears or damage. This comfortable three-seater sofa features genuine leather upholstery with a classic design that fits most decor styles. The cushions are still firm and supportive, and the frame is solid hardwood for durability.",
      price: 160,
      originalPrice: 250,
      image: "/placeholder.svg?height=400&width=600",
      additionalImages: [
        "/placeholder.svg?height=200&width=200&text=Side+View",
        "/placeholder.svg?height=200&width=200&text=Cushion+Detail",
        "/placeholder.svg?height=200&width=200&text=Back+View",
      ],
      category: "furniture",
      condition: "good",
      listedDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000), // 32 days ago
      nextMarkdownDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // in 23 days
      markdownStage: 2, // Second markdown applied (15% + 20%)
      dimensions: '84"W x 36"D x 32"H',
      location: "San Jose, CA",
      seller: "Junk Butler",
      views: 67,
      materials: "Genuine leather, hardwood frame",
      brand: "Ashley Furniture",
      estimatedAge: "5 years",
      features: ["Three-seater", "Genuine leather", "Removable cushions"],
      flaws: ["Some wear on seat cushions", "Minor fading on armrests"],
    },
    {
      id: 4,
      title: "Whirlpool Refrigerator",
      description:
        "Stainless steel refrigerator in working condition. Approximately 5 years old. This side-by-side refrigerator features an ice maker, water dispenser, and adjustable shelving. All components are in working order, and it has been thoroughly cleaned and sanitized.",
      price: 195,
      originalPrice: 300,
      image: "/placeholder.svg?height=400&width=600",
      additionalImages: [
        "/placeholder.svg?height=200&width=200&text=Interior",
        "/placeholder.svg?height=200&width=200&text=Ice+Maker",
        "/placeholder.svg?height=200&width=200&text=Side+Panel",
      ],
      category: "appliances",
      condition: "fair",
      listedDate: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000), // 56 days ago
      nextMarkdownDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // in 4 days (donation soon)
      markdownStage: 3, // Final markdown applied (15% + 20% + 35%)
      dimensions: '30"W x 32"D x 70"H',
      location: "Berkeley, CA",
      seller: "Junk Butler",
      views: 38,
      model: "WRS325SDHZ",
      brand: "Whirlpool",
      year: "2018",
      features: ["Side-by-side design", "Ice maker", "Water dispenser", "Adjustable shelving"],
      flaws: ["Small dent on right side", "Water dispenser works but is slow", "Some shelf clips missing"],
    },
    {
      id: 5,
      title: "Exercise Bike",
      description:
        "Stationary exercise bike with digital display. Light use, works perfectly. This NordicTrack exercise bike features 20 resistance levels, built-in workout programs, and a comfortable padded seat. The digital display shows speed, distance, calories burned, and heart rate when using the pulse sensors on the handlebars.",
      price: 95,
      originalPrice: 95,
      image: "/placeholder.svg?height=400&width=600",
      additionalImages: [
        "/placeholder.svg?height=200&width=200&text=Console",
        "/placeholder.svg?height=200&width=200&text=Resistance+System",
        "/placeholder.svg?height=200&width=200&text=Seat+Adjustment",
      ],
      category: "fitness",
      condition: "excellent",
      listedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      nextMarkdownDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
      markdownStage: 0,
      dimensions: '40"L x 20"W x 48"H',
      location: "San Francisco, CA",
      seller: "Junk Butler",
      views: 15,
      model: "GX 2.7",
      brand: "NordicTrack",
      year: "2020",
      features: ["20 resistance levels", "Digital display", "Heart rate monitor", "Built-in workout programs"],
      flaws: ["Small scuff on right pedal (cosmetic only)"],
    },
    {
      id: 6,
      title: "Dining Table with 4 Chairs",
      description:
        'Wooden dining set. Table is 48" round with 4 matching chairs. This beautiful dining set features a solid pine construction with a warm honey finish. The round table comfortably seats four people and includes four matching chairs with upholstered seats. Perfect for a breakfast nook or small dining area.',
      price: 170,
      originalPrice: 200,
      image: "/placeholder.svg?height=400&width=600",
      additionalImages: [
        "/placeholder.svg?height=200&width=200&text=Chair+Detail",
        "/placeholder.svg?height=200&width=200&text=Table+Base",
        "/placeholder.svg?height=200&width=200&text=Full+Set",
      ],
      category: "furniture",
      condition: "good",
      listedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      nextMarkdownDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // in 15 days
      markdownStage: 1,
      dimensions: '48" diameter x 30"H (table), 18"W x 20"D x 36"H (chairs)',
      location: "Palo Alto, CA",
      seller: "Junk Butler",
      views: 29,
      materials: "Solid pine, fabric seat cushions",
      brand: "Pottery Barn",
      estimatedAge: "3 years",
      features: ["Round table", "Four matching chairs", "Upholstered seats", "Sturdy construction"],
      flaws: ["Minor scratches on table surface", "Small stain on one chair cushion"],
    },
  ]

  return items.find((item) => item.id === numId)
}

// Helper function to get markdown info
function getMarkdownInfo(item: any) {
  const daysListed = Math.floor((Date.now() - item.listedDate.getTime()) / (24 * 60 * 60 * 1000))
  const daysUntilNextMarkdown = Math.floor((item.nextMarkdownDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  const daysUntilDonation = 60 - daysListed

  let markdownText = ""
  let markdownBadgeVariant: "default" | "destructive" | "outline" | "secondary" = "outline"
  let markdownPercentage = 0
  let nextMarkdownPercentage = 15

  if (item.markdownStage === 0) {
    markdownText = `Price drops in ${daysUntilNextMarkdown} days`
    markdownPercentage = 0
    nextMarkdownPercentage = 15
  } else if (item.markdownStage === 1) {
    markdownText = `15% off • Next drop in ${daysUntilNextMarkdown} days`
    markdownBadgeVariant = "secondary"
    markdownPercentage = 15
    nextMarkdownPercentage = 35
  } else if (item.markdownStage === 2) {
    markdownText = `35% off • Final drop in ${daysUntilNextMarkdown} days`
    markdownBadgeVariant = "secondary"
    markdownPercentage = 35
    nextMarkdownPercentage = 70
  } else {
    markdownText = `70% off • Donating in ${daysUntilNextMarkdown} days`
    markdownBadgeVariant = "destructive"
    markdownPercentage = 70
    nextMarkdownPercentage = 100
  }

  // Calculate timeline dates
  const listDate = item.listedDate
  const firstMarkdownDate = addDays(listDate, 10)
  const secondMarkdownDate = addDays(listDate, 30)
  const finalMarkdownDate = addDays(listDate, 55)
  const donationDate = addDays(listDate, 60)

  // Calculate progress percentage (0-100)
  const totalConsignmentDays = 60
  const daysElapsed = daysListed
  const progressPercentage = Math.min(100, Math.round((daysElapsed / totalConsignmentDays) * 100))

  return {
    markdownText,
    markdownBadgeVariant,
    daysListed,
    daysUntilNextMarkdown,
    daysUntilDonation,
    markdownPercentage,
    nextMarkdownPercentage,
    progressPercentage,
    listDate,
    firstMarkdownDate,
    secondMarkdownDate,
    finalMarkdownDate,
    donationDate,
  }
}

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("details")

  // Get item data
  const item = getItemById(params.id)

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <MobileNav />
        <main className="flex-1 container max-w-4xl mx-auto py-8 px-4 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The item you're looking for doesn't exist or has been removed from the marketplace.
              </p>
              <Button asChild>
                <Link href="/marketplace">Back to Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const {
    markdownText,
    markdownBadgeVariant,
    daysListed,
    daysUntilNextMarkdown,
    daysUntilDonation,
    markdownPercentage,
    progressPercentage,
    listDate,
    firstMarkdownDate,
    secondMarkdownDate,
    finalMarkdownDate,
    donationDate,
  } = getMarkdownInfo(item)

  const allImages = [item.image, ...(item.additionalImages || [])]

  return (
    <div className="min-h-screen flex flex-col">
      <MobileNav />

      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Images */}
            <div className="w-full md:w-1/2">
              <div className="rounded-lg overflow-hidden border mb-4">
                <img
                  src={allImages[selectedImage] || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full aspect-video object-cover"
                />
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`rounded border overflow-hidden flex-shrink-0 transition-all ${
                        selectedImage === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`View ${index + 1}`}
                        className="w-16 h-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right column - Item details */}
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="capitalize">
                  {item.condition}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  <Eye className="inline h-3 w-3 mr-1" />
                  {item.views} views
                </span>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold mr-2">${item.price}</span>
                {item.price !== item.originalPrice && (
                  <span className="text-lg line-through text-muted-foreground">${item.originalPrice}</span>
                )}
                {markdownPercentage > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {markdownPercentage}% OFF
                  </Badge>
                )}
              </div>

              {/* Consignment timeline */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Consignment Timeline</h3>
                    <Badge variant={markdownBadgeVariant}>
                      <Clock className="h-3 w-3 mr-1" />
                      {markdownText}
                    </Badge>
                  </div>

                  <Progress value={progressPercentage} className="h-2 mb-4" />

                  <div className="grid grid-cols-4 gap-1 text-xs">
                    <div className="text-center">
                      <div
                        className={`h-2 w-2 rounded-full mx-auto mb-1 ${daysListed >= 0 ? "bg-primary" : "bg-muted"}`}
                      ></div>
                      <div>Listed</div>
                      <div className="text-muted-foreground">{format(listDate, "MMM d")}</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`h-2 w-2 rounded-full mx-auto mb-1 ${daysListed >= 10 ? "bg-primary" : "bg-muted"}`}
                      ></div>
                      <div>15% Off</div>
                      <div className="text-muted-foreground">{format(firstMarkdownDate, "MMM d")}</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`h-2 w-2 rounded-full mx-auto mb-1 ${daysListed >= 30 ? "bg-primary" : "bg-muted"}`}
                      ></div>
                      <div>35% Off</div>
                      <div className="text-muted-foreground">{format(secondMarkdownDate, "MMM d")}</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`h-2 w-2 rounded-full mx-auto mb-1 ${daysListed >= 55 ? "bg-primary" : "bg-muted"}`}
                      ></div>
                      <div>70% Off</div>
                      <div className="text-muted-foreground">{format(finalMarkdownDate, "MMM d")}</div>
                    </div>
                  </div>

                  {daysUntilDonation <= 10 && (
                    <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                      This item will be donated in {daysUntilDonation} days if not purchased
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Ruler className="h-4 w-4 mr-2" />
                  <span>{item.dimensions}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Listed {formatDistanceToNow(item.listedDate, { addSuffix: true })}</span>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <Button className="flex-1">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Purchase Now
                </Button>
                <Button variant="outline" className="flex-1">
                  Contact Seller
                </Button>
              </div>

              {/* Reclamation option */}
              {item.markdownStage > 0 && (
                <Card className="mb-6 bg-muted/30">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Consignor Options</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Original consignors can reclaim this item for a 25% reclamation fee ($
                      {Math.round(item.originalPrice * 0.25)}).
                    </p>
                    <Button variant="outline" size="sm">
                      Reclaim Item
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for additional information */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="features">Features & Flaws</TabsTrigger>
            <TabsTrigger value="policy">Consignment Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Item Description</h3>
                <p className="mb-6">{item.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.brand && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Brand</h4>
                      <p>{item.brand}</p>
                    </div>
                  )}

                  {item.model && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Model</h4>
                      <p>{item.model}</p>
                    </div>
                  )}

                  {item.year && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Year</h4>
                      <p>{item.year}</p>
                    </div>
                  )}

                  {item.materials && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Materials</h4>
                      <p>{item.materials}</p>
                    </div>
                  )}

                  {item.estimatedAge && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Estimated Age</h4>
                      <p>{item.estimatedAge}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {item.features && item.features.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Features</h3>
                      <ul className="space-y-2">
                        {item.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 font-medium">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.flaws && item.flaws.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Known Flaws</h3>
                      <ul className="space-y-2">
                        {item.flaws.map((flaw: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600 font-medium">•</span>
                            <span>{flaw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policy" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Consignment Policy</h3>
                <div className="space-y-4">
                  <p>All items in our marketplace operate under our consignment policy. Here's how it works:</p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-1">
                        <span className="font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">60-Day Consignment Period</h4>
                        <p className="text-muted-foreground">
                          Items remain in our marketplace for 60 days or until sold, whichever comes first.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-1">
                        <span className="font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Automatic Price Reductions</h4>
                        <p className="text-muted-foreground">
                          Items are automatically marked down according to this schedule:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>• 15% off after 10 days</li>
                          <li>• Additional 20% off after 30 days (35% total)</li>
                          <li>• Final 35% off after 55 days (70% total)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-1">
                        <span className="font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Reclamation Option</h4>
                        <p className="text-muted-foreground">
                          Consignors may reclaim their unsold items at any time during the 60-day period by paying a 25%
                          reclamation fee based on the original listing price.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-1">
                        <span className="font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Donation</h4>
                        <p className="text-muted-foreground">
                          If an item remains unsold after 60 days and is not reclaimed, it will be donated to a local
                          charity or non-profit organization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/request">
                    <Info className="mr-2 h-4 w-4" />
                    Learn About Selling Your Items
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar items section would go here */}
        <BottomNav />
      </main>
    </div>
  )
}
