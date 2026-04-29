import Link from "next/link"
import { auth } from "@/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { StorefrontAuth } from "./storefront-auth"
import { CartIndicator } from "./cart-indicator"

export async function StorefrontHeader() {
  let session = null
  try {
    session = await auth()
  } catch (error) {
    console.error("Auth session fetch failed:", error)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block text-xl">Author Space</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/books" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Books
            </Link>
            <Link href="/blog" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-end gap-4">
          <nav className="flex items-center gap-2">
            <CartIndicator />
            <ThemeToggle />
            <StorefrontAuth 
              key={session?.user?.email || "guest"} 
              user={session?.user} 
            />
          </nav>
        </div>
      </div>
    </header>
  )
}
