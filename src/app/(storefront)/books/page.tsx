import { prisma } from "@/lib/prisma"
import { BookOpen } from "lucide-react"
import { BookCard } from "@/components/books/book-card"

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">All Books</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Explore our complete collection of stories. From thrilling mysteries to heartfelt dramas, find your next favorite read here.
        </p>
      </div>

      {books.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No books found</h2>
          <p className="text-muted-foreground">Our library is currently empty. Please check back later!</p>
        </div>
      )}
    </div>
  )
}
