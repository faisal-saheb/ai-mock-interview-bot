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

  useEffect(() => { loadQuestions() }, [])

  const loadQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const qs = await getQuestions(role)
      if (qs && qs.length > 0) {
        setQuestions(qs)
      } else {
        setError("No questions loaded. Please try again!")
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
      question: questions[currentQ], answer, ...result
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="text-6xl mb-6 animate-pulse">🤖</div>
        <h2 className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}>
          Preparing your interview...
        </h2>
        <p className="text-sm" style={{ color: "var(--accent-dijon)" }}>
          Generating {role} questions
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="text-5xl mb-6">⚠️</div>
        <p className="text-lg font-medium mb-6"
          style={{ color: "var(--text-primary)" }}>{error}</p>
        <button onClick={() => { setError(null); loadQuestions() }}
          className="btn-primary px-8 py-3 rounded-xl mb-4 text-sm">
          Try Again
        </button>
        <button onClick={() => navigate("/")}
          className="text-sm" style={{ color: "var(--text-secondary)" }}>
          ← Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Progress */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium"
            style={{ color: "var(--accent-dijon)" }}>
            {role} Interview
          </span>
          <span className="text-xs"
            style={{ color: "var(--text-secondary)" }}>
            {currentQ + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full h-0.5 rounded-full"
          style={{ background: "var(--border-ash)" }}>
          <div className="progress-bar h-0.5"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Main Card */}
      <div className="card rounded-2xl p-8 w-full max-w-2xl">

        {/* Question */}
        <div className="mb-6 pl-4 border-l-2"
          style={{ borderColor: "var(--accent-pistachio)" }}>
          <p className="text-xs uppercase tracking-widest mb-2"
            style={{ color: "var(--text-secondary)" }}>
            Question {currentQ + 1}
          </p>
          <p className="text-lg font-medium leading-relaxed"
            style={{ color: "var(--text-primary)" }}>
            {questions[currentQ]}
          </p>
        </div>

        {/* Answer */}
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Share your thoughts... use specific examples for best results"
          rows={6}
          className="textarea-custom w-full rounded-xl px-4 py-3 mb-6 text-sm"
        />

        {/* Button */}
        <button
          onClick={handleNext}
          disabled={evaluating}
          className="btn-primary w-full py-3.5 rounded-xl text-sm disabled:opacity-50"
        >
          {evaluating ? "Evaluating your answer..." :
            currentQ + 1 < questions.length
              ? "Next Question →"
              : "Complete Interview →"}
        </button>

      </div>
    </div>
  )
}

export default Interview