import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as materials from './materialsRepo.js'

const app = express()

// CORS before the routes. Middleware registered after a route never sees that
// route's requests, which is the m4 lesson showing up in production.
//
// Name your origins. app.use(cors()) with no options sends
// Access-Control-Allow-Origin: *, which lets any site on the internet call this
// API from a visitor's browser, and is incompatible with cookies.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Is the process alive?
app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

// Is the database reachable? A different question, and the one that tells you
// in two seconds which half of a problem you have.
app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

// Validation lives on the server because the client can be bypassed. The
// browser form is for a fast, friendly message; this is for correctness.
function validate(body) {
  const errors = []
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const content = typeof body.content === 'string' ? body.content.trim() : ''

  if (!title) errors.push('title is required')
  if (title.length > 200) errors.push('title must be 200 characters or fewer')
  if (content.length > 10000) errors.push('content must be 10000 characters or fewer')

  return { errors, value: { title, content } }
}

app.get('/api/materials', async (request, response, next) => {
  try {
    response.json(await materials.getAll(pool))
  } catch (error) {
    next(error)
  }
})

app.get('/api/materials/:id', async (request, response, next) => {
  try {
    const material = await materials.getById(pool, request.params.id)
    if (!material) return response.status(404).json({ error: 'Not found' })
    response.json(material)
  } catch (error) {
    next(error)
  }
})

app.post('/api/materials', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    response.status(201).json(await materials.create(pool, value))
  } catch (error) {
    next(error)
  }
})

app.put('/api/materials/:id', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    const material = await materials.update(pool, request.params.id, value)
    if (!material) return response.status(404).json({ error: 'Not found' })
    response.json(material)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/materials/:id', async (request, response, next) => {
  try {
    const removed = await materials.remove(pool, request.params.id)
    if (!removed) return response.status(404).json({ error: 'Not found' })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

// The detail goes in your logs; the visitor gets a plain message. Sending a
// stack trace to a stranger tells them about your file layout and dependencies.
app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

// The host chooses the port and tells you through PORT. Hardcoding 3000 is the
// commonest reason a first deploy is marked unhealthy and killed.
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})
