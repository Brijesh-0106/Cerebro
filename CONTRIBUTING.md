# Contributing to Cerebro — Docker Setup

## Project Structure

```
Cerebro/
├── secondBrain/          # Frontend — React + Vite + TypeScript
│   ├── dockerfile
│   └── .dockerignore
├── secondBrainBackend/   # Backend — Express + TypeScript + MongoDB
│   ├── dockerfile
│   └── .dockerignore
├── docker-compose.yml    # Orchestrates both services
├── .env.example          # Template — copy this to .env and fill in values
└── .env                  # Root-level secrets (you must create this — gitignored)
```

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git

---

## Step 1 — Clone the Repository

```bash
git clone <repo-url>
cd Cerebro
```

---

## Step 2 — Create the Root `.env` File

A template file `.env.example` is provided with all required keys (no values).  
Copy it and fill in your credentials:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

Then open `.env` and fill in the values:

```env
# Backend secrets
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
SECRET_KEY=your_jwt_secret_key
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# Frontend build args
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_BACKEND_URL=http://localhost:3000
```

> **Where to get these keys:**
> - `GROQ_API_KEY` → [console.groq.com](https://console.groq.com)
> - `PINECONE_API_KEY` → [app.pinecone.io](https://app.pinecone.io)
> - `GOOGLE_CLIENT_ID` → [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
> - `MONGO_URI` → [MongoDB Atlas](https://cloud.mongodb.com)

---

## Step 3 — Build and Run with Docker Compose

From the `Cerebro/` directory:

```bash
docker compose up --build
```

This will:
1. Build the **backend** image from `./secondBrainBackend/dockerfile`
2. Build the **frontend** image from `./secondBrain/dockerfile`
3. Start both containers

| Service          | URL                      |
|-----------------|--------------------------|
| Backend API      | http://localhost:3000    |
| Frontend App     | http://localhost:5173    |

---

## Step 4 — Stopping the Containers

```bash
docker compose down
```

To also remove built images:

```bash
docker compose down --rmi all
```

---

## Rebuilding After Code Changes

If you change source code, rebuild the affected service:

```bash
# Rebuild everything
docker compose up --build

# Rebuild a specific service only
docker compose up --build cerebro_backend
docker compose up --build cerebro_frontend
```

---

## Individual Docker Commands (without Compose)

### Backend

```bash
cd secondBrainBackend

docker build -t cerebro_backend \
  --build-arg GROQ_API_KEY=your_key \
  --build-arg PINECONE_API_KEY=your_key \
  --build-arg GOOGLE_CLIENT_ID=your_id \
  --build-arg SECRET_KEY=your_secret \
  --build-arg MONGO_URI=your_mongo_uri \
  .

docker run -p 3000:3000 --name cerebro_backend cerebro_backend:latest
```

### Frontend

```bash
cd secondBrain

docker build -t cerebro_fe \
  --build-arg VITE_GOOGLE_CLIENT_ID=your_id \
  --build-arg VITE_BACKEND_URL=http://localhost:3000 \
  .

docker run -p 5173:5173 --name cerebro_fe cerebro_fe:latest
```

---

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `undefined` in API request URL | `VITE_BACKEND_URL` not passed at build time | Add it as `--build-arg` or in root `.env` |
| `❌ Database connection failed` | Wrong or missing `MONGO_URI` | Check your `.env` value |
| Port already in use | Another process using 3000 or 5173 | Run `docker ps` and stop conflicting containers |
| Frontend can't reach backend | `VITE_BACKEND_URL` set to container IP instead of `localhost` | Use `http://localhost:3000` — browser calls go through host |
