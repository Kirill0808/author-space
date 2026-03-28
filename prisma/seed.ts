import * as dns from 'node:dns'
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
const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0])
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

  await prisma.book.create({
    data: {
      title: 'Echoes of Eternity',
      description: 'An epic fantasy novel tracing the journey of a young mage who must save the realm from an ancient curse.',
      price: 2999,
      slug: 'echoes-of-eternity',
      coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2588&auto=format&fit=crop',
    },
  })

  await prisma.book.create({
    data: {
      title: 'Digital Minimalism',
      description: 'In this timely and enlightening book, the author introduces a philosophy for technology use that has already improved countless lives. Discover how to reclaim your time!',
      price: 1850,
      slug: 'digital-minimalism',
      coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2712&auto=format&fit=crop',
    },
  })

  await prisma.book.create({
    data: {
      title: 'The Whispering Shadows',
      description: 'A terrifying psychological thriller about a detective investigating a series of inexplicable disappearances in a small coastal town.',
      price: 2490,
      slug: 'the-whispering-shadows',
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop',
    },
  })

  await prisma.book.create({
    data: {
      title: 'Mastering Next.js',
      description: 'The complete guide to building blazing fast React applications with Next.js 15, the App Router, and React Server Components.',
      price: 3499,
      slug: 'mastering-nextjs',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2940&auto=format&fit=crop',
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
