"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Book } from "@prisma/client"
import { Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createOrder } from "@/lib/actions/orders"
import { cn } from "@/lib/utils"

interface BuyNowButtonProps {
  book: Book
  isAuthenticated: boolean
  className?: string
}

export function BuyNowButton({ book, isAuthenticated, className }: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      // Redirect to sign in page with redirect back to this page
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    try {
      setIsLoading(true)

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

  return (
    <Button
      size="lg"
      variant="secondary"
      onClick={handleBuyNow}
      disabled={isLoading}
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
