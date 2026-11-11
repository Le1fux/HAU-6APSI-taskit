import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import MaterialDetailPage from './pages/MaterialDetailPage.jsx'
import MaterialsPage from './pages/MaterialsPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'

const THEME_STORAGE_KEY = 'studylens-theme'

// Owns materials created during this app session.
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
    } catch (error) {
      console.error('Unable to read the saved theme preference.', error)
      return false
    }
  })
  const [materials, setMaterials] = useState([])
  const [questions, setQuestions] = useState([])
  const [answersByMaterial, setAnswersByMaterial] = useState({})

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light'
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light')
    } catch (error) {
      console.error('Unable to save the theme preference.', error)
    }
  }, [isDarkMode])

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

  // Clears only a completed attempt before starting another from the reviewer.
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
    <div className="mx-auto min-h-screen max-w-6xl border-x border-slate-200 bg-surface text-text">
      <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((current) => !current)} />
      <Routes>
        <Route path="/materials/philippine-cpale-reviewer" element={<Navigate to="/" replace />} />
        <Route path="/materials/philippine-cpale-reviewer/:section" element={<Navigate to="/" replace />} />
        <Route path="/" element={<MaterialsPage uploadedMaterials={materials} onReviewerCreated={saveReviewer} />} />
        <Route path="/materials/:id" element={<MaterialDetailPage uploadedMaterials={materials} questions={questions} answersByMaterial={answersByMaterial} onStartQuiz={startQuiz} />} />
        <Route path="/materials/:id/summary" element={<MaterialDetailPage section="summary" uploadedMaterials={materials} questions={questions} answersByMaterial={answersByMaterial} onStartQuiz={startQuiz} />} />
        <Route path="/materials/:id/findings" element={<MaterialDetailPage section="findings" uploadedMaterials={materials} questions={questions} answersByMaterial={answersByMaterial} onStartQuiz={startQuiz} />} />
        <Route path="/materials/:id/concepts" element={<MaterialDetailPage section="concepts" uploadedMaterials={materials} questions={questions} answersByMaterial={answersByMaterial} onStartQuiz={startQuiz} />} />
        <Route path="/materials/:id/sources" element={<MaterialDetailPage section="sources" uploadedMaterials={materials} questions={questions} answersByMaterial={answersByMaterial} onStartQuiz={startQuiz} />} />
        <Route path="/materials/:id/quiz" element={<QuizPage questions={questions} answersByMaterial={answersByMaterial} onAnswer={recordAnswer} onRetry={retryQuiz} />} />
        <Route path="/materials/:id/results" element={<ResultsPage questions={questions} answersByMaterial={answersByMaterial} />} />
      </Routes>
    </div>
  )
}
