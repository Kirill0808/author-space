"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Book } from "@prisma/client"
import { Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createOrder } from "@/lib/actions/orders"
import { cn } from "@/lib/utils"

interface BuyNowButtonProps {
  book: Book
  className?: string
}

export function BuyNowButton({ book, className }: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleBuyNow = async () => {
    if (status === "loading") {
      return // Do nothing if session is still loading
    }

    if (!session?.user) {
      // Redirect to sign in page with redirect back to this page
      const currentUrl = typeof window !== "undefined" ? window.location.href : `/books/${book.slug}`
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`)
      return
    }

    try {
      setIsLoading(true)
      
      // Prepare payload to pass schema validation (server action will recalculate prices for security)
      const orderData = {
        totalAmount: book.price,
        items: [{
          bookId: book.id,
          quantity: 1,
          priceAtPurchase: book.price
        }]
      }

      const result = await createOrder(orderData)
      
      if (result.success) {
        router.push("/checkout/success")
        router.refresh()
      }
    } catch (error) {
      console.error("Buy now failed:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isBtnLoading = isLoading || status === "loading"

  return (
    <Button
      size="lg"
      variant="secondary"
      onClick={handleBuyNow}
      disabled={isBtnLoading}
      className={cn(
        "w-full sm:flex-1 h-14 text-base font-semibold rounded-xl border border-border shadow-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-75 disabled:pointer-events-none",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Zap className="mr-2 h-5 w-5 fill-current text-amber-500 stroke-amber-500" />
          Buy Now
        </>
      )}
    </Button>
  )
}
