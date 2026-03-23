import * as dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { PrismaClient } from '@prisma/client'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const urlString = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!urlString) {
    console.warn("DATABASE_URL/DIRECT_URL not found. Prisma will not be able to connect.")
    return new PrismaClient()
  }

  try {
    const u = new URL(urlString)
    const pool = new Pool({
      host: u.hostname,
      port: u.port ? parseInt(u.port) : 5432,
      user: u.username,
      password: decodeURIComponent(u.password),
      database: u.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
    })
    const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0])
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error("Failed to initialize Prisma with adapter:", error)
    return new PrismaClient()
  }
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
