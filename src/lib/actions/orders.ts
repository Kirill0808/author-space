"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { OrderStatus } from "@prisma/client"

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
