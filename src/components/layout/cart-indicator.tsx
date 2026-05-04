"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/store/use-cart"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function CartIndicator() {
  const [mounted, setMounted] = useState(false)
  const itemsCount = useCart((state) => state.getTotalItems())

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="relative p-2 text-muted-foreground opacity-50">
      <ShoppingCart className="h-5 w-5" />
    </div>
  )

  return (
    <Link 
      href="/cart"
      className="relative p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemsCount > 0 && (
        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white animate-in zoom-in duration-300">
          {itemsCount}
        </span>
      )}
    </Link>
  )
}
