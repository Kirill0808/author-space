"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { PostForm } from "@/components/admin/post-form"
import { deletePost, togglePublishPost } from "@/lib/actions/posts"
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  createdAt: Date
}

interface PostsTableClientProps {
  posts: Post[]
}

export function PostsTableClient({ posts }: PostsTableClientProps) {
  const router = useRouter()
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingPost, setEditingPost] = React.useState<Post | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(id)
      router.refresh()
    }
  }

  const handleTogglePublish = async (id: string, published: boolean) => {
    await togglePublishPost(id, published)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content and publishing status.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "gap-2")}>
            <Plus className="h-4 w-4" />
            New Post
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Draft your title and content. You can publish it immediately or keep it as a draft.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto pr-2">
              <PostForm onSuccess={() => setIsAddOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No posts found. Start writing your first post!
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="group transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{post.title}</span>
                      <span className="text-xs text-muted-foreground font-mono">/{post.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={post.published ? "default" : "secondary"}
                      className={cn("gap-1 font-semibold")}
                    >
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleTogglePublish(post.id, !post.published)}
                        className="h-8 w-8 p-0"
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                        className="h-8 w-8 p-0"
                        title="View on site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingPost(post)}
                        className="h-8 w-8 p-0"
                        title="Edit post"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(post.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        title="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update your post content. Remember to keep the slug unique.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto pr-2">
            {editingPost && (
              <PostForm 
                initialData={{
                  ...editingPost,
                }} 
                onSuccess={() => {
                  setEditingPost(null)
                  router.refresh()
                }} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
