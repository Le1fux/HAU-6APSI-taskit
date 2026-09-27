const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const mockMaterials = [
  {
    id: 'biology',
    title: 'Cell Biology',
    content: 'Review the structure and function of cells, including organelles, membranes, and cellular processes.',
    uploaded_at: '2026-09-27T00:00:00.000Z',
  },
  {
    id: 'history',
    title: 'World War II',
    content: 'Study the major events, turning points, and lasting effects of World War II.',
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