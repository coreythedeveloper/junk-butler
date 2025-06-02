import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileNav />

      <main className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Transparent Pricing</h1>
        <p className="text-muted-foreground mb-8">
          Clear and simple pricing for junk removal services. No hidden fees or surprise charges.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Single Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>Small Appliances</span>
                  <span className="font-bold">$50-75</span>
                </li>
                <li className="flex justify-between">
                  <span>Furniture (Chair, Table)</span>
                  <span className="font-bold">$75-125</span>
                </li>
                <li className="flex justify-between">
                  <span>Large Appliances</span>
                  <span className="font-bold">$100-150</span>
                </li>
                <li className="flex justify-between">
                  <span>Mattress (Any Size)</span>
                  <span className="font-bold">$100-150</span>
                </li>
                <li className="flex justify-between">
                  <span>TV or Electronics</span>
                  <span className="font-bold">$75-125</span>
                </li>
                <li className="flex justify-between">
                  <span>Exercise Equipment</span>
                  <span className="font-bold">$100-200</span>
                </li>
              </ul>

              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link href="/request">Get Exact Quote</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Truck Load Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>1/8 Truck (Minimum)</span>
                  <span className="font-bold">$150-200</span>
                </li>
                <li className="flex justify-between">
                  <span>1/4 Truck</span>
                  <span className="font-bold">$250-300</span>
                </li>
                <li className="flex justify-between">
                  <span>1/2 Truck</span>
                  <span className="font-bold">$350-450</span>
                </li>
                <li className="flex justify-between">
                  <span>3/4 Truck</span>
                  <span className="font-bold">$500-600</span>
                </li>
                <li className="flex justify-between">
                  <span>Full Truck</span>
                  <span className="font-bold">$650-750</span>
                </li>
              </ul>

              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link href="/request">Get Exact Quote</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Check className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Labor & Loading</h3>
                  <p className="text-muted-foreground">
                    Our team will do all the heavy lifting and loading, no matter where the items are located.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Check className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Transportation</h3>
                  <p className="text-muted-foreground">
                    We'll transport your items to the appropriate facility for disposal, recycling, or donation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Check className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Disposal Fees</h3>
                  <p className="text-muted-foreground">
                    All disposal and recycling fees are included in our pricing. No hidden charges.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Are there any additional fees?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Our quotes are all-inclusive, but there may be additional charges for:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Items located above the first floor (stairs fee)</li>
                  <li>Extremely heavy items requiring special equipment</li>
                  <li>Hazardous materials (paint, chemicals, etc.)</li>
                  <li>Long carry distances (over 100 feet from truck parking)</li>
                </ul>
                <p className="mt-2">We'll always inform you of any potential additional fees before we begin work.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How accurate is the AI estimate?</AccordionTrigger>
              <AccordionContent>
                Our AI-powered estimates are typically very accurate. The system analyzes the photos you provide and
                compares them to thousands of previous jobs. However, the final price may vary slightly based on actual
                conditions at the pickup location.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What items can't you take?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">We cannot accept certain hazardous materials, including:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Asbestos</li>
                  <li>Medical waste</li>
                  <li>Certain chemicals and solvents</li>
                  <li>Ammunition or explosives</li>
                  <li>Radioactive materials</li>
                </ul>
                <p className="mt-2">
                  For household paint, batteries, and electronics, we can often take these items for an additional fee.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How does the resale option work?</AccordionTrigger>
              <AccordionContent>
                If you choose the resale option, we'll evaluate your items for resale potential. Items that can be
                resold will be listed in our marketplace and on partner platforms. If sold, you'll receive 40% of the
                sale price, which will be credited to your account or sent via your preferred payment method.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards, cash, and mobile payment options like Apple Pay, Google Pay, and
                Venmo. Payment is typically collected at the time of service, though we may require a deposit for larger
                jobs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
