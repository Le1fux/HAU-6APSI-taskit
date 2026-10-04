import pg from 'pg'

let pool

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL not set: database routes disabled, reviewer and health routes available.')
  pool = {
    query() {
      const error = new Error('Database not configured')
      error.code = 'DB_NOT_CONFIGURED'
      error.status = 503
      return Promise.reject(error)
    },
  }
} else {
  // A local PostgreSQL has no TLS configured. Managed hosts require TLS.
  const isLocal =
    process.env.DATABASE_URL.includes('localhost') ||
    process.env.DATABASE_URL.includes('127.0.0.1')

  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
  })

  pool.on('error', (error) => {
    console.error('Unexpected database pool error:', error.message)
  })
}

export { pool }
