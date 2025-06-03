from flask import Flask,request,jsonify
from flask_cors import CORS
from models import db, Expense
from config import Config

app= Flask(__name__) 
app.config.from_object(Config) 
db.init_app(app)
CORS(app)

#add expenses

