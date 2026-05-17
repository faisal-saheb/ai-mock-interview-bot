import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getQuestions, evaluateAnswer } from "../api"

function Interview() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = location.state?.role || "Software Engineer"

  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(true)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadQuestions()
  }, [])

const loadQuestions = async () => {
  setLoading(true)
  try {
    const qs = await getQuestions(role)
    if (qs && qs.length > 0) {
      setQuestions(qs)
    } else {
      setError("No questions loaded. Please go back and try again!")
    }
  } catch (error) {
    setError(error.message)
  }
  setLoading(false)
}

  const handleNext = async () => {
    if (!answer.trim()) {
      alert("Please type your answer first!")
      return
    }
    setEvaluating(true)
    const result = await evaluateAnswer(role, questions[currentQ], answer)
    const newResults = [...results, {
      question: questions[currentQ],
      answer,
      ...result
    }]
    setResults(newResults)
    setEvaluating(false)

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1)
      setAnswer("")
    } else {
      navigate("/results", { state: { results: newResults, role } })
    }
  }
if (error) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-red-400 text-6xl mb-6">⚠️</div>
      <p className="text-white text-xl font-semibold mb-4">{error}</p>
      <button
        onClick={() => { setError(null); loadQuestions() }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl"
      >
        🔄 Try Again
      </button>
      <button
        onClick={() => navigate("/")}
        className="mt-4 text-gray-400 hover:text-white"
      >
        ← Go Back Home
      </button>
    </div>
  )
}
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <div className="text-blue-400 text-6xl mb-6 animate-bounce">🤖</div>
        <p className="text-white text-xl font-semibold">
          AI is preparing your interview...
        </p>
        <p className="text-gray-400 mt-2">Generating {role} questions</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-400 font-semibold text-lg">
            🎯 {role} Interview
          </span>
          <span className="text-gray-400">
            Question {currentQ + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <p className="text-gray-400 text-sm mb-2">Question {currentQ + 1}</p>
          <p className="text-white text-lg font-medium">
            {questions[currentQ]}
          </p>
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={6}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-blue-500 resize-none"
        />
        <button
          onClick={handleNext}
          disabled={evaluating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-xl transition duration-200 text-lg"
        >
          {evaluating ? "🤖 AI is evaluating..." :
            currentQ + 1 < questions.length ?
            "Next Question →" : "Finish Interview 🎉"}
        </button>
      </div>
    </div>
  )
}

export default Interview