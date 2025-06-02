"use client"

import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, DollarSign, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { BottomNav } from "@/components/bottom-nav"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Enhanced marketplace items with consignment data
const marketplaceItems = [
  {
    id: 1,
    title: "Vintage Wooden Desk",
    description: "Solid wood desk in good condition. Some minor scratches but structurally sound.",
    price: 120,
    originalPrice: 120,
    image: "/placeholder.svg?height=200&width=300",
    category: "furniture",
    condition: "good",
    listedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    nextMarkdownDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
    markdownStage: 0, // 0 = original price, 1 = first markdown, 2 = second markdown, 3 = final markdown
    dimensions: '48"W x 24"D x 30"H',
    location: "San Francisco, CA",
    seller: "Junk Butler",
    views: 24,
  },
  {
    id: 2,
    title: 'Samsung 55" TV',
    description: "Working Samsung TV with remote. 2018 model with 4K resolution.",
    price: 153,
    originalPrice: 180,
    image: "/placeholder.svg?height=200&width=300",
    category: "electronics",
    condition: "excellent",
    listedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    nextMarkdownDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // in 18 days
    markdownStage: 1, // First markdown applied (15%)
    dimensions: '55" diagonal, 48"W x 28"H x 3"D',
    location: "Oakland, CA",
    seller: "Junk Butler",
    views: 42,
  },
  {
    id: 3,
    title: "Leather Sofa",
    description: "Brown leather sofa. Some wear on the cushions but no tears or damage.",
    price: 160,
    originalPrice: 250,
    image: "/placeholder.svg?height=200&width=300",
    category: "furniture",
    condition: "good",
    listedDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000), // 32 days ago
    nextMarkdownDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // in 23 days
    markdownStage: 2, // Second markdown applied (15% + 20%)
    dimensions: '84"W x 36"D x 32"H',
    location: "San Jose, CA",
    seller: "Junk Butler",
    views: 67,
  },
  {
    id: 4,
    title: "Whirlpool Refrigerator",
    description: "Stainless steel refrigerator in working condition. Approximately 5 years old.",
    price: 195,
    originalPrice: 300,
    image: "/placeholder.svg?height=200&width=300",
    category: "appliances",
    condition: "fair",
    listedDate: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000), // 56 days ago
    nextMarkdownDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // in 4 days (donation soon)
    markdownStage: 3, // Final markdown applied (15% + 20% + 35%)
    dimensions: '30"W x 32"D x 70"H',
    location: "Berkeley, CA",
    seller: "Junk Butler",
    views: 38,
  },
  {
    id: 5,
    title: "Exercise Bike",
    description: "Stationary exercise bike with digital display. Light use, works perfectly.",
    price: 95,
    originalPrice: 95,
    image: "/placeholder.svg?height=200&width=300",
    category: "fitness",
    condition: "excellent",
    listedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    nextMarkdownDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
    markdownStage: 0,
    dimensions: '40"L x 20"W x 48"H',
    location: "San Francisco, CA",
    seller: "Junk Butler",
    views: 15,
  },
  {
    id: 6,
    title: "Dining Table with 4 Chairs",
    description: 'Wooden dining set. Table is 48" round with 4 matching chairs.',
    price: 170,
    originalPrice: 200,
    image: "/placeholder.svg?height=200&width=300",
    category: "furniture",
    condition: "good",
    listedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    nextMarkdownDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // in 15 days
    markdownStage: 1,
    dimensions: '48" diameter x 30"H (table), 18"W x 20"D x 36"H (chairs)',
    location: "Palo Alto, CA",
    seller: "Junk Butler",
    views: 29,
  },
]

