from groq import Groq
import os

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL_NAME = "llama3-8b-8192"

def ask_groq(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior HR recruiter and technical interviewer with 15 years of experience at top companies like Google, Amazon, and McKinsey. You ask precise, real-world interview questions and evaluate answers strictly but fairly."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def generate_questions(role: str) -> list:
    prompt = f"""You are a senior recruiter at a top tech company interviewing a candidate for a {role} position.

Generate exactly 5 real interview questions that you would ACTUALLY ask in a real interview.
Mix these types:
- 1 behavioral question (Tell me about a time...)
- 1 situational question (What would you do if...)
- 1 technical/role-specific question
- 1 problem-solving question
- 1 strategic thinking question

Rules:
- Questions must be specific to {role} role
- No generic questions like "tell me your strengths"
- Make them challenging and realistic
- Return ONLY numbered list, no extra text

1. First question
2. Second question
3. Third question
4. Fourth question
5. Fifth question"""

    response = ask_groq(prompt)
    lines = response.strip().split("\n")
    questions = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line[0].isdigit():
            parts = line.split(".", 1)
            if len(parts) > 1:
                question = parts[1].strip()
                if question:
                    questions.append(question)

    if len(questions) < 3:
        questions = [
            f"Tell me about a specific challenge you faced in a {role} context and exactly how you resolved it.",
            f"How would you handle a situation where stakeholders disagreed on priorities in your {role} role?",
            f"Walk me through your decision-making process when you had limited data as a {role}.",
            f"Describe a project where you failed as a {role} and what you learned from it.",
            f"How do you measure success in your work as a {role}?"
        ]
    return questions[:5]

def evaluate_answer(role: str, question: str, answer: str) -> dict:
    prompt = f"""You are a strict but fair senior interviewer evaluating a {role} candidate.

Question Asked: {question}

Candidate's Answer: {answer}

Evaluate this answer like a real recruiter would. Be honest and precise.

Scoring criteria:
- 9-10: Exceptional — specific examples, structured (STAR), shows deep expertise
- 7-8: Good — clear answer with some examples, minor gaps
- 5-6: Average — relevant but vague, lacks specifics or structure  
- 3-4: Below average — too generic, missing key points
- 1-2: Poor — off-topic, very weak or no real answer given

IMPORTANT: If the answer is very short, vague or just 1-2 words, give score 1-3 maximum.
If answer is detailed with examples, give 7-10.
Be realistic — not everyone gets 7+.

Respond in EXACTLY this format:
SCORE: [single number 1-10]
FEEDBACK: [2-3 sentences — what was good, what was missing]
IDEAL: [1 sentence — what a perfect answer would include]"""

    response = ask_groq(prompt)

    score = 5
    feedback = "Answer needs more specific examples and structure."
    ideal = "Use the STAR method with concrete examples from your experience."

    lines = response.strip().split("\n")
    for line in lines:
        line = line.strip()
        if line.startswith("SCORE:"):
            try:
                num = line.replace("SCORE:", "").strip()
                score = int(''.join(filter(str.isdigit, num)))
                score = max(1, min(10, score))
            except:
                score = 5
        elif line.startswith("FEEDBACK:"):
            feedback = line.replace("FEEDBACK:", "").strip()
        elif line.startswith("IDEAL:"):
            ideal = line.replace("IDEAL:", "").strip()

    return {
        "score": score,
        "feedback": feedback,
        "ideal": ideal
    }