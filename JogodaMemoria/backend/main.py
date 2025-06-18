from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_db_connection
from models import PlayerScore, RankingItem
import uvicorn

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/save-score/")
async def save_score(score_data: PlayerScore):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            """
            INSERT INTO ranking (player_name, score, time, element)
            VALUES (?, ?, ?, ?)
            """,
            (score_data.player_name, score_data.score, score_data.time, score_data.element)
        )
        conn.commit()
        return {"message": "Score saved successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/ranking/", response_model=list[RankingItem])
async def get_ranking(limit: int = 10):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            """
            SELECT player_name, score, time, element, date
            FROM ranking
            ORDER BY score DESC, time ASC
            LIMIT ?
            """,
            (limit,)
        )
        ranking = cursor.fetchall()
        return ranking
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/player-scores/{player_name}", response_model=list[RankingItem])
async def get_player_scores(player_name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            """
            SELECT player_name, score, time, element, date
            FROM ranking
            WHERE player_name = ?
            ORDER BY score DESC
            """,
            (player_name,)
        )
        scores = cursor.fetchall()
        return scores
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)