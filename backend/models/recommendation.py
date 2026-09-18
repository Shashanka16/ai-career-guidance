from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    career = Column(String)
    confidence = Column(Integer)