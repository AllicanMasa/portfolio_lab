from fastapi import FastAPI
from database import engine
import models

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Backend + DB connected"}