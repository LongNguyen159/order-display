from typing import Union, List, Optional
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine

from fastapi import FastAPI

models.Base.metadata.create_all(bind=engine)
app = FastAPI()


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get all Locations
@app.get("/locations/", response_model=List[schemas.Location])
def get_all_locations(db: Session = Depends(get_db)):
    return crud.get_all_locations(db=db)

# Get Location by ID
@app.get("/locations/{location_id}/", response_model=schemas.Location)
def get_location(location_id: int, db: Session = Depends(get_db)):
    return crud.get_location(db=db, location_id=location_id)

# Get all Orders
@app.get("/orders/", response_model=List[schemas.Order])
def get_all_orders(db: Session = Depends(get_db)):
    return crud.get_all_orders(db=db)

# Get Order by ID
@app.get("/orders/{order_id}/", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return crud.get_order(db=db, order_id=order_id)

# Create Order endpoint
@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)

# Patch Order endpoint
@app.patch("/orders/{order_id}/", response_model=schemas.Order)
def update_order(order_id: int, done: bool, db: Session = Depends(get_db)):
    return crud.update_order(db=db, order_id=order_id, done=done)

# Delete Order by ID endpoint
@app.delete("/orders/{order_id}/")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    return crud.delete_order(db=db, order_id=order_id)

# Delete All Orders endpoint
@app.delete("/orders/")
def delete_all_orders(db: Session = Depends(get_db)):
    return crud.delete_all_orders(db=db)

# Create Location endpoint
@app.post("/locations/", response_model=schemas.Location)
def create_location(location: schemas.LocationCreate, db: Session = Depends(get_db)):
    return crud.create_location(db=db, location=location)

# Patch Location endpoint
@app.patch("/locations/{location_id}/", response_model=schemas.Location)
def update_location(location_id: int, description: str, db: Session = Depends(get_db)):
    return crud.update_location(db=db, location_id=location_id, description=description)

# Delete Location by ID endpoint
@app.delete("/locations/{location_id}/")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    return crud.delete_location(db=db, location_id=location_id)

# Delete All Locations endpoint
@app.delete("/locations/")
def delete_all_locations(db: Session = Depends(get_db)):
    return crud.delete_all_locations(db=db)