import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, User, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!post || !post.published) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Author Space Blog`,
    description: post.content.substring(0, 160),
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params

  const post = await prisma.post.findUnique({
    where: {
      slug: resolvedParams.slug,
    },
  })

  // If post wasn't found or isn't published, throw 404
  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-3xl">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "mb-8 -ml-4 text-muted-foreground hover:text-foreground"
        )}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blog
      </Link>

      <article>
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.createdAt.toISOString()}>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "long",
                }).format(post.createdAt)}
              </time>
            </div>
          </div>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
          {/* using whitespace-pre-wrap so that simple line breaks in raw text are rendered as new lines */}
          <div className="whitespace-pre-wrap leading-relaxed text-lg text-foreground/90">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  )
}
