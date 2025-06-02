"use client"

// Logo component with error handling for SVG loading issues
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className, width = 180, height = 36 }: LogoProps) {
  return (
    <Link href="/" className={className}>
      <Image
        src="https://h0btiwodbpjmqicv.public.blob.vercel-storage.com/logo-KwGnA4sMN5CrPoeuN4gXKqajarWTsU.svg"
        alt="Junk Butler Logo"
        width={width}
        height={height}
        priority
        className="h-auto"
        onError={(e) => {
          console.error("Logo failed to load:", e)
          // Fallback to a text version if the image fails to load
          const target = e.target as HTMLImageElement
          target.onerror = null // Prevent infinite error loop
          target.style.display = "none"
          const parent = target.parentElement
          if (parent) {
            const fallback = document.createElement("span")
            fallback.textContent = "Junk Butler"
            fallback.className = "font-extrabold text-xl text-brand-dark"
            parent.appendChild(fallback)
          }
        }}
      />
    </Link>
  )
}
