import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`

export const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})
