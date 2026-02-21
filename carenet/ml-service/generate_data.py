"""
Generate synthetic patient dataset for CARE-NET dropout risk model training.
Creates 1000 rows with features and dropout_risk label.
"""
import pandas as pd
import numpy as np

np.random.seed(42)

n = 1000
df = pd.DataFrame({
    "missed_appointments": np.random.randint(0, 11, n),
    "days_since_last_visit": np.random.randint(0, 181, n),
    "financial_score": np.random.randint(1, 11, n),
    "treatment_stage": np.random.randint(1, 5, n),
    "follow_up_calls_received": np.random.randint(0, 9, n),
    "hospital_delay_days": np.random.randint(0, 46, n),
    "scheme_enrolled": np.random.randint(0, 2, n),
})

def compute_dropout_risk(row):
    if row["missed_appointments"] > 3:
        return 1
    if row["financial_score"] < 4 and row["scheme_enrolled"] == 0:
        return 1
    if row["days_since_last_visit"] > 90:
        return 1
    if row["follow_up_calls_received"] == 0 and row["days_since_last_visit"] > 45:
        return 1
    return 0

df["dropout_risk"] = df.apply(compute_dropout_risk, axis=1)
df.to_csv("patients_data.csv", index=False)
print(f"Generated patients_data.csv with {len(df)} rows. Dropout rate: {df['dropout_risk'].mean():.2%}")
