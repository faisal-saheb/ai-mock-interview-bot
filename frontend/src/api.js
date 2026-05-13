const BASE_URL = "http://127.0.0.1:8000/api"

export async function getQuestions(role) {
  const response = await fetch(`${BASE_URL}/generate-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role })
  })
  const data = await response.json()
  return data.questions
}

export async function evaluateAnswer(role, question, answer) {
  const response = await fetch(`${BASE_URL}/evaluate-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, question, answer })
  })
  const data = await response.json()
  return data
}
