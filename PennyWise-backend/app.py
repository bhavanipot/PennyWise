from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from models import db, Expense, Budget
from auth import auth_bp   
from AI import (
    ask_assistant, budget_breakdown, spending_insights,
    dashboard_summary, goal_progress, forecast_expenses,
)

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)
jwt = JWTManager(app)

with app.app_context():
    #db.drop_all() #temporary
    db.create_all()

# Add new expense for the logged-in user
@app.route("/expenses", methods=["POST"])
@jwt_required()
def add_expense():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Optional: check for missing fields
    if not all([data.get("amount"), data.get("category"), user_id]):
        return jsonify({"error": "Missing required fields"}), 400

    new_expense = Expense(
        amount=data["amount"], category=data["category"],
        description=data.get("description", ""),
        date=data.get("date", ""), user_id=user_id
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Expense added successfully"}), 201

# Get all expenses for the logged-in user
@app.route("/expenses", methods=["GET"])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(user_id=user_id).all()
    result = [{
        "id": e.id, "amount": e.amount, "category": e.category,
        "description": e.description, "date": e.date
    } for e in expenses]
    return jsonify(result)

# Set monthly budget for the user
@app.route("/set-budget", methods=["POST"])
@jwt_required()
def set_budget():
    user_id = get_jwt_identity()
    data = request.get_json()
    month = data["month"]
    amount = data["amount"]
    existing = Budget.query.filter_by(month=month, user_id=user_id).first()
    if existing:
        existing.amount = amount
    else:
        db.session.add(Budget(month=month, amount=amount, user_id=user_id))
    db.session.commit()
    return jsonify({"message": f"Budget set for {month}"})

# Get budget for the current user and month
@app.route("/get-budget", methods=["GET"])
@jwt_required()
def get_budget():
    user_id = get_jwt_identity()
    month = request.args.get("month")
    budget = Budget.query.filter_by(month=month, user_id=user_id).first()
    if not budget:
        return jsonify({"message": "No budget set"}), 404
    return jsonify({"month": month, "amount": budget.amount})

# AI spending insight suggestion route
@app.route("/spending-insights", methods=["POST"])
@jwt_required()
def spending_tips():
    data = request.get_json()
    return jsonify({"response": spending_insights(data["categories"])})

# AI budget breakdown route
@app.route("/budget-breakdown", methods=["POST"])
@jwt_required()
def budget_ai():
    data = request.get_json()
    return jsonify({"response": budget_breakdown(data["income"], data["fixed_expenses"], data["savings_goal"])})

# AI goal progress route
@app.route("/goal-progress", methods=["POST"])
@jwt_required()
def goal_status():
    data = request.get_json()
    return jsonify({"response": goal_progress(data["goal_name"], data["target_amount"], data["current_amount"], data["weekly_contribution"])})

# AI dashboard summary route
@app.route("/dashboard-summary", methods=["POST"])
@jwt_required()
def dash_summary():
    data = request.get_json()
    return jsonify({"response": dashboard_summary(data["income"], data["expenses"], data["savings"])})

# AI forecast expenses route
@app.route("/forecast-expenses", methods=["POST"])
@jwt_required()
def forecast():
    data = request.get_json()
    return jsonify({"response": forecast_expenses(data["monthly_spending"])})

app.register_blueprint(auth_bp)

#if __name__ == "__main__":
#app.run(debug=True)
