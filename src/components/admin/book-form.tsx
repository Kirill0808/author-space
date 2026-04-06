"use client"

import * as React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { slugify } from "@/lib/utils"
import { createBook, updateBook } from "@/lib/actions/books"
import { bookSchema, BookFormData } from "@/lib/schemas"

interface BookFormProps {
  initialData?: BookFormData & { id: string }
  onSuccess?: () => void
}

export function BookForm({ initialData, onSuccess }: BookFormProps) {
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema) as any,
    defaultValues: initialData 
      ? {
          ...initialData,
          price: initialData.price / 100, // Convert cents back to dollars for the form
        }
      : {
          title: "",
          description: "",
          price: 0,
          coverImage: "",
          slug: "",
        },
  })

  // Auto-generate slug from title
  const title = watch("title")
  React.useEffect(() => {
    if (!initialData && title) {
      setValue("slug", slugify(title))
    }
  }, [title, setValue, initialData])

  const onSubmit: SubmitHandler<BookFormData> = async (data) => {
    setIsPending(true)
    try {
      if (initialData) {
        await updateBook(initialData.id, data)
      } else {
        await createBook(data)
      }
      onSuccess?.()
    } catch (error) {
      console.error("Failed to save book:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input {...register("title")} placeholder="Book title" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Slug</label>
        <Input {...register("slug")} placeholder="book-url-slug" />
        {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price (USD)</label>
        <Input {...register("price")} type="number" step="0.01" placeholder="19.99" />
        {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Image URL</label>
        <Input {...register("coverImage")} placeholder="https://example.com/image.jpg" />
        {errors.coverImage && <p className="text-xs text-destructive">{errors.coverImage.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea {...register("description")} placeholder="Describe the book..." className="min-h-[100px]" />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Update Book" : "Create Book"}
        </Button>
      </div>
    </form>
  )
}
