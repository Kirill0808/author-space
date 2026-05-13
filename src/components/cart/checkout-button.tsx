"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createOrder } from "@/lib/actions/orders"
import { useCart } from "@/lib/store/use-cart"
import { Loader2, ShoppingBag } from "lucide-react"

interface CheckoutButtonProps {
  totalAmount: number
  items: any[]
}

export function CheckoutButton({ totalAmount, items }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { clearCart } = useCart()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      
      const orderData = {
        totalAmount,
        items: items.map(item => ({
          bookId: item.book.id,
          quantity: item.quantity,
          priceAtPurchase: item.book.price,
        }))
      }

      const result = await createOrder(orderData)
      
      if (result.success) {
        clearCart()
        // For now redirect to home since success page is Phase 3
        // but we'll add a query param to show a message if needed
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Checkout failed:", error)
      alert("Checkout failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleCheckout}
      disabled={isLoading || items.length === 0}
      className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-primary/90"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-5 w-5" />
          Checkout
        </>
      )}
    </Button>
  )
}
