from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
from google import genai
from duckduckgo_search import DDGS

load_dotenv()

app = FastAPI(title="StreamShield Piracy Scanner API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize API Keys
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
else:
    gemini_client = None

class SearchQuery(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"message": "Welcome to StreamShield AI API"}

@app.post("/api/youtube-search")
def youtube_search(request: SearchQuery):
    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YouTube API Key not configured.")
    
    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        
        # Search for recent videos
        enhanced_youtube_query = f"{request.query} stream"
        video_request = youtube.search().list(
            q=enhanced_youtube_query,
            part='snippet',
            type='video',
            order='relevance',
            maxResults=10
        )
        video_response = video_request.execute()
        
        # Search for live streams
        live_query = f"{request.query} live free"
        live_request = youtube.search().list(
            q=live_query,
            part='snippet',
            type='video',
            eventType='live',
            order='relevance',
            maxResults=10
        )
        live_response = live_request.execute()
        
        return {
            "query": request.query,
            "recent_videos": video_response.get("items", []),
            "live_streams": live_response.get("items", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/web-scan")
def web_scan(request: SearchQuery):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured.")
    
    try:
        # 1. Generate Similar Keywords using Gemini
        prompt = f"Generate a comma-separated list of 10 to 15 alternative search keywords or phrases related to: '{request.query}'. This is for discovering unauthorized streaming or piracy sites. Provide ONLY the comma-separated list, nothing else."
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        generated_text = response.text.strip()
        similar_keywords = [kw.strip() for kw in generated_text.split(",") if kw.strip()]
        
        # 2. Perform DuckDuckGo Search for piracy detection
        search_results = []
        enhanced_query = f"{request.query} live stream free"
        
        # Using DuckDuckGo Search
        with DDGS() as ddgs:
            results = list(ddgs.text(enhanced_query, max_results=5))
            
            for item in results:
                search_results.append({
                    "title": item.get("title"),
                    "link": item.get("href"),
                    "snippet": item.get("body"),
                    "risk_score": 85 # Simulated risk score
                })
        
        # Always inject some simulated clone websites
        simulated_clones = [
            {
                "title": f"Watch {request.query} HD Live Free",
                "link": "https://stream-pirate-site-example.com/live",
                "snippet": f"Watch {request.query} live stream in 1080p HD without any ads. Click here to join the broadcast for free.",
                "risk_score": 98
            },
            {
                "title": f"{request.query} - Free Sports Stream",
                "link": "https://sports-clone-hub.net/match",
                "snippet": f"Access the live stream for {request.query} right now. No registration required.",
                "risk_score": 92
            }
        ]
        search_results.extend(simulated_clones)
            
        return {
            "original_query": request.query,
            "generated_keywords": similar_keywords,
            "piracy_results": search_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
