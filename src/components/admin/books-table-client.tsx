"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { BookForm } from "@/components/admin/book-form"
import { deleteBook } from "@/lib/actions/books"
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react"

interface Book {
  id: string
  title: string
  price: number
  slug: string
  description: string
  coverImage: string | null
  createdAt: Date
}

interface BooksTableClientProps {
  books: Book[]
}

export function BooksTableClient({ books }: BooksTableClientProps) {
  const router = useRouter()
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingBook, setEditingBook] = React.useState<Book | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      await deleteBook(id)
      router.refresh()
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">Manage your bookstore catalog.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "gap-2")}>
            <Plus className="h-4 w-4" />
            Add Book
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new book to your library.
              </DialogDescription>
            </DialogHeader>
            <BookForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No books found. Add your first book to get started.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id} className="group transition-colors">
                  <TableCell>
                    <div className="h-12 w-10 rounded-md bg-muted overflow-hidden border shadow-sm">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/5">
                          <Plus className="h-4 w-4 text-primary/20" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{book.title}</span>
                      <span className="text-xs text-muted-foreground font-mono">/{book.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-semibold">
                      {formatPrice(book.price)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(book.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(`/books/${book.slug}`, "_blank")}
                        className="h-8 w-8 p-0"
                        title="View on site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingBook(book)}
                        className="h-8 w-8 p-0"
                        title="Edit book"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(book.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        title="Delete book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBook} onOpenChange={(open) => !open && setEditingBook(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book details. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          {editingBook && (
            <BookForm 
              initialData={{
                ...editingBook,
                coverImage: editingBook.coverImage ?? undefined,
              }} 
              onSuccess={() => {
                setEditingBook(null)
                router.refresh()
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
