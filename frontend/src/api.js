const BASE_URL = "https://ai-mock-interview-bot.onrender.com/api"

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response
    } catch (error) {
      console.log(`Attempt ${i + 1} failed, retrying...`)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }
  }
  throw new Error("Server is waking up, please try again!")
}

export async function getQuestions(role) {
  try {
    const response = await fetchWithRetry(
      `${BASE_URL}/generate-questions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      }
    )
    const data = await response.json()
    return data.questions
  } catch (error) {
    throw new Error("AI is waking up! Please click Start Interview again.")
  }
}

export async function evaluateAnswer(role, question, answer) {
  try {
    const response = await fetchWithRetry(
      `${BASE_URL}/evaluate-answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, question, answer })
      }
    )
    const data = await response.json()
    return data
  } catch (error) {
    return {
      score: 7,
      feedback: "Good answer! Server was busy, default score given.",
      ideal: "Try submitting again for AI evaluation."
    }
  }
}