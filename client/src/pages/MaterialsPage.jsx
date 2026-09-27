import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { create, getAll } from '../api/materials.js'

export default function MaterialsPage() {
  const [title, setTitle] = useState('')
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadMaterials() {
    setLoading(true)
    setError('')
    try {
      setMaterials(await getAll())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMaterials()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) return
    setError('')
    try {
      await create({ title: title.trim(), content: '' })
      setTitle('')
      await loadMaterials()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-small font-bold uppercase tracking-[0.18em] text-primary">Your study space</p>
        <h1 className="text-heading tracking-tight text-text">Make learning stick.</h1>
        <p className="mt-4 text-body text-slate-500">Turn your notes into focused practice. Choose a material to keep going or start something new.</p>
      </div>

      <section className="mb-12 rounded-2xl bg-primary p-6 text-white shadow-soft sm:p-8" aria-labelledby="create-heading">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-small font-bold uppercase tracking-[0.16em] text-blue-100">Start a new set</p>
            <h2 id="create-heading" className="text-2xl font-bold">What are you working on?</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="material-title">Material name</label>
            <input id="material-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Organic chemistry notes" className="min-w-0 flex-1 rounded-xl border-0 px-4 py-3 text-text outline-none ring-2 ring-transparent placeholder:text-slate-400 focus:ring-accent" />
            <button className="rounded-xl bg-accent px-5 py-3 font-bold text-text transition hover:bg-amber-300" type="submit">Create material</button>
          </form>
        </div>
      </section>

      <section aria-labelledby="materials-heading">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="materials-heading" className="text-xl font-bold text-text">Recent materials</h2>
          {!loading && !error && <span className="text-small text-slate-400">{materials.length} sets</span>}
        </div>
        {loading && <p className="text-slate-500" role="status">Loading materials...</p>}
        {!loading && error && <p className="text-red-600" role="alert">{error}</p>}
        {!loading && !error && materials.length === 0 && <p className="text-slate-500">No materials yet. Create your first one above.</p>}
        {!loading && !error && materials.length > 0 && <div className="grid gap-4 md:grid-cols-2">
          {materials.map((material) => (
            <Link key={material.id} to={`/materials/${material.id}`} className="group rounded-2xl border border-slate-200 bg-surface p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-blue-200">
              <div className="mb-8 flex items-start justify-between gap-4">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">Study material</span>
                <span className="text-xs text-slate-400">{new Date(material.uploaded_at).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-text group-hover:text-primary">{material.title}</h3>
              <p className="mt-3 line-clamp-2 text-small text-slate-500">{material.content || 'No notes added yet.'}</p>
            </Link>
          ))}
        </div>}
      </section>
    </main>
  )
}
