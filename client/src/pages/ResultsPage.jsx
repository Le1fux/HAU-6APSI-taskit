import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import SourceLinks from '../components/SourceLinks.jsx'
import { getFallbackQuestions } from '../utils/fallbackQuestions.js'
import { getBuiltInQuestions } from '../data/builtInMaterials.js'

// Displays the score and source evidence for questions missed in this attempt.
export default function ResultsPage({
  questions = [],
  answersByMaterial = {},
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const answers = answersByMaterial[id] || {}
  const score = Object.values(answers).filter(Boolean).length
  const missedIds = Object.keys(answers).filter((questionId) => !answers[questionId])
  const answeredQuestionIds = Object.keys(answers)
  const savedQuestions = questions.filter((question) => String(question.materialId) === String(id))
  const builtInQuestions = getBuiltInQuestions(id)
  const attemptQuestions = savedQuestions.length
    ? savedQuestions
    : builtInQuestions.length
      ? builtInQuestions
      : getFallbackQuestions(id)
  const missedQuestions = attemptQuestions.filter((question) => missedIds.includes(question.id))
  const total = attemptQuestions.length
  const attemptComplete = total > 0 &&
    attemptQuestions.every((question) => answeredQuestionIds.includes(question.id))
  const percentage = total ? Math.round((score / total) * 100) : 0
  const resultMessage = percentage === 100
    ? 'Excellent recall. You got every question right.'
    : percentage >= 70
      ? 'Good progress. Review the details below to strengthen recall.'
      : 'Use the source notes below to revisit the key ideas, then try again.'

  if (!attemptComplete) return <Navigate to={`/materials/${id}`} replace />

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
      <Link to={`/materials/${id}`} className="text-small font-bold text-primary hover:underline">&lt;- Back to reviewer</Link>
      <section className="mt-8 rounded-2xl bg-primary p-8 text-white shadow-soft sm:p-10">
        <p className="text-small font-bold uppercase tracking-[0.16em] text-white/80">Practice quiz complete</p>
        <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold">{percentage === 100 ? 'Excellent work.' : 'Keep building recall.'}</h1>
            <p className="mt-2 text-white/80">{resultMessage}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-5xl font-bold">{score}/{total}</p>
            <p className="text-small text-white/80">{percentage}% correct</p>
          </div>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/25" role="progressbar" aria-label="Quiz score" aria-valuemin={0} aria-valuemax={total} aria-valuenow={score}>
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${percentage}%` }} />
        </div>
      </section>

      <section className="mt-8" aria-labelledby="missed-heading">
        <div className="mb-4">
          <h2 id="missed-heading" className="text-xl font-bold text-text">Review missed questions</h2>
          <p className="mt-1 text-small text-slate-500">Revisit the cited source and try to answer each question in your own words.</p>
        </div>
        {missedQuestions.length > 0
          ? <div className="space-y-3">{missedQuestions.map((question) => <article key={question.id} className="rounded-xl border border-slate-200 bg-surface p-5">
            <p className="font-bold text-text">{question.question}</p>
            <p className="mt-3 text-small leading-6 text-slate-600">{question.answer}</p>
            {question.page && <p className="mt-3 text-xs font-bold text-primary">Source: page {question.page}</p>}
            {question.evidence && <blockquote className="mt-2 border-l-2 border-primary/30 pl-3 text-small italic text-slate-500">“{question.evidence}”</blockquote>}
            <SourceLinks sourceIds={question.sourceIds} sources={question.sources} />
          </article>)}</div>
          : <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-small font-medium text-emerald-950">No missed questions this round. Keep reviewing periodically to reinforce what you learned.</p>}

        <button
          type="button"
          onClick={() => navigate(`/materials/${id}/quiz`, { state: { retry: true } })}
          className="mt-5 rounded-xl border border-primary px-5 py-3 font-bold text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Retry quiz
        </button>
      </section>
    </main>
  )
}
