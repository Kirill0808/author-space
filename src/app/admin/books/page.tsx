import { getBooks } from "@/lib/actions/books"
import { BooksTableClient } from "@/components/admin/books-table-client"

export default async function AdminBooksPage() {
  const books = await getBooks()

  return <BooksTableClient books={books} />
}
