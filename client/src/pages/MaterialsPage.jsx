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
          <h2 id="materials-heading" className="text-xl font-bold text-text">Recent materials</h2>
          {!loading && !error && <span className="text-small text-slate-400">{materials.length} sets</span>}
        </div>
        {loading && <p className="text-text/70" role="status">Loading saved materials...</p>}
        {!loading && error && <div className="mb-tight flex flex-wrap items-center gap-tight"><p className="text-small" role="alert">{error}</p><Button variant="secondary" onClick={loadMaterials}>Retry</Button></div>}
        {!loading && !error && materials.length === 0 && <p className="text-slate-500">No materials yet. Create your first one above.</p>}
        {!loading && materials.length > 0 && <div className="grid gap-4 md:grid-cols-2">
          {materials.map((material) => {
            const materialCard = (
              <>
              <div className="mb-8 flex items-start justify-between gap-4">
                <span className="rounded-full bg-bg px-3 py-1 text-xs font-bold text-primary">{material.summary ? 'Scanned PDF' : 'Study material'}</span>
                <span className="text-xs text-text/60">{new Date(material.uploadedAt || material.uploaded_at).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-text">{material.title}</h3>
              <p className="mt-3 line-clamp-2 text-small text-text/70">{material.content || 'No notes added yet.'}</p>
              </>
            )

            return <Link key={material.id} to={`/materials/${material.id}`} className="group rounded-xl border border-text/15 bg-surface p-6 transition hover:border-primary">{materialCard}</Link>
          })}
        </div>}
      </section>
    </main>
  )
}
