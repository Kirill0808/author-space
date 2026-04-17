"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { profileSchema, ProfileFormData } from "@/lib/schemas"
import { auth } from "@/auth"

export async function updateProfile(data: ProfileFormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be logged in to update your profile")
  }

  // Validate on server
  profileSchema.parse(data)

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      image: data.image || null,
    },
  })
  
  revalidatePath("/profile")
  revalidatePath("/settings")
  
  return { success: true }
}
