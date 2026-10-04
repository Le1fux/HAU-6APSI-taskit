import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const fallbackQuestions = [
  { question: 'What is the central idea in this material?', answer: 'Explain the main subject or process described in the material.' },
  { question: 'Which detail best supports that idea?', answer: 'Choose a specific detail from the material that supports its central idea.' },
  { question: 'How would you explain this to someone else?', answer: 'Summarize the main idea and connect it to a supporting detail.' },
]

// Runs one question at a time and keeps only the current answer state locally.
export default function QuizPage({ questions = [], score = 0, onAnswer }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const materialQuestions = questions.filter((question) => String(question.materialId) === String(id))
  const quizQuestions = materialQuestions.length
    ? materialQuestions
    : fallbackQuestions.map((question, index) => ({ ...question, id: `fallback-${id}-${index + 1}` }))
  const currentQuestion = quizQuestions[currentIndex]

  // Records the answer in App state before advancing or opening results.
  function grade(correct) {
    onAnswer(currentQuestion.id, correct)
    if (currentIndex === quizQuestions.length - 1) navigate(`/materials/${id}/results`)
    else { setCurrentIndex(currentIndex + 1); setAnswerRevealed(false) }
  }

  return <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14"><div className="mb-8 flex items-center justify-between"><Link to={`/materials/${id}`} className="text-small font-bold text-primary hover:underline">Quit quiz</Link><span className="text-small font-bold text-slate-400">{currentIndex + 1} of {quizQuestions.length}</span></div><div className="mb-10 h-2 overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }} /></div><section className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-soft sm:p-10"><p className="text-small font-bold uppercase tracking-[0.16em] text-primary">Question {currentIndex + 1}</p><h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text">{currentQuestion.question}</h1><button type="button" onClick={() => setAnswerRevealed(!answerRevealed)} className="mt-10 w-full rounded-xl border border-dashed border-slate-300 bg-bg p-5 text-left font-semibold text-slate-500 transition hover:border-primary hover:text-primary">{answerRevealed ? `Answer: ${currentQuestion.answer}` : 'Tap to reveal your answer'}</button><div className="mt-8 border-t border-slate-100 pt-6"><p className="text-small text-slate-500">How did you do?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => grade(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-text transition hover:border-red-300 hover:bg-red-50">Needs more practice</button><button type="button" onClick={() => grade(true)} className="rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-blue-700">Got it</button></div></div></section><p className="mt-5 text-center text-small text-slate-400">{score} correct so far</p></main>
}
