# backend/crud.py
from typing import List, Optional
from sqlalchemy.orm import Session
import models, schemas
from fastapi import FastAPI, Depends, HTTPException

# Create Order
def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

# Get all Locations
def get_all_locations(db: Session) -> List[schemas.Location]:
    return db.query(models.Location).order_by(models.Location.id.desc()).all()

# Get Location by ID
def get_location(db: Session, location_id: int) -> schemas.Location:
    location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


# Get all Orders
def get_all_orders(db: Session) -> List[schemas.Order]:
     return db.query(models.Order).order_by(models.Order.id.desc()).all()

# Get Order by ID
def get_order(db: Session, order_id: int) -> Optional[schemas.Order]:
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
        


# Patch Order
def update_order(db: Session, order_id: int, done: bool):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        db_order.done = done
        db.commit()
        return db_order
    else:
        raise HTTPException(status_code=404, detail="Order not found")

# Delete Order by ID
def delete_order(db: Session, order_id: int):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
        return {"message": "Order deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Order not found")

# Delete All Orders
def delete_all_orders(db: Session):
    db.query(models.Order).delete()
    db.commit()
    return {"message": "All orders deleted successfully"}

# Create Location
def create_location(db: Session, location: schemas.LocationCreate):
    db_location = models.Location(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

# Patch Location
def update_location(db: Session, location_id: int, description: str):
    db_location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if db_location:
        db_location.description = description
        db.commit()
        return db_location
    else:
        raise HTTPException(status_code=404, detail="Location not found")

# Delete Location by ID
def delete_location(db: Session, location_id: int):
    db_location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if db_location:
        db.delete(db_location)
        db.commit()
        return {"message": "Location deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Location not found")

# Delete All Locations
def delete_all_locations(db: Session):
    db.query(models.Location).delete()
    db.commit()
    return {"message": "All locations deleted successfully"}