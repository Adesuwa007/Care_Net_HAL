"""
CARE-NET ML Service — Flask REST API for dropout risk prediction.
Loads trained model and feature names on startup; exposes /predict, /health, /feature-importance.
"""
import os
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="*")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "dropout_model.pkl")
FEATURE_NAMES_PATH = os.path.join(BASE_DIR, "feature_names.pkl")

model = None
feature_names = None


def load_model():
    global model, feature_names
    model = joblib.load(MODEL_PATH)
    feature_names = joblib.load(FEATURE_NAMES_PATH)


@app.before_request
def ensure_model_loaded():
    if model is None:
        load_model()


def get_risk_level(probability):
    if probability > 70:
        return "High"
    if probability > 40:
        return "Medium"
    return "Low"


def get_primary_reasons(data):
    reasons = []
    missed = data.get("missed_appointments", 0)
    if missed > 3:
        reasons.append("Multiple missed appointments")
    financial = data.get("financial_score", 5)
    scheme = data.get("scheme_enrolled", 0)
    if financial < 4 and scheme == 0:
        reasons.append("Financial barrier with no scheme support")
    days = data.get("days_since_last_visit", 0)
    if days > 90:
        reasons.append("Extended treatment gap (over 90 days)")
    follow_ups = data.get("follow_up_calls_received", 0)
    if follow_ups == 0:
        reasons.append("No follow-up communication received")
    delay = data.get("hospital_delay_days", 0)
    if delay > 14:
        reasons.append("Significant hospital processing delays")
    return reasons if reasons else ["No major risk factors identified"]


def get_recommendation(risk_level):
    if risk_level == "High":
        return "Immediate intervention required. Assign ASHA worker and enroll in financial scheme."
    if risk_level == "Medium":
        return "Schedule follow-up within 7 days and assess scheme eligibility."
    return "Continue regular monitoring. Next check-in in 30 days."


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400
        features = [
            data.get("missed_appointments", 0),
            data.get("days_since_last_visit", 0),
            data.get("financial_score", 5),
            data.get("treatment_stage", 1),
            data.get("follow_up_calls_received", 0),
            data.get("hospital_delay_days", 0),
            data.get("scheme_enrolled", 0),
        ]
        import numpy as np
        X = np.array([features])
        dropout_risk = int(model.predict(X)[0])
        proba = model.predict_proba(X)[0]
        risk_probability = round(float(proba[1]) * 100, 1)
        risk_level = get_risk_level(risk_probability)
        primary_reasons = get_primary_reasons(data)
        recommendation = get_recommendation(risk_level)
        return jsonify({
            "dropout_risk": dropout_risk,
            "risk_probability": risk_probability,
            "risk_level": risk_level,
            "primary_reasons": primary_reasons,
            "recommendation": recommendation,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "loaded"})


@app.route("/feature-importance", methods=["GET"])
def feature_importance():
    importances = model.feature_importances_
    pairs = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in zip(feature_names, importances)
    ]
    pairs.sort(key=lambda x: x["importance"], reverse=True)
    return jsonify(pairs)


if __name__ == "__main__":
    load_model()
    app.run(host="0.0.0.0", port=5001, debug=False)
