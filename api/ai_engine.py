import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_match(profile: dict, job: dict) -> dict:
    prompt = f"""
You are an AI job matching engine for ZimJobMatch, a platform for Zimbabwean job seekers.

Analyze how well this candidate matches the job and return a JSON response.

CANDIDATE PROFILE:
- Name: {profile['name']}
- Title: {profile['title']}
- Experience: {profile['experience_years']} years
- Skills: {', '.join(profile['skills'])}
- Bio: {profile['bio']}

JOB:
- Title: {job['title']}
- Company: {job['company']}
- Location: {job['location']}
- Required skills: {', '.join(job['chips'])}

Return ONLY a JSON object with this exact structure, no extra text:
{{
  "match": <integer 0-100>,
  "scores": {{
    "skills": <integer 0-100>,
    "experience": <integer 0-100>,
    "culture": <integer 0-100>,
    "growth": <integer 0-100>
  }},
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>"
  ],
  "gaps": [
    "<specific gap 1>",
    "<specific gap 2>"
  ],
  "tips": [
    "<specific application tip 1>",
    "<specific application tip 2>"
  ]
}}

Rules:
- Be specific to the candidate and job, not generic
- Strengths should reference actual skills from the candidate profile
- Gaps should be honest and constructive
- Tips should be actionable advice for applying to this specific company in Zimbabwe
- Match score should reflect genuine compatibility
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        text = response.text.strip()

        # Strip markdown code fences if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()

        return json.loads(text)

    except Exception as e:
        print(f"Gemini error: {e}")
        return {
            "match": 70,
            "scores": {"skills": 70, "experience": 70, "culture": 70, "growth": 70},
            "strengths": ["Your profile shows relevant experience for this role"],
            "gaps": ["Review the job description for specific requirements"],
            "tips": ["Tailor your application to highlight relevant experience"],
        }
