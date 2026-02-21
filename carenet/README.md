# CARE-NET

**AI-Powered Continuity of Care & Treatment Dropout Prevention Platform**

CARE-NET is a full-stack application that helps healthcare workers identify patients at risk of treatment dropout and take preventive action through scheme enrollment, follow-ups, and transfer tracking.

---

## Architecture

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    React Frontend (Vite)                │
                    │                      http://localhost:5173              │
                    │  Dashboard | Patients | Add Patient | Transfer Records  │
                    └────────────────────────────┬────────────────────────────┘
                                                 │ HTTP (REST)
                                                 ▼
                    ┌─────────────────────────────────────────────────────────-------┐
                    │                 Node.js Backend (Express)                      │
                    │                      http://localhost:5000                     │
                    │  /api/patients | /api/schemes | /api/transfer | /api/analytics │
                    └────────────────────────────┬────────────────────────────-------┘
                         │                                    │
                         │ MongoDB                            │ HTTP (internal)
                         ▼                                    ▼
                    ┌──────────┐                    ┌─────────────────────────┐
                    │ MongoDB  │                    │   Flask ML Service      │
                    │ (Atlas)  │                    │   http://localhost:5001 │
                    │          │                    │   /predict | /health    │
                    └──────────┘                    └─────────────────────────┘
                                                              │
                                                              │ RandomForest
                                                              ▼
                                                    dropout_model.pkl
                                                    (Scikit-learn)
```

- **Frontend** talks only to the **Backend**.
- **Backend** stores data in **MongoDB** and calls the **ML Service** for risk predictions.
- **ML Service** loads a trained RandomForest model and returns dropout risk, reasons, and recommendations.

---

## Tech Stack

| Layer      | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React 18, Vite, TailwindCSS, Recharts, Lucide React, Axios, React Router |
| Backend   | Node.js, Express, Mongoose, Axios, CORS, dotenv |
| ML Service| Python 3, Flask, Flask-CORS, Scikit-learn, Pandas, NumPy, Joblib |
| Database  | MongoDB (e.g. MongoDB Atlas)         |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.8+
- MongoDB (local or MongoDB Atlas connection string)

### Step 1 — ML Service

```bash
cd ml-service
pip install -r requirements.txt
python generate_data.py
python train_model.py
python app.py
```

(Run from the `carenet` directory. The ML service runs at **http://localhost:5001**. Leave it running.)

### Step 2 — Backend

```bash
cd backend
npm install
```

Edit `backend/.env` and set your MongoDB URI:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/carenet
```

Seed demo patients (run once):

```bash
node seed.js
```

Start the server:

```bash
node server.js
```

(Run from the `carenet` directory. The backend runs at **http://localhost:5000**.)

### Step 3 — Frontend

```bash
cd frontend
npm install
npm run dev
```

(Run from the `carenet` directory. The frontend runs at **http://localhost:5173**.)

---

## Team

**HAL 4.0 Hackathon** — CARE-NET Team

---

## Live Demo

Live demo URL: _[Add your deployed URL here]_

---

## Features

- **Dashboard**: Total patients, high-risk count, scheme enrollment rate, dropout risk rate, risk donut chart, recent high-risk list, disease breakdown.
- **Patient list**: Search, filter by risk/disease/hospital, pagination, view profile.
- **Add patient**: Full form; on submit, backend creates patient and calls ML service; result shows risk level, probability, reasons, recommendation.
- **Patient profile**: Info card, treatment stage, re-assess risk, AI risk card with reasons and recommendation, appointment history + add appointment, recommended schemes with enroll, transfer history + transfer to new hospital modal.
- **Transfer records**: Select patient, fill transfer form; on success, shows "Transfer Complete" with from/to, date, and updated risk.

All APIs are fully implemented; no placeholders or TODOs. The app works end-to-end with the ML service and MongoDB.
