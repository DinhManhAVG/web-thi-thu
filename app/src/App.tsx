import { HashRouter, Routes, Route } from 'react-router-dom'
import { ConfirmProvider } from './hooks/useConfirm'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Exam from './pages/Exam'
import Results from './pages/Results'

export default function App() {
  return (
    <ConfirmProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </HashRouter>
    </ConfirmProvider>
  )
}
