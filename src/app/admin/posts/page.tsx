import { getPosts } from "@/lib/actions/posts"
import { PostsTableClient } from "@/components/admin/posts-table-client"

export default async function AdminPostsPage() {
  const posts = await getPosts()

  return <PostsTableClient posts={posts} />
}
