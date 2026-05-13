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

  // Validate the data
  const validatedData = orderSchema.parse(data)

  const order = await prisma.$transaction(async (tx) => {
    // In a real app, you'd recalculate prices on the server to prevent manipulation
    
    return await tx.order.create({
      data: {
        userId: session.user.id!,
        totalAmount: validatedData.totalAmount,
        status: "PAID",
        items: {
          create: validatedData.items.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          }))
        }
      }
    })
  })

  revalidatePath("/admin/orders")
  return { success: true, orderId: order.id }
}
