# 🏥 CARE-NET
### AI-Powered Continuity of Care & Treatment Dropout Prevention Platform

<div align="center">

<img width="600" height="200" alt="carenetbanner" src="https://github.com/user-attachments/assets/51893883-9e42-4b81-be74-a3e6be3d7318" />

> *"In India, nearly 50% of chronic disease patients drop out of treatment midway — not because they want to, but because the system fails them. CARE-NET fixes that."*

[![Made at HAL 4.0](https://img.shields.io/badge/HAL%204.0-Hackathon-purple?style=for-the-badge)](https://unstop.com)
[![Global Academy of Technology](https://img.shields.io/badge/GAT-Bengaluru-blue?style=for-the-badge)](https://gat.ac.in)
[![Theme](https://img.shields.io/badge/Theme-Ignite%20The%20Future-orange?style=for-the-badge)]()
[![Track](https://img.shields.io/badge/Track-Healthcare%20%26%20AI-green?style=for-the-badge)]()

</div>

---

## 📸 Screenshots

### Dashboard
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 39 56 AM" src="https://github.com/user-attachments/assets/d5ca35a9-eb9f-4596-a7c2-dc1b663c33b6" />

> *Real-time overview — total patients, risk distribution donut chart, high-risk alerts, and disease breakdown table*

### Patient List
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 40 32 AM" src="https://github.com/user-attachments/assets/f2b153e1-63c3-4042-8911-c27582cef0ba" />

> *Full patient registry with search, risk-level filtering, and color-coded badges*

### Patient Profile
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 40 46 AM" src="https://github.com/user-attachments/assets/a8170453-bf4c-45d4-a787-572fc2cc6aeb" />

> *Complete patient view — AI risk score with reasons, treatment timeline, scheme recommendations, and Aadhaar identity card*

### Add Patient with Aadhaar Scan
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 40 53 AM" src="https://github.com/user-attachments/assets/d510665b-0097-48d0-8cf6-9bedbeb60ff9" />

> *Upload Aadhaar card photo → AI auto-fills patient details instantly*

### Transfer Records
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 40 57 AM" src="https://github.com/user-attachments/assets/34c4c552-0063-4df0-94e0-cfaeb7761a06" />

> *Seamless cross-hospital medical record transfer with full history preservation*

### Analytics
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 40 19 AM" src="https://github.com/user-attachments/assets/425f74a0-44af-4f4d-92d5-6fb708c8863a" />

> *6 live charts — risk trends, disease breakdown, hospital load, treatment stage distribution*

### Government Health Schemes
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 41 11 AM" src="https://github.com/user-attachments/assets/b49d0eb9-7bf7-462d-b024-0a227f26a112" />

> *Browse and enroll in 8 major Indian government healthcare schemes*

### Nearby Services
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 41 06 AM" src="https://github.com/user-attachments/assets/bc6a4c8d-ee95-45a6-85fc-487e6bbbd16b" />

> *GPS-powered Jan Aushadhi store finder and emergency ambulance locator*

### System Logs
<img width="618" height="314" alt="Screenshot 2026-02-22 at 3 41 15 AM" src="https://github.com/user-attachments/assets/e5592bfb-ab4a-4da6-a9ed-58cd87ec9784" />

> *Full audit trail — login/logout timestamps, patient events, and activity monitoring*

### CARE-NET Chatbot
<img width="200" height="260" alt="Screenshot 2026-02-22 at 3 42 20 AM" src="https://github.com/user-attachments/assets/dd46ff0d-0467-4408-a6d5-28b809902b98" />

> *AI-powered navigation assistant that guides users through every feature*

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Team](#-team)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Project](#-running-the-project)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [ML Model](#-ml-model)
- [Deployment](#-deployment)
- [Impact](#-impact)
- [Future Scope](#-future-scope)
- [License](#-license)

---

## 🚨 Problem Statement

Public healthcare programs — TB, maternal care, diabetes, hypertension — suffer from **high patient treatment dropout rates** caused by:

| System Failure | Impact |
|---|---|
| Fragmented patient records across hospitals | Treatment restarts from scratch after every transfer |
| No financial aid awareness | Patients quit due to cost — unaware free schemes exist |
| Zero automated follow-ups | Patients forget appointments, no one follows up |
| Poor inter-hospital communication | Diagnosis data lost during hospital transfers |
| Workflow delays | Lab reports delayed → patient loses faith → dropout |

> **The system blames patients for non-adherence while ignoring structural barriers it created.**

---

## 💡 Solution

**CARE-NET** is a three-service AI platform that:

1. **Predicts** which patients are at risk of dropping out — before they do
2. **Detects** the specific system failure causing the risk
3. **Fixes** it — by recommending schemes, triggering follow-ups, transferring records seamlessly
4. **Tracks** every event with a complete audit trail

---

## ✨ Features

### 🤖 AI Dropout Risk Prediction
- Random Forest ML model trained on 1000 synthetic patient records
- Predicts risk probability (0–100%) with specific reasons
- Risk levels: **High** (>70%) · **Medium** (40–70%) · **Low** (<40%)
- Re-assesses automatically after every patient update

### 🪪 Aadhaar Photo Identity Recognition
- Upload Aadhaar card photo → AI reads and auto-fills patient form
- Extracts name, DOB, gender, last 4 digits
- Uses Claude/Gemini Vision API
- Only last 4 digits stored for privacy compliance

### 📊 Live Analytics Dashboard
- 6 interactive Recharts graphs on a dedicated Analytics page
- Donut chart, line chart, bar charts, radial bar — all animated
- Auto-refreshes every 60 seconds with live data

### 🏥 Inter-Hospital Medical Record Transfer
- Unique Patient ID (PAT-XXXXXX) follows patient across hospitals
- Complete diagnosis history preserved on transfer
- Risk re-assessed after every transfer

### 💊 Government Scheme Recommendation
- AI matches patient profile to eligible schemes
- One-click enrollment updates risk score
- 8 schemes: Ayushman Bharat, Nikshay Poshan Yojana, JSY, and more

### 📍 Nearby Jan Aushadhi & Ambulance Locator
- GPS-based pharmacy finder using Overpass (OpenStreetMap) API
- Shows distance, name, and Google Maps directions for each store
- Emergency call buttons: **108** and **112** dial directly
- No API key required — completely free

### 📄 Digital Prescription Generator
- Doctor fills form → live PDF preview updates in real time
- Downloads branded CARE-NET prescription PDF
- Unique prescription ID per document
- Includes medications table, diagnosis, follow-up date

### 📝 System Activity Logs
- Logs every login, logout, patient creation, risk assessment
- Filter by type, user, and date
- Auto-refreshes every 30 seconds
- Success/Failure/Warning status badges

### 🤖 AI Navigation Chatbot
- Floating chatbot on every page
- Knows every feature, page, and workflow in CARE-NET
- Multi-turn conversation with full history context
- Quick suggestion buttons for common questions

### 🔐 Authentication
- JWT-based login with bcrypt password hashing
- Protected routes — all pages require login
- Two roles: Admin and Doctor
- Logout creates audit log entry

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| TailwindCSS | Utility-first styling |
| Recharts | Interactive data charts |
| React Router DOM | Client-side routing |
| Axios | HTTP client |
| jsPDF + jspdf-autotable | PDF generation |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT + bcryptjs | Authentication |
| Axios | Internal service calls to ML |
| Morgan + Winston | Request logging |

### ML Service
| Technology | Purpose |
|---|---|
| Python 3.11 | Runtime |
| Flask + Flask-CORS | ML API server |
| Scikit-learn | Random Forest model |
| Pandas + NumPy | Data processing |
| Joblib | Model serialization |

### External APIs
| API | Feature | Cost |
|---|---|---|
| Anthropic Claude / Google Gemini | Aadhaar scan + Chatbot | Free tier |
| Overpass API (OpenStreetMap) | Nearby pharmacy finder | Free |
| Google Maps Embed | Map display + directions | Free |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                        │
│              React + Vite (port 5173)                   │
│                                                         │
│  Dashboard │ Patients │ Analytics │ Schemes │ Nearby    │
│  Add Patient │ Transfer │ Logs │ Prescription │ Chat    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / REST
                       ▼
┌─────────────────────────────────────────────────────────┐
│              NODE.JS BACKEND (port 5000)                │
│                                                         │
│  /api/patients    /api/analytics    /api/schemes        │
│  /api/transfer    /api/logs         /api/auth           │
│  /api/aadhaar     /api/prescriptions                    │
│                                                         │
│              MongoDB Atlas (Cloud)                      │
│         Patients │ Logs │ RiskAssessments               │
└──────────────────────┬──────────────────────────────────┘
                       │ Internal HTTP
                       ▼
┌─────────────────────────────────────────────────────────┐
│           PYTHON ML SERVICE (port 5001)                 │
│                                                         │
│  POST /predict          → Dropout risk score            │
│  GET  /feature-importance → Model explainability        │
│  GET  /health           → Service health check          │
│                                                         │
│  RandomForestClassifier (scikit-learn)                  │
│  Trained on 1000 synthetic patient records              │
└─────────────────────────────────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
┌──────────────────┐    ┌──────────────────────┐
│  Anthropic /     │    │  Overpass API        │
│  Gemini API      │    │  (OpenStreetMap)     │
│                  │    │                      │
│  Aadhaar scan    │    │  Nearby pharmacies   │
│  AI Chatbot      │    │  Nearby hospitals    │
└──────────────────┘    └──────────────────────┘
```

---

## 👥 Team

| Name | Role | Responsibility |
|---|---|---|
| [Kiran A V] | ML Engineer | Dropout prediction model, Flask API |
| [Karthik M] | Backend Developer | Express API, MongoDB, Auth |
| [Jeevan N Mallya] | Frontend Developer | React UI, Charts, PDF generation |

**College:** Global Academy of Technology, Bengaluru
**Event:** Hack-A-League 4.0 — February 21–22, 2026
**Track:** Healthcare & AI/ML

---

## 📦 Prerequisites

Make sure these are installed before starting:

```bash
node --version    # v18.0.0 or higher
npm --version     # v9.0.0 or higher
python --version  # v3.9 or higher
pip --version     # comes with Python
git --version     # any version
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourteam/carenet.git
cd carenet
```

### 2. MongoDB Atlas Setup

1. Create free account at https://mongodb.com/atlas
2. Create free M0 cluster
3. Add database user with password
4. Allow network access from anywhere (0.0.0.0/0)
5. Copy connection string — needed in Step 4

### 3. ML Service Setup

```bash
cd ml-service

# Create and activate virtual environment
python -m venv venv

# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Generate synthetic training data
python generate_data.py

# Train the model (creates dropout_model.pkl)
python train_model.py
```

**Expected training output:**
```
Training model...
Accuracy: 0.89
Model saved as dropout_model.pkl ✓
```

### 4. Backend Setup

```bash
cd ../backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carenet
ML_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=carenet_secret_hal4_2026
ANTHROPIC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
NODE_ENV=development
```

```bash
# Seed demo patients (run ONCE only)
node seed.js
```

**Expected seed output:**
```
Connected to MongoDB ✓
Seeded: Mohammed Iqbal  PAT-204096  High Risk (87.2%)
Seeded: Lakshmi Devi    PAT-150634  High Risk (79.4%)
Seeded: Priya Sharma    PAT-656813  Medium Risk (52.1%)
Seeded: Ramesh Kumar    PAT-222162  Low Risk (18.3%)
Seeded: Arjun Patel     PAT-481721  Low Risk (11.7%)
Seed complete. 5 patients added ✓
```

### 5. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_GEMINI_API_KEY=your_key_here
VITE_GROQ_API_KEY=your_key_here
```

---

## ▶️ Running the Project

Open **three separate terminal tabs** and run each command:

### Terminal 1 — ML Service
```bash
cd carenet/ml-service
source venv/bin/activate    # Windows: venv\Scripts\activate
python app.py
# ✅ Running on http://localhost:5001
```

### Terminal 2 — Backend
```bash
cd carenet/backend
npx nodemon server.js
# ✅ CARE-NET Backend running on port 8000
# ✅ MongoDB connected successfully
```

### Terminal 3 — Frontend
```bash
cd carenet/frontend
npm run dev
# ✅ Local: http://localhost:5173
```

### Open in Browser
```
http://localhost:5173
```

### Demo Login Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `carenet2026` |
| Doctor | `doctor` | `doctor123` |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `PORT` | Backend server port (default 8000) | ✅ |
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `ML_SERVICE_URL` | Flask ML service URL | ✅ |
| `FRONTEND_URL` | React app URL for CORS | ✅ |
| `JWT_SECRET` | Secret for JWT token signing | ✅ |
| `ANTHROPIC_API_KEY` | For Aadhaar card scanning | Optional |
| `GEMINI_API_KEY` | Alternative to Anthropic | Optional |
| `NODE_ENV` | development or production | ✅ |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | ✅ |
| `VITE_ANTHROPIC_API_KEY` | For AI chatbot | Optional |
| `VITE_GEMINI_API_KEY` | Alternative chatbot API | Optional |
| `VITE_GROQ_API_KEY` | Fast free chatbot API | Optional |

> **Note:** Only one AI API key is needed. Get a free Gemini key at https://aistudio.google.com

---

## 📡 API Reference

### Authentication
```
POST   /api/auth/login          Login with username + password
GET    /api/auth/verify         Verify JWT token
POST   /api/auth/logout         Logout + create log entry
```

### Patients
```
GET    /api/patients            Get all patients (with filters)
POST   /api/patients            Create new patient
GET    /api/patients/:id        Get single patient profile
PUT    /api/patients/:id        Update patient
DELETE /api/patients/:id        Soft delete patient
POST   /api/patients/:id/assess Re-run AI risk assessment
POST   /api/patients/:id/appointment  Add appointment
GET    /api/patients/high-risk  Get all high-risk patients
```

### Analytics
```
GET    /api/analytics/overview       Dashboard stats
GET    /api/analytics/trends         Weekly risk trend data
GET    /api/analytics/stage-breakdown Treatment stage counts
```

### Schemes
```
GET    /api/schemes/recommend/:id    Recommend schemes for patient
POST   /api/schemes/enroll/:id       Enroll patient in scheme
```

### Transfer
```
POST   /api/transfer/:id             Transfer patient records
GET    /api/transfer/:id/history     Get transfer history
```

### Logs
```
GET    /api/logs                     Get activity logs (with filters)
GET    /api/logs/stats               Get log statistics
DELETE /api/logs/clear               Clear all logs (admin)
```

### Aadhaar
```
POST   /api/aadhaar/scan             Extract details from Aadhaar photo
```

### ML Service
```
POST   /predict                      Get dropout risk prediction
GET    /health                       Service health check
GET    /feature-importance           Model feature weights
```

---

## 🧠 ML Model

### Algorithm
**Random Forest Classifier** — chosen for:
- High accuracy on tabular healthcare data
- Built-in feature importance for explainability
- No data normalization required
- Resistant to overfitting on small datasets

### Input Features

| Feature | Description | Range |
|---|---|---|
| `missed_appointments` | Total missed appointments | 0–10 |
| `days_since_last_visit` | Days since patient last visited | 0–180 |
| `financial_score` | Economic status of patient | 1–10 |
| `treatment_stage` | Current stage of treatment | 1–4 |
| `follow_up_calls_received` | Number of follow-up calls | 0–8 |
| `hospital_delay_days` | Days of hospital processing delay | 0–45 |
| `scheme_enrolled` | Enrolled in government scheme | 0 or 1 |

### Output

```json
{
  "dropout_risk": 1,
  "risk_probability": 87.3,
  "risk_level": "High",
  "primary_reasons": [
    "Multiple missed appointments",
    "Financial barrier with no scheme support",
    "Extended treatment gap (over 90 days)"
  ],
  "recommendation": "Immediate intervention required. Assign ASHA worker and enroll in financial scheme."
}
```

### Model Performance
```
Accuracy:  89%
Precision: 0.91 (Low Risk) | 0.87 (High Risk)
Recall:    0.88 (Low Risk) | 0.91 (High Risk)
F1 Score:  0.89
```

> **Note:** Model trained on 1000 synthetic records generated with realistic Indian healthcare dropout patterns.

---

## 🌐 Deployment(not yet been implemented)

### ML Service → Railway
```bash
# Add Procfile in ml-service/
echo "web: gunicorn app:app --bind 0.0.0.0:\$PORT" > Procfile

# Push and deploy at railway.app
# Set root directory to ml-service/
```

### Backend → Render
```bash
# At render.com → New Web Service
# Root directory: backend/
# Build command: npm install
# Start command: node server.js
# Add all environment variables in Render dashboard
```

### Frontend → Vercel
```bash
# At vercel.com → Import GitHub repo
# Root directory: frontend/
# Framework: Vite
# Add VITE_API_URL = your Render backend URL
```

### Live URLs
```
Frontend:   https://carenet-frontend.vercel.app
Backend:    https://carenet-backend.onrender.com
ML Service: https://carenet-ml.railway.app
```

---

## 📊 Impact

### Healthcare Impact
- Reduces treatment dropout rates in public healthcare programs
- Improves chronic disease management outcomes
- Enables data-driven hospital workflow decisions

### Social Impact
- Supports low-income patients with scheme awareness
- Prevents financial-barrier-induced dropout
- Bridges communication gap between patient and hospital

### Scale Potential
- Deployable in any government PHC with a browser
- Same platform handles TB, diabetes, maternal care, hypertension
- Estimated 500M+ patients in India who could benefit

---

## 🔭 Future Scope

- [ ] Mobile app (React Native) using same backend API
- [ ] ASHA worker dedicated mobile dashboard
- [ ] Regional language support (Kannada, Hindi, Tamil)
- [ ] Real SMS/WhatsApp follow-up via Twilio
- [ ] Integration with Ayushman Bharat digital health records
- [ ] Predictive analytics for hospital resource planning
- [ ] Offline mode for rural PHCs with poor connectivity
- [ ] Biometric patient verification via fingerprint

---

## 📁 Project Structure

```
carenet/
├── ml-service/
│   ├── app.py                 Flask API server
│   ├── train_model.py         Model training script
│   ├── generate_data.py       Synthetic data generator
│   ├── dropout_model.pkl      Trained model (auto-generated)
│   ├── feature_names.pkl      Feature list (auto-generated)
│   └── requirements.txt       Python dependencies
│
├── backend/
│   ├── server.js              Express app entry point
│   ├── seed.js                Database seeder
│   ├── .env                   Environment variables
│   ├── models/
│   │   ├── Patient.js         Patient schema
│   │   └── RiskAssessment.js  Risk assessment schema
│   ├── routes/
│   │   ├── patients.js        Patient CRUD + assessment
│   │   ├── analytics.js       Dashboard stats + trends
│   │   ├── schemes.js         Scheme recommendation
│   │   ├── transfer.js        Record transfer
│   │   ├── auth.js            Login + logout
│   │   ├── logs.js            Activity logs
│   │   └── aadhaar.js         Aadhaar scan
│   └── middleware/
│       └── logger.js          Log model + createLog helper
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            Router + ProtectedRoute
│   │   ├── api/axios.js       API client functions
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    Navigation sidebar
│   │   │   ├── RiskBadge.jsx  High/Medium/Low badge
│   │   │   ├── StatCard.jsx   Dashboard stat card
│   │   │   └── Chatbot.jsx    AI chat widget
│   │   ├── pages/
│   │   │   ├── Login.jsx      Auth page
│   │   │   ├── Dashboard.jsx  Overview + charts
│   │   │   ├── PatientList.jsx All patients table
│   │   │   ├── PatientProfile.jsx Full patient view
│   │   │   ├── AddPatient.jsx New patient form
│   │   │   ├── TransferRecords.jsx Hospital transfer
│   │   │   ├── Analytics.jsx  6 live charts
│   │   │   ├── Schemes.jsx    Government schemes
│   │   │   ├── NearbyServices.jsx GPS pharmacy finder
│   │   │   ├── SystemLogs.jsx Activity audit trail
│   │   │   └── Prescription.jsx Digital prescription
│   │   └── utils/
│   │       └── generatePDF.js Patient + prescription PDF
│   └── .env                   Frontend environment vars
│
├── .gitignore
└── README.md
```

---

## ⚠️ Common Issues & Fixes

| Error | Cause | Fix |
|---|---|---|
| `EADDRINUSE port 5000` | Port already in use | Run `lsof -ti:5000 \| xargs kill -9` |
| `dropout_model.pkl not found` | Model not trained | Run `python generate_data.py && python train_model.py` |
| `patientId is required` | pre-save hook issue | Change `pre('save')` to `pre('validate')` in Patient.js |
| `Cannot connect to MongoDB` | Wrong URI or IP not whitelisted | Check Atlas Network Access → allow 0.0.0.0/0 |
| `Connection refused port 5001` | Flask not running | Start ML service first in Terminal 1 |
| Blank screen on frontend | Backend not running | Start backend first, then refresh |
| CORS error in browser | FRONTEND_URL mismatch | Match `.env` FRONTEND_URL with actual frontend port |

---

## 📜 License

This project was built for **Hack-A-League 4.0** hosted by the Department of Computer Science & Engineering, Global Academy of Technology, Bengaluru.

Built with ❤️ for the theme **"Ignite the Future"** — February 21–22, 2026.

---

<div align="center">

**CARE-NET** · HAL 4.0 Hackathon · Global Academy of Technology

*"Preventing system-induced dropout — one patient at a time."*

![Visitors](https://img.shields.io/badge/Built%20in-24%20Hours-cyan?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Python-blue?style=flat-square)
![AI](https://img.shields.io/badge/AI-Random%20Forest%20%2B%20LLM-green?style=flat-square)

</div>
