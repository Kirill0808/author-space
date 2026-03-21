"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function StorefrontAuth({ hasUser }: { hasUser: boolean }) {
  if (hasUser) {
    return (
      <Link href="/api/auth/signout" className={buttonVariants({ variant: "outline" })}>
        Выйти
      </Link>
    )
  }
  return (
    <Link href="/api/auth/signin" className={buttonVariants({ variant: "default" })}>
      Войти
    </Link>
  )
}
