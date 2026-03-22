import Link from "next/link"

export function StorefrontFooter() {
  return (
    <footer className="border-t py-6 md:py-0 bg-muted/20">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <p className="text-sm leading-loose text-muted-foreground">
            Built for the Author Space platform.
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Author Name. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:underline underline-offset-4">Terms</Link>
          <Link href="#" className="hover:underline underline-offset-4">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
