# Imported all models here to ensure they're registered with SQLAlchemy
from .base_class import Base  
from .models.user import User  
from .models.event import Event  
from .models.registration import Registration  
from .models.bug_report import BugReport  