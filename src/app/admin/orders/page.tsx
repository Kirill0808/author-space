import { getOrders } from "@/lib/actions/orders"
import { OrdersTableClient } from "@/components/admin/orders-table-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Orders",
  description: "Manage incoming orders and update their statuses.",
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return <OrdersTableClient initialOrders={orders} />
}
