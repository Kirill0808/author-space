"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/actions/auth"
import { LayoutDashboard, BookOpen, FileText, Settings, Users, ChevronRight, LogOut, ArrowLeft } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    path: "/admin",
  },
  {
    title: "Books",
    icon: BookOpen,
    href: "/admin/books",
    path: "/admin/books",
  },
  {
    title: "Blog Posts",
    icon: FileText,
    href: "/admin/posts",
    path: "/admin/posts",
  },
]

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn("flex h-full flex-col bg-card", className)}>
      <div className="flex h-20 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary p-1.5 rounded-lg">
             <ArrowLeft className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">Main Site</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/(admin)" && pathname.startsWith(item.path))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-4.5 w-4.5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-xl bg-secondary/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Admin Actions</span>
          </div>
          <button 
            onClick={() => logout()}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out admin</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
