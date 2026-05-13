import { z } from "zod"

export const bookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
})

export type BookFormData = z.infer<typeof bookSchema>

export const postSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  published: z.boolean().default(false),
})

export type PostFormData = z.infer<typeof postSchema>

export const profileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  image: z.string().url("Введите корректный URL изображения").optional().or(z.literal("")),
})

export type ProfileFormData = z.infer<typeof profileSchema>
 
export const orderItemSchema = z.object({
  bookId: z.string().cuid(),
  quantity: z.number().int().positive(),
  priceAtPurchase: z.number().int().positive(),
})

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  totalAmount: z.number().int().positive(),
})

export type OrderData = z.infer<typeof orderSchema>
