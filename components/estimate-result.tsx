"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CheckCircle, ArrowLeft, Truck, DollarSign } from "lucide-react"

type EstimateResultProps = {
  data: {
    items: string[]
    quantity: "single" | "multiple"
    photos: string[]
    price: number
    resale: boolean
  }
  onAccept: () => void
  onRestart: () => void
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

export function EstimateResult({ data, onAccept, onRestart }: EstimateResultProps) {
  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-800">Estimate Ready!</h2>
          </div>

          <p className="text-green-700 mb-6">
            Based on the information and photos you provided, we've prepared your estimate.
          </p>

          <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Your Estimate</h3>
              <div className="text-2xl font-bold text-primary">${data.price}</div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Item Type:</span>
                <span className="font-medium">{data.items.map((item) => itemLabels[item] || item).join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{data.quantity === "single" ? "Single Item" : "Multiple Items"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Resale Option:</span>
                <span className="font-medium">{data.resale ? "Yes (eligible for resale)" : "No"}</span>
              </div>
            </div>

            {data.resale && (
              <div className="bg-green-50 p-3 rounded-md text-sm text-green-700 mb-4">
                <p className="font-medium">Resale Benefit</p>
                <p>You'll receive 40% of the sale price if we successfully resell your item(s).</p>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Includes loading, transportation, and proper disposal</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {data.photos.map((photo, index) => (
              <img
                key={index}
                src={photo || "/placeholder.svg"}
                alt="Item photo"
                className="w-20 h-20 object-cover rounded-md border border-border"
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white" onClick={onAccept}>
            <DollarSign className="mr-2 h-4 w-4" />
            Accept & Continue
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={onRestart}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
