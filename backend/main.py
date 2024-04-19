from typing import Union, List, Optional

import asyncio
# Fast API
from fastapi import FastAPI, Depends, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# SQL import
from sqlalchemy.orm import Session
from sqlalchemy import event
from sqlalchemy.orm.attributes import get_history

import models, schemas, crud
from database import SessionLocal, engine


models.Base.metadata.create_all(bind=engine)
app = FastAPI()

change_detect = False

## ALWAYS RUN ON `LOCALHOST` AS A SERVER
# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


websocket_manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocketEndpoint(websocket: WebSocket, client_id: int):
    global change_detect
    await websocket_manager.connect(websocket)
    await websocket_manager.broadcast(f"Client #{client_id} connected to websocket.")
    try:
        while True:
            if change_detect:
                ## Broadcast message to all clients upon changes detected in database (via boolean flag)
                await websocket_manager.broadcast(f'Client #{client_id} modified Order table')
                print('broadcasted!')
                ## After broadcasting, set change detect to false again, then await for next changes.
                change_detect = False
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print('disconnect client')
        websocket_manager.disconnect(websocket)
        await websocket_manager.broadcast(f"Client #{client_id} left.")


def track_status_changes(mapper, connection, target):
        # Detect changes in databases, triggered by event listeners
        on_change_detected()
        

def on_change_detected():
    global change_detect
    change_detect = True
    
# Add the event listeners
event.listen(models.Order, 'after_update', track_status_changes)
event.listen(models.Order, 'after_insert', track_status_changes)
event.listen(models.Order, 'after_delete', track_status_changes)


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
@app.patch("/orders/{order_id}/", response_model=bool)
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