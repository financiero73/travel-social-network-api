# Travel Social Network - Backend API

FastAPI backend for the Travel Social Network application.

## Deployment on Render

This backend is configured to deploy on Render.com (free tier).

### Environment Variables Required:

- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port (usually 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password

### Local Development:

```bash
pip install -r requirements.txt
uvicorn api.routes:app --reload
```

## Database

Uses PostgreSQL (Neon) for data storage.
