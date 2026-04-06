import { z } from "zod"

export const bookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
})

export type BookFormData = z.infer<typeof bookSchema>
