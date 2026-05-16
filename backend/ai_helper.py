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
    prompt = f"""
    Generate exactly 5 interview questions for a {role} position.
    Return ONLY a numbered list like this:
    1. Question one
    2. Question two
    3. Question three
    4. Question four
    5. Question five
    No extra text, just the 5 questions.
    """
    response = ask_groq(prompt)
    lines = response.strip().split("\n")
    questions = []
    for line in lines:
        line = line.strip()
        if line and line[0].isdigit():
            question = line.split(".", 1)[-1].strip()
            questions.append(question)
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