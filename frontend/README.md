# Employee Performance Dashboard

A full-stack web application for tracking and visualizing employee KPIs and performance metrics.

## Live Demo
- Frontend: https://perf-dashboard-ui.onrender.com
- API Docs: https://performance-dashboard-api.onrender.com/docs

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React, Vite, Recharts, Axios
- **Auth**: JWT (JSON Web Tokens)
- **Deployment**: Render.com

## Features
- Manager authentication with JWT
- Add and manage employees
- Log KPIs with targets vs actuals
- Auto-computed performance scores
- Performance charts and insights
- Fully responsive — works on any device

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register manager |
| POST | /auth/login | Login |
| POST | /employees/ | Add employee |
| GET | /employees/ | List employees |
| POST | /kpis/ | Log KPI |
| GET | /kpis/insights/{id} | Get performance insights |