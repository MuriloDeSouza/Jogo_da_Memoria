from pydantic import BaseModel
from datetime import datetime

class PlayerScore(BaseModel):
    player_name: str
    score: int
    time: int
    element: str

class RankingItem(BaseModel):
    player_name: str
    score: int
    time: int
    element: str
    date: datetime