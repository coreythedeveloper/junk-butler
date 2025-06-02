import { MobileNav } from "@/components/mobile-nav"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileNav />

      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" disabled className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Images */}
            <div className="w-full md:w-1/2">
              <Skeleton className="w-full aspect-video rounded-lg mb-4" />

              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="w-16 h-16 rounded" />
                ))}
              </div>
            </div>

            {/* Right column - Item details */}
            <div className="w-full md:w-1/2">
              <Skeleton className="h-10 w-3/4 mb-2" />

              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>

              <Skeleton className="h-12 w-32 mb-6" />

              <Skeleton className="h-32 w-full mb-6" />

              <div className="flex flex-col gap-3 mb-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>

              <div className="flex gap-3 mb-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>

        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </main>
    </div>
  )
}
