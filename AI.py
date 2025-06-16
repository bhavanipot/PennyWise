import numpy as np
from sklearn.linear_model import LinearRegression

class BudgetingAI:
    def __init__(self, income, past_data):
        self.income = income
        self.past_data = past_data
        self.predictions = {}

    def predict_spending(self):
        X = np.array([[1], [2], [3]])  # months for prediction
        for category, values in self.past_data.items():
            y = np.array(values)
            model = LinearRegression()
            model.fit(X, y)
            next_month = np.array([[4]])  # Predict for the next month
            predicted = model.predict(next_month)[0]
            self.predictions[category] = round(predicted, 2)

    def recommend_budget(self):
        self.predict_spending()

        total_predicted_spending = sum(self.predictions.values())
        
        # Ensure total recommended spending does not exceed income
        if total_predicted_spending > self.income:
            scaling_factor = self.income / total_predicted_spending
            recommended = {category: round(amount * scaling_factor, 2) for category, amount in self.predictions.items()}
        else:
            recommended = self.predictions
        
        return recommended

    def print_budget(self):
        recommended_budget = self.recommend_budget()
        print(f"Recommended Budget Allocation for Next Month (Total Income: ${self.income}):")
        for category, value in recommended_budget.items():
            print(f" - {category.capitalize()}: ${value}")

# have to integrate with backend
income = 1000  
past_data = {
    "food": [120, 130, 125],
    "transport": [40, 50, 45],
    "entertainment": [60, 70, 65],
    "books": [30, 20, 25]
}

# Create the BudgetingAI object and print the recommended budget
budget_ai = BudgetingAI(income, past_data)
budget_ai.print_budget()
