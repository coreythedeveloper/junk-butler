import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, DollarSign, ExternalLink, Package, Search, Truck, Upload } from "lucide-react"

// Mock data for resale items
const resaleItems = [
  {
    id: "R5001",
    title: "Vintage Coffee Table",
    customer: "John Doe",
    pickupDate: "April 12, 2025",
    recommendedPrice: 85,
    status: "pending",
    platforms: [],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "R5002",
    title: 'Samsung 32" TV',
    customer: "Jane Smith",
    pickupDate: "April 5, 2025",
    recommendedPrice: 120,
    status: "listed",
    platforms: ["eBay", "Marketplace"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "R5003",
    title: "Office Chair",
    customer: "Mike Johnson",
    pickupDate: "April 18, 2025",
    recommendedPrice: 65,
    status: "sold",
    platforms: ["eBay", "Facebook", "Marketplace"],
    soldPrice: 70,
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Mock data for upcoming pickups
const upcomingPickups = [
  {
    id: "B12345",
    customer: "John Doe",
    date: "May 15, 2025",
    timeSlot: "10:00 AM - 12:00 PM",
    address: "123 Main St, Anytown, CA 90210",
    items: ["Furniture", "Electronics"],
    resale: true,
  },
  {
    id: "B12346",
    customer: "Jane Smith",
    date: "May 20, 2025",
    timeSlot: "2:00 PM - 4:00 PM",
    address: "456 Oak Ave, Somewhere, CA 90211",
    items: ["Appliances"],
    resale: false,
  },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileNav />

      <main className="flex-1 container max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="resale" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="resale">Resale Dashboard</TabsTrigger>
            <TabsTrigger value="pickups">Upcoming Pickups</TabsTrigger>
            <TabsTrigger value="tracking">Truck Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="resale" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Resale Dashboard</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search items..." className="pl-10 w-64" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="listed">Listed</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {resaleItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground">
                              ID: {item.id} • Customer: {item.customer}
                            </p>
                            <p className="text-muted-foreground">Pickup Date: {item.pickupDate}</p>
                          </div>

                          <Badge
                            className={
                              item.status === "pending"
                                ? "bg-yellow-500"
                                : item.status === "listed"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                            }
                          >
                            {item.status === "pending" ? "Pending" : item.status === "listed" ? "Listed" : "Sold"}
                          </Badge>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium">Recommended Price</p>
                            <p className="text-xl font-bold">${item.recommendedPrice}</p>
                            {item.soldPrice && <p className="text-sm text-green-600">Sold for: ${item.soldPrice}</p>}
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Listing Status</p>
                            <div className="flex flex-wrap gap-2">
                              {item.platforms.length > 0 ? (
                                item.platforms.map((platform) => (
                                  <Badge key={platform} variant="outline">
                                    {platform}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">Not listed yet</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {item.status === "pending" && (
                              <>
                                <Button size="sm">
                                  <Upload className="mr-2 h-4 w-4" />
                                  List on Platforms
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Details
                                </Button>
                              </>
                            )}
                            {item.status === "listed" && (
                              <>
                                <Button size="sm">
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Mark as Sold
                                </Button>
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Listings
                                </Button>
                              </>
                            )}
                            {item.status === "sold" && (
                              <Button size="sm" variant="outline">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>

                        {item.status === "pending" && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Item Title</label>
                              <Input defaultValue={item.title} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Price</label>
                              <Input type="number" defaultValue={item.recommendedPrice} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Platforms</label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select platforms" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Platforms</SelectItem>
                                  <SelectItem value="ebay">eBay</SelectItem>
                                  <SelectItem value="facebook">Facebook</SelectItem>
                                  <SelectItem value="marketplace">Marketplace</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 md:col-span-3">
                              <label className="text-sm font-medium">Description</label>
                              <Textarea placeholder="Enter item description..." className="min-h-[100px]" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pickups">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Pickups</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Resale</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingPickups.map((pickup) => (
                      <TableRow key={pickup.id}>
                        <TableCell className="font-medium">{pickup.id}</TableCell>
                        <TableCell>{pickup.customer}</TableCell>
                        <TableCell>
                          {pickup.date}
                          <br />
                          <span className="text-muted-foreground text-sm">{pickup.timeSlot}</span>
                        </TableCell>
                        <TableCell>{pickup.address}</TableCell>
                        <TableCell>{pickup.items.join(", ")}</TableCell>
                        <TableCell>
                          {pickup.resale ? (
                            <Badge className="bg-green-500">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Truck className="h-4 w-4" />
                              <span className="sr-only">Assign Truck</span>
                            </Button>
                            <Button size="sm" variant="outline">
                              <Package className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Live Truck Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Truck Tracking Map</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature will display a real-time map showing the location of all active trucks.
                  </p>
                  <Button>Initialize Tracking System</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
