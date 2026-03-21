import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { PrismaClient } from '@prisma/client'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const u = new URL(process.env.DIRECT_URL!)
  const pool = new Pool({
    host: u.hostname,
    port: parseInt(u.port),
    user: u.username,
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    ssl: { rejectUnauthorized: false },
  })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg(pool as any)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
