from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class BugReportBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "Open"


class BugReportCreate(BugReportBase):
    title: str
    description: str


class BugReportUpdate(BugReportBase):
    pass


class BugReportInDBBase(BugReportBase):
    id: int
    reported_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class BugReport(BugReportInDBBase):
    pass