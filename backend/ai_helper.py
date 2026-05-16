from groq import Groq

import os
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL_NAME = "llama3-8b-8192"

def ask_groq(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def generate_questions(role: str) -> list:
    prompt = f"""Generate exactly 5 interview questions for a {role} position.
Return ONLY a numbered list. No extra text.
1. First question here
2. Second question here
3. Third question here
4. Fourth question here
5. Fifth question here"""
    
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
            f"Tell me about your experience relevant to {role}?",
            f"What are your key strengths for this {role} position?",
            f"Where do you see yourself in 5 years as a {role}?",
            f"Describe a challenge you faced and how you solved it?",
            f"Why do you want this {role} role specifically?"
        ]
    return questions[:5]

def evaluate_answer(role: str, question: str, answer: str) -> dict:
    prompt = f"""
    You are an expert interviewer for {role} positions.
    
    Question: {question}
    Candidate Answer: {answer}
    
    Evaluate this answer and respond in this EXACT format:
    SCORE: [number between 1-10]
    FEEDBACK: [2-3 sentences of specific feedback]
    IDEAL: [one sentence about what a perfect answer includes]
    """
    response = ask_groq(prompt)
    
    score = 7
    feedback = "Good answer overall."
    ideal = "Focus on specific examples."
    
    lines = response.strip().split("\n")
    for line in lines:
        if line.startswith("SCORE:"):
            try:
                score = int(line.replace("SCORE:", "").strip())
            except:
                score = 7
        elif line.startswith("FEEDBACK:"):
            feedback = line.replace("FEEDBACK:", "").strip()
        elif line.startswith("IDEAL:"):
            ideal = line.replace("IDEAL:", "").strip()
    
    return {
        "score": score,
        "feedback": feedback,
        "ideal": ideal
    }