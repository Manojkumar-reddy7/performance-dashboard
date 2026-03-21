from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Employee ---
class EmployeeCreate(BaseModel):
    name: str
    department: str
    role: str

class EmployeeOut(BaseModel):
    id: int
    name: str
    department: str
    role: str
    manager_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- KPI ---
class KPICreate(BaseModel):
    employee_id: int
    metric_name: str
    target: float
    actual: float
    period: str

class KPIOut(BaseModel):
    id: int
    employee_id: int
    metric_name: str
    target: float
    actual: float
    period: str
    score: Optional[float] = None   # computed field
    class Config:
        from_attributes = True