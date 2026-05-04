"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/store/use-cart"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[75vh] w-full px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center space-y-8 text-center max-w-lg"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/5 blur-2xl animate-pulse" />
            <div className="relative bg-secondary/50 p-8 rounded-full border border-border/50 shadow-inner">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Your cart is currently empty</h1>
            <p className="text-muted-foreground max-w-sm mx-auto text-lg">
              Looks like you haven't added any books to your collection yet.
            </p>
          </div>
          <Link href="/books">
            <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5">
              Browse Books
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 lg:py-20">
      <div className="flex flex-col space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-4">
            <Link href="/books">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/80 h-12 w-12">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Shopping Bag</h1>
          </div>
          <p className="text-muted-foreground text-xl">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.book.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:bg-secondary/40 transition-colors"
                >
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                    {/* Book Image */}
                    <div className="relative aspect-[3/4] w-full sm:w-32 rounded-2xl overflow-hidden bg-secondary shadow-sm">
                      {item.book.coverImage ? (
                        <Image
                          src={item.book.coverImage}
                          alt={item.book.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No cover
                        </div>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/books/${item.book.slug}`}>
                            <h3 className="font-bold text-xl sm:text-2xl line-clamp-1 hover:text-primary transition-colors">
                              {item.book.title}
                            </h3>
                          </Link>
                          <p className="text-xl font-bold text-foreground">
                            {formatPrice(item.book.price)}
                          </p>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed max-w-md">
                          {item.book.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl p-1 shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                          onClick={() => removeItem(item.book.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-secondary/30 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 shadow-xl shadow-primary/5 space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-muted-foreground text-lg">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground tabular-nums">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-lg">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between items-end pt-2">
                  <span className="text-lg font-medium text-muted-foreground">Total</span>
                  <span className="text-4xl font-black tracking-tight tabular-nums">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button 
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-primary/90"
                >
                  Checkout
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Secure checkout powered by Stripe
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-lg bg-background/50 border border-border/50 p-1 flex items-center justify-center">
                      <div className="h-full w-full rounded bg-muted-foreground/10" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">All cards accepted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
