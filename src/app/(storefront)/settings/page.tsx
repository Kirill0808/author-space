"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileFormData } from "@/lib/schemas"
import { updateProfile } from "@/lib/actions/user"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [isPending, setIsPending] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      image: session?.user?.image || "",
    },
  })

  // Update form defaults when session loads
  React.useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        image: session.user.image || "",
      })
    }
  }, [session, form])

  async function onSubmit(data: ProfileFormData) {
    setIsPending(true)
    setMessage(null)
    
    try {
      await updateProfile(data)
      // Update the local session to reflect changes immediately
      await update()
      setMessage({ type: "success", text: "Профиль успешно обновлен!" })
    } catch (error) {
      setMessage({ type: "error", text: "Произошла ошибка при обновлении профиля." })
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  if (!session) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Загрузка данных пользователя...</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center w-full py-12 lg:py-20 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Настройки</h1>
          <p className="text-muted-foreground">Управление вашим аккаунтом и личными данными.</p>
        </div>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Личные данные</CardTitle>
            <CardDescription>Измените свое имя и аватар, чтобы другие видели актуальную информацию.</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Имя
                </label>
                <Input
                  {...form.register("name")}
                  placeholder="Ваше имя"
                  disabled={isPending}
                />
                {form.formState.errors.name && (
                  <p className="text-xs font-medium text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none opacity-70">
                  Email (только для чтения)
                </label>
                <Input
                  value={session.user?.email || ""}
                  disabled
                  className="bg-secondary/50"
                />
                <p className="text-[10px] text-muted-foreground">
                  Email привязан к вашей учетной записи {session.user?.email?.includes("gmail") ? "Google" : "провайдера"}.
                </p>
              </div>

              {/* Avatar Image URL Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Ссылка на изображение профиля
                </label>
                <Input
                  {...form.register("image")}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isPending}
                />
                {form.formState.errors.image && (
                  <p className="text-xs font-medium text-destructive">
                    {form.formState.errors.image.message}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground">
                  Используйте URL изображения для изменения аватара.
                </p>
              </div>

              {/* Status Message */}
              {message && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  message.type === "success" 
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}>
                  {message.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {message.text}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-border/50 bg-secondary/10 px-6 py-4">
              <Button type="submit" disabled={isPending} className="ml-auto">
                {isPending ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
