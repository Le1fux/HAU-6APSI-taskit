import { buildReviewer } from '../utils/buildReviewer.js'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const mockMaterials = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    content: 'Review variables, data types, functions, conditionals, and loops. Practice how values move through a program and how functions organize reusable logic.',
    uploaded_at: '2026-09-27T00:00:00.000Z',
  },
  {
    id: 'data-structures',
    title: 'Data Structures and Algorithms',
    content: 'Study arrays, linked lists, stacks, queues, and hash maps. Compare common search and sort algorithms by their behavior and time complexity.',
    uploaded_at: '2026-09-26T00:00:00.000Z',
  },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

function findMockMaterial(id) {
  return mockMaterials.find((material) => String(material.id) === String(id))
}

function createMockId(title) {
  const baseId = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'material'
  let id = baseId
  let suffix = 2
  while (findMockMaterial(id)) id = `${baseId}-${suffix++}`
  return id
}

async function mockGetAll() {
  await delay()
  return mockMaterials.slice().sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at))
}

async function mockGetById(id) {
  await delay()
  const material = findMockMaterial(id)
  if (!material) throw new Error('Material not found')
  return { ...material }
}

async function mockCreate({ title, content }) {
  await delay()
  const material = {
    id: createMockId(title),
    title,
    content: content ?? '',
    uploaded_at: new Date().toISOString(),
  }
  mockMaterials.unshift(material)
  return { ...material }
}

async function mockUpdate(id, { title, content }) {
  await delay()
  const index = mockMaterials.findIndex((material) => String(material.id) === String(id))
  if (index === -1) throw new Error('Material not found')
  mockMaterials[index] = { ...mockMaterials[index], title, content: content ?? '' }
  return { ...mockMaterials[index] }
}

async function mockRemove(id) {
  await delay()
  const index = mockMaterials.findIndex((material) => String(material.id) === String(id))
  if (index === -1) throw new Error('Material not found')
  mockMaterials.splice(index, 1)
}

// Uses the local builder after the same short delay as other mock operations.
async function mockGenerateReviewer(content, fileName) {
  await delay()
  const reviewer = buildReviewer(content, fileName)
  if (reviewer.error) {
    throw new Error("This PDF doesn't have enough readable content.")
  }
  return reviewer
}

// Requests a reviewer and converts expected API errors into user-safe messages.
async function requestReviewer(content) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/reviewer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
  } catch {
    const error = new Error('We could not reach the reviewer service. Please retry.')
    error.isReviewerError = true
    throw error
  }

  if (!response.ok) {
    let body = null
    try {
      body = await response.json()
    } catch {
      // Preserve a friendly status-based message when the response is not JSON.
    }

    let message = 'We could not generate your reviewer. Please retry.'
    if (response.status === 422) {
      message = "This PDF doesn't have enough readable content."
    } else if (body?.code === 'ANTHROPIC_API_KEY_MISSING') {
      message = 'API Key Missing: add ANTHROPIC_API_KEY to the server environment.'
    } else if (body?.code === 'ANTHROPIC_AUTHENTICATION_FAILED') {
      message = 'Authentication Failed: check the Anthropic API key configuration.'
    } else if (typeof body?.message === 'string') {
      message = body.message
    } else if (typeof body?.error === 'string' && body.error !== body.code) {
      message = body.error
    }

    const error = new Error(message)
    error.code = body?.code
    error.isReviewerError = true
    throw error
  }

  return response.json()
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/materials${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      if (body.error) message = body.error
    } catch {
      // Keep the status-based message when the response is not JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return undefined
  return response.json()
}

export function getAll() {
  return USE_MOCK_API ? mockGetAll() : request('')
}

export function getById(id) {
  return USE_MOCK_API ? mockGetById(id) : request(`/${encodeURIComponent(id)}`)
}

export function create({ title, content }) {
  return USE_MOCK_API
    ? mockCreate({ title, content })
    : request('', { method: 'POST', body: JSON.stringify({ title, content }) })
}

export function update(id, { title, content }) {
  return USE_MOCK_API
    ? mockUpdate(id, { title, content })
    : request(`/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
      })
}

export function remove(id) {
  return USE_MOCK_API
    ? mockRemove(id)
    : request(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function generateReviewer(content, fileName) {
  return USE_MOCK_API ? mockGenerateReviewer(content, fileName) : requestReviewer(content)
}