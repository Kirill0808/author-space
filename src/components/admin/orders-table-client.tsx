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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { deleteOrder, updateOrderStatus } from "@/lib/actions/orders"
import { Trash2, AlertCircle } from "lucide-react"

// Assume the standard Prisma generated types:
type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"

interface OrderWithUser {
  id: string
  totalAmount: number
  status: OrderStatus
  createdAt: Date
  user: {
    name: string | null
    email: string | null
  }
}

interface OrdersTableClientProps {
  initialOrders: OrderWithUser[]
}

const statusOptions: OrderStatus[] = [
  "PENDING", 
  "PAID", 
  "SHIPPED", 
  "DELIVERED", 
  "CANCELLED"
]

export function OrdersTableClient({ initialOrders }: OrdersTableClientProps) {
  const router = useRouter()
  const [orders, setOrders] = React.useState<OrderWithUser[]>(initialOrders)
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this order?")) {
      try {
        await deleteOrder(id)
        setOrders((prev) => prev.filter((o) => o.id !== id))
        router.refresh()
      } catch (error) {
        console.error("Failed to delete order:", error)
        alert("Failed to delete order.")
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setIsUpdating(id)
    try {
      await updateOrderStatus(id, newStatus)
      setOrders((prev) => 
        prev.map((o) => o.id === id ? { ...o, status: newStatus } : o)
      )
      router.refresh()
    } catch (error) {
      console.error("Failed to update status:", error)
      alert("Failed to update status.")
    } finally {
      setIsUpdating(null)
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100)
  }

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED": return "default"
      case "PAID": return "secondary"
      case "SHIPPED": return "outline"
      case "CANCELLED": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and manage customer orders.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-6 w-6 opacity-30" />
                    <span>No orders found.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="group transition-colors">
                  <TableCell className="font-mono text-xs font-medium">
                    {order.id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.user.name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground">{order.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-primary">
                      {formatPrice(order.totalAmount)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={isUpdating === order.id}
                        className="h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(order.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        title="Delete order"
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
    </div>
  )
}
