"use client"

import { useState } from "react"
import { Book } from "@prisma/client"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/use-cart"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  book: Book
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
}

export function AddToCartButton({ 
  book, 
  className, 
  size = "lg",
  showIcon = true
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCart((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(book)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button
      size={size}
      onClick={handleAddToCart}
      className={cn(
        "relative transition-all duration-300 rounded-xl font-semibold",
        isAdded ? "bg-green-600 hover:bg-green-600 text-white" : "",
        className
      )}
      disabled={isAdded}
    >
      <span className={cn(
        "flex items-center justify-center transition-all duration-300",
        isAdded ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      )}>
        {showIcon && <ShoppingCart className="mr-2 h-5 w-5" />}
        Add to Cart
      </span>
      
      <span className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-300",
        isAdded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}>
        <Check className="mr-2 h-5 w-5" />
        Added!
      </span>
    </Button>
  )
}
