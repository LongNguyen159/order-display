from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base

# Location model
class Location(Base):
    __tablename__ = "location"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)

# Order model
class Order(Base):
    __tablename__ = "order"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String)
    location_id = Column(Integer, ForeignKey("location.id"))
    done = Column(Boolean, nullable=True)

    # Define relationship with Location
    location = relationship("Location", back_populates="orders")


# Define relationship for Location model
Location.orders = relationship("Order", back_populates="location")
