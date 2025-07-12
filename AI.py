# pennywise_ai.py

import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")


#Will add a RAG Pipeline for more personalized results 
def ask_assistant(income: float, expenses: float, message: str) -> str:
    prompt = f"""
    You are PennyWise, a smart budgeting assistant for students.
    The user has ${income} in income and ${expenses} in expenses this month.
    They asked: "{message}"

    Provide a short, clear, helpful response based on their financial status.
    """
    return model.generate_content(prompt).text.strip()


#Working on Implementing a Regression Model
def budget_breakdown(income: float, fixed_expenses: float, savings_goal: float) -> str: 
    prompt = f"""
    Monthly income: ${income}
    Fixed expenses: ${fixed_expenses}
    Savings goal: ${savings_goal}

    Suggest a personalized budget split for food, transportation, entertainment, and miscellaneous.
    Keep the total under budget.
    """
    return model.generate_content(prompt).text.strip()


def spending_insights(categories: dict) -> str:
    breakdown = "\\n".join([f"{k}: ${v}" for k, v in categories.items()])
    prompt = f"""
    Here is the student's monthly spending breakdown:
    {breakdown}

    Provide 3 helpful and actionable tips to reduce unnecessary spending and save more next month.
    """
    return model.generate_content(prompt).text.strip()


def dashboard_summary(income: float, expenses: float, savings: float) -> str:
    prompt = f"""
    Monthly Income: ${income}
    Expenses: ${expenses}
    Savings: ${savings}

    Generate a one-sentence dashboard summary with a motivational tone.
    """
    return model.generate_content(prompt).text.strip()


def goal_progress(goal_name: str, target_amount: float, current_amount: float, weekly_contribution: float) -> str:
    prompt = f"""
    Goal: {goal_name}
    Target: ${target_amount}
    Current: ${current_amount}
    Weekly Contribution: ${weekly_contribution}

    Estimate how many weeks it will take to achieve this goal, and offer words of encouragement.
    """
    return model.generate_content(prompt).text.strip()


def forecast_expenses(monthly_spending: dict) -> str:
    history = "\\n".join([f"{k}: ${v}" for k, v in monthly_spending.items()])
    prompt = f"""
    Given this monthly spending history:
    {history}

    Forecast next month’s spending and highlight any categories that are trending upward or becoming risky.
    """
    return model.generate_content(prompt).text.strip()
