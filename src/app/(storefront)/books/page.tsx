import { prisma } from "@/lib/prisma"
import { BookOpen } from "lucide-react"
import { BookCard } from "@/components/books/book-card"
import { BookFilters } from "@/components/books/book-filters"

export default async function BooksPage(props: {
  searchParams: Promise<{ query?: string; tag?: string; sort?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams.query || ""
  const tag = searchParams.tag || ""
  const sort = searchParams.sort || "latest"

  // Build the Prisma query
  const where: any = {}

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ]
  }

  if (tag) {
    where.tags = { has: tag }
  }

  // Determine sorting order
  let orderBy: any = { createdAt: "desc" }
  if (sort === "price_asc") {
    orderBy = { price: "asc" }
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" }
  }

  // Fetch books with filters and sorting
  const books = await prisma.book.findMany({
    where,
    orderBy,
  })

  // Fetch all unique tags from database books
  const allBooksForTags = await prisma.book.findMany({
    select: { tags: true },
  })
  const allTags = Array.from(
    new Set(allBooksForTags.flatMap((b) => b.tags || []))
  ).sort()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">All Books</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Explore our complete collection of stories. From thrilling mysteries to
          heartfelt dramas, find your next favorite read here.
        </p>
      </div>

      {/* Interactive Filters Panel */}
      <BookFilters allTags={allTags} />

      {books.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20 border-border/50">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No books found</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t find any books matching your criteria. Try adjusting your filters!
          </p>
        </div>
      )}
    </div>
  )
}
