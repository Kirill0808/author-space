import { getBooks } from "@/lib/actions/books"
import { BooksTableClient } from "@/components/admin/books-table-client"

export default async function AdminBooksPage() {
  const books = await getBooks()

  return (
    <div className="container py-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      <BooksTableClient books={books} />
    </div>
  )
}
