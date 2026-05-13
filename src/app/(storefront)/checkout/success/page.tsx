"use client"

import Link from "next/link"
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function SuccessPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] w-full px-4 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full text-center space-y-12"
      >
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
            className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary mb-6"
          >
            <CheckCircle2 className="w-16 h-16" />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl text-foreground">
            Order <span className="text-primary italic underline underline-offset-8">Confirmed!</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-md mx-auto">
            Thank you for your purchase. Your order has been placed successfully and is being processed.
          </p>
        </div>

        <div className="bg-secondary/30 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 shadow-2xl shadow-primary/5 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/books"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all px-8"
              )}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
            <Link 
              href="/admin/orders"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto h-14 rounded-2xl text-lg font-bold border-border/50 bg-background/50 hover:bg-background/80 transition-all px-8"
              )}
            >
              View in Admin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            A confirmation email will be sent shortly.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
