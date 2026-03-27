import Link from "next/link"
import Image from "next/image"
import { Book } from "@prisma/client"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"

interface BookCardProps {
  book: Book
  showBadge?: boolean
  className?: string
}

export function BookCard({ book, showBadge = false, className }: BookCardProps) {
  const isNew = new Date(book.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  const displayBadge = showBadge || isNew

  return (
    <Card className={cn("overflow-hidden flex flex-col group border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <div className="aspect-[3/4] relative overflow-hidden bg-muted">
        {book.coverImage ? (
          <Image 
            src={book.coverImage} 
            alt={book.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 opacity-20" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {displayBadge && (
            <Badge variant="secondary" className="font-normal bg-primary/10 text-primary border-primary/20">
              New Release
            </Badge>
          )}
          <span className="text-lg font-semibold ml-auto">${(book.price / 100).toFixed(2)}</span>
        </div>
        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{book.title}</CardTitle>
        <CardDescription className="line-clamp-2">{book.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pr-6 pl-6 pb-6 pt-0">
        <Link 
          href={`/books/${book.slug}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full rounded-lg")}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}
