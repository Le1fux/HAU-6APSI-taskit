import { Link, useParams } from 'react-router-dom'

// Displays the score and missed questions for the current material's quiz.
export default function ResultsPage({ questions = [], score = 0, missedIds = [], onRetry }) {
  const { id } = useParams()
  const materialQuestions = questions.filter((question) => String(question.materialId) === String(id))
  const missedQuestions = materialQuestions.filter((question) => missedIds.includes(question.id))

  if (materialQuestions.length > 0) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
        <Link to={`/materials/${id}`} className="text-small font-bold text-primary hover:underline">&lt;- Back to material</Link>
        <section className="mt-8 rounded-2xl bg-primary p-8 text-white shadow-soft sm:p-10">
          <p className="text-small font-bold uppercase tracking-[0.16em] text-blue-100">Quiz complete</p>
          <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><h1 className="text-4xl font-bold">Nice work.</h1><p className="mt-2 text-blue-100">You finished this practice round.</p></div>
            <div className="text-left sm:text-right"><p className="text-5xl font-bold">{score}/{materialQuestions.length}</p><p className="text-small text-blue-100">answers correct</p></div>
          </div>
        </section>
        <section className="mt-8" aria-labelledby="missed-heading">
          <h2 id="missed-heading" className="mb-4 text-xl font-bold text-text">Review missed questions</h2>
          {missedQuestions.length > 0
            ? <div className="space-y-3">{missedQuestions.map((question) => <article key={question.id} className="rounded-xl border border-slate-200 bg-surface p-5"><p className="font-bold text-text">{question.question}</p><p className="mt-3 text-small text-slate-500">{question.answer}</p></article>)}</div>
            : <p className="text-small text-slate-500">No missed questions this round.</p>}
          <Link to={`/materials/${id}/quiz`} onClick={onRetry} className="mt-4 inline-block rounded-xl border border-primary px-5 py-3 font-bold text-primary transition hover:bg-blue-50">Retry Quiz</Link>
        </section>
      </main>
    )
  }

  return <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14"><Link to={`/materials/${id}`} className="text-small font-bold text-primary hover:underline">&lt;- Back to material</Link><section className="mt-8 rounded-2xl bg-primary p-8 text-white shadow-soft sm:p-10"><p className="text-small font-bold uppercase tracking-[0.16em] text-blue-100">Quiz complete</p><div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><h1 className="text-4xl font-bold tracking-tight">Nice work.</h1><p className="mt-2 text-blue-100">You finished this practice round.</p></div><div className="text-left sm:text-right"><p className="text-5xl font-bold">2/3</p><p className="text-small text-blue-100">answers correct</p></div></div></section><div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr]"><section aria-labelledby="missed-heading"><h2 id="missed-heading" className="mb-4 text-xl font-bold text-text">Review missed questions</h2><div className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-soft"><p className="text-small font-bold text-red-500">Needs another look</p><p className="mt-2 font-semibold text-text">Which detail best supports the central idea?</p><p className="mt-3 text-small leading-6 text-slate-500">Try returning to the material and explaining the supporting detail in your own words.</p></div><Link to={`/materials/${id}/quiz`} className="mt-4 inline-block rounded-xl border border-primary px-5 py-3 font-bold text-primary transition hover:bg-blue-50">Try again</Link></section><section aria-labelledby="history-heading"><h2 id="history-heading" className="mb-4 text-xl font-bold text-text">Attempt history</h2><div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-surface shadow-soft"><div className="flex items-center justify-between p-5"><span className="text-small text-slate-500">Today</span><span className="font-bold text-text">2/3</span></div><div className="flex items-center justify-between p-5"><span className="text-small text-slate-500">Yesterday</span><span className="font-bold text-text">1/3</span></div></div></section></div></main>
}
