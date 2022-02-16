from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from matchup import get_matchups
from stats import get_stats

def create_api():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app

app = create_api()

@app.get("/")
def read(num_games: int, venue: str):
    return get_stats(num_games, venue)

@app.get("/matchups")
def read():
    return get_matchups()
