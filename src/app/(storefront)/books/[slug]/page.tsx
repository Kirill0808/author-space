import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, ShieldCheck, Zap } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/books/add-to-cart-button"

interface BookPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params
  
  const book = await prisma.book.findUnique({
    where: { slug }
  })

  if (!book) {
    return {
      title: "Book Not Found | Author Space"
    }
  }

  return {
    title: `${book.title} | Author Space`,
    description: book.description,
  }
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params
  
  const book = await prisma.book.findUnique({
    where: { slug }
  })

  if (!book) {
    notFound()
  }

  // Calculate if the book was created within the last 7 days
  const isNew = new Date(book.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <Link 
        href="/books" 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-10 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Link>

      <div className="flex flex-col items-center max-w-4xl mx-auto gap-10">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border bg-muted shadow-2xl">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground bg-muted/50 p-6 text-center">
              <span className="text-2xl font-serif font-medium">{book.title}</span>
              <span className="text-sm">No Cover Available</span>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex flex-col items-center text-center w-full py-2">
          <div className="space-y-5 mb-8 flex flex-col items-center">
            {isNew && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors border-primary/20 px-4 py-1.5 text-sm">
                New Release
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight max-w-3xl">
              {book.title}
            </h1>
            
            <div className="text-3xl font-bold tracking-tight text-primary mt-4">
              ${(book.price / 100).toFixed(2)}
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-2xl text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mb-10 text-center">
            {book.description}
          </div>

          <div className="pt-8 border-t w-full max-w-xl">
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <AddToCartButton 
                book={book} 
                className="w-full sm:flex-1 h-14 shadow-lg shadow-primary/20"
              />
              <Button size="lg" variant="secondary" className="w-full sm:flex-1 h-14 text-base font-semibold rounded-xl border border-border shadow-sm transition-transform hover:-translate-y-0.5">
                Buy Now
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground bg-muted/40 p-5 rounded-2xl border border-muted">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-5 h-5 text-green-500/90 shrink-0" />
                <span className="pt-0.5">Secure checkout</span>
              </div>
              <div className="hidden sm:block text-muted-foreground/30">•</div>
              <div className="flex items-center gap-2 font-medium">
                <Zap className="w-5 h-5 text-blue-500/90 shrink-0" />
                <span className="pt-0.5">Instant eBook delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
