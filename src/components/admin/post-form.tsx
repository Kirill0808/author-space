"use client"

import * as React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { slugify } from "@/lib/utils"
import { postSchema, PostFormData } from "@/lib/schemas"
import { createPost, updatePost } from "@/lib/actions/posts"

interface PostFormProps {
  initialData?: PostFormData & { id: string }
  onSuccess?: () => void
}

export function PostForm({ initialData, onSuccess }: PostFormProps) {
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: initialData || {
      title: "",
      slug: "",
      content: "",
      published: false,
    },
  })

  // Auto-generate slug from title
  const title = watch("title")
  React.useEffect(() => {
    if (!initialData && title) {
      setValue("slug", slugify(title))
    }
  }, [title, setValue, initialData])

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    setIsPending(true)
    try {
      if (initialData) {
        await updatePost(initialData.id, data)
      } else {
        await createPost(data)
      }
      onSuccess?.()
    } catch (error) {
      console.error("Failed to save post:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input {...register("title")} placeholder="Post title" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Slug</label>
        <Input {...register("slug")} placeholder="post-url-slug" />
        {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <Textarea 
          {...register("content")} 
          placeholder="Write your post content here..." 
          className="min-h-[300px] font-sans leading-relaxed" 
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input 
          type="checkbox" 
          id="published" 
          {...register("published")} 
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="published" className="text-sm font-medium cursor-pointer select-none">
          Publish immediately
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  )
}
