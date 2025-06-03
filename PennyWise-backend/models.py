from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Expense(db.Model): # a table called expense containing all details
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.String(50))


