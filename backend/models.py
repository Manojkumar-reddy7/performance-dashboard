from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class RoleEnum(str, enum.Enum):
    manager = "manager"
    employee = "employee"

class User(Base):
    __tablename__ = "users"
    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String, nullable=False)
    email        = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role         = Column(Enum(RoleEnum), default=RoleEnum.manager)
    created_at   = Column(DateTime, default=datetime.utcnow)

class Employee(Base):
    __tablename__ = "employees"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    department = Column(String)
    role       = Column(String)
    manager_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    kpis       = relationship("KPI", back_populates="employee")
    manager    = relationship("User")

class KPI(Base):
    __tablename__ = "kpis"
    id          = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    metric_name = Column(String, nullable=False)   # e.g. "sales_target"
    target      = Column(Float, nullable=False)
    actual      = Column(Float, nullable=False)
    period      = Column(String, nullable=False)   # e.g. "2025-Q1"
    created_at  = Column(DateTime, default=datetime.utcnow)
    employee    = relationship("Employee", back_populates="kpis")