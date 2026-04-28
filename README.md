# StreamShield AI 🛡️

StreamShield AI is a premium, real-time digital asset protection platform designed to monitor and detect unauthorized broadcasts, streams, and piracy clones across the web and YouTube. By leveraging AI-driven discovery, the system dynamically hunts for copyright infringements related to live sports and exclusive media.

## Features ✨

- **Smart AI Discovery Pipeline**: Utilizes Google's Gemini AI (`google-genai`) to automatically expand a single match title into 10-15 highly relevant keyword variations to outsmart pirates who try to evade standard keyword blocking.
- **YouTube Live Scanner**: Directly integrates with the YouTube Data API v3 to identify high-risk, unauthorized live streams and recent video uploads matching the protected media.
- **External Web Piracy Scanner**: Utilizes DuckDuckGo Search to crawl the web for external clone sites and illegitimate broadcasting hubs, injecting simulated high-risk hits for demonstration and testing purposes.
- **Dynamic Risk Evaluation**: AI-driven analysis automatically assigns risk badges (High vs. Low) to sources depending on title string similarities and contextual clues.
- **Premium Real-Time Dashboard**: A high-end React frontend built with Vite, featuring dynamic glassmorphism, responsive data tables, and a sleek dark mode.

## Tech Stack 🛠️

- **Backend**: Python, FastAPI, Uvicorn, Google Gemini SDK (`google-genai`), YouTube Data API, DuckDuckGo Search.
- **Frontend**: React (Vite), React Router, Lucide React (Icons), Vanilla CSS (Custom Design System).

## Getting Started 🚀

### Prerequisites
Make sure you have [Python 3.x](https://www.python.org/downloads/) and [Node.js](https://nodejs.org/) installed.

### 1. Environment Configuration

1. Inside the `backend/` directory, open the `.env.example` file and save a copy of it named exactly `.env`.
2. Fill in your required API keys inside the `backend/.env` file:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 2. Running the Application (Windows)

The easiest way to start both the frontend and the backend simultaneously on Windows is to double-click the `run.bat` script in the root directory. This batch script will:
- Automatically activate your Python virtual environment and start the FastAPI backend server on Port `8000`.
- Open a second terminal window to launch the Vite development server for the React frontend on Port `5173`.

Alternatively, you can run them manually:

**Backend:**
```bash
# Navigate to backend and activate virtual environment
cd backend
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Start the server
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
Once both servers are running, open your browser to `http://localhost:5173`. 
Enter a query like "Super Bowl LVIII" or "Champions League Final" into the search bar, click "Start Scan", and watch the AI dashboard flag unauthorized streams and web clones in real time!

## Project Structure 📁

- `backend/` - The core FastAPI backend application workspace.
  - `main.py` - Core logic containing the YouTube and Web scanning logic.
  - `requirements.txt` - Python dependencies for the backend.
- `run.bat` - Execution script to quickly boot up the entire stack.
- `frontend/` - The React application workspace.
  - `src/Dashboard.jsx` - The main Piracy Monitoring Dashboard component.
  - `src/index.css` - The custom vanilla CSS design system and theme tokens.
