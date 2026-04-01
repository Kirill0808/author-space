import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect("/auth/signin")

  return (
    <div className="container py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Settings</h1>
      <p className="text-muted-foreground">Account and application management coming soon.</p>
    </div>
  )
}
