import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const questions = ['What is the central idea in this material?', 'Which detail best supports that idea?', 'How would you explain this to someone else?']

export default function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)

  function grade(correct) {
    if (correct) setScore(score + 1)
    if (current === questions.length - 1) navigate(`/materials/${id}/results`)
    else { setCurrent(current + 1); setShowAnswer(false) }
  }

  return <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14"><div className="mb-8 flex items-center justify-between"><Link to={`/materials/${id}`} className="text-small font-bold text-primary hover:underline">Quit quiz</Link><span className="text-small font-bold text-slate-400">{current + 1} of {questions.length}</span></div><div className="mb-10 h-2 overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div><section className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-soft sm:p-10"><p className="text-small font-bold uppercase tracking-[0.16em] text-primary">Question {current + 1}</p><h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text">{questions[current]}</h1><button type="button" onClick={() => setShowAnswer(!showAnswer)} className="mt-10 w-full rounded-xl border border-dashed border-slate-300 bg-bg p-5 text-left font-semibold text-slate-500 transition hover:border-primary hover:text-primary">{showAnswer ? 'Answer: connect this topic to the main idea and explain it in your own words.' : 'Tap to reveal your answer'}</button><div className="mt-8 border-t border-slate-100 pt-6"><p className="text-small text-slate-500">How did you do?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => grade(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-text transition hover:border-red-300 hover:bg-red-50">Needs more practice</button><button type="button" onClick={() => grade(true)} className="rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-blue-700">Got it</button></div></div></section><p className="mt-5 text-center text-small text-slate-400">{score} correct so far</p></main>
}
