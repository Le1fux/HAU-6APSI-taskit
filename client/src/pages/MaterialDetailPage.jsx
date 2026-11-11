import { useEffect, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { getFallbackQuestions } from '../utils/fallbackQuestions.js'
import { getBuiltInQuestions } from '../data/builtInMaterials.js'
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

// Shows one reviewer section at a time, with questions as the default view.
export default function MaterialDetailPage({
  section = 'questions',
  uploadedMaterials = [],
  questions = [],
  answersByMaterial = {},
  onStartQuiz,
}) {
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

  const savedQuestions = questions.filter((question) => String(question.materialId) === String(id))
  const materialQuestions = savedQuestions.length ? savedQuestions : getBuiltInQuestions(id)
  const quizQuestions = materialQuestions.length ? materialQuestions : getFallbackQuestions(id)
  const answeredIds = Object.keys(answersByMaterial[id] || {})
  const attemptComplete = quizQuestions.length > 0 &&
    quizQuestions.every((question) => answeredIds.includes(question.id))
  const attemptInProgress = answeredIds.length > 0 && !attemptComplete
  const summaryPoints = Array.isArray(material?.summary) ? material.summary : []
  const findings = Array.isArray(material?.findings) ? material.findings : []
  const keyTerms = Array.isArray(material?.keyTerms) ? material.keyTerms : []
  const referenceSources = Array.isArray(material?.sources) ? material.sources : []
  const summaryText = (point) => typeof point === 'string' ? point : point.text
  const vocabularyTerms = getVocabularyTerms(summaryPoints.map(summaryText))
  const citation = (page) => page ? `Page ${page}` : 'Source page unavailable'
  const multipleChoiceCount = quizQuestions.filter((question) => Array.isArray(question.options)).length
  const reviewerDescription = material?.id?.startsWith('cpale-')
    ? 'An independent guide for one CPALE subject, with a topic map and practice questions. It is not an official or exhaustive PRC/BOA syllabus; verify the current program and applicable standards, laws, and rules.'
    : material?.isBuiltIn
      ? 'An illustrative sample for study practice. It is not an official exam blueprint or a substitute for your course materials.'
      : 'Specific takeaways grounded in your document, with page references to check the source.'
  const sourceExcerpt = (evidence) => evidence
    ? <blockquote className="mt-3 border-l-2 border-primary/30 pl-3 text-small italic text-slate-500">“{evidence}”</blockquote>
    : null
  const sourceFor = (sourceId) => referenceSources.find((source) => source.id === sourceId)
  const sections = [
    { key: 'questions', label: 'Questions and answers', path: `/materials/${id}`, count: quizQuestions.length },
    { key: 'summary', label: 'Summary', path: `/materials/${id}/summary`, count: summaryPoints.length },
    { key: 'findings', label: 'Specific findings', path: `/materials/${id}/findings`, count: findings.length },
    { key: 'concepts', label: 'Key concepts', path: `/materials/${id}/concepts`, count: keyTerms.length },
    { key: 'sources', label: 'Sources', path: `/materials/${id}/sources`, count: referenceSources.length },
  ]

  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6 sm:py-8 xl:px-10 xl:py-10">
      <Link to="/" className="inline-flex min-h-10 items-center text-small font-bold text-primary hover:underline">&lt;- Back to library</Link>
      {loading && <p className="mt-6 text-slate-500" role="status">Loading reviewer...</p>}
      {!loading && error && <p className="mt-6 text-red-600" role="alert">{error}</p>}
      {!loading && !error && !material && <p className="mt-6 text-slate-500">Reviewer not found.</p>}
      {!loading && !error && material && <>
      <header className="mt-5 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm sm:mt-7 sm:p-7 xl:flex-row xl:items-end xl:justify-between xl:gap-8">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">{material.isBuiltIn ? 'Built-in sample reviewer' : 'PDF study guide'}</p>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-text sm:text-3xl xl:text-4xl">{material.title}</h1>
          {material.course && <p className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-small font-bold text-primary">{material.course}</p>}
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">{reviewerDescription}</p>
        </div>
        <Link to={`/materials/${id}/quiz`} onClick={() => onStartQuiz(id, attemptComplete)} className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto">
          {attemptInProgress ? 'Continue practice quiz' : attemptComplete ? 'Start another attempt' : 'Start practice quiz'}
        </Link>
      </header>

      <div className="mt-5">
        <nav aria-label="Reviewer sections" className="sticky top-0 z-20 -mx-4 mb-5 border-y border-slate-200 bg-bg/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 xl:mb-7">
          <div className="reviewer-nav-scroll flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap">
            {sections.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end
                className={({ isActive }) => `inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4 sm:text-small ${isActive ? 'bg-primary text-white shadow-sm' : 'border border-slate-200 bg-surface text-slate-700 hover:border-primary/40 hover:text-primary'}`}
              >
                <span>{item.label}</span>
                <span className={`text-xs ${item.key === section ? 'text-white/75' : 'text-slate-400'}`}>{item.count}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="min-w-0">
          {section === 'summary' && <section aria-labelledby="summary-heading">
            <div className="mb-4 sm:mb-5">
              <h2 id="summary-heading" className="text-xl font-bold text-text sm:text-2xl">Full summary</h2>
              <p className="mt-1 text-sm text-slate-500">Core ideas and takeaways from this reviewer.</p>
            </div>
            {summaryPoints.length
              ? <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{summaryPoints.map((point, index) => {
                const text = summaryText(point)
                return <article key={`${index}-${text}`} className="rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm sm:p-5">
                  <div className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{index + 1}</span>
                    <div className="min-w-0">
                      {point.title && <h3 className="text-sm font-bold leading-6 text-text sm:text-base">{point.title}</h3>}
                      <p className={`${point.title ? 'mt-2 ' : ''}text-sm leading-7 text-slate-700 sm:text-base`}>{highlightVocabulary(text, vocabularyTerms)}</p>
                      {point.application && <div className="mt-4 rounded-xl bg-primary/5 p-3 sm:p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-primary">Study application</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{point.application}</p>
                      </div>}
                    </div>
                  </div>
                </article>
              })}</div>
              : <p className="rounded-2xl border border-slate-200 bg-surface p-5 leading-7 text-slate-600">{material.content || 'No notes added yet.'}</p>}
          </section>}

          {section === 'findings' && <section aria-labelledby="findings-heading">
            <div className="mb-4 sm:mb-5">
              <h2 id="findings-heading" className="text-xl font-bold text-text sm:text-2xl">Specific findings</h2>
              <p className="mt-1 text-sm text-slate-500">{material.isBuiltIn ? 'Core ideas covered by this sample reviewer.' : 'Each point includes its source location and supporting excerpt.'}</p>
            </div>
            {findings.length
              ? <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{findings.map((finding, index) => <article key={`${index}-${finding.text}`} className="rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3"><p className="font-semibold leading-7 text-text">{finding.text}</p>{!material.isBuiltIn && <span className="shrink-0 rounded-full bg-bg px-3 py-1 text-xs font-bold text-primary">{citation(finding.page)}</span>}</div>
                {finding.explanation && <p className="mt-2 text-sm leading-7 text-slate-600">{finding.explanation}</p>}
                {sourceExcerpt(finding.evidence)}
              </article>)}</div>
              : <p className="rounded-2xl border border-slate-200 bg-surface p-5 text-slate-500">No specific findings are available for this reviewer.</p>}
          </section>}

          {section === 'concepts' && <section aria-labelledby="terms-heading">
            <div className="mb-4 sm:mb-5">
              <h2 id="terms-heading" className="text-xl font-bold text-text sm:text-2xl">{material.isBuiltIn ? 'Key concepts' : 'Key terms from the PDF'}</h2>
              <p className="mt-1 text-sm text-slate-500">Review definitions and supporting explanations.</p>
            </div>
            {keyTerms.length
              ? <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{keyTerms.map((term, index) => <article key={`${index}-${term.term}`} className="rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3"><h3 className="font-bold leading-6 text-text">{term.term}</h3>{!material.isBuiltIn && <span className="shrink-0 rounded-full bg-bg px-3 py-1 text-xs font-bold text-primary">{citation(term.page)}</span>}</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">{term.definition}</p>
                {term.explanation && <p className="mt-2 text-sm leading-7 text-slate-600">{term.explanation}</p>}
                {sourceExcerpt(term.evidence)}
              </article>)}</div>
              : <p className="rounded-2xl border border-slate-200 bg-surface p-5 text-slate-500">No key concepts are available for this reviewer.</p>}
          </section>}

          {section === 'questions' && <section aria-labelledby="practice-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2 sm:mb-5">
              <div><h2 id="practice-heading" className="text-xl font-bold text-text sm:text-2xl">Practice questions and answers</h2><p className="mt-1 text-sm text-slate-500">{multipleChoiceCount ? `${multipleChoiceCount} original scored multiple-choice problems plus recall questions. Try them unaided; this independent practice is not copied from an official exam.` : 'Study each question, then check its answer and references.'}</p></div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{quizQuestions.length} questions</span>
            </div>
            <div className="grid gap-3 xl:grid-cols-2">{quizQuestions.map((question, index) => <article key={question.id || `${index}-${question.question}`} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold leading-7 text-text"><span className="mr-2 text-primary">{index + 1}.</span>{question.question}</p>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {question.topic && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{question.topic}</span>}
                  {!material.isBuiltIn && <span className="rounded-full bg-bg px-3 py-1 text-xs font-bold text-primary">{citation(question.page)}</span>}
                </div>
              </div>
              {question.difficulty && <p className="mt-2 text-xs font-semibold text-slate-500">{question.difficulty} question</p>}
              {question.options && <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{question.options.map((option, optionIndex) => <li key={option}><span className="mr-2 font-bold text-primary">{String.fromCharCode(65 + optionIndex)}.</span>{option}</li>)}</ol>}
              <details className="group mt-4 border-t border-slate-100 pt-3">
                <summary className="min-h-10 cursor-pointer py-2 text-sm font-bold text-primary marker:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <span className="group-open:hidden">Show answer</span>
                  <span className="hidden group-open:inline">Hide answer</span>
                </summary>
                <div className="pb-1">
                  <p className="text-sm leading-7 text-slate-600 sm:text-base"><span className="font-bold text-text">Answer:</span> {question.answer || 'No answer is available for this question.'}</p>
                  {question.explanation && <p className="mt-2 rounded-xl bg-primary/5 p-3 text-sm leading-6 text-slate-600"><span className="font-bold text-primary">Rationale:</span> {question.explanation}</p>}
                  {!material.isBuiltIn && sourceExcerpt(question.evidence)}
                </div>
              </details>
            </article>)}</div>
          </section>}

          {section === 'sources' && <section aria-labelledby="sources-heading">
            <div className="mb-4 sm:mb-5">
              <h2 id="sources-heading" className="text-xl font-bold text-text sm:text-2xl">Reference materials</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                These links support independent study; they are not an official PRC/BOA syllabus or question bank.
                Links include official organizations, legal-text reproductions, and supplemental educational material.
                Check current rules, local adoption, and exam coverage for your sitting.
              </p>
            </div>
            {referenceSources.length
              ? <>
                {summaryPoints.some((point) => point && typeof point === 'object' && Array.isArray(point.sourceIds)) && <div className="mb-8 grid gap-3 md:grid-cols-2">
                  {summaryPoints.filter((point) => point && typeof point === 'object' && Array.isArray(point.sourceIds)).map((point) => {
                    const subjectSources = point.sourceIds.map(sourceFor).filter(Boolean)
                    return <article key={point.title} className="rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm sm:p-5">
                      <h3 className="font-bold text-text">{point.title || 'Study topic'}</h3>
                      {subjectSources.length
                        ? <ul className="mt-3 space-y-2">{subjectSources.map((source) => <li key={source.id}>
                          <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{source.title}</a>
                        </li>)}</ul>
                        : <p className="mt-2 text-sm text-slate-500">No source links are attached to this topic.</p>}
                    </article>
                  })}
                </div>}
                <h3 className="mb-3 text-lg font-bold text-text">All linked materials</h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  {referenceSources.map((source) => <li key={source.id} className="rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm sm:p-5">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {source.title}
                    </a>
                    {source.description && <p className="mt-2 text-sm leading-6 text-slate-600">{source.description}</p>}
                  </li>)}
                </ul>
              </>
              : <p className="rounded-2xl border border-slate-200 bg-surface p-5 text-slate-500">No external sources are linked to this material.</p>}
          </section>}
        </div>
      </div>
      </>}
    </main>
  )
}
