import 'dotenv/config'
import pg from 'pg'

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    // Render requires SSL; a local Postgres (used for development) does not
    ssl: ['localhost', '127.0.0.1'].includes(process.env.PGHOST)
        ? false
        : { rejectUnauthorized: false }
}

export const pool = new pg.Pool(config)
