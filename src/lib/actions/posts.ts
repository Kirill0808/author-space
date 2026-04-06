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
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a post")
  }
  
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
  await prisma.post.update({
    where: { id },
    data,
  })
  
  revalidatePath("/admin/posts")
  revalidatePath(`/blog/${data.slug}`)
  revalidatePath("/blog")
}

export async function deletePost(id: string) {
  await prisma.post.delete({
    where: { id },
  })
  
  revalidatePath("/admin/posts")
  revalidatePath("/blog")
}

export async function togglePublishPost(id: string, published: boolean) {
  await prisma.post.update({
    where: { id },
    data: { published },
  })
  
  revalidatePath("/admin/posts")
  revalidatePath("/blog")
}
