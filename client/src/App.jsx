import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import MaterialDetailPage from './pages/MaterialDetailPage.jsx'
import MaterialsPage from './pages/MaterialsPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'

// Owns materials created during this app session.
export default function App() {
  const [materials, setMaterials] = useState([])
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)
  const [missedIds, setMissedIds] = useState([])

  // Stores the uploaded material and associates every generated question with it.
  function saveReviewer(material, reviewerQuestions) {
    const attachedQuestions = reviewerQuestions.map((question, index) => ({
      ...question,
      id: `${material.id}-${index + 1}`,
      materialId: material.id,
    }))
    setMaterials((currentMaterials) => [material, ...currentMaterials])
    setQuestions((currentQuestions) => [...currentQuestions, ...attachedQuestions])
  }

  // Records quiz grading in App state for the results route.
  function recordAnswer(questionId, correct) {
    if (correct) setScore((currentScore) => currentScore + 1)
    else setMissedIds((currentIds) => [...currentIds, questionId])
  }

  // Clears the prior attempt before a fresh quiz or retry.
  function resetQuiz() {
    setScore(0)
    setMissedIds([])
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <Routes>
        <Route path="/" element={<MaterialsPage uploadedMaterials={materials} onReviewerCreated={saveReviewer} />} />
        <Route path="/materials/:id" element={<MaterialDetailPage uploadedMaterials={materials} questions={questions} onStartQuiz={resetQuiz} />} />
        <Route path="/materials/:id/quiz" element={<QuizPage questions={questions} score={score} onAnswer={recordAnswer} />} />
        <Route path="/materials/:id/results" element={<ResultsPage questions={questions} score={score} missedIds={missedIds} onRetry={resetQuiz} />} />
      </Routes>
    </div>
  )
}
