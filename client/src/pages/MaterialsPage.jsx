import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import UploadForm from '../components/UploadForm.jsx'
import { getAll, isMockApiEnabled } from '../api/materials.js'

// Shows saved materials and accepts new PDF uploads.
export default function MaterialsPage({ uploadedMaterials = [], onReviewerCreated }) {
  const [savedMaterials, setSavedMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [courseFilter, setCourseFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

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
  const courses = [...new Set(materials.map((material) => material.course?.trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right))
  const hasAnalysis = (material) =>
    (Array.isArray(material.summary) && material.summary.length > 0) ||
    (Array.isArray(material.findings) && material.findings.length > 0)
  const visibleMaterials = materials
    .filter((material) => {
      if (courseFilter && material.course?.trim() !== courseFilter) return false
      if (typeFilter === 'guides' && !hasAnalysis(material)) return false
      if (typeFilter === 'materials' && hasAnalysis(material)) return false
      const searchableContent = [
        material.title,
        material.course,
        material.content,
        ...(Array.isArray(material.summary) ? material.summary.map((point) => typeof point === 'string' ? point : point.text) : []),
        ...(Array.isArray(material.findings) ? material.findings.map((finding) => finding.text) : []),
        ...(Array.isArray(material.keyTerms) ? material.keyTerms.flatMap((term) => [term.term, term.definition]) : []),
      ].filter(Boolean).join(' ').toLowerCase()
      return searchableContent.includes(normalizedQuery)
    })
    .sort((left, right) => {
      if (sortBy === 'title') return left.title.localeCompare(right.title)
      const leftDate = Date.parse(left.uploadedAt || left.uploaded_at || '') || 0
      const rightDate = Date.parse(right.uploadedAt || right.uploaded_at || '') || 0
      return sortBy === 'oldest' ? leftDate - rightDate : rightDate - leftDate
    })
  const formatDate = (material) => {
    const timestamp = Date.parse(material.uploadedAt || material.uploaded_at || '')
    return Number.isNaN(timestamp)
      ? 'Date unavailable'
      : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(timestamp)
  }
  const hasActiveFilters = Boolean(normalizedQuery || courseFilter || typeFilter !== 'all')

  function clearFilters() {
    setSearchQuery('')
    setCourseFilter('')
    setTypeFilter('all')
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-small font-bold uppercase tracking-[0.18em] text-primary">StudyLens PDF reviewer</p>
        <h1 className="text-heading tracking-tight text-text">Turn your PDFs into focused study guides.</h1>
        <p className="mt-4 text-body text-slate-500">{isMockApiEnabled
          ? 'Create a reviewer from your material, or explore built-in CPALE, Accounting, Economics, and business fundamentals samples.'
          : 'Analyze your PDF for specific findings, key terms, and practice questions with page citations and source excerpts.'}</p>
      </div>

      <section className="mb-12 rounded-2xl bg-primary p-6 text-white shadow-soft sm:p-8" aria-labelledby="create-heading">
        <h2 id="create-heading" className="mb-2 text-2xl font-bold">Create a PDF study guide</h2>
        <p className="mb-5 text-small text-white/80">Analyze up to 30 pages and 15,000 extracted characters. AI mode includes page citations and source excerpts; offline mode creates a text-based reviewer.</p>
        <UploadForm onReviewerCreated={onReviewerCreated} />
      </section>

      <section aria-labelledby="materials-heading">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="materials-heading" className="text-xl font-bold text-text">Your library</h2>
          {!loading && <span className="text-small text-slate-500">{visibleMaterials.length} of {materials.length} reviewers</span>}
        </div>
        {!loading && materials.length > 0 && <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(150px,0.65fr)_minmax(150px,0.65fr)_minmax(150px,0.65fr)]">
          <label className="sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Search reviewer titles, subjects, and topics</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search titles, subjects, and topics"
              className="w-full rounded-lg border border-text/20 bg-surface px-4 py-3 text-small text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-text/20 bg-surface px-3 text-small text-text/70">
            <span className="shrink-0">Type</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-3 font-bold text-text outline-none"
            >
              <option value="all">All items</option>
              <option value="guides">PDF study guides</option>
              <option value="materials">Other notes</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-text/20 bg-surface px-3 text-small text-text/70">
            <span className="shrink-0">Subject</span>
            <select
              value={courseFilter}
              onChange={(event) => setCourseFilter(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-3 font-bold text-text outline-none"
            >
              <option value="">All subjects</option>
              {courses.map((course) => <option key={course} value={course}>{course}</option>)}
            </select>
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
        {loading && <p className="text-text/70" role="status">Loading saved reviewers...</p>}
        {!loading && error && <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
          <p className="text-small text-amber-950" role="alert">{error}</p>
          <Button variant="secondary" onClick={loadMaterials}>Retry</Button>
        </div>}
        {!loading && materials.length === 0 && !error && <div className="rounded-2xl border border-dashed border-text/20 px-5 py-10 text-center">
          <h3 className="font-bold text-text">Your reviewer library is ready</h3>
          <p className="mt-2 text-small text-slate-500">Upload a PDF to create a source-grounded study guide with key findings and practice questions.</p>
        </div>}
        {!loading && materials.length > 0 && visibleMaterials.length === 0 && <div className="rounded-lg border border-dashed border-text/20 px-5 py-8 text-center">
          <p className="text-text/70">No reviewers match the current search and filters.</p>
          {hasActiveFilters && <button type="button" onClick={clearFilters} className="mt-3 rounded px-2 py-1 text-small font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear search and filters</button>}
        </div>}
        {visibleMaterials.length > 0 && <div className="grid gap-4 md:grid-cols-2">
          {visibleMaterials.map((material) => {
            const firstSummary = material.summary?.[0]
            const preview = (typeof firstSummary === 'string' ? firstSummary : firstSummary?.text) || material.findings?.[0]?.text || material.content || 'No preview available.'
            return <article key={material.id} className="rounded-xl border border-text/15 bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
              <div className="mb-6 flex items-start justify-between gap-4">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{material.isBuiltIn ? 'Built-in sample' : hasAnalysis(material) ? 'PDF reviewer' : 'Reference notes'}</span>
                {material.isBuiltIn
                  ? <span className="text-right text-xs text-text/60">Included with StudyLens</span>
                  : <time dateTime={material.uploadedAt || material.uploaded_at} className="text-right text-xs text-text/60">{formatDate(material)}</time>}
              </div>
              <h3 className="text-xl font-bold leading-snug text-text"><Link to={`/materials/${material.id}`} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{material.title}</Link></h3>
              {material.course && <p className="mt-2 text-xs font-semibold text-primary">{material.course}</p>}
              <p className="mt-3 line-clamp-3 text-small leading-6 text-text/70">{preview}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-small font-bold">
                <Link to={`/materials/${material.id}`} className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{material.isBuiltIn ? 'Explore sample' : 'Open reviewer'} <span aria-hidden="true">→</span></Link>
                {(Array.isArray(material.summary) && material.summary.length > 0) && <Link to={`/materials/${material.id}/summary`} className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open full summary <span aria-hidden="true">→</span></Link>}
              </div>
            </article>
          })}
        </div>}
      </section>
    </main>
  )
}
