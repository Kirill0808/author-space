import { getPosts } from "@/lib/actions/posts"
import { PostsTableClient } from "@/components/admin/posts-table-client"

export default async function AdminPostsPage() {
  const posts = await getPosts()

  return (
    <div className="container py-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      <PostsTableClient posts={posts} />
    </div>
  )
}
