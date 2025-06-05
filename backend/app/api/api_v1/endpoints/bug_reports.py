from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.bug_report import BugReport, BugReportCreate, BugReportUpdate
from app.db.models.bug_report import BugReport as BugReportModel
from app.db.models.user import User

router = APIRouter()

@router.get("/", response_model=List[BugReport])
def list_bug_reports(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve bug reports.
    """

    if current_user.is_admin:
        bug_reports = db.query(BugReportModel).offset(skip).limit(limit).all()
    else:
        bug_reports = db.query(BugReportModel).filter(
            BugReportModel.reported_by == current_user.id
        ).offset(skip).limit(limit).all()
    
    return bug_reports

@router.post("/", response_model=BugReport)
def create_bug_report(
    *,
    db: Session = Depends(deps.get_db),
    bug_report_in: BugReportCreate,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Create new bug report.
    """
    bug_report = BugReportModel(
        title=bug_report_in.title,
        description=bug_report_in.description,
        reported_by=current_user.id,
        status="Open"
    )
    db.add(bug_report)
    db.commit()
    db.refresh(bug_report)
    return bug_report

@router.get("/{bug_report_id}", response_model=BugReport)
def get_bug_report(
    *,
    db: Session = Depends(deps.get_db),
    bug_report_id: int,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get bug report by ID.
    """
    bug_report = db.query(BugReportModel).filter(BugReportModel.id == bug_report_id).first()
    if not bug_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug report not found"
        )
    
    
    if not current_user.is_admin and bug_report.reported_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this bug report"
        )
    
    return bug_report

@router.put("/{bug_report_id}", response_model=BugReport)
def update_bug_report(
    *,
    db: Session = Depends(deps.get_db),
    bug_report_id: int,
    bug_report_in: BugReportUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Update bug report status (admin only) or details (creator only).
    """
    bug_report = db.query(BugReportModel).filter(BugReportModel.id == bug_report_id).first()
    if not bug_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug report not found"
        )
    
    
    if "status" in bug_report_in.model_dump(exclude_unset=True):
        if not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can change bug report status"
            )
    
    
    if not current_user.is_admin and bug_report.reported_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this bug report"
        )
    
    
    update_data = bug_report_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(bug_report, field, value)
    
    db.commit()
    db.refresh(bug_report)
    return bug_report

@router.delete("/{bug_report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bug_report(
    *,
    db: Session = Depends(deps.get_db),
    bug_report_id: int,
    current_user: User = Depends(deps.get_current_admin_user)  # Only admins can delete
):
    """
    Delete bug report (admin only).
    """
    bug_report = db.query(BugReportModel).filter(BugReportModel.id == bug_report_id).first()
    if not bug_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug report not found"
        )
    
    db.delete(bug_report)
    db.commit()
    return None