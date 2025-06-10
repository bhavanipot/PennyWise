from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, Expense

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)

#  Create DB table
with app.app_context():
    db.create_all()

#  add a new expense 
@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.get_json()
    if not all(k in data for k in ("amount", "category")):
        return jsonify({"error": "Missing required fields"}), 400

    new_expense = Expense(
        amount=data["amount"],
        category=data["category"],
        description=data.get("description", ""),
        date=data.get("date", "")
    )

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"message": "Expense added successfully"}), 201

#  get all expenses
@app.route("/expenses", methods=["GET"])
def get_expenses():
    expenses = Expense.query.all()
    result = []

    for e in expenses:
        result.append({
            "id": e.id,
            "amount": e.amount,
            "category": e.category,
            "description": e.description,
            "date": e.date
        })

    return jsonify(result)

#  Run the app
if __name__ == "__main__":
    app.run(debug=True)
