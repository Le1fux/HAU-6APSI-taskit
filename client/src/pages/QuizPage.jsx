import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getFallbackQuestions } from '../utils/fallbackQuestions.js'

// Runs one question at a time and resumes the first unanswered question.
export default function QuizPage({
  questions = [],
  answersByMaterial = {},
  onAnswer,
  onRetry,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const answers = answersByMaterial[id] || {}
  const score = Object.values(answers).filter(Boolean).length
  const answeredQuestionIds = Object.keys(answers)
  const materialQuestions = questions.filter((question) => String(question.materialId) === String(id))
  const quizQuestions = materialQuestions.length
    ? materialQuestions
    : getFallbackQuestions(id)
  const [currentIndex, setCurrentIndex] = useState(() =>
    location.state?.retry
      ? 0
      : quizQuestions.findIndex((question) => !answeredQuestionIds.includes(question.id))
  )
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const gradedQuestionIds = useRef(new Set())
  const currentQuestion = quizQuestions[currentIndex]

  useEffect(() => {
    if (!location.pathname.endsWith('/quiz')) return
    if (location.state?.retry) {
      onRetry()
      setCurrentIndex(0)
      setAnswerRevealed(false)
      gradedQuestionIds.current.clear()
      return
    }
    const firstUnanswered = quizQuestions.findIndex((question) => !answeredQuestionIds.includes(question.id))
    setCurrentIndex(firstUnanswered)
    setAnswerRevealed(false)
    gradedQuestionIds.current.clear()
  }, [location.pathname, location.state, id])

  function grade(correct) {
    if (!currentQuestion || gradedQuestionIds.current.has(currentQuestion.id)) return
    gradedQuestionIds.current.add(currentQuestion.id)
    onAnswer(id, currentQuestion.id, correct)

    const nextIndex = quizQuestions.findIndex((question, index) =>
      index > currentIndex &&
      !answeredQuestionIds.includes(question.id)
    )
    if (nextIndex === -1) navigate(`/materials/${id}/results`)
    else {
      setCurrentIndex(nextIndex)
      setAnswerRevealed(false)
    }
  }

  if (!currentQuestion) return <Navigate to={`/materials/${id}/results`} replace />

  const progress = Math.round(((currentIndex + 1) / quizQuestions.length) * 100)

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex items-center justify-between">
        <Link to={`/materials/${id}`} className="text-small font-bold text-primary hover:underline">Quit quiz</Link>
        <span className="text-small font-bold text-slate-500">{currentIndex + 1} of {quizQuestions.length}</span>
      </div>
      <div className="mb-10 h-2 overflow-hidden rounded-full bg-primary/10" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={quizQuestions.length} aria-valuenow={currentIndex + 1}>
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-soft sm:p-10">
        <p className="text-small font-bold uppercase tracking-[0.16em] text-primary">Question {currentIndex + 1}</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text">{currentQuestion.question}</h1>
        <button
          type="button"
          onClick={() => setAnswerRevealed((revealed) => !revealed)}
          aria-expanded={answerRevealed}
          className="mt-10 w-full rounded-xl border border-dashed border-slate-300 bg-bg p-5 text-left font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
        >
          {answerRevealed
            ? <>
              <span className="block text-text">Answer: {currentQuestion.answer}</span>
              {currentQuestion.page && <span className="mt-3 block text-xs font-bold text-primary">Source: page {currentQuestion.page}</span>}
              {currentQuestion.evidence && <span className="mt-2 block border-l-2 border-primary/30 pl-3 text-small font-normal italic text-slate-500">“{currentQuestion.evidence}”</span>}
            </>
            : 'Reveal the answer and source'}
        </button>
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-small text-slate-500">How did you do?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => grade(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-text transition hover:border-red-300 hover:bg-red-50">Needs more practice</button>
            <button type="button" onClick={() => grade(true)} className="rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-primary/90">Got it</button>
          </div>
        </div>
      </section>
      <p className="mt-5 text-center text-small text-slate-500">{score} correct so far</p>
    </main>
  )
}
