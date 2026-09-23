import { Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import MaterialDetailPage from './pages/MaterialDetailPage.jsx'
import MaterialsPage from './pages/MaterialsPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <Routes>
        <Route path="/" element={<MaterialsPage />} />
        <Route path="/materials/:id" element={<MaterialDetailPage />} />
        <Route path="/materials/:id/quiz" element={<QuizPage />} />
        <Route path="/materials/:id/results" element={<ResultsPage />} />
      </Routes>
    </div>
  )
}
