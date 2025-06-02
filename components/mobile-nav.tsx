"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-brand-cream/30"
      } hidden md:block`}
    >
      <div className="container flex h-16 md:h-20 items-center">
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex items-center justify-between mb-6">
                <Logo width={140} height={35} />
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/request"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  Get Estimate
                </Link>
                <Link
                  href="/pricing"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/marketplace"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  href="/account"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation - Left side */}
        <nav className="hidden md:flex items-center flex-1">
          <div className="flex gap-8">
            <Link href="/" className="text-base font-medium text-brand-dark hover:text-brand-green transition-colors">
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-base font-medium text-brand-dark hover:text-brand-green transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/marketplace"
              className="text-base font-medium text-brand-dark hover:text-brand-green transition-colors"
            >
              Marketplace
            </Link>
          </div>
        </nav>

        {/* Logo - Center */}
        <div className="flex justify-center flex-1">
          <Logo width={180} height={45} />
        </div>

        {/* Right side - Login and CTA */}
        <div className="flex items-center justify-end flex-1 gap-4">
          <Link
            href="/account"
            className="hidden md:block text-base font-medium text-brand-dark hover:text-brand-green transition-colors"
          >
            Log in
          </Link>
          <Button asChild className="bg-brand-blue hover:bg-brand-blue/90 text-brand-dark rounded-full text-base">
            <Link href="/request">Get Estimate</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
