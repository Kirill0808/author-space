import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { PrismaClient } from '@prisma/client'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({
  host: 'aws-1-eu-west-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.pfwonkghmjqgernpkuwq',
  password: '?jd#quii4.BbL2G',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clear existing
  await prisma.order.deleteMany()
  await prisma.post.deleteMany()
  await prisma.book.deleteMany()
  await prisma.user.deleteMany()

  // Create an admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    },
  })

  // Create mock books
  await prisma.book.create({
    data: {
      title: 'The Art of Writing',
      description: 'A comprehensive guide to writing books.',
      price: 1999, // $19.99
      slug: 'the-art-of-writing',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop',
    },
  })

  await prisma.book.create({
    data: {
      title: 'Journey to the Stars',
      description: 'A sci-fi novel about space exploration.',
      price: 1499, // $14.99
      slug: 'journey-to-the-stars',
      coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2940&auto=format&fit=crop',
    },
  })

  // Create mock posts
  await prisma.post.create({
    data: {
      title: 'Welcome to My Author Site',
      slug: 'welcome-to-my-author-site',
      content: 'This is my first post! I am really excited to share my journey with you all.',
      published: true,
      authorId: admin.id,
    },
  })

  await prisma.post.create({
    data: {
      title: 'Writing Update: Chapter 5',
      slug: 'writing-update-chapter-5',
      content: 'I finally finished chapter 5 after weeks of outlining and drafting. It was a tough one!',
      published: true,
      authorId: admin.id,
    },
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
