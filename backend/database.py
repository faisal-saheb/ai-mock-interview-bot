from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Create SQLite database file
engine = create_engine("sqlite:///interviews.db")
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

# Interview table structure
class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String)
    question = Column(String)
    answer = Column(String)
    score = Column(Float)
    feedback = Column(String)
    ideal = Column(String)
    date = Column(DateTime, default=datetime.now)

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()