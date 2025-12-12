# Travel Social Network

A full-stack travel social network application with AI-powered recommendations.

## Project Structure

```
├── backend/          # FastAPI backend
│   ├── api/         # API routes
│   ├── core/        # Core services (AI, social, etc.)
│   ├── solar/       # Solar/media services
│   └── main.py      # FastAPI app entry point
│
└── frontend/        # React + Vite frontend
    ├── src/
    │   ├── components/  # React components (SocialFeed, CreatePostModal, etc.)
    │   ├── auth/        # Authentication (AuthProvider)
    │   └── main.tsx     # App entry point
    └── package.json
```

## Deployment

- **Backend**: Deployed on [Render](https://render.com) at https://travel-social-network-api.onrender.com
- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Database**: PostgreSQL on [Neon](https://neon.tech)

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Environment Variables (Backend)
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `OPENAI_API_KEY` - OpenAI API key for AI recommendations
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database credentials

## Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

### Environment Variables (Frontend)
- `VITE_API_URL` - Backend API URL (https://travel-social-network-api.onrender.com)

## Features

- ✅ Social feed with posts, likes, saves, follows
- ✅ Create travel posts with images, location, ratings
- ✅ AI-powered travel recommendations
- ✅ User authentication
- ✅ Real-time feed updates
- ✅ Mobile-responsive TikTok-style interface

## Tech Stack

**Backend:**
- FastAPI
- PostgreSQL (Neon)
- OpenAI API
- Python 3.11

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Radix UI
- Lucide Icons

## Recent Updates

- ✅ Fixed post creation - now uses direct API calls instead of SDK
- ✅ Reorganized repository structure (backend + frontend in one repo)
- ✅ All interface translated to English
- ✅ Compact modal design for better mobile experience

## License

MIT
