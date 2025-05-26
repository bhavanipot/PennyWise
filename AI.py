#Simple Budgeting Ideas
import numpy as np
from sklearn.linear_model import LinearRegression

# Example data - has to be intergrated from backend
past_data = {
    "food": [120, 130, 125],
    "transport": [40, 50, 45],
    "entertainment": [60, 70, 65],
    "books": [30, 20, 25]
}

# Average spending
X = np.array([[1], [2], [3]])  # months
predictions = {}

for category, values in past_data.items():
    y = np.array(values)
    model = LinearRegression()
    model.fit(X, y)
    next_month = np.array([[4]])
    predicted = model.predict(next_month)[0]
    predictions[category] = round(predicted, 2)

print("Recommended Budget for Next Month:")
for category, value in predictions.items():
    print(f" - {category.capitalize()}: ${value}")
