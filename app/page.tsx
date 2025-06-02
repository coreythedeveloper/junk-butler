import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Recycle, DollarSign, Clock, Star, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ServiceAreaChecker } from "@/components/service-area-checker"
import { MobileNav } from "@/components/mobile-nav"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-brand-sage/70 overflow-hidden">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 py-16 lg:py-24 px-4 lg:pr-8">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-brand-dark leading-tight tracking-tight">
                  MODERN,
                  <br />
                  AI-POWERED TEST
                  <br />
                  JUNK REMOVAL
                </h1>
                <p className="text-lg md:text-xl mb-10 text-brand-dark/80 max-w-lg">
                  AI-powered junk removal and resale service. Get an instant estimate, schedule a pickup, and we'll
                  handle the rest.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-brand-blue hover:bg-brand-blue/90 text-brand-dark font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href="/request" className="flex items-center">
                      Get an instant estimate
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-brand-green hover:bg-brand-green/90 text-white border-0 text-lg px-8 py-6 rounded-full"
                  >
                    <Link href="/pricing">View pricing</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative">
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                  <Image
                    src="/images/hero-pose.png"
                    alt="Junk Butler Team"
                    fill
                    className="object-contain object-center lg:object-right"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Area Checker */}
        <section className="px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 -mt-12 relative z-20 border border-gray-100">
              <h2 className="text-2xl font-extrabold mb-6 text-center">Check if We Serve Your Area</h2>
              <ServiceAreaChecker />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-gradient-to-b from-white to-brand-cream/20">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-extrabold mb-3 text-center">How Junk Butler Works</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our streamlined process makes junk removal effortless from start to finish
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-2 bg-brand-sage"></div>
                <CardContent className="pt-8 p-6">
                  <div className="mb-6 bg-brand-dark/10 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    <DollarSign className="text-brand-dark h-7 w-7" />
                  </div>
                  <h3 className="font-extrabold text-xl mb-3">Get an Instant Estimate</h3>
                  <p className="text-muted-foreground">
                    Upload a photo of your items and our AI will provide an instant price estimate.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-2 bg-brand-green"></div>
                <CardContent className="pt-8 p-6">
                  <div className="mb-6 bg-brand-dark/10 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    <Clock className="text-brand-dark h-7 w-7" />
                  </div>
                  <h3 className="font-extrabold text-xl mb-3">Schedule a Pickup</h3>
                  <p className="text-muted-foreground">
                    Choose a convenient time for our team to come and remove your items.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-2 bg-brand-teal"></div>
                <CardContent className="pt-8 p-6">
                  <div className="mb-6 bg-brand-dark/10 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    <Recycle className="text-brand-dark h-7 w-7" />
                  </div>
                  <h3 className="font-extrabold text-xl mb-3">Resell or Recycle</h3>
                  <p className="text-muted-foreground">
                    We'll resell valuable items and responsibly recycle or dispose of the rest.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-brand-blue/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#B3E5F9_0%,transparent_35%)] opacity-50"></div>
          <div className="container relative z-10 mx-auto max-w-5xl">
            <h2 className="text-3xl font-extrabold mb-3 text-center">Why Choose Junk Butler</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We're revolutionizing junk removal with technology and sustainability
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="bg-brand-dark/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0 mb-4">
                  <Truck className="text-brand-dark h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-lg mb-2">Fast & Reliable</h3>
                <p className="text-muted-foreground">Professional team with quick response times.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="bg-brand-dark/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0 mb-4">
                  <DollarSign className="text-brand-dark h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-lg mb-2">Transparent Pricing</h3>
                <p className="text-muted-foreground">No hidden fees or surprise charges.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="bg-brand-dark/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0 mb-4">
                  <Recycle className="text-brand-dark h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-lg mb-2">Eco-Friendly</h3>
                <p className="text-muted-foreground">We recycle and donate whenever possible.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="bg-brand-dark/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0 mb-4">
                  <Star className="text-brand-dark h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-lg mb-2">Resale Marketplace</h3>
                <p className="text-muted-foreground">Turn your unwanted items into cash.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-extrabold mb-3 text-center">What Our Customers Say</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The AI estimate was spot on! They came exactly when scheduled and were so professional. Highly
                  recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-sage/30 flex items-center justify-center text-brand-dark font-bold mr-3">
                    JD
                  </div>
                  <div>
                    <p className="font-bold">Jane D.</p>
                    <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I made $200 from items I thought were junk! The resale option is amazing and the whole process was
                  seamless."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-teal/30 flex items-center justify-center text-brand-dark font-bold mr-3">
                    MS
                  </div>
                  <div>
                    <p className="font-bold">Michael S.</p>
                    <p className="text-sm text-muted-foreground">Austin, TX</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Cleared out my garage in one afternoon. The crew was friendly and efficient. Will definitely use
                  again!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/30 flex items-center justify-center text-brand-dark font-bold mr-3">
                    AL
                  </div>
                  <div>
                    <p className="font-bold">Amanda L.</p>
                    <p className="text-sm text-muted-foreground">Chicago, IL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-brand-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#A7C4A0_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#3A7D7B_0%,transparent_50%)]"></div>
          </div>
          <div className="container relative z-10 mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to declutter your space?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-white/80">
              Get an instant estimate and schedule your junk removal today.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-sage hover:bg-brand-sage/90 text-brand-dark font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/request" className="flex items-center">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/5 hover:bg-white/15 border-white/20 text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
              >
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 h-6 w-6 mr-2" />
                <span className="font-medium">Eco-Friendly</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 h-6 w-6 mr-2" />
                <span className="font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 h-6 w-6 mr-2" />
                <span className="font-medium">5-Star Rated</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 h-6 w-6 mr-2" />
                <span className="font-medium">Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-cream/30 py-12 px-4 border-t">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo width={120} height={30} />
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Modern, AI-powered junk removal and resale service. We make getting rid of unwanted items simple,
                sustainable, and rewarding.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-brand-dark hover:text-brand-green transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-brand-dark hover:text-brand-green transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-brand-dark hover:text-brand-green transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-brand-dark transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="text-muted-foreground hover:text-brand-dark transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-muted-foreground hover:text-brand-dark transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-brand-dark transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-extrabold text-lg mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="text-muted-foreground">support@junkbutler.com</li>
                <li className="text-muted-foreground">(555) 123-4567</li>
                <li className="text-muted-foreground">
                  123 Green Street
                  <br />
                  San Francisco, CA 94118
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Junk Butler. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <BottomNav />
    </div>
  )
}
