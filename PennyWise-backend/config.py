#connecting to database

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL") #Gets the PostgreSQL connection string from .env
    SQLALCHEMY_TRACK_MODIFICATIONS = False
