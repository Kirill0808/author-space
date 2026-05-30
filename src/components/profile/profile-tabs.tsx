"use client"

import * as React from "react"
import Link from "next/link"
import { 
  User as UserIcon, 
  BookOpen, 
  ShoppingBag, 
  MailIcon, 
  ShieldCheckIcon, 
  CalendarIcon, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  Download,
  BookOpenCheck
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn, formatDate } from "@/lib/utils"

export interface PurchasedBook {
  id: string
  title: string
  description: string
  price: number
  coverImage: string | null
  slug: string
  createdAt: Date
}

export interface ProfileOrder {
  id: string
  totalAmount: number
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  createdAt: Date
  items: {
    id: string
    quantity: number
    priceAtPurchase: number
    book: {
      id: string
      title: string
      coverImage: string | null
      slug: string
    }
  }[]
}

interface ProfileTabsProps {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    createdAt: Date
  }
  orders: ProfileOrder[]
  purchasedBooks: PurchasedBook[]
}

export function ProfileTabs({ user, orders, purchasedBooks }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"profile" | "library" | "orders">("profile")

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() || "?"

  const createdAtDate = new Date(user.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100)
  }

  const getOrderStatusBadgeVariant = (status: ProfileOrder["status"]) => {
    switch (status) {
      case "DELIVERED": return "default"
      case "PAID": return "secondary"
      case "SHIPPED": return "outline"
      case "CANCELLED": return "destructive"
      default: return "outline"
    }
  }

  const getOrderStatusText = (status: ProfileOrder["status"]) => {
    switch (status) {
      case "PENDING": return "В обработке"
      case "PAID": return "Оплачен"
      case "SHIPPED": return "Отправлен"
      case "DELIVERED": return "Доставлен"
      case "CANCELLED": return "Отменен"
      default: return status
    }
  }

  const handleDownloadMock = (bookTitle: string) => {
    alert(`Имитация загрузки: книга "${bookTitle}" подготавливается к скачиванию в формате EPUB/PDF.`)
  }

  return (
    <div className="w-full max-w-5xl px-4 flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header Profile Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Личный кабинет
          </h1>
          <p className="text-muted-foreground mt-1">Добро пожаловать назад, {user.name || "Пользователь"}!</p>
        </div>
        
        {/* Navigation Tabs Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/30 border border-border/40 backdrop-blur-md self-start md:self-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer",
              activeTab === "profile" 
                ? "bg-background text-foreground shadow-sm border border-border/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UserIcon className="h-4 w-4" />
            Профиль
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer",
              activeTab === "library" 
                ? "bg-background text-foreground shadow-sm border border-border/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Библиотека
            {purchasedBooks.length > 0 && (
              <span className="ml-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                {purchasedBooks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer",
              activeTab === "orders" 
                ? "bg-background text-foreground shadow-sm border border-border/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            Заказы
            {orders.length > 0 && (
              <span className="ml-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                {orders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="grid gap-6">
        
        {/* Tab 1: Profile Summary */}
        {activeTab === "profile" && (
          <div className="grid gap-6 md:grid-cols-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Main Profile Info */}
            <Card className="md:col-span-8 overflow-hidden border-border/50 bg-secondary/5 backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-6 border-b border-border/40 bg-secondary/15">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <Avatar className="h-24 w-24 border-2 border-primary/20 p-1 bg-background shadow-md">
                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                    <AvatarFallback className="text-2xl font-bold bg-secondary/50 text-foreground">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center sm:pt-2">
                    <CardTitle className="text-3xl font-extrabold">{user.name || "Пользователь"}</CardTitle>
                    <CardDescription className="flex items-center justify-center sm:justify-start gap-1.5 mt-1.5 text-sm font-medium">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl border border-border/50 bg-background/40 space-y-1.5 hover:border-primary/20 transition-colors">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-primary" />
                      Роль аккаунта
                    </div>
                    <div className="pt-1">
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="rounded-md font-semibold px-2.5 py-0.5">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-background/40 space-y-1.5 hover:border-primary/20 transition-colors">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                      Дата регистрации
                    </div>
                    <div className="text-sm font-bold pt-1.5 text-foreground">
                      {createdAtDate}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex flex-wrap gap-3">
                  <Link 
                    href="/settings" 
                    className={cn(buttonVariants({ variant: "default", size: "sm" }), "font-semibold shadow-sm")}
                  >
                    Редактировать профиль
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link 
                      href="/admin" 
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "font-semibold border-primary/20 text-primary hover:bg-primary/5")}
                    >
                      Панель администратора
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Sidebar Card */}
            <Card className="md:col-span-4 border-border/50 bg-secondary/5 h-fit shadow-sm">
              <CardHeader className="pb-3 text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3 text-primary border border-primary/20">
                  <UserIcon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">Ваша активность</CardTitle>
                <CardDescription>Сводка ваших покупок</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2.5 border-b border-border/40 text-sm">
                  <span className="text-muted-foreground font-medium">Статус аккаунта</span>
                  <span className="text-green-500 font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Активен
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-border/40 text-sm">
                  <span className="text-muted-foreground font-medium">Куплено книг</span>
                  <Badge variant="outline" className="font-bold text-primary border-primary/20 bg-primary/5">
                    {purchasedBooks.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-border/40 text-sm">
                  <span className="text-muted-foreground font-medium">Всего заказов</span>
                  <Badge variant="outline" className="font-bold border-muted text-muted-foreground">
                    {orders.length}
                  </Badge>
                </div>
                
                <div className="pt-4">
                  <p className="text-[10px] text-center text-muted-foreground/80 font-mono tracking-wider break-all">
                    USER_ID: {user.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Purchased Books Library */}
        {activeTab === "library" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {purchasedBooks.length === 0 ? (
              <Card className="border-border/50 bg-secondary/5 py-16 text-center shadow-sm">
                <CardContent className="flex flex-col items-center justify-center gap-5 max-w-md mx-auto">
                  <div className="bg-primary/10 p-5 rounded-full border border-primary/20 text-primary animate-bounce">
                    <BookOpenCheck className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Ваша библиотека пуста</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Вы еще не приобрели ни одной книги. Откройте наш каталог и выберите свою первую историю прямо сейчас!
                    </p>
                  </div>
                  <Link 
                    href="/books" 
                    className={cn(buttonVariants({ variant: "default" }), "mt-2 font-semibold flex items-center gap-2")}
                  >
                    Перейти в каталог
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {purchasedBooks.map((book) => (
                  <Card key={book.id} className="group overflow-hidden border-border/50 bg-card hover:bg-secondary/5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col">
                    {/* Cover image wrap */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted border-b border-border/40 shrink-0">
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-secondary/30 text-muted-foreground">
                          <BookOpen className="h-12 w-12 opacity-30" />
                        </div>
                      )}
                      
                      {/* Premium Cover Overlay Tag */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-emerald-500/90 text-white border-0 hover:bg-emerald-500 font-semibold flex items-center gap-1">
                          Куплено
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Book Text Info */}
                    <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5">
                        <Link href={`/books/${book.slug}`} className="hover:text-primary transition-colors block">
                          <h4 className="font-extrabold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {book.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {book.description}
                        </p>
                      </div>
                      
                      {/* Interaction Buttons */}
                      <div className="pt-2 border-t border-border/40 flex items-center gap-2">
                        <Link 
                          href={`/books/${book.slug}`} 
                          className={cn(buttonVariants({ variant: "default", size: "sm" }), "flex-1 font-semibold text-xs text-center")}
                        >
                          Открыть страницу
                        </Link>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownloadMock(book.title)}
                          className="shrink-0 p-2 border border-border/50 bg-secondary hover:bg-secondary/80"
                          title="Скачать файлы книги"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Order History */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {orders.length === 0 ? (
              <Card className="border-border/50 bg-secondary/5 py-16 text-center shadow-sm">
                <CardContent className="flex flex-col items-center justify-center gap-5 max-w-md mx-auto">
                  <div className="bg-muted p-5 rounded-full text-muted-foreground border border-border/50">
                    <ShoppingBag className="h-10 w-10 opacity-40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Заказов пока нет</h3>
                    <p className="text-muted-foreground text-sm">
                      Вы еще не совершали покупок в нашем магазине.
                    </p>
                  </div>
                  <Link 
                    href="/books" 
                    className={cn(buttonVariants({ variant: "outline" }), "mt-2 font-semibold")}
                  >
                    Выбрать книгу
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id} className="border-border/50 overflow-hidden shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300">
                    {/* Order summary header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border/40 bg-secondary/10">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span className="font-mono font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded text-xs uppercase">
                          ID: #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-foreground">
                          {formatPrice(order.totalAmount)}
                        </span>
                        <Badge variant={getOrderStatusBadgeVariant(order.status)} className="font-semibold px-2.5 py-0.5">
                          {getOrderStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Order items details */}
                    <CardContent className="p-5">
                      <div className="divide-y divide-border/40">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                            {/* Small cover thumb */}
                            <div className="h-14 w-11 rounded bg-secondary/30 border border-border/50 overflow-hidden shrink-0 flex items-center justify-center relative">
                              {item.book.coverImage ? (
                                <img 
                                  src={item.book.coverImage} 
                                  alt={item.book.title} 
                                  className="object-cover h-full w-full" 
                                />
                              ) : (
                                <BookOpen className="h-5 w-5 text-muted-foreground/40" />
                              )}
                            </div>
                            
                            {/* Book Title, price, quantity */}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-sm truncate hover:text-primary transition-colors">
                                <Link href={`/books/${item.book.slug}`}>
                                  {item.book.title}
                                </Link>
                              </h5>
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                                <span>Цена: {formatPrice(item.priceAtPurchase)}</span>
                                <span className="h-1 w-1 rounded-full bg-border" />
                                <span>Кол-во: {item.quantity} шт.</span>
                              </p>
                            </div>
                            
                            {/* Row Total */}
                            <div className="text-sm font-semibold text-right shrink-0">
                              {formatPrice(item.priceAtPurchase * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
