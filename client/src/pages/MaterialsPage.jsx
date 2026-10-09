import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import UploadForm from '../components/UploadForm.jsx'
import { getAll } from '../api/materials.js'

// Shows saved materials and accepts new PDF uploads.
export default function MaterialsPage({ uploadedMaterials = [], onReviewerCreated }) {
  const [savedMaterials, setSavedMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  // Loads the existing material list from the current data source.
  async function loadMaterials() {
    setLoading(true)
    setError('')
    try {
      setSavedMaterials(await getAll())
    } catch {
      setError('Saved materials could not be loaded. Your uploaded materials are still available.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMaterials()
  }, [])

  const materials = [...uploadedMaterials, ...savedMaterials]
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const visibleMaterials = materials
    .filter((material) => `${material.title} ${material.content || ''}`.toLowerCase().includes(normalizedQuery))
    .sort((left, right) => {
      if (sortBy === 'title') return left.title.localeCompare(right.title)
      const leftDate = Date.parse(left.uploadedAt || left.uploaded_at || '') || 0
      const rightDate = Date.parse(right.uploadedAt || right.uploaded_at || '') || 0
      return sortBy === 'oldest' ? leftDate - rightDate : rightDate - leftDate
    })

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-small font-bold uppercase tracking-[0.18em] text-primary">Your study space</p>
        <h1 className="text-heading tracking-tight text-text">Make learning stick.</h1>
        <p className="mt-4 text-body text-slate-500">Turn your notes into focused practice. Choose a material to keep going or start something new.</p>
      </div>

      <section className="mb-12 rounded-2xl bg-primary p-6 text-white shadow-soft sm:p-8" aria-labelledby="create-heading">
        <h2 id="create-heading" className="mb-4 text-2xl font-bold">Upload study notes</h2>
        <UploadForm onReviewerCreated={onReviewerCreated} />
      </section>

      <section aria-labelledby="materials-heading">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="materials-heading" className="text-xl font-bold text-text">Your library</h2>
          {!loading && !error && <span className="text-small text-slate-400">{visibleMaterials.length} of {materials.length} materials</span>}
        </div>
        {!loading && !error && materials.length > 0 && <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
          <label>
            <span className="sr-only">Search your library</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search titles and notes"
              className="w-full rounded-lg border border-text/20 bg-surface px-4 py-3 text-small text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-text/20 bg-surface px-3 text-small text-text/70">
            <span className="shrink-0">Sort</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-3 font-bold text-text outline-none"
            >
              <option value="recent">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
            </select>
          </label>
        </div>}
        {loading && <p className="text-text/70" role="status">Loading saved materials...</p>}
        {!loading && error && <div className="mb-tight flex flex-wrap items-center gap-tight"><p className="text-small" role="alert">{error}</p><Button variant="secondary" onClick={loadMaterials}>Retry</Button></div>}
        {!loading && !error && materials.length === 0 && <p className="text-slate-500">No materials yet. Create your first one above.</p>}
        {!loading && materials.length > 0 && visibleMaterials.length === 0 && <div className="rounded-lg border border-dashed border-text/20 px-5 py-8 text-center">
          <p className="text-text/70">No materials match “{searchQuery}”.</p>
          <button type="button" onClick={() => setSearchQuery('')} className="mt-3 text-small font-bold text-primary hover:underline">Clear search</button>
        </div>}
        {!loading && visibleMaterials.length > 0 && <div className="grid gap-4 md:grid-cols-2">
          {visibleMaterials.map((material) => {
            const preview = material.summary?.[0] || material.content || 'No notes added yet.'
            const materialCard = (
              <>
              <div className="mb-8 flex items-start justify-between gap-4">
                <span className="rounded-full bg-bg px-3 py-1 text-xs font-bold text-primary">{material.summary ? 'Scanned PDF' : 'Study material'}</span>
                <span className="text-xs text-text/60">{new Date(material.uploadedAt || material.uploaded_at).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-text">{material.title}</h3>
              <p className="mt-3 line-clamp-2 text-small text-text/70">{preview}</p>
              </>
            )

            return <Link key={material.id} to={`/materials/${material.id}`} className="group rounded-xl border border-text/15 bg-surface p-6 transition hover:border-primary">{materialCard}</Link>
          })}
        </div>}
      </section>
    </main>
  )
}
