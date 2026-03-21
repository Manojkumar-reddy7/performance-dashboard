from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/kpis", tags=["KPIs"])

def compute_score(target: float, actual: float) -> float:
    if target == 0:
        return 0.0
    return round(min((actual / target) * 100, 150), 2)  # cap at 150%

@router.post("/", response_model=schemas.KPIOut)
def add_kpi(kpi: schemas.KPICreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    emp = db.query(models.Employee).filter(models.Employee.id == kpi.employee_id, models.Employee.manager_id == current_user.id).first()
    if not emp:
        raise HTTPException(status_code=403, detail="Not your employee")
    new_kpi = models.KPI(**kpi.dict())
    db.add(new_kpi)
    db.commit()
    db.refresh(new_kpi)
    result = schemas.KPIOut.from_orm(new_kpi)
    result.score = compute_score(new_kpi.target, new_kpi.actual)
    return result

@router.get("/{employee_id}", response_model=list[schemas.KPIOut])
def get_kpis(employee_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    emp = db.query(models.Employee).filter(models.Employee.id == employee_id, models.Employee.manager_id == current_user.id).first()
    if not emp:
        raise HTTPException(status_code=403, detail="Not your employee")
    kpis = db.query(models.KPI).filter(models.KPI.employee_id == employee_id).all()
    result = []
    for k in kpis:
        out = schemas.KPIOut.from_orm(k)
        out.score = compute_score(k.target, k.actual)
        result.append(out)
    return result

@router.get("/insights/{employee_id}")
def get_insights(employee_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    emp = db.query(models.Employee).filter(models.Employee.id == employee_id, models.Employee.manager_id == current_user.id).first()
    if not emp:
        raise HTTPException(status_code=403, detail="Not your employee")
    kpis = db.query(models.KPI).filter(models.KPI.employee_id == employee_id).all()
    if not kpis:
        return {"employee": emp.name, "average_score": 0, "insights": []}
    scores = [compute_score(k.target, k.actual) for k in kpis]
    avg = round(sum(scores) / len(scores), 2)
    insights = []
    for k, s in zip(kpis, scores):
        if s >= 100:
            insights.append(f"{k.metric_name}: On track ({s}%)")
        else:
            insights.append(f"{k.metric_name}: Below target ({s}%) — needs attention")
    return {"employee": emp.name, "average_score": avg, "insights": insights}