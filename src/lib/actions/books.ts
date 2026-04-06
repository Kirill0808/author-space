"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { bookSchema, BookFormData } from "@/lib/schemas"

export async function getBooks() {
  return await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function createBook(data: BookFormData) {
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
  revalidatePath("/books")
}

export async function deleteBook(id: string) {
  await prisma.book.delete({
    where: { id },
  })
  
  revalidatePath("/admin/books")
  revalidatePath("/books")
}
