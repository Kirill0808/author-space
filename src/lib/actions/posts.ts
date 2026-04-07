"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { postSchema, PostFormData } from "@/lib/schemas"
import { auth } from "@/auth"

export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function createPost(data: PostFormData) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage posts")
  }

  // Validate on server
  postSchema.parse(data)
  
  await prisma.post.create({
    data: {
      ...data,
      authorId: session.user.id,
    },
  })
  
  revalidatePath("/admin/posts")
  revalidatePath("/blog")
}

export async function updatePost(id: string, data: PostFormData) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage posts")
  }

  // Validate on server
  postSchema.parse(data)

  // Get the current post to check for slug change
  const currentPost = await prisma.post.findUnique({
    where: { id },
    select: { slug: true }
  })

  await prisma.post.update({
    where: { id },
    data,
  })
  
  revalidatePath("/admin/posts")
  revalidatePath(`/blog/${data.slug}`)
  if (currentPost && currentPost.slug !== data.slug) {
    revalidatePath(`/blog/${currentPost.slug}`)
  }
  revalidatePath("/blog")
}

export async function deletePost(id: string) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage posts")
  }

  await prisma.post.delete({
    where: { id },
  })
  
  revalidatePath("/admin/posts")
  revalidatePath("/blog")
}

export async function togglePublishPost(id: string, published: boolean) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage posts")
  }

  await prisma.post.update({
    where: { id },
    data: { published },
  })
  
  revalidatePath("/admin/posts")
  revalidatePath("/blog")
}
