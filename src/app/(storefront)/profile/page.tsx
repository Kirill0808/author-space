import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProfileTabs, ProfileOrder, PurchasedBook } from "@/components/profile/profile-tabs"

export const metadata = {
  title: "Личный кабинет",
  description: "Управляйте своим профилем, просматривайте купленные книги и историю заказов.",
}

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Fetch fresh user data from database
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    }
  })

  if (!dbUser) {
    redirect("/auth/signin")
  }

  // Fetch all orders with items and book details
  const rawOrders = await prisma.order.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          book: true
        }
      }
    }
  })

  // Format orders to match ProfileOrder interface
  const orders: ProfileOrder[] = rawOrders.map(order => ({
    id: order.id,
    totalAmount: order.totalAmount,
    status: order.status as ProfileOrder["status"],
    createdAt: order.createdAt,
    items: order.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      book: {
        id: item.book.id,
        title: item.book.title,
        coverImage: item.book.coverImage,
        slug: item.book.slug
      }
    }))
  }))

  // Calculate unique purchased books (from successful orders)
  const purchasedBooksMap = new Map<string, PurchasedBook>()
  for (const order of orders) {
    if (["PAID", "SHIPPED", "DELIVERED"].includes(order.status)) {
      for (const item of order.items) {
        if (!purchasedBooksMap.has(item.book.id)) {
          // Fetch complete book details for library layout
          const rawBook = rawOrders
            .find(o => o.id === order.id)
            ?.items.find(i => i.book.id === item.book.id)
            ?.book

          if (rawBook) {
            purchasedBooksMap.set(item.book.id, {
              id: rawBook.id,
              title: rawBook.title,
              description: rawBook.description,
              price: rawBook.price,
              coverImage: rawBook.coverImage,
              slug: rawBook.slug,
              createdAt: rawBook.createdAt
            })
          }
        }
      }
    }
  }
  const purchasedBooks = Array.from(purchasedBooksMap.values())

  return (
    <div className="flex justify-center w-full py-12 lg:py-20 bg-background">
      <ProfileTabs 
        user={{
          ...dbUser,
          role: dbUser.role.toString(),
        }}
        orders={orders}
        purchasedBooks={purchasedBooks}
      />
    </div>
  )
}