// Helper function to get markdown info
function getMarkdownInfo(item: any) {
  const daysListed = Math.floor((Date.now() - item.listedDate.getTime()) / (24 * 60 * 60 * 1000))
  const daysUntilNextMarkdown = Math.floor((item.nextMarkdownDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))

  let markdownText = ""
  let markdownBadgeVariant: "default" | "destructive" | "outline" | "secondary" = "outline"

  if (item.markdownStage === 0) {
    markdownText = `Price drops in ${daysUntilNextMarkdown} days`
  } else if (item.markdownStage === 1) {
    markdownText = `15% off • Next drop in ${daysUntilNextMarkdown} days`
    markdownBadgeVariant = "secondary"
  } else if (item.markdownStage === 2) {
    markdownText = `35% off • Final drop in ${daysUntilNextMarkdown} days`
    markdownBadgeVariant = "secondary"
  } else {
    markdownText = `70% off • Donating in ${daysUntilNextMarkdown} days`
    markdownBadgeVariant = "destructive"
  }

  return { markdownText, markdownBadgeVariant, daysListed, daysUntilNextMarkdown }
}

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <MobileNav />

      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Junk Butler Marketplace</h1>
            <p className="text-muted-foreground">
              One person's junk is another person's treasure. Browse quality pre-owned items.
            </p>
          </div>
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-white">
            <a href="/request">Sell Your Items</a>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Mobile filter section */}
          <div className="md:hidden w-full space-y-3">
            {/* Full width search on its own row */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search items..." className="pl-10 w-full" />
            </div>

            {/* Filter buttons row */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                    <Filter className="h-4 w-4" />
                    All Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="appliances">Appliances</SelectItem>
                          <SelectItem value="fitness">Fitness Equipment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Condition</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Any Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Condition</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Min" type="number" />
                        <Input placeholder="Max" type="number" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Markdown Status</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Any Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Status</SelectItem>
                          <SelectItem value="original">Original Price</SelectItem>
                          <SelectItem value="markdown1">First Markdown (15% off)</SelectItem>
                          <SelectItem value="markdown2">Second Markdown (35% off)</SelectItem>
                          <SelectItem value="markdown3">Final Markdown (70% off)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full mt-4">Apply Filters</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                    Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Select Category</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="appliances">Appliances</SelectItem>
                        <SelectItem value="fitness">Fitness Equipment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full mt-4">Apply</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                    Price
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Price Range</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Min Price</label>
                        <Input placeholder="Min" type="number" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Max Price</label>
                        <Input placeholder="Max" type="number" />
                      </div>
                    </div>
                    <Button className="w-full mt-4">Apply</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                    Condition
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Item Condition</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Any Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Condition</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full mt-4">Apply</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                    Markdown
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Markdown Status</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Any Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Status</SelectItem>
                        <SelectItem value="original">Original Price</SelectItem>
                        <SelectItem value="markdown1">First Markdown (15% off)</SelectItem>
                        <SelectItem value="markdown2">Second Markdown (35% off)</SelectItem>
                        <SelectItem value="markdown3">Final Markdown (70% off)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full mt-4">Apply</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Desktop filter sidebar */}
          <div className="hidden md:block w-64 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search items..." className="pl-10" />
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                    <SelectItem value="fitness">Fitness Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Condition</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Any Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Condition</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Markdown Status</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Any Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Status</SelectItem>
                    <SelectItem value="original">Original Price</SelectItem>
                    <SelectItem value="markdown1">First Markdown (15% off)</SelectItem>
                    <SelectItem value="markdown2">Second Markdown (35% off)</SelectItem>
                    <SelectItem value="markdown3">Final Markdown (70% off)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </div>

            <div className="p-4 border rounded-md bg-muted/30">
              <h3 className="font-medium mb-3">Consignment Policy</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>Items are listed for 60 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>15% markdown after 10 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>Additional 20% off after 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>Final 35% off after 55 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>25% fee to reclaim unsold items</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceItems.map((item) => {
                const { markdownText, markdownBadgeVariant, daysListed } = getMarkdownInfo(item)

                return (
                  <Card key={item.id} className="overflow-hidden flex flex-col h-full">
                    <div className="aspect-video relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 right-2 bg-secondary">
                        ${item.price}
                        {item.price !== item.originalPrice && (
                          <span className="ml-1 text-xs line-through opacity-70">${item.originalPrice}</span>
                        )}
                      </Badge>

                      {/* Markdown badge */}
                      {markdownText && (
                        <Badge variant={markdownBadgeVariant} className="absolute bottom-2 left-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {markdownText}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline" className="capitalize">
                          {item.condition}
                        </Badge>
                        <span className="text-muted-foreground">
                          Listed {formatDistanceToNow(item.listedDate, { addSuffix: true })}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                      <Link href={`/marketplace/${item.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button className="w-full">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Purchase
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
