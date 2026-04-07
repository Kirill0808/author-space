"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { bookSchema, BookFormData } from "@/lib/schemas"
import { auth } from "@/auth"

export async function getBooks() {
  return await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function createBook(data: BookFormData) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage books")
  }

  // Validate on server
  bookSchema.parse(data)

  // Convert dollars to cents for DB
  const priceInCents = Math.round(data.price * 100)
  
  await prisma.book.create({
    data: {
      ...data,
      price: priceInCents,
    },
  })
  
  revalidatePath("/admin/books")
  revalidatePath("/books")
}

export async function updateBook(id: string, data: BookFormData) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage books")
  }

  // Validate on server
  bookSchema.parse(data)

  // Get the current book to check for slug change
  const currentBook = await prisma.book.findUnique({
    where: { id },
    select: { slug: true }
  })

  const priceInCents = Math.round(data.price * 100)
  
  await prisma.book.update({
    where: { id },
    data: {
      ...data,
      price: priceInCents,
    },
  })
  
  revalidatePath("/admin/books")
  revalidatePath(`/books/${data.slug}`)
  if (currentBook && currentBook.slug !== data.slug) {
    revalidatePath(`/books/${currentBook.slug}`)
  }
  revalidatePath("/books")
}

export async function deleteBook(id: string) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage books")
  }

  await prisma.book.delete({
    where: { id },
  })
  
  revalidatePath("/admin/books")
  revalidatePath("/books")
}
