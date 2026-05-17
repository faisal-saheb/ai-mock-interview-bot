from groq import Groq
import os

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL_NAME = "llama3-8b-8192"

ROLE_CONTEXT = {
    "Product Manager": {
        "skills": "product roadmap, user research, PRD writing, stakeholder management, OKRs, A/B testing, prioritization frameworks like RICE/MoSCoW, go-to-market strategy",
        "companies": "Google, Amazon, Microsoft, Flipkart, Swiggy"
    },
    "Software Engineer": {
        "skills": "system design, data structures, algorithms, code reviews, scalability, REST APIs, microservices, debugging production issues, CI/CD",
        "companies": "Google, Amazon, Microsoft, Infosys, TCS"
    },
    "Data Analyst": {
        "skills": "SQL, Python, Tableau, data cleaning, statistical analysis, dashboards, KPI tracking, A/B testing, business insights",
        "companies": "Google, Amazon, Razorpay, Flipkart, Zomato"
    },
    "Frontend Developer": {
        "skills": "React, JavaScript, CSS, performance optimization, responsive design, state management, web accessibility, browser compatibility",
        "companies": "Google, Amazon, Razorpay, Swiggy, Freshworks"
    },
    "Backend Developer": {
        "skills": "Node.js/Python/Java, database design, REST APIs, system architecture, caching, message queues, security, scalability",
        "companies": "Google, Amazon, Razorpay, Freshworks, PhonePe"
    },
    "UI/UX Designer": {
        "skills": "user research, wireframing, prototyping, Figma, usability testing, design systems, information architecture, accessibility",
        "companies": "Google, Apple, Swiggy, Zomato, Razorpay"
    },
    "Marketing Manager": {
        "skills": "campaign strategy, SEO/SEM, brand positioning, customer acquisition, retention, marketing analytics, content strategy, budget management",
        "companies": "Google, Amazon, Unilever, P&G, Zomato"
    }
}

