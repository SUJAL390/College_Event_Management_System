from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.core.config import settings
print(f"Using database: {settings.DATABASE_URL}")

def main():
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
    print("Database initialized successfully!")