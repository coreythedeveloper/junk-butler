import type React from "react"
import type { Metadata } from "next"
import { Albert_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-albert-sans",
})

export const metadata: Metadata = {
  title: "Junk Butler | AI-Powered Junk Removal & Resale",
  description: "Modern, AI-powered junk removal and resale service",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${albertSans.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
