import Link from "next/link"
import { Post } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

import { formatDate } from "@/lib/utils"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <Card className="h-full flex flex-col border-none shadow-none bg-background/50 hover:bg-background transition-colors p-6 rounded-2xl group-hover:ring-1 ring-primary/20 ring-inset">
        <div className="text-xs text-muted-foreground mb-3 flex items-center justify-between">
          <span>{formatDate(post.createdAt)}</span>
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
  )
}
