import numpy as np
from sklearn.linear_model import LinearRegression

def predict_days_left(consumption_history):
    # Example: [5, 4, 3, 2] quantity over days
    X = np.array(range(len(consumption_history))).reshape(-1, 1)
    y = np.array(consumption_history)

    model = LinearRegression()
    model.fit(X, y)

    future_day = len(consumption_history)
    predicted = model.predict([[future_day]])

    return max(int(predicted[0]), 0)