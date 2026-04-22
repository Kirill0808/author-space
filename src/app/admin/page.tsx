import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BookOpen,
  FileText,
  Users,
  ShoppingBag,
  TrendingUp,
  Clock,
} from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"

export default async function AdminDashboardPage() {
  const session = await auth()
  
  // Fetch real statistics
  const [bookCount, postCount, userCount, orderCount] = await Promise.all([
    prisma.book.count(),
    prisma.post.count(),
    prisma.user.count(),
    prisma.order.count(),
  ])

  const stats = [
    {
      title: "Total Books",
      value: bookCount,
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Published and drafts",
    },
    {
      title: "Blog Posts",
      value: postCount,
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "News and updates",
    },
    {
      title: "Active Users",
      value: userCount,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Registered accounts",
    },
    {
      title: "Total Orders",
      value: orderCount,
      icon: ShoppingBag,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: "Complete and pending",
    },
  ]

  // Recent activity: Fetch latest items from all relevant tables
  const [recentBooks, recentPosts, recentUsers, recentOrders] = await Promise.all([
    prisma.book.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ 
      take: 5, 
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    }),
  ])

  // Combine and sort
  const allActivities = [
    ...recentBooks.map(b => ({
      id: `book-${b.id}`,
      type: "book",
      message: `New book added: ${b.title}`,
      time: b.createdAt,
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    })),
    ...recentPosts.map(p => ({
      id: `post-${p.id}`,
      type: "post",
      message: `${p.published ? 'Published' : 'Drafted'} post: ${p.title}`,
      time: p.createdAt,
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    })),
    ...recentUsers.map(u => ({
      id: `user-${u.id}`,
      type: "user",
      message: `New user registered: ${u.name || u.email}`,
      time: u.createdAt,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    })),
    ...recentOrders.map(o => ({
      id: `order-${o.id}`,
      type: "order",
      message: `New order: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(o.totalAmount / 100)}`,
      time: o.createdAt,
      icon: ShoppingBag,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    })),
  ]
  .sort((a, b) => b.time.getTime() - a.time.getTime())
  .slice(0, 8)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}. Here&apos;s what&apos;s happening on your site today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Content Area - Activity */}
        <Card className="lg:col-span-4 border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes and updates from the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {allActivities.length === 0 ? (
                 <div className="text-center py-6 text-muted-foreground italic">
                   No recent activity to show.
                 </div>
               ) : (
                 allActivities.map((activity) => (
                   <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl border border-border/40 hover:bg-secondary/20 transition-all group">
                     <div className={cn(activity.bg, activity.color, "p-2.5 rounded-full shrink-0")}>
                       <activity.icon className="h-4 w-4" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium leading-none truncate mb-1">{activity.message}</p>
                       <p className="text-xs text-muted-foreground flex items-center gap-1">
                         <Clock className="h-3 w-3" />
                         {formatRelativeTime(activity.time)}
                       </p>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 border-border/50 bg-secondary/10">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Commonly used management tools.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
             <Link 
               href="/admin/books"
               className="flex items-center gap-3 w-full p-4 rounded-xl bg-background border border-border/50 hover:border-primary/50 text-left transition-all group"
             >
                <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20">
                   <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                   <div className="text-sm font-semibold">Manage Library</div>
                   <div className="text-xs text-muted-foreground">Add and edit your books</div>
                </div>
             </Link>
             <Link 
               href="/admin/posts"
               className="flex items-center gap-3 w-full p-4 rounded-xl bg-background border border-border/50 hover:border-primary/50 text-left transition-all group"
             >
                <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20">
                   <FileText className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                   <div className="text-sm font-semibold">Write Post</div>
                   <div className="text-xs text-muted-foreground">Create a new blog story</div>
                </div>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
