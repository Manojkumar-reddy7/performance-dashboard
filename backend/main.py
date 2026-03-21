from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, employees, kpis

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Performance Dashboard API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(kpis.router)

@app.get("/")
def root():
    return {"message": "Performance Dashboard API is running"}
