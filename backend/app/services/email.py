from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pathlib import Path
from app.core.config import settings
from typing import List, Dict, Any
from fastapi import BackgroundTasks

conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER,
    MAIL_PASSWORD=settings.SMTP_PASSWORD,
    MAIL_FROM=settings.EMAIL_FROM,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_SERVER,
    MAIL_SSL_TLS=False,
    MAIL_STARTTLS=True,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=Path(__file__).parent.parent / "templates/email"
)

async def send_email(
    background_tasks: BackgroundTasks,
    subject: str,
    email_to: List[str],
    body: Dict[str, Any],
    template_name: str = "base.html"
):
    message = MessageSchema(
        subject=subject,
        recipients=email_to,
        template_body=body,
        subtype="html"
    )
    
    fm = FastMail(conf)
    background_tasks.add_task(
        fm.send_message, message, template_name=template_name
    )