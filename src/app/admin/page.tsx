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

  // Recent activity (mock data for now or fetch from DB)
  const recentActivities = [
    { id: 1, type: "book", message: "New book 'The Infinite Loop' added", time: "2 hours ago" },
    { id: 2, type: "post", message: "Published blog post 'Building with Next.js'", time: "5 hours ago" },
    { id: 3, type: "user", message: "New user registered: alex@example.com", time: "Yesterday" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}. Here's what's happening on your site today.
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
               {recentActivities.map((activity) => (
                 <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/40 hover:bg-secondary/20 transition-colors">
                   <div className="bg-primary/5 p-2 rounded-full">
                     <Clock className="h-4 w-4 text-primary" />
                   </div>
                   <div className="flex-1 space-y-0.5">
                     <p className="text-sm font-medium">{activity.message}</p>
                     <p className="text-xs text-muted-foreground">{activity.time}</p>
                   </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Info Sidebar */}
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
