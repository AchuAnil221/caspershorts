# Casper Shorts — AI Video-to-Shorts SaaS Platform 🎬⚡

> Production-grade AI video repurposing platform inspired by OpusClip, Linear, and Stripe. Upload long-form videos or provide authorized YouTube sources, automatically detect viral hooks, frame speakers in 9:16 vertical video using computer vision, burn dynamic karaoke subtitles, and export multiple ready-to-publish YouTube Shorts, Instagram Reels, and TikToks.

---

## 🌟 Key Features

- **🎯 AI Highlight & Hook Detection**: Whisper transcription + LLM analysis identifies high-retention moments, storytelling arcs, punchlines, and assigns an AI Viral Quality Score (0–100).
- **📹 Smart Speaker Tracking (9:16)**: Computer vision face detection follows the active speaker across horizontal footage and dynamically frames them in vertical 9:16 without manual keyframing.
- **💬 Dynamic Karaoke Subtitles**: Word-level synchronized captions with 5 creator presets: *Minimal*, *Bold*, *Highlight*, *Creator Style*, and *Professional*.
- **✂️ Full Timeline Video Editor**: Browser-based editor with HTML5 video playback, trim handles, subtitle correction, aspect ratio switching (9:16, 1:1, 16:9), and crop control.
- **🎨 Brand Presets & Templates**: Customizable color palettes, fonts, logo watermarks, and caption position defaults.
- **💳 Multi-Currency Subscription Architecture**: Stripe (USD) and Razorpay (INR) checkout flows, minute quotas, and credit consumption tracking.
- **🛡️ Admin Operations Dashboard**: Live platform analytics, user credit adjustments, Celery queue monitoring, and task retry triggers.

---

## 🏗️ Architecture & Technology Stack

```
casper-shorts/
├── frontend/                  # Next.js 14 App Router + TypeScript + Tailwind CSS + Zustand
│   ├── src/
│   │   ├── app/               # Landing page, Auth, Dashboard, Video Editor, Admin
│   │   ├── components/        # Reusable UI primitives, editor canvas, clips grid
│   │   ├── hooks/             # useAuth, Supabase session
│   │   ├── lib/               # API clients, Supabase client, mock data
│   │   └── types/             # Shared TypeScript models
├── backend/                   # Python FastAPI + SQLAlchemy + Celery
│   ├── app/
│   │   ├── main.py            # FastAPI entry point, CORS, routers, WebSockets
│   │   ├── config.py          # Pydantic v2 settings
│   │   ├── database.py        # SQLAlchemy async engine & session
│   │   ├── models/            # User, Project, Video, Transcript, Clip, Template, Subscription
│   │   ├── routers/           # Auth, Projects, Videos, Processing, Clips, Subscriptions, Admin
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # FFmpeg processor, Whisper, GPT-4o analysis, Speaker tracking, Captions
│   │   └── tasks/             # Celery distributed workers & Redis pub/sub
├── docker-compose.yml         # Containerized services (PostgreSQL, Redis, API, Worker, Web)
└── .env.example               # Environment variables template
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.10+
- **FFmpeg**: `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Ubuntu)
- **Redis**: For background Celery task processing (optional for frontend preview)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application:
- **Landing Page**: `http://localhost:3000`
- **User Dashboard**: `http://localhost:3000/dashboard`
- **Create New Video**: `http://localhost:3000/dashboard/create`
- **Generated Clips**: `http://localhost:3000/dashboard/clips`
- **Timeline Video Editor**: `http://localhost:3000/editor/clip-1`
- **Brand Templates**: `http://localhost:3000/dashboard/templates`
- **Super Admin Console**: `http://localhost:3000/admin`

### 3. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Interactive OpenAPI / Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 4. Background Workers (Celery)
```bash
cd backend
celery -A app.tasks.celery_app worker --loglevel=info
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

| Key | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key for Whisper transcription and GPT-4o analysis |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key |
| `DATABASE_URL` | PostgreSQL connection string (`postgresql+asyncpg://...`) |
| `REDIS_URL` | Redis broker URL (`redis://localhost:6379/0`) |
| `STRIPE_SECRET_KEY` | Stripe API key for USD subscriptions |
| `RAZORPAY_KEY_ID` | Razorpay API key for INR subscriptions |
| `R2_ACCOUNT_ID` / `AWS_ACCESS_KEY_ID` | Cloud storage credentials for video exports |

---

## 🐳 Docker Deployment

To launch the complete platform (PostgreSQL, Redis, FastAPI, Celery worker, and Next.js frontend) in Docker:

```bash
docker-compose up --build -d
```

---

## 📄 License
Commercial SaaS platform template. Proprietary & confidential.

