"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, User, MessageSquare, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"

export function BottomNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Check if the current path matches the nav item
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border h-16 px-2">
        <div className="flex items-center justify-around h-full">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-16 h-full ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/marketplace"
            className={`flex flex-col items-center justify-center w-16 h-full ${
              isActive("/marketplace") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs mt-1">Shop</span>
          </Link>

          <Link href="/request" className="flex flex-col items-center justify-center w-16 h-full">
            <div className="bg-secondary text-white rounded-full p-3 -mt-8 shadow-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1">Request</span>
          </Link>

          <Link
            href="/account"
            className={`flex flex-col items-center justify-center w-16 h-full ${
              isActive("/account") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Account</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="flex flex-col items-center justify-center w-16 h-full text-muted-foreground"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center justify-between mb-6">
                <Logo width={140} height={35} />
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
      </div>

      {/* Add padding to the bottom of the page on mobile to account for the nav bar */}
      <div className="md:hidden h-16"></div>
    </>
  )
}
