"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions/auth"
import { User, LogOut, Settings, User as UserIcon, LayoutDashboard } from "lucide-react"

interface StorefrontAuthProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export function StorefrontAuth({ user }: StorefrontAuthProps) {
  if (user) {
    const initials = user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : user.email?.[0].toUpperCase() || "U"

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="relative h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" sideOffset={10}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile" className="flex w-full items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="flex w-full items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          {user.role === "ADMIN" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-medium text-primary focus:bg-primary/5 focus:text-primary">
                <Link href="/admin" className="flex w-full items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Link 
      href="/auth/signin" 
      className={buttonVariants({ variant: "default", size: "sm" })}
    >
      Sign in
    </Link>
  )
}
