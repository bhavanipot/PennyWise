from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_jwt_extended import get_jwt_identity
from config import Config
from models import db, Expense, Budget
from auth import auth_bp   

from AI import (
    ask_assistant,
    budget_breakdown,
    spending_insights,
    dashboard_summary,
    goal_progress,
    forecast_expenses,
)

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)
jwt = JWTManager(app)


# Create DB table
with app.app_context():
    db.create_all()


# Add Expense
@app.route("/expenses", methods=["POST"])
@jwt_required()
def add_expense():
    user_id = get_jwt_identity()
    data = request.get_json()

    new_expense = Expense(
        amount=data["amount"],
        category=data["category"],
        description=data.get("description", ""),
        date=data.get("date", ""),
        user_id=user_id
    )

    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Expense added"}), 201

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

# AI Assistant: Ask Anything
@app.route("/ai-assistant", methods=["POST"])
def ai_assistant():
    data = request.get_json()
    income = data.get("income", 0)
    expenses = data.get("expenses", 0)
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "Message is required"}), 400

    response = ask_assistant(income, expenses, message)
    return jsonify({"response": response}), 200


# AI Budget Breakdown
@app.route("/budget-breakdown", methods=["POST"])
def budget_ai():
    data = request.get_json()
    income = data.get("income", 0)
    fixed_expenses = data.get("fixed_expenses", 0)
    savings_goal = data.get("savings_goal", 0)

    response = budget_breakdown(income, fixed_expenses, savings_goal)
    return jsonify({"response": response}), 200

# AI Spending Insights
@app.route("/spending-insights", methods=["POST"])
def spending_tips():
    data = request.get_json()
    categories = data.get("categories", {})

    response = spending_insights(categories)
    return jsonify({"response": response}), 200

# AI Dashboard Summary
@app.route("/dashboard-summary", methods=["POST"])
def dash_summary():
    data = request.get_json()
    income = data.get("income", 0)
    expenses = data.get("expenses", 0)
    savings = data.get("savings", 0)

    response = dashboard_summary(income, expenses, savings)
    return jsonify({"response": response}), 200

# AI Goal Progress
@app.route("/goal-progress", methods=["POST"])
def goal_status():
    data = request.get_json()
    goal_name = data.get("goal_name", "")
    target_amount = data.get("target_amount", 0)
    current_amount = data.get("current_amount", 0)
    weekly_contribution = data.get("weekly_contribution", 0)

    response = goal_progress(goal_name, target_amount, current_amount, weekly_contribution)
    return jsonify({"response": response}), 200

# AI Forecast Expenses
@app.route("/forecast-expenses", methods=["POST"])
def forecast():
    data = request.get_json()
    monthly_spending = data.get("monthly_spending", {})

    response = forecast_expenses(monthly_spending)
    return jsonify({"response": response}), 200

# Register blueprint below db/CORS config
app.register_blueprint(auth_bp)

# Run App
if __name__ == "__main__":
    app.run(debug=True)
