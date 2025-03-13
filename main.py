from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from typing import List, Optional

# File to store tournament data
DATA_FILE = "data.json"

app = FastAPI()

# Models
class Player(BaseModel):
    id: int
    name: str
    played: int = 0
    won: int = 0
    lost: int = 0
    points: int = 0

class Match(BaseModel):
    id: int
    player1Id: int
    player2Id: int
    completed: bool = False
    winner: Optional[int] = None  # FIXED: Allow None values
    groupId: str

class Group(BaseModel):
    id: str
    name: str
    players: List[Player]
    matches: List[Match]

class TournamentData(BaseModel):
    groups: List[Group]

# Load data from file
def load_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"groups": []}

# Save data to file
def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

@app.get("/")
def home():
    return {"message": "Welcome to Pool Tournament API"}

# Get all groups
@app.get("/groups", response_model=TournamentData)
def get_groups():
    return load_data()

# Get specific group by ID
@app.get("/group/{group_id}", response_model=Group)
def get_group(group_id: str):
    data = load_data()
    group = next((g for g in data["groups"] if g["id"] == group_id), None)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

# Get standings of a group
@app.get("/standings/{group_id}")
def get_standings(group_id: str):
    group = get_group(group_id)
    return {"group": group["name"], "standings": sorted(group["players"], key=lambda x: -x["points"])}

# Get fixtures (unplayed matches) for a group
@app.get("/fixtures/{group_id}")
def get_fixtures(group_id: str):
    group = get_group(group_id)
    fixtures = [match for match in group["matches"] if not match["completed"]]
    return {"group": group["name"], "fixtures": fixtures}

# Get completed matches for a group
@app.get("/completed/{group_id}")
def get_completed_matches(group_id: str):
    group = get_group(group_id)
    completed = [match for match in group["matches"] if match["completed"]]
    return {"group": group["name"], "completed_matches": completed}

# Update match result
@app.post("/update-match")
def update_match(match_id: int, winner_id: int):
    data = load_data()
    for group in data["groups"]:
        for match in group["matches"]:
            if match["id"] == match_id and not match["completed"]:
                match["completed"] = True
                match["winner"] = winner_id
                
                # Update player stats
                for player in group["players"]:
                    if player["id"] == match["player1Id"] or player["id"] == match["player2Id"]:
                        player["played"] += 1
                        if player["id"] == winner_id:
                            player["won"] += 1
                            player["points"] += 1  # Changed from +2 to +1
                        else:
                            player["lost"] += 1
                save_data(data)
                return {"message": "Match updated successfully"}
    
    raise HTTPException(status_code=404, detail="Match not found or already completed")

# Undo match result
@app.post("/undo-match")
def undo_match(match_id: int):
    data = load_data()
    for group in data["groups"]:
        for match in group["matches"]:
            if match["id"] == match_id and match["completed"]:
                winner_id = match["winner"]
                match["completed"] = False
                match["winner"] = None

                # Revert player stats
                for player in group["players"]:
                    if player["id"] == match["player1Id"] or player["id"] == match["player2Id"]:
                        player["played"] -= 1
                        if player["id"] == winner_id:
                            player["won"] -= 1
                            player["points"] -= 1
                        else:
                            player["lost"] -= 1
                
                save_data(data)
                return {"message": "Match undone successfully"}
    
    raise HTTPException(status_code=404, detail="Match not found or not completed")

# Reset tournament data
@app.post("/reset")
def reset_tournament():
    initial_data = {
        "groups": []  # Load from your initial structure if needed
    }
    save_data(initial_data)
    return {"message": "Tournament reset successfully"}
