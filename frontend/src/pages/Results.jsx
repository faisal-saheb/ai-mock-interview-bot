import { useLocation, useNavigate } from "react-router-dom"

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { results = [], role = "" } = location.state || {}

  const totalScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length * 10)
    : 0

  const getScoreClass = (score) => {
    if (score >= 8) return "score-high"
    if (score >= 5) return "score-mid"
    return "score-low"
  }

  const getOverallEmoji = () => {
    if (totalScore >= 80) return "🏆"
    if (totalScore >= 60) return "👍"
    return "💪"
  }

  const getOverallMessage = () => {
    if (totalScore >= 80) return "Outstanding Performance!"
    if (totalScore >= 60) return "Good Effort — Keep Improving!"
    return "Keep Practicing — You'll Get There!"
  }

  return (
    <div className="min-h-screen px-4 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">{getOverallEmoji()}</div>
        <h1 className="text-3xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}>
          Interview Complete
        </h1>
        <div className="w-12 h-0.5 mx-auto mb-3"
          style={{ background: "var(--accent-dijon)" }} />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {getOverallMessage()}
        </p>
      </div>

      {/* Score Card */}
      <div className="card rounded-2xl p-8 w-full max-w-md mx-auto text-center mb-8">
        <p className="text-xs uppercase tracking-widest mb-4"
          style={{ color: "var(--text-secondary)" }}>
          Overall Score
        </p>
        <p className="text-8xl font-bold mb-1"
          style={{ color: "var(--accent-dijon)" }}>
          {totalScore}
        </p>
        <p className="text-sm mb-6"
          style={{ color: "var(--text-secondary)" }}>
          out of 100
        </p>

        {/* Progress */}
        <div className="w-full h-1 rounded-full mb-6"
          style={{ background: "var(--border-ash)" }}>
          <div className="progress-bar h-1"
            style={{ width: `${totalScore}%` }} />
        </div>

        <div className="flex justify-center gap-4">
          <div className="px-4 py-2 rounded-lg text-xs"
            style={{
              background: "rgba(168,184,122,0.1)",
              color: "var(--accent-pistachio)",
              border: "1px solid rgba(168,184,122,0.2)"
            }}>
            ✅ {results.length} Questions
          </div>
          <div className="px-4 py-2 rounded-lg text-xs"
            style={{
              background: "rgba(200,169,81,0.1)",
              color: "var(--accent-dijon)",
              border: "1px solid rgba(200,169,81,0.2)"
            }}>
            ⭐ {results.length > 0
              ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
              : 0}/10 Avg
          </div>
        </div>
      </div>

      {/* Question Breakdown */}
      <div className="max-w-2xl mx-auto space-y-4 mb-8">
        {results.map((result, index) => (
          <div key={index} className="card rounded-2xl p-6">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}>
                Question {index + 1}
              </p>
              <span className={`text-lg font-bold ${getScoreClass(result.score)}`}>
                {result.score}/10
              </span>
            </div>
            <p className="text-sm font-medium mb-3 leading-relaxed"
              style={{ color: "var(--text-primary)" }}>
              {result.question}
            </p>
            <div className="w-full h-px mb-3"
              style={{ background: "var(--border-ash)" }} />
            <p className="text-xs mb-2 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}>
              📝 {result.feedback}
            </p>
            <p className="text-xs leading-relaxed"
              style={{ color: "var(--accent-pistachio)" }}>
              💡 {result.ideal}
            </p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 w-full max-w-md mx-auto">
        <button onClick={() => navigate("/")}
          className="btn-secondary flex-1 py-3.5 rounded-xl text-sm">
          ← Home
        </button>
        <button onClick={() => navigate("/")}
          className="btn-primary flex-1 py-3.5 rounded-xl text-sm">
          Try Again →
        </button>
      </div>

    </div>
  )
}

export default Results