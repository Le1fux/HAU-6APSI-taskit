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
  const vocabularyTerms = getVocabularyTerms(summaryPoints)

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
      <Link to="/" className="text-small font-bold text-primary hover:underline">&lt;- Back to materials</Link>
      {loading && <p className="mt-8 text-slate-500" role="status">Loading material...</p>}
      {!loading && error && <p className="mt-8 text-red-600" role="alert">{error}</p>}
      {!loading && !error && !material && <p className="mt-8 text-slate-500">Material not found.</p>}
      {!loading && !error && material && <>
      <div className="mt-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-small font-bold uppercase tracking-[0.16em] text-primary">Material overview</p><h1 className="text-heading tracking-tight text-text">{material.title}</h1><p className="mt-3 text-slate-500">A focused collection of notes and practice for your next study session.</p></div>
        <Link to={`/materials/${id}/quiz`} onClick={onStartQuiz} className="rounded-xl bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-blue-700">Start quiz</Link>
      </div>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-surface p-6 shadow-soft sm:p-8"><h2 className="text-xl font-bold text-text">Summary</h2>{summaryPoints.length ? <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-600">{summaryPoints.map((point, index) => <li key={`${index}-${point}`}>{highlightVocabulary(point, vocabularyTerms)}</li>)}</ul> : <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-600">{material.content || 'No notes added yet.'}</p>}</section>
      <section className="mt-8" aria-labelledby="practice-heading"><div className="mb-4 flex items-center justify-between"><h2 id="practice-heading" className="text-xl font-bold text-text">Practice questions</h2><span className="text-small text-slate-400">{materialQuestions.length || fallbackQuestions.length} questions</span></div><div className="space-y-3">{(materialQuestions.length ? materialQuestions.map((question) => question.question) : fallbackQuestions).map((question, index) => <div key={`${index}-${question}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-surface p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-small font-bold text-primary">{index + 1}</span><p className="font-medium text-text">{question}</p></div>)}</div></section>
      </>}
    </main>
  )
}
