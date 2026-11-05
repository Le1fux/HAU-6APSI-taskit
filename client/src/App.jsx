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
  const [answersByMaterial, setAnswersByMaterial] = useState({})

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
  function recordAnswer(materialId, questionId, correct) {
    setAnswersByMaterial((currentAnswers) => {
      const materialAnswers = currentAnswers[materialId] || {}
      if (Object.hasOwn(materialAnswers, questionId)) return currentAnswers
      return {
        ...currentAnswers,
        [materialId]: { ...materialAnswers, [questionId]: correct },
      }
    })
  }

  // Clears only a completed attempt before starting another from the study guide.
  function startQuiz(materialId, attemptComplete) {
    if (!attemptComplete) return
    setAnswersByMaterial((currentAnswers) => {
      const nextAnswers = { ...currentAnswers }
      delete nextAnswers[materialId]
      return nextAnswers
    })
  }

  // Clears only the selected material's attempt before a retry.
  function retryQuiz(materialId) {
    setAnswersByMaterial((currentAnswers) => {
      const nextAnswers = { ...currentAnswers }
      delete nextAnswers[materialId]
      return nextAnswers
    })
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <Routes>
        <Route path="/" element={<MaterialsPage uploadedMaterials={materials} onReviewerCreated={saveReviewer} />} />
        <Route path="/materials/:id" element={<MaterialDetailPage uploadedMaterials={materials} questions={questions} answersByMaterial={answersByMaterial} onStartQuiz={startQuiz} />} />
        <Route path="/materials/:id/quiz" element={<QuizPage questions={questions} answersByMaterial={answersByMaterial} onAnswer={recordAnswer} onRetry={retryQuiz} />} />
        <Route path="/materials/:id/results" element={<ResultsPage questions={questions} answersByMaterial={answersByMaterial} />} />
      </Routes>
    </div>
  )
}
