from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.init_db import init_db

def init():
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

if __name__ == "__main__":
    init()
