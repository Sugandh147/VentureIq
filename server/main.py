import os
import time
import json
import re
from datetime import datetime
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
import google.generativeai as genai



import db

load_dotenv()

app = FastAPI(title="VentureIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    # Simple colorized logging in terminal
    status_code = response.status_code
    color = "\033[92m" if 200 <= status_code < 300 else "\033[93m" if 400 <= status_code < 500 else "\033[91m"
    reset = "\033[0m"
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {request.method} {request.url.path} -> {color}{status_code}{reset} ({process_time:.2f}s)")
    return response

# Pydantic models for requests
class StartupCreateRequest(BaseModel):
    name: str
    websiteUrl: Optional[str] = ""

class CommentRequest(BaseModel):
    text: str
    author: Optional[str] = "VC Analyst"

class VoteRequest(BaseModel):
    voteType: Optional[str] = None # 'invest', 'watch', 'pass', or null

class DealScenarioRequest(BaseModel):
    name: str
    preMoney: float
    roundSize: float
    optionPool: float
    liqPrefMultiplier: float
    isParticipating: bool

class ChatRequest(BaseModel):
    startupId: str
    message: str
    history: List[Dict[str, str]] = []


# Endpoints
@app.get("/api/user")
async def get_user_endpoint():
    return await db.get_user()

@app.post("/api/user/upgrade")
async def upgrade_user():
    return await db.update_user({"subscription": "pro", "analysisCredits": 9999})

@app.post("/api/user/reset")
async def reset_user():
    return await db.update_user({"subscription": "free", "analysisCredits": 1})

@app.get("/api/startups")
async def get_startups_endpoint():
    return await db.get_startups()

@app.post("/api/startups")
async def create_startup(req: StartupCreateRequest):
    if not req.name or len(req.name) < 2:
        raise HTTPException(status_code=400, detail="Invalid startup name")
        
    user = await db.get_user()
    if user.get("analysisCredits", 0) <= 0:
        raise HTTPException(status_code=403, detail="Credit limit reached. Please upgrade to Pro.")
        
    report = None
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY is missing. Please configure it in your environment to run actual data analysis.")
        
    print(f"Running real Gemini AI Due Diligence for '{req.name}'...")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
Analyze the startup "{req.name}" with website "{req.websiteUrl}". 
Return a COMPLETE due diligence report as a JSON object STRICTLY following this exact structure. 
Be highly aggressive, analytical, and concise like a senior VC partner. DO NOT USE FLUFF. DO NOT HALLUCINATE metrics.

{{
  "name": "{req.name}",
  "websiteUrl": "{req.websiteUrl}",
  "whatTheyDo": "One sentence. No jargon.",
  "market": {{
    "size": "...",
    "growthRate": "...",
    "crowdingLevel": "WIDE OPEN, CONTESTED, or SATURATED"
  }},
  "tractionPulse": {{
    "metrics": "ARR / Users / Growth MoM",
    "benchmark": "benchmark vs stage peers",
    "flag": "✅ On track, ⚠️ Lagging, or 🔴 Missing data"
  }},
  "moatRating": {{
    "rating": "NONE, WEAK, MODERATE, or STRONG",
    "reason": "one-line reason"
  }},
  "teamSignal": "Domain fit · Prior exits · Red flags — max 2 lines",
  "riskMatrix": {{
    "highestRisk": {{ "risk": "...", "reason": "..." }},
    "mediumRisk": {{ "risk": "...", "reason": "..." }},
    "manageableRisk": {{ "risk": "...", "reason": "..." }}
  }},
  "capTableHealth": {{
    "status": "CLEAN or FLAG",
    "issue": "one specific issue or green light"
  }},
  "verdict": {{
    "decision": "✅ INVEST, 👀 WATCH, or ❌ PASS",
    "reason": "Here's why in one sentence."
  }},
  "dateAnalyzed": "{datetime.now().strftime('%Y-%m-%d')}"
}}

RETURN ONLY VALID JSON.
"""
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        text = response.text
        cleaned_text = re.sub(r'^```json|```$', '', text.strip(), flags=re.IGNORECASE).strip()
        report = json.loads(cleaned_text)
    except Exception as e:
        print(f"Gemini analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate analysis using Gemini API. Error: {e}")
        
    report["id"] = re.sub(r'[^a-z0-9]', '', req.name.lower()) + "_" + str(int(time.time()))[-4:]
    
    await db.add_startup(report)
    
    if user.get("analysisCredits", 1) != 9999:
        await db.update_user({"analysisCredits": max(0, user.get("analysisCredits", 1) - 1)})
        
    return report

@app.delete("/api/startups/{startup_id}")
async def delete_startup_endpoint(startup_id: str):
    await db.delete_startup(startup_id)
    return {"success": True}

@app.get("/api/startups/{startup_id}/signals")
async def get_signals(startup_id: str):
    return [
        {
            "id": "sig1",
            "timestamp": datetime.fromtimestamp(time.time() - 3600*3).isoformat(),
            "type": "Domain Activity",
            "title": "WHOIS Database Update",
            "content": "Domain lease extended. Server nameservers updated.",
            "status": "neutral"
        },
        {
            "id": "sig2",
            "timestamp": datetime.fromtimestamp(time.time() - 3600*24).isoformat(),
            "type": "Social Sentiment",
            "title": "Spike in Dev Mentions",
            "content": "Activity index raised by 18% on GitHub discussions.",
            "status": "positive"
        },
        {
            "id": "sig3",
            "timestamp": datetime.fromtimestamp(time.time() - 3600*240).isoformat(),
            "type": "Job Board Activity",
            "title": "New Hiring Posting Detected",
            "content": "Opened engineering positions looking for senior backend development.",
            "status": "neutral"
        }
    ]

@app.get("/api/startups/{startup_id}/comments")
async def get_comments_endpoint(startup_id: str):
    return await db.get_comments(startup_id)

@app.post("/api/startups/{startup_id}/comments")
async def add_comment_endpoint(startup_id: str, req: CommentRequest):
    comment = {
        "id": "c_" + str(int(time.time() * 1000)),
        "text": req.text,
        "author": req.author,
        "timestamp": datetime.now().isoformat()
    }
    return await db.add_comment(startup_id, comment)

@app.delete("/api/startups/{startup_id}/comments/{comment_id}")
async def delete_comment_endpoint(startup_id: str, comment_id: str):
    await db.delete_comment(startup_id, comment_id)
    return {"success": True}

@app.get("/api/startups/{startup_id}/votes")
async def get_votes_endpoint(startup_id: str):
    return await db.get_votes(startup_id)

@app.post("/api/startups/{startup_id}/vote")
async def cast_vote_endpoint(startup_id: str, req: VoteRequest):
    return await db.cast_vote(startup_id, req.voteType)

@app.get("/api/deal-calculator/scenarios")
async def get_deal_scenarios_endpoint():
    return await db.get_deal_scenarios()

@app.post("/api/deal-calculator/scenarios")
async def save_deal_scenario_endpoint(req: DealScenarioRequest):
    scenario = req.model_dump()
    scenario["id"] = "sc_" + str(int(time.time() * 1000))
    scenario["timestamp"] = datetime.now().isoformat()
    return await db.save_deal_scenario(scenario)

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    startups = await db.get_startups()
    startup = next((s for s in startups if s["id"] == req.startupId), None)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found in database.")
        
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            history_str = "\n".join([f"{'Investor' if h['sender'] == 'user' else 'Co-pilot'}: {h['text']}" for h in req.history])
            
            system_prompt = f"""
You are VentureIQ's AI Startup Due Diligence Co-pilot. You are evaluating {startup['name']} ({startup['industry']}).
Here is the diligence report: {json.dumps(startup)}
Your tone is critical, analytical, objective, and professional. 
Review Market, Team, Product, Financials, Risks. Keep responses concise, using bullet points.
Chat History:
{history_str}
Investor: {req.message}
Co-pilot:"""
            response = model.generate_content(system_prompt)
            return {"reply": response.text}
        except Exception as e:
            print(f"Chat error: {e}")
            
    # Fallback local logic
    return {"reply": f"**Local AI Co-pilot**: Analyzing query regarding {startup['name']}... (Please add GEMINI_API_KEY for deep analysis). \n\nQuery received: {req.message}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
