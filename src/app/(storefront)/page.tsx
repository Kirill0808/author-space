import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Newspaper, ArrowRight } from "lucide-react"

import { Book, Post } from "@prisma/client"

export default async function Home() {
  let featuredBooks: Book[] = []
  let latestPosts: Post[] = []

  try {
    const [books, posts] = await Promise.all([
      prisma.book.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.findMany({
        where: { published: true },
        take: 2,
        orderBy: { createdAt: 'desc' }
      })
    ])
    featuredBooks = books
    latestPosts = posts
  } catch (error) {
    console.error("Failed to fetch data for Home page:", error)
  }

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/30 py-24 sm:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Escape into a <span className="text-primary italic">New World</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Discover captivating stories, insightful blog posts, and the latest releases from an author dedicated to the craft of storytelling.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link 
                href="/books" 
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
              >
                Explore My Books
              </Link>
              <Link 
                href="/blog" 
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-full px-8 group")}
              >
                Read My Blog <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
        {/* Subtle decorative background */}
        <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-80 lg:left-1/2 lg:translate-x-0">
          <div className="absolute inset-0 bg-primary/5 opacity-40 blur-3xl"></div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Books</h2>
            <p className="text-muted-foreground mt-2">Latest releases and reader favorites.</p>
          </div>
          <Link 
            href="/books" 
            className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto flex items-center text-primary")}
          >
            View all books <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden flex flex-col group border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                {book.coverImage ? (
                  <Image 
                    src={book.coverImage} 
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 opacity-20" />
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="font-normal">New Release</Badge>
                  <span className="text-lg font-semibold">${(book.price / 100).toFixed(2)}</span>
                </div>
                <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                <CardDescription className="line-clamp-2">{book.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {/* Additional content could go here */}
              </CardContent>
              <CardFooter className="pt-0 pb-6 pr-6 pl-6">
                <Link 
                  href={`/books/${book.slug}`}
                  className={cn(buttonVariants({ variant: "default" }), "w-full rounded-lg")}
                >
                  Learn More
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col gap-12 bg-muted/20 rounded-3xl p-8 sm:p-12 lg:flex-row items-center border border-muted/50">
          <div className="lg:w-1/3">
            <Badge className="mb-4">From the Blog</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Latest Insights</h2>
            <p className="text-muted-foreground mb-8">Follow my journey as a writer, learn about character building, plot development, and more.</p>
            <Link 
              href="/blog" 
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center")}
            >
              <Newspaper className="mr-2 h-4 w-4 text-primary" />
              Read all articles
            </Link>
          </div>
          
          <div className="lg:w-2/3 grid gap-6 sm:grid-cols-2 w-full">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                <Card className="h-full border-none shadow-none bg-background/50 hover:bg-background transition-colors p-6 rounded-2xl group-hover:ring-1 ring-primary/20 ring-inset">
                  <div className="text-xs text-muted-foreground mb-3 flex items-center justify-between">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {post.content}
                  </p>
                  <div className="text-primary text-sm font-semibold flex items-center mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </Card>
              </Link>
            ))}
            {latestPosts.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-background/50 rounded-2xl border border-dashed border-muted">
                No articles yet. Stay tuned!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter / Simple Signup */}
      <section className="container mx-auto px-4">
        <div className="relative isolate overflow-hidden bg-primary px-6 py-16 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl italic">
            Get updates from the <span className="underline underline-offset-8">Author&apos;s Space</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
            Join the community and be the first to know about new books, upcoming events, and exclusive content.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="rounded-full bg-background text-primary hover:bg-background/90 font-bold px-8">
              Join Newsletter
            </Button>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx="512" cy="512" r="512" fill="url(#circle-gradient)" fillOpacity="0.2" />
            <defs>
              <radialGradient id="circle-gradient">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>
    </div>
  )
}
