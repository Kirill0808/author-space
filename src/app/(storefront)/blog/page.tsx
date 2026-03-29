import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PostCard } from "@/components/blog/post-card"
import { Post } from "@prisma/client"

export const metadata: Metadata = {
  title: "Blog | Author Space",
  description: "Read the latest thoughts, updates, and articles from the author.",
}

export default async function BlogPage() {
  let posts: Post[] = []

  try {
    posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error("Failed to fetch blog posts:", error)
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl lg:max-w-4xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Author&apos;s <span className="text-primary italic">Blog</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Latest updates, writing journey, and random thoughts.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-muted">
          <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
          <p className="text-muted-foreground">
            There are no published blog posts at the moment. Check back later!
          </p>
        </div>
      )}
    </div>
  )
}
