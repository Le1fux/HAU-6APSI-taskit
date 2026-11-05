import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getById } from '../api/materials.js'

const COMMON_LONG_WORDS = new Set([
  'according', 'another', 'between', 'different', 'especially', 'everything',
  'following', 'important', 'including', 'information', 'something', 'sometimes',
  'students', 'therefore', 'throughout', 'together', 'understand', 'whatever',
])

function getVocabularyTerms(summary) {
  const frequencies = new Map()
  for (const point of summary) {
    for (const match of point.matchAll(/[A-Za-z][A-Za-z'-]{8,}/g)) {
      const term = match[0].toLowerCase()
      if (!COMMON_LONG_WORDS.has(term)) frequencies.set(term, (frequencies.get(term) || 0) + 1)
    }
  }
  return new Set([...frequencies]
    .sort(([leftTerm, leftCount], [rightTerm, rightCount]) => rightCount - leftCount || rightTerm.length - leftTerm.length)
    .slice(0, 8)
    .map(([term]) => term))
}

function highlightVocabulary(text, terms) {
  const parts = []
  const wordPattern = /[A-Za-z][A-Za-z'-]*/g
  let previousIndex = 0

  for (const match of text.matchAll(wordPattern)) {
    parts.push(text.slice(previousIndex, match.index))
    if (terms.has(match[0].toLowerCase())) {
      parts.push(<mark key={match.index} title="Long or specialized vocabulary" className="rounded-sm bg-amber-100 px-0.5 font-semibold text-amber-950">{match[0]}</mark>)
    } else {
      parts.push(match[0])
    }
    previousIndex = match.index + match[0].length
  }

  parts.push(text.slice(previousIndex))
  return parts
}

// Shows uploaded summaries and the questions associated with a material.
export default function MaterialDetailPage({ uploadedMaterials = [], questions = [], onStartQuiz }) {
  const { id } = useParams()
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadMaterial() {
      setLoading(true)
      setError('')
      const uploadedMaterial = uploadedMaterials.find((item) => String(item.id) === String(id))
      if (uploadedMaterial) {
        setMaterial(uploadedMaterial)
        setLoading(false)
        return
      }
      try {
        const result = await getById(id)
        if (active) setMaterial(result)
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMaterial()
    return () => { active = false }
  }, [id, uploadedMaterials])

  const materialQuestions = questions.filter((question) => String(question.materialId) === String(id))
  const fallbackQuestions = [
    'What is the central idea in this material?',
    'Which detail best supports that idea?',
    'How would you explain this to someone else?',
  ]
  const summaryPoints = Array.isArray(material?.summary) ? material.summary : []
  const findings = Array.isArray(material?.findings) ? material.findings : []
  const keyTerms = Array.isArray(material?.keyTerms) ? material.keyTerms : []
  const vocabularyTerms = getVocabularyTerms(summaryPoints)
  const citation = (page) => page ? `Page ${page}` : 'Source page unavailable'
  const sourceExcerpt = (evidence) => evidence
    ? <blockquote className="mt-3 border-l-2 border-primary/30 pl-3 text-small italic text-slate-500">“{evidence}”</blockquote>
    : null

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
      <Link to="/" className="text-small font-bold text-primary hover:underline">&lt;- Back to materials</Link>
      {loading && <p className="mt-8 text-slate-500" role="status">Loading material...</p>}
      {!loading && error && <p className="mt-8 text-red-600" role="alert">{error}</p>}
      {!loading && !error && !material && <p className="mt-8 text-slate-500">Material not found.</p>}
      {!loading && !error && material && <>
      <div className="mt-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-small font-bold uppercase tracking-[0.16em] text-primary">Study guide</p><h1 className="text-heading tracking-tight text-text">{material.title}</h1>{material.course && <p className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-small font-bold text-primary">{material.course}</p>}<p className="mt-3 text-slate-500">Specific takeaways grounded in your document, with page references to check the source.</p></div>
        <Link to={`/materials/${id}/quiz`} onClick={onStartQuiz} className="rounded-xl bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary/90">Start quiz</Link>
      </div>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-surface p-6 shadow-soft sm:p-8"><h2 className="text-xl font-bold text-text">Summary</h2>{summaryPoints.length ? <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-600">{summaryPoints.map((point, index) => <li key={`${index}-${point}`}>{highlightVocabulary(point, vocabularyTerms)}</li>)}</ul> : <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-600">{material.content || 'No notes added yet.'}</p>}</section>
      {findings.length > 0 && <section className="mt-8" aria-labelledby="findings-heading">
        <div className="mb-4"><h2 id="findings-heading" className="text-xl font-bold text-text">Specific findings</h2><p className="mt-1 text-small text-slate-500">Each point includes its source location and supporting excerpt.</p></div>
        <div className="space-y-3">{findings.map((finding, index) => <article key={`${index}-${finding.text}`} className="rounded-xl border border-slate-200 bg-surface p-5">
          <div className="flex items-start justify-between gap-3"><p className="font-semibold leading-7 text-text">{finding.text}</p><span className="shrink-0 rounded-full bg-bg px-3 py-1 text-xs font-bold text-primary">{citation(finding.page)}</span></div>
          {sourceExcerpt(finding.evidence)}
        </article>)}</div>
      </section>}
      {keyTerms.length > 0 && <section className="mt-8" aria-labelledby="terms-heading">
        <h2 id="terms-heading" className="mb-4 text-xl font-bold text-text">Key terms from the PDF</h2>
        <div className="grid gap-3 sm:grid-cols-2">{keyTerms.map((term, index) => <article key={`${index}-${term.term}`} className="rounded-xl border border-slate-200 bg-surface p-5">
          <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-text">{term.term}</h3><span className="shrink-0 rounded-full bg-bg px-3 py-1 text-xs font-bold text-primary">{citation(term.page)}</span></div>
          <p className="mt-2 text-small leading-6 text-slate-600">{term.definition}</p>
          {sourceExcerpt(term.evidence)}
        </article>)}</div>
      </section>}
      <section className="mt-8" aria-labelledby="practice-heading"><div className="mb-4 flex items-center justify-between"><h2 id="practice-heading" className="text-xl font-bold text-text">Practice questions</h2><span className="text-small text-slate-400">{materialQuestions.length || fallbackQuestions.length} questions</span></div><div className="space-y-3">{materialQuestions.length ? materialQuestions.map((question, index) => <article key={question.id || `${index}-${question.question}`} className="rounded-xl border border-slate-200 bg-surface p-4">
        <div className="flex items-start justify-between gap-3"><p className="font-medium text-text">{question.question}</p><span className="shrink-0 rounded-full bg-bg px-3 py-1 text-xs font-bold text-primary">{citation(question.page)}</span></div>
        {sourceExcerpt(question.evidence)}
      </article>) : fallbackQuestions.map((question, index) => <div key={`${index}-${question}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-surface p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-small font-bold text-primary">{index + 1}</span><p className="font-medium text-text">{question}</p></div>)}</div></section>
      </>}
    </main>
  )
}
