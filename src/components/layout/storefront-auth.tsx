"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function StorefrontAuth({ hasUser }: { hasUser: boolean }) {
  if (hasUser) {
    return (
      <Link href="/api/auth/signout" className={buttonVariants({ variant: "outline" })}>
        Sign out
      </Link>
    )
  }
  return (
    <Link href="/api/auth/signin" className={buttonVariants({ variant: "default" })}>
      Sign in
    </Link>
  )
}
