import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MailIcon, ShieldCheckIcon, UserIcon } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = session.user
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() || "?"

  const createdAtDate = user.createdAt ? new Date(user.createdAt as string).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }) : "Неизвестно"

  return (
    <div className="container max-w-4xl py-12 lg:py-20 animate-in fade-in duration-500">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Личный кабинет</h1>
          <p className="text-muted-foreground">Управляйте своим профилем и настройками аккаунта.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Основная инфо-карточка */}
          <Card className="md:col-span-8 overflow-hidden border-border/50 bg-secondary/10 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-border/50 bg-secondary/20">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/20 p-1 bg-background">
                  <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                  <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-2xl">{user.name || "Пользователь"}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1">
                    <MailIcon className="h-3.5 w-3.5" />
                    {user.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2">
                    <ShieldCheckIcon className="h-3 w-3" />
                    Роль аккаунта
                  </div>
                  <div className="pt-1">
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="rounded-md">
                      {user.role || "USER"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" />
                    Дата регистрации
                  </div>
                  <div className="text-sm font-semibold pt-1">
                    {createdAtDate}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Button variant="default" size="sm">
                  Редактировать профиль
                </Button>
                <Button variant="outline" size="sm">
                  Изменить пароль
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Боковая карточка со статистикой или доп-инфо */}
          <Card className="md:col-span-4 border-border/50 h-fit">
            <CardHeader className="pb-3 text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Активность</CardTitle>
              <CardDescription>Статус вашего аккаунта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Статус</span>
                <span className="text-green-500 font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Активен
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">ID</span>
                <span className="text-xs font-mono">{user.id?.slice(0, 8)}...</span>
              </div>
              <p className="text-[10px] text-center text-muted-foreground pt-4 uppercase tracking-widest">
                ID клиента: {user.id}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
