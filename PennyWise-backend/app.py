from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from config import Config
from models import db, Expense, Budget

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)
jwt = JWTManager(app)

# Create DB tables
with app.app_context():
    db.create_all()

# Add Expense
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

# Get All Expenses
@app.route("/expenses", methods=["GET"])
def get_expenses():
    expenses = Expense.query.all()
    result = [
        {
            "id": e.id,
            "amount": e.amount,
            "category": e.category,
            "description": e.description,
            "date": e.date
        } for e in expenses
    ]
    return jsonify(result)

# User Logout (Frontend clears token)
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Successfully logged out. Please clear the token on client side."}), 200


# Set Monthly Budget
@app.route("/set-budget", methods=["POST"])
def set_budget():
    data = request.get_json()
    if not all(k in data for k in ("month", "amount")):
        return jsonify({"error": "Missing month or amount"}), 400

    month = data["month"]  # Format: "2025-07"
    amount = data["amount"]

    existing = Budget.query.filter_by(month=month).first()
    if existing:
        existing.amount = amount
    else:
        new_budget = Budget(month=month, amount=amount)
        db.session.add(new_budget)

    db.session.commit()
    return jsonify({"message": f"Budget set for {month}"}), 200

# Get Monthly Budget
@app.route("/get-budget", methods=["GET"])
def get_budget():
    month = request.args.get("month")
    if not month:
        return jsonify({"error": "Month is required"}), 400

    budget = Budget.query.filter_by(month=month).first()
    if not budget:
        return jsonify({"message": "No budget set for this month"}), 404

    return jsonify({"month": month, "amount": budget.amount}), 200

# Monthly Summary – Total per Category
@app.route("/monthly-summary", methods=["GET"])
def monthly_summary():
    from sqlalchemy import func

    month = request.args.get("month")
    if not month:
        return jsonify({"error": "Month is required"}), 400

    results = db.session.query(
        Expense.category,
        func.sum(Expense.amount)
    ).filter(Expense.date.startswith(month)).group_by(Expense.category).all()

    summary = [{"category": cat, "total": float(total)} for cat, total in results]
    return jsonify(summary)

# Progress Tracker – % of budget used
@app.route("/progress", methods=["GET"])
def progress():
    from sqlalchemy import func

    month = request.args.get("month")
    if not month:
        return jsonify({"error": "Month is required"}), 400

    total_spent = db.session.query(func.sum(Expense.amount)).filter(Expense.date.startswith(month)).scalar() or 0
    budget = Budget.query.filter_by(month=month).first()

    if not budget:
        return jsonify({"message": "No budget set for this month"}), 404

    percentage = (total_spent / budget.amount) * 100 if budget.amount > 0 else 0
    return jsonify({
        "month": month,
        "budget": budget.amount,
        "spent": float(total_spent),
        "progress": round(percentage, 2)
    })

# Run App
if __name__ == "__main__":
    app.run(debug=True)
