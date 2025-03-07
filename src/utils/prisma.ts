import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import { isProd } from './helpers'

let adapter: PrismaLibSQL | null = null

if (isProd) {
    const libsql = createClient({
        url: `${process.env.TURSO_DATABASE_URL}`,
        authToken: `${process.env.TURSO_AUTH_TOKEN}`,
    })

    adapter = new PrismaLibSQL(libsql)
}

export const prisma = isProd && adapter ? new PrismaClient({ adapter }) : new PrismaClient()
