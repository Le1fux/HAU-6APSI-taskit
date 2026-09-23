import { Link, useParams } from 'react-router-dom'

export default function MaterialDetailPage() {
  const { id } = useParams()
  const title = id === 'biology' ? 'Cell Biology' : id === 'history' ? 'World War II' : id?.replaceAll('-', ' ')

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
      <Link to="/" className="text-small font-bold text-primary hover:underline">&lt;- Back to materials</Link>
      <div className="mt-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-small font-bold uppercase tracking-[0.16em] text-primary">Material overview</p><h1 className="text-heading capitalize tracking-tight text-text">{title}</h1><p className="mt-3 text-slate-500">A focused collection of notes and practice for your next study session.</p></div>
        <Link to={`/materials/${id}/quiz`} className="rounded-xl bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-blue-700">Start quiz</Link>
      </div>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-surface p-6 shadow-soft sm:p-8"><h2 className="text-xl font-bold text-text">Your material</h2><p className="mt-4 leading-8 text-slate-600">Review the key ideas here before testing yourself. You can add, edit, and reorganize your notes as your understanding grows.</p><div className="mt-6 rounded-xl bg-bg p-5"><p className="text-small font-bold uppercase tracking-wide text-slate-400">Key concept</p><p className="mt-2 font-semibold text-text">Break complex topics into smaller questions you can answer without looking at your notes.</p></div></section>
      <section className="mt-8" aria-labelledby="practice-heading"><div className="mb-4 flex items-center justify-between"><h2 id="practice-heading" className="text-xl font-bold text-text">Practice questions</h2><span className="text-small text-slate-400">3 questions</span></div><div className="space-y-3">{['What is the central idea in this material?', 'Which detail best supports that idea?', 'How would you explain this to someone else?'].map((question, index) => <div key={question} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-surface p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-small font-bold text-primary">{index + 1}</span><p className="font-medium text-text">{question}</p></div>)}</div></section>
    </main>
  )
}
