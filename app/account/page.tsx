"use client"

import type React from "react"

import { useState } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, DollarSign, Package, Settings, ShoppingBag, Truck } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

// Mock data for bookings
const bookings = [
  {
    id: "B12345",
    date: "May 15, 2025",
    timeSlot: "10:00 AM - 12:00 PM",
    status: "scheduled",
    address: "123 Main St, Anytown, CA 90210",
    items: ["Furniture", "Electronics"],
    price: 175,
  },
  {
    id: "B12346",
    date: "May 20, 2025",
    timeSlot: "2:00 PM - 4:00 PM",
    status: "pending",
    address: "456 Oak Ave, Somewhere, CA 90211",
    items: ["Appliances"],
    price: 120,
  },
]

// Mock data for past pickups
const pastPickups = [
  {
    id: "B12340",
    date: "April 10, 2025",
    items: ["Furniture", "Household Items"],
    price: 200,
    resaleStatus: "sold",
    resaleAmount: 45,
  },
  {
    id: "B12339",
    date: "March 25, 2025",
    items: ["Electronics", "Appliances"],
    price: 150,
    resaleStatus: "not_eligible",
    resaleAmount: 0,
  },
]

// Mock data for resale items
const resaleItems = [
  {
    id: "R5001",
    title: "Vintage Coffee Table",
    status: "listed",
    platforms: ["Marketplace", "eBay"],
    listedDate: "April 12, 2025",
    price: 85,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "R5002",
    title: 'Samsung 32" TV',
    status: "sold",
    platforms: ["Marketplace", "eBay", "Facebook"],
    listedDate: "April 5, 2025",
    soldDate: "April 15, 2025",
    price: 120,
    soldPrice: 110,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "R5003",
    title: "Office Chair",
    status: "listed",
    platforms: ["Marketplace", "Facebook"],
    listedDate: "April 18, 2025",
    price: 65,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("bookings")

  return (
    <div className="min-h-screen flex flex-col">
      <MobileNav />

      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">John Doe</h2>
                  <p className="text-muted-foreground">john.doe@example.com</p>
                  <Button variant="outline" className="mt-4 w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="hidden md:block">
              <h3 className="font-medium text-muted-foreground mb-3 px-4">Account</h3>
              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "bookings" ? "bg-muted" : ""}`}
                  onClick={() => setActiveTab("bookings")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Upcoming Pickups
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "history" ? "bg-muted" : ""}`}
                  onClick={() => setActiveTab("history")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Pickup History
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "resale" ? "bg-muted" : ""}`}
                  onClick={() => setActiveTab("resale")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Resale Items
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "payments" ? "bg-muted" : ""}`}
                  onClick={() => setActiveTab("payments")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Payments
                </Button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:hidden mb-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="bookings">Pickups</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="resale">Resale</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Upcoming Pickups</h2>
                  <Button asChild>
                    <a href="/request">Schedule Pickup</a>
                  </Button>
                </div>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg">Booking #{booking.id}</h3>
                                <Badge className={booking.status === "scheduled" ? "bg-green-500" : "bg-yellow-500"}>
                                  {booking.status === "scheduled" ? "Scheduled" : "Pending"}
                                </Badge>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>
                                  {booking.date} • {booking.timeSlot}
                                </span>
                              </div>
                              <div className="flex items-start text-muted-foreground">
                                <Truck className="mr-2 h-4 w-4 mt-1 shrink-0" />
                                <span>{booking.address}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Package className="mr-2 h-4 w-4" />
                                <span>{booking.items.join(", ")}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="text-xl font-bold">${booking.price}</div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Reschedule
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground mb-4">You don't have any upcoming pickups.</p>
                      <Button asChild>
                        <a href="/request">Schedule a Pickup</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Pickup History</h2>

                {pastPickups.length > 0 ? (
                  <div className="space-y-4">
                    {pastPickups.map((pickup) => (
                      <Card key={pickup.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-bold text-lg">Pickup #{pickup.id}</h3>
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{pickup.date}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Package className="mr-2 h-4 w-4" />
                                <span>{pickup.items.join(", ")}</span>
                              </div>
                              {pickup.resaleStatus === "sold" && (
                                <div className="flex items-center text-green-600">
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  <span>Resale credit: ${pickup.resaleAmount}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="text-xl font-bold">${pickup.price}</div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">You don't have any pickup history yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "resale" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Your Resale Items</h2>

                {resaleItems.length > 0 ? (
                  <div className="space-y-4">
                    {resaleItems.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-20 h-20 object-cover rounded-md"
                              />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <Badge className={item.status === "sold" ? "bg-green-500" : "bg-blue-500"}>
                                  {item.status === "sold" ? "Sold" : "Listed"}
                                </Badge>
                              </div>

                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>
                                  Listed: {item.listedDate}
                                  {item.soldDate && ` • Sold: ${item.soldDate}`}
                                </span>
                              </div>

                              <div className="flex items-center text-muted-foreground">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                <span>Listed on: {item.platforms.join(", ")}</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-muted-foreground">
                                  {item.status === "sold" ? (
                                    <span>
                                      Sold for: <span className="font-bold text-green-600">${item.soldPrice}</span>
                                    </span>
                                  ) : (
                                    <span>
                                      Listed price: <span className="font-bold">${item.price}</span>
                                    </span>
                                  )}
                                </div>

                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground mb-4">You don't have any items listed for resale.</p>
                      <Button asChild>
                        <a href="/request">Schedule a Pickup with Resale</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Payment History</h2>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-md mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded-md">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your payment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastPickups.map((pickup) => (
                        <div key={pickup.id} className="flex justify-between items-center p-4 border-b last:border-0">
                          <div>
                            <p className="font-medium">Pickup #{pickup.id}</p>
                            <p className="text-sm text-muted-foreground">{pickup.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${pickup.price}</p>
                            <p className="text-sm text-green-600">Completed</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Resale Credits Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resale Credits</CardTitle>
                    <CardDescription>Earnings from resold items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-green-800">Available Balance</p>
                        <p className="text-xl font-bold text-green-800">$45.00</p>
                      </div>
                    </div>

                    <Button className="w-full">Withdraw to Bank Account</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

// This component is used in the Payments tab
function CreditCard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
