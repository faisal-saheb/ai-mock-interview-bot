import { useNavigate } from "react-router-dom"
import { useState } from "react"

const roles = [
  "Product Manager",
  "Software Engineer",
  "Data Analyst",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Marketing Manager",
]

function Home() {
  const [selectedRole, setSelectedRole] = useState("")
  const navigate = useNavigate()

  const handleStart = () => {
    if (!selectedRole) {
      alert("Please select a job role first!")
      return
    }
    navigate("/interview", { state: { role: selectedRole } })
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-blue-400 mb-3">
          🤖 AI Mock Interview Bot
        </h1>
        <p className="text-gray-400 text-lg">
          Practice interviews with AI — get instant feedback and scores
        </p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-5">
          Select Your Job Role
        </h2>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="">-- Choose a role --</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button
          onClick={handleStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-200 text-lg"
        >
          Start Interview 🚀
        </button>
      </div>
      <p className="text-gray-600 text-sm mt-8">
        Powered by Ollama + Llama3 — 100% Free & Local AI
      </p>
    </div>
  )
}

export default Home