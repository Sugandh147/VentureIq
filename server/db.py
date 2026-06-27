import json
import os
import asyncio
from pathlib import Path

# We'll use a simple file lock to prevent concurrent write issues in development
db_lock = asyncio.Lock()

DB_FILE = Path(__file__).parent / "db.json"

DEFAULT_DB = {
    "user": {
        "subscription": "free",
        "analysisCredits": 1
    },
    "startups": [],
    "comments": {},
    "votes": {},
    "dealScenarios": []
}

async def read_db():
    if not DB_FILE.exists():
        await write_db(DEFAULT_DB)
        return DEFAULT_DB
        
    async with db_lock:
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return DEFAULT_DB

async def write_db(data):
    async with db_lock:
        temp_path = DB_FILE.with_suffix(".tmp")
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        os.replace(temp_path, DB_FILE)

async def get_user():
    db = await read_db()
    return db.get("user", DEFAULT_DB["user"])

async def update_user(user_data):
    db = await read_db()
    db["user"] = {**db.get("user", DEFAULT_DB["user"]), **user_data}
    await write_db(db)
    return db["user"]

async def get_startups():
    db = await read_db()
    return db.get("startups", [])

async def add_startup(startup):
    db = await read_db()
    startups = db.get("startups", [])
    
    # Check for existing
    index = next((i for i, s in enumerate(startups) if s["id"] == startup["id"] or s["name"].lower() == startup["name"].lower()), -1)
    
    if index != -1:
        startups[index] = {**startups[index], **startup}
    else:
        startups.insert(0, startup)
        
    db["startups"] = startups
    await write_db(db)
    return startup

async def delete_startup(startup_id):
    db = await read_db()
    db["startups"] = [s for s in db.get("startups", []) if s["id"] != startup_id]
    if startup_id in db.get("comments", {}):
        del db["comments"][startup_id]
    if startup_id in db.get("votes", {}):
        del db["votes"][startup_id]
    await write_db(db)

async def get_comments(startup_id):
    db = await read_db()
    return db.get("comments", {}).get(startup_id, [])

async def add_comment(startup_id, comment):
    db = await read_db()
    comments = db.setdefault("comments", {})
    startup_comments = comments.setdefault(startup_id, [])
    startup_comments.append(comment)
    await write_db(db)
    return comment

async def delete_comment(startup_id, comment_id):
    db = await read_db()
    comments = db.get("comments", {})
    if startup_id in comments:
        comments[startup_id] = [c for c in comments[startup_id] if c["id"] != comment_id]
        await write_db(db)

async def get_votes(startup_id):
    db = await read_db()
    return db.get("votes", {}).get(startup_id, {"invest": 0, "watch": 0, "pass": 0, "userVote": None})

async def cast_vote(startup_id, vote_type):
    db = await read_db()
    votes = db.setdefault("votes", {})
    current_vote = votes.setdefault(startup_id, {"invest": 0, "watch": 0, "pass": 0, "userVote": None})
    
    # Undo previous vote
    if current_vote["userVote"]:
        prev_vote = current_vote["userVote"]
        current_vote[prev_vote] = max(0, current_vote[prev_vote] - 1)
        
    # Record new vote
    if vote_type:
        current_vote[vote_type] = current_vote.get(vote_type, 0) + 1
        current_vote["userVote"] = vote_type
    else:
        current_vote["userVote"] = None
        
    # Recalculate recommendation
    startup = next((s for s in db.get("startups", []) if s["id"] == startup_id), None)
    if startup:
        total = current_vote["invest"] + current_vote["watch"] + current_vote["pass"]
        if total > 0:
            invest_ratio = current_vote["invest"] / total
            pass_ratio = current_vote["pass"] / total
            if invest_ratio >= 0.5:
                startup["recommendation"] = "Strong Invest"
            elif invest_ratio >= 0.25:
                startup["recommendation"] = "Invest"
            elif pass_ratio >= 0.5:
                startup["recommendation"] = "Avoid"
            else:
                startup["recommendation"] = "Investigate Further"
                
    await write_db(db)
    return current_vote

async def get_deal_scenarios():
    db = await read_db()
    return db.get("dealScenarios", [])

async def save_deal_scenario(scenario):
    db = await read_db()
    scenarios = db.setdefault("dealScenarios", [])
    scenarios.append(scenario)
    await write_db(db)
    return scenario
