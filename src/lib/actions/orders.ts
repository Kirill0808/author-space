"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { OrderStatus } from "@prisma/client"
import { orderSchema } from "@/lib/schemas"

export async function getOrders() {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage orders")
  }

  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage orders")
  }

  await prisma.order.update({
    where: { id },
    data: { status },
  })
  
  revalidatePath("/admin/orders")
}

export async function deleteOrder(id: string) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage orders")
  }

  await prisma.order.delete({
    where: { id },
  })
  
  revalidatePath("/admin/orders")
}

export async function createOrder(data: unknown) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to place an order")
  }

  // Validate the data structure
  const validatedData = orderSchema.parse(data)

  const order = await prisma.$transaction(async (tx) => {
    // 1. Fetch real book prices from the database for the ordered items
    const bookIds = validatedData.items.map((item) => item.bookId)
    const dbBooks = await tx.book.findMany({
      where: { id: { in: bookIds } },
      select: { id: true, price: true }
    })

    // Create a map for quick price lookups
    const bookPriceMap = new Map(dbBooks.map((b) => [b.id, b.price]))

    let calculatedTotalAmount = 0
    const orderItemsToCreate = []

    // 2. Validate existence and calculate total on the server
    for (const item of validatedData.items) {
      const realPrice = bookPriceMap.get(item.bookId)
      if (realPrice === undefined) {
        throw new Error(`Book with ID ${item.bookId} not found`)
      }

      calculatedTotalAmount += realPrice * item.quantity
      orderItemsToCreate.push({
        bookId: item.bookId,
        quantity: item.quantity,
        priceAtPurchase: realPrice, // Use verified DB price
      })
    }

    // 3. Create the order with server-calculated amounts
    return await tx.order.create({
      data: {
        userId: session.user.id!,
        totalAmount: calculatedTotalAmount,
        status: "PAID",
        items: {
          create: orderItemsToCreate
        }
      }
    })
  })

  revalidatePath("/admin/orders")
  return { success: true, orderId: order.id }
}