def ask_groq(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": """You are a brutally honest senior hiring manager at a top tech company with 20 years of experience. 
You interview candidates for senior positions and you ask deep, role-specific questions that reveal true expertise.
You never ask generic questions. You never give high scores for vague answers.
You evaluate answers exactly as a real recruiter would — most candidates score 4-6, only truly exceptional answers get 8+."""
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.5
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def generate_questions(role: str) -> list:
    context = ROLE_CONTEXT.get(role, {
        "skills": "core role responsibilities and industry knowledge",
        "companies": "top companies in the industry"
    })

    prompt = f"""You are the Head of Talent Acquisition at a top tech company interviewing a candidate for {role}.

The candidate claims to be experienced in: {context['skills']}

Generate 5 DEEP, SPECIFIC, CHALLENGING interview questions for this {role} role.

STRICT RULES:
- Each question must test REAL expertise in {role} work
- Reference actual tools, frameworks, and scenarios used in {context['skills']}
- Questions must require detailed, experienced answers — not generic ones
- NO questions like "tell me your strengths" or "where do you see yourself"
- Each question should take 2-3 minutes to answer properly
- Mix: 1 behavioral, 1 case study, 1 technical, 1 situational crisis, 1 strategic

EXAMPLES OF BAD QUESTIONS (never ask these):
- "Tell me about yourself"
- "What are your weaknesses"
- "Why do you want this job"

EXAMPLES OF GOOD QUESTIONS for reference:
- For PM: "Walk me through how you would prioritize a backlog of 50 features with conflicting stakeholder opinions and limited engineering bandwidth"
- For SWE: "Design a rate limiting system that handles 1 million requests per second with 99.9% uptime"

Now generate 5 such deep questions for {role}. Return ONLY numbered list.

1.
2.
3.
4.
5."""

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
                if len(question) > 20:
                    questions.append(question)

    if len(questions) < 3:
        if role == "Product Manager":
            questions = [
                "Walk me through how you prioritized a product roadmap when engineering capacity was cut by 40% mid-sprint. What framework did you use and what got cut?",
                "You launch a feature and DAU drops 15% within 48 hours. Walk me through your exact incident response process.",
                "How do you write a PRD for a feature where user research contradicts stakeholder requirements?",
                "Describe a time you had to kill a feature you personally championed. How did you make that call?",
                "How would you define and measure product-market fit for a B2B SaaS product entering a new market?"
            ]
        else:
            questions = [
                f"Describe the most complex technical challenge you solved in your {role} career. What was your exact approach?",
                f"Walk me through a situation where your work as a {role} directly impacted business revenue or user retention.",
                f"How do you handle a situation where your technical recommendation was rejected by leadership? Give a specific example.",
                f"Describe how you improved a broken process in your team. What metrics did you use to measure success?",
                f"You're given 2 weeks to deliver a project that needs 6 weeks. How do you handle this as a {role}?"
            ]
    return questions[:5]

def evaluate_answer(role: str, question: str, answer: str) -> dict:
    word_count = len(answer.split())
    
    # Step 1: Instant rejection for garbage answers
    if word_count < 8:
        return {
            "score": 1,
            "feedback": "This answer is far too short to evaluate. A real interview answer requires at least 3-4 detailed sentences with specific examples from your experience.",
            "ideal": "A strong answer uses the STAR method (Situation, Task, Action, Result) with specific metrics and role-relevant examples."
        }

    # Step 2: Two-phase intelligent evaluation
    prompt = f"""You are the strictest technical interviewer at a top company evaluating a {role} candidate.

INTERVIEW QUESTION:
{question}

CANDIDATE'S ANSWER:
{answer}

ANSWER WORD COUNT: {word_count} words

PHASE 1 — DEFINE PERFECT ANSWER:
First, think about what a truly expert {role} professional would answer for this question.
A perfect answer must include:
- Specific real-world examples with actual numbers/metrics
- Correct use of industry terminology and frameworks
- Clear logical structure (problem → approach → outcome)
- Evidence of hands-on experience in {role} work

PHASE 2 — STRICT COMPARISON:
Now compare the candidate's actual answer against that perfect benchmark.

CHECK THESE POINTS:
❌ Is the answer vague or generic? (costs 3 points)
❌ Does it lack specific examples or metrics? (costs 2 points)
❌ Does it miss key {role} concepts? (costs 2 points)
❌ Is it poorly structured or rambling? (costs 1 point)
❌ Does it contain incorrect information? (costs 3 points)
✅ Uses STAR method with specifics? (adds 2 points)
✅ Shows real expertise with correct terminology? (adds 2 points)
✅ Has measurable outcomes or metrics? (adds 1 point)

SCORING GUIDE — BE BRUTAL:
1-2: Answer is irrelevant, one-liner, or completely wrong
3-4: Answer is generic with zero specific examples or role knowledge
5-6: Answer is okay but lacks depth, specifics, or structure
7-8: Answer is good with examples and some role expertise shown
9-10: Answer is exceptional — specific metrics, STAR structure, deep expertise

REALITY CHECK:
- Most real candidates score 3-6
- Score 7+ only if answer genuinely impresses a senior {role} interviewer
- Never give 7+ just because the answer is long — it must be CORRECT and SPECIFIC
- A long but vague answer scores maximum 5

Now evaluate strictly and respond in EXACTLY this format:
SCORE: [number 1-10]
FEEDBACK: [2-3 sentences — mention exactly what was missing or wrong]
IDEAL: [1 sentence — what specific elements a perfect answer must have]"""

    response = ask_groq(prompt)

    score = 4
    feedback = "Your answer lacks the specific depth and role expertise expected at this level."
    ideal = "A strong answer uses STAR method with real metrics, specific tools, and concrete outcomes."

    lines = response.strip().split("\n")
    for line in lines:
        line = line.strip()
        if line.startswith("SCORE:"):
            try:
                num = ''.join(filter(str.isdigit, line.replace("SCORE:", "").strip()))
                score = int(num[0]) if num else 4
                score = max(1, min(10, score))
            except:
                score = 4
        elif line.startswith("FEEDBACK:"):
            feedback = line.replace("FEEDBACK:", "").strip()
        elif line.startswith("IDEAL:"):
            ideal = line.replace("IDEAL:", "").strip()

    # Hard code penalties — these override AI if it's being too generous
    if word_count < 20:
        score = min(score, 3)
        feedback = f"Your answer is too brief ({word_count} words). Recruiters expect detailed answers with examples. " + feedback
    elif word_count < 50:
        score = min(score, 5)

    # Check for filler/garbage answers
    garbage_phrases = [
        "i don't know", "idk", "nothing", "good", "fine", 
        "yes", "no", "ok", "okay", "maybe", "i will try",
        "i would do my best", "i am good at this"
    ]
    answer_lower = answer.lower().strip()
    if any(phrase in answer_lower for phrase in garbage_phrases) and word_count < 30:
        score = min(score, 2)
        feedback = "This type of response would immediately disqualify a candidate in a real interview. Provide detailed, specific answers."

    return {
        "score": score,
        "feedback": feedback,
        "ideal": ideal
    }