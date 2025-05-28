import logging
from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.session import engine
from app.db.models.user import User
from app.core.config import settings


logger = logging.getLogger(__name__)

# Create initial admin user
def init_db(db: Session) -> None:
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Check if we already have users
    user = db.query(User).first()
    if not user:
        # Create admin user
        admin = User(
            username=settings.FIRST_ADMIN_USERNAME,
            email=settings.FIRST_ADMIN_EMAIL,
            is_admin=True
        )
        admin.set_password(settings.FIRST_ADMIN_PASSWORD)
        db.add(admin)
        db.commit()
        logger.info("Created admin user")
    else:
        logger.info("Database already initialized")