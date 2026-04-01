import { auth } from "@/auth"

// Next.js 16 requires the export to be named 'proxy' (or default export)
// and handles the Auth.js v5 middleware convention under this new name.
export const proxy = auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
