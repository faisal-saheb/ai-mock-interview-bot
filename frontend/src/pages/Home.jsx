import { useNavigate } from "react-router-dom"
import { useState } from "react"

const roles = [
  { title: "Product Manager", icon: "🎯" },
  { title: "Software Engineer", icon: "💻" },
  { title: "Data Analyst", icon: "📊" },
  { title: "Frontend Developer", icon: "🎨" },
  { title: "Backend Developer", icon: "⚙️" },
  { title: "UI/UX Designer", icon: "✏️" },
  { title: "Marketing Manager", icon: "📢" },
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Subtle background texture */}
      <div className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(200,169,81,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(107,124,74,0.05) 0%, transparent 50%)"
        }} />

      <div className="relative z-10 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-5">🤖</div>
          <h1 className="text-5xl mb-3 comic-text"
  style={{ color: "var(--accent-dijon)" }}>
  AI MOCK INTERVIEW
</h1>
<div className="w-16 h-0.5 mx-auto mb-4"
  style={{ background: "var(--accent-teal)" }} />
<p style={{ color: "var(--text-secondary)" }}
  className="text-sm leading-relaxed">
  Practice with AI — get honest feedback,<br />
  real scores and improve faster
</p>
        </div>

        {/* Card */}
        <div className="card rounded-2xl p-6">

         <p className="comic-text text-xl mb-4"
  style={{ color: "var(--accent-teal)" }}>
  SELECT YOUR ROLE
</p>

          {/* Roles */}
          <div className="space-y-2 mb-6">
            {roles.map((role) => (
              <button
                key={role.title}
                onClick={() => setSelectedRole(role.title)}
                className={`role-card w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${selectedRole === role.title ? "selected" : ""}`}
              >
                <span>{role.icon}</span>
                <span className="text-sm font-medium"
                  style={{ color: selectedRole === role.title ? "var(--accent-dijon)" : "var(--text-primary)" }}>
                  {role.title}
                </span>
                {selectedRole === role.title && (
                  <span className="ml-auto text-xs"
                    style={{ color: "var(--accent-dijon)" }}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Button */}
          <button
            onClick={handleStart}
            disabled={!selectedRole}
            className="btn-primary w-full py-3.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Begin Interview →
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6"
          style={{ color: "var(--text-secondary)" }}>
          Powered by Groq + Llama3 · Free & Private
        </p>

      </div>
    </div>
  )
}

export default Home