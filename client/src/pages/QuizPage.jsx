import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import SourceLinks from '../components/SourceLinks.jsx'
import { getFallbackQuestions } from '../utils/fallbackQuestions.js'
import { getBuiltInQuestions } from '../data/builtInMaterials.js'

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
  const builtInQuestions = getBuiltInQuestions(id)
  const quizQuestions = materialQuestions.length
    ? materialQuestions
    : builtInQuestions.length
      ? builtInQuestions
      : getFallbackQuestions(id)
  const [currentIndex, setCurrentIndex] = useState(() =>
    location.state?.retry
      ? 0
      : quizQuestions.findIndex((question) => !answeredQuestionIds.includes(question.id))
  )
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const gradedQuestionIds = useRef(new Set())
  const currentQuestion = quizQuestions[currentIndex]

  function advanceQuestion() {
    const nextIndex = quizQuestions.findIndex((question, index) =>
      index > currentIndex &&
      !answeredQuestionIds.includes(question.id)
    )
    if (nextIndex === -1) navigate(`/materials/${id}/results`)
    else {
      setCurrentIndex(nextIndex)
      setAnswerRevealed(false)
      setSelectedOption(null)
    }
  }

  useEffect(() => {
    if (!location.pathname.endsWith('/quiz')) return
    if (location.state?.retry) {
      onRetry()
      setCurrentIndex(0)
      setAnswerRevealed(false)
      setSelectedOption(null)
      gradedQuestionIds.current.clear()
      return
    }
    const firstUnanswered = quizQuestions.findIndex((question) => !answeredQuestionIds.includes(question.id))
    setCurrentIndex(firstUnanswered)
    setAnswerRevealed(false)
    setSelectedOption(null)
    gradedQuestionIds.current.clear()
  }, [location.pathname, location.state, id])

  function grade(correct) {
    if (!currentQuestion || gradedQuestionIds.current.has(currentQuestion.id)) return
    gradedQuestionIds.current.add(currentQuestion.id)
    onAnswer(id, currentQuestion.id, correct)
    advanceQuestion()
  }

  function checkMultipleChoice() {
    if (
      !currentQuestion ||
      selectedOption === null ||
      gradedQuestionIds.current.has(currentQuestion.id)
    ) return
    gradedQuestionIds.current.add(currentQuestion.id)
    onAnswer(id, currentQuestion.id, selectedOption === currentQuestion.correctOption)
    setAnswerRevealed(true)
  }

  if (!currentQuestion) return <Navigate to={`/materials/${id}/results`} replace />

  const progress = Math.round(((currentIndex + 1) / quizQuestions.length) * 100)

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex items-center justify-between">
        <Link to={`/materials/${id}`} className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-surface px-4 py-2 text-small font-bold text-text transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Stop taking test</Link>
        <span className="text-small font-bold text-slate-500">{currentIndex + 1} of {quizQuestions.length}</span>
      </div>
      <div className="mb-10 h-2 overflow-hidden rounded-full bg-primary/10" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={quizQuestions.length} aria-valuenow={currentIndex + 1}>
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-soft sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-small font-bold uppercase tracking-[0.16em] text-primary">Question {currentIndex + 1}</p>
          {currentQuestion.topic && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{currentQuestion.topic}</span>}
        </div>
        {currentQuestion.difficulty && <p className="mt-2 text-xs font-semibold text-slate-500">{currentQuestion.difficulty} question</p>}
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text">{currentQuestion.question}</h1>
        {Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0
          ? <>
            <fieldset className="mt-7 space-y-3" disabled={answerRevealed}>
              <legend className="sr-only">Choose one answer</legend>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index
                const isCorrect = answerRevealed && index === currentQuestion.correctOption
                const isIncorrectSelection = answerRevealed && isSelected && !isCorrect
                return <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedOption(index)}
                  className={`flex min-h-14 w-full items-start gap-3 rounded-xl border p-4 text-left text-sm leading-6 transition sm:text-base ${isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : isIncorrectSelection ? 'border-red-400 bg-red-50 text-red-950' : isSelected ? 'border-primary bg-primary/5 text-text ring-2 ring-primary/20' : 'border-slate-200 text-slate-700 hover:border-primary/50 hover:bg-primary/5'}`}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                  {isCorrect && <span className="ml-auto shrink-0 font-bold text-emerald-700">Correct</span>}
                  {isIncorrectSelection && <span className="ml-auto shrink-0 font-bold text-red-700">Your answer</span>}
                </button>
              })}
            </fieldset>
            {answerRevealed
              ? <div className="mt-5 rounded-xl border border-slate-200 bg-bg p-4 sm:p-5">
                <p className="font-bold text-text">Rationale</p>
                <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{currentQuestion.explanation || currentQuestion.answer}</p>
                {currentQuestion.page && <p className="mt-3 text-xs font-bold text-primary">Source: page {currentQuestion.page}</p>}
                {currentQuestion.evidence && <blockquote className="mt-2 border-l-2 border-primary/30 pl-3 text-small italic text-slate-500">“{currentQuestion.evidence}”</blockquote>}
                <SourceLinks sourceIds={currentQuestion.sourceIds} sources={currentQuestion.sources} />
              </div>
              : <button type="button" disabled={selectedOption === null} onClick={checkMultipleChoice} className="mt-5 min-h-12 w-full rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">Check answer</button>}
            {answerRevealed && <button type="button" onClick={advanceQuestion} className="mt-5 min-h-12 w-full rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary/90 sm:w-auto">Continue to next question</button>}
          </>
          : <>
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
            {answerRevealed && <SourceLinks sourceIds={currentQuestion.sourceIds} sources={currentQuestion.sources} />}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-small text-slate-500">How did you do?</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => grade(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-text transition hover:border-red-300 hover:bg-red-50">Needs more practice</button>
                <button type="button" onClick={() => grade(true)} className="rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-primary/90">Got it</button>
              </div>
            </div>
          </>}
      </section>
      <p className="mt-5 text-center text-small text-slate-500">{score} correct so far</p>
    </main>
  )
}
