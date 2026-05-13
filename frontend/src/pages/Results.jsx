import { useLocation, useNavigate } from "react-router-dom"

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { results = [], role = "" } = location.state || {}

  const totalScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length * 10)
    : 0

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          🎉 Interview Complete!
        </h1>
        <p className="text-gray-400">Here's your AI evaluation for {role}</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-lg mx-auto shadow-2xl text-center mb-8">
        <p className="text-gray-400 mb-2">Overall Score</p>
        <p className="text-7xl font-bold text-blue-400 mb-2">{totalScore}</p>
        <p className="text-gray-400">out of 100</p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="bg-green-900 text-green-400 px-4 py-2 rounded-xl">
            ✅ Questions: {results.length}
          </div>
          <div className="bg-blue-900 text-blue-400 px-4 py-2 rounded-xl">
            ⭐ Avg: {results.length > 0
              ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
              : 0}/10
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 mb-8">
        {results.map((result, index) => (
          <div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-3">
              <p className="text-gray-400 text-sm">Question {index + 1}</p>
              <span className="bg-blue-900 text-blue-400 px-3 py-1 rounded-lg text-sm font-bold">
                {result.score}/10
              </span>
            </div>
            <p className="text-white font-medium mb-3">{result.question}</p>
            <p className="text-gray-400 text-sm mb-3">📝 {result.feedback}</p>
            <p className="text-green-400 text-sm">💡 {result.ideal}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 w-full max-w-lg mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition duration-200"
        >
          🏠 Home
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-200"
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  )
}

export default Results
