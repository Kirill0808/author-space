import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar className="hidden w-64 border-r md:block" />
      <div className="flex flex-col flex-1">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold tracking-tight">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground mr-2">
              {session.user.name || session.user.email}
            </span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
               <span className="text-xs font-bold text-primary">AD</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
