from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=schemas.EmployeeOut)
def create_employee(emp: schemas.EmployeeCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    new_emp = models.Employee(**emp.dict(), manager_id=current_user.id)
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@router.get("/", response_model=list[schemas.EmployeeOut])
def list_employees(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.Employee).filter(models.Employee.manager_id == current_user.id).all()

@router.get("/{employee_id}", response_model=schemas.EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    emp = db.query(models.Employee).filter(models.Employee.id == employee_id, models.Employee.manager_id == current_user.id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    emp = db.query(models.Employee).filter(models.Employee.id == employee_id, models.Employee.manager_id == current_user.id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(emp)
    db.commit()
    return {"message": "Deleted"}