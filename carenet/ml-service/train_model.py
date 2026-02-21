"""
Train RandomForest classifier for dropout risk prediction.
Loads patients_data.csv, trains model, saves dropout_model.pkl and feature_names.pkl.
"""
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

df = pd.read_csv("patients_data.csv")
feature_cols = [
    "missed_appointments",
    "days_since_last_visit",
    "financial_score",
    "treatment_stage",
    "follow_up_calls_received",
    "hospital_delay_days",
    "scheme_enrolled",
]
X = df[feature_cols]
y = df["dropout_risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=150, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(classification_report(y_test, y_pred))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")

joblib.dump(model, "dropout_model.pkl")
joblib.dump(feature_cols, "feature_names.pkl")
print("Saved dropout_model.pkl and feature_names.pkl")
