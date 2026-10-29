# EmotionSense™ – Real-Time Workplace Wellness and Burnout Analytics Platform

> **B2B HR-Tech Platform for Workplace Wellness Signal Aggregation, Predictive Burnout Analytics, and AI-Powered Organizational Interventions.**

---

## 📌 Project Metadata & Academic/Industry Context
- **Project Title**: EmotionSense – Real-Time Workplace Wellness and Burnout Analytics Platform
- **Prerequisite Skills**: AI, Data Analytics, Full Stack, NLP
- **Verticals**: HRTech, AI Analytics
- **Project Type**: Industry
- **Complexity Level**: Complex
- **Supervisor**: Amit Vajpayee (E18696)
- **Evaluation Panelists**: Bhupinder Kaur (E2779) and Sushil Kumar Garg (E16434)

---

## 🎯 Project Objective
Build a scalable B2B HR analytics platform that:
1. Ingests pseudonymous employee wellness signals (surveys, workload indicators, overtime trends, leave utilization).
2. Predicts organizational burnout risk using an ensemble ML model ($R^2 = 0.896$, Accuracy = $96.75\%$) and extracts sentiment/themes from pulse feedback using NLP.
3. Renders real-time executive and team dashboards with multidimensional telemetry and risk distributions.
4. Delivers actionable organizational recommendations (e.g. no-meeting days, on-call rotation splitting, mandatory recovery windows) rather than diagnosing individuals.
5. Generates automated weekly/monthly HR reports with one-click export to PDF and Excel.
6. Strictly adheres to ethical privacy guidelines, enforcing K-Anonymity ($k \ge 5$) and SHA-256 tokenization.

---

## 🏛️ System Architecture

```
                                  EmotionSense Platform Flow
                                  ==========================

     Employee / HR Signals              Data Collection & Privacy Layer
   ┌───────────────────────────┐            ┌────────────────────────────────────┐
   │ • Weekly Pulse Surveys    │ ─────────> │ • SHA-256 Token Pseudonymization   │
   │ • Work Hours & Overtime   │            │ • K-Anonymity (k >= 5) Aggregation │
   │ • Meeting Saturation      │            │ • Data Scrubbing & PII Redaction   │
   │ • Attendance & Leave Def. │            └─────────────────┬──────────────────┘
   └───────────────────────────┘                              │
                                                              ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │                    Spring Boot Core Backend (Java 21 / 17)                  │
   │  - REST APIs (JWT Auth, RBAC: HR_Admin, Manager, Employee)                  │
   │  - Multi-Tenant Isolation (TenantContext ThreadLocal)                       │
   │  - Hibernate / JPA with Dual Drivers (PostgreSQL 16 & H2 Compatibility)     │
   │  - Report Generation (Apache POI for Excel, OpenPDF for Executive PDF)      │
   │  - Audit Logging & Real-Time Alert Dispatching                              │
   └───────────────────────┬─────────────────────────────────────┬───────────────┘
                           │                                     │
                           ▼                                     ▼
        ┌──────────────────────────────────────┐  ┌──────────────────────────────┐
        │       PostgreSQL 16 Database         │  │  Python FastAPI ML Engine    │
        │ - organizations, departments, teams  │  │ - Random Forest Regressor    │
        │ - pseudonymous_tokens, surveys       │  │ - Gradient Boosting Clf      │
        │ - workload_metrics, leave_records    │  │ - NLP Feedback Sentiment     │
        │ - burnout_assessments, audit_logs    │  │ - Action Recommendation Gen  │
        └──────────────────────────────────────┘  └──────────────┬───────────────┘
                                                                 │
                                                                 ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │               React 18 + TypeScript + Recharts Dashboard                    │
   │  - Executive Overview: Wellness Index Dial, Risk Distribution Donut         │
   │  - 12-Week Risk vs Overtime Trend Line Chart & Department Comparison Bar   │
   │  - Team Deep Dive: Multidimensional Ergonomics Radar & Telemetry vs Benchmark│
   │  - Confidential Pulse Survey Portal with Live NLP Polarity Preview          │
   │  - AI Recommendation Action Center (Status tracking: Start -> Resolved)    │
   │  - One-Click PDF & Excel Reports Export                                     │
   │  - Privacy & Audit Log Inspector                                            │
   └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Crucial Ethical & Privacy Design Principles

> [!IMPORTANT]
> **Non-Clinical Stance**: Burnout is an organizational ergonomics and workload strain challenge, not an individual psychiatric pathology.
> EmotionSense **explicitly avoids presenting scores as clinical or medical diagnoses**. All indicators are framed as **Workplace Risk Indexes (0–100)** to guide managerial adjustments.

- **K-Anonymity Cohort Protection ($k \ge 5$)**: Teams with fewer than 5 respondents never display isolated individual results; data automatically rolls up into parent departments.
- **Pseudonymous Tokenization**: Survey responses are decoupled from user accounts using salted one-way SHA-256 cryptographic hashes (`pseudonymous_tokens`).
- **Audit Trails**: Every HR export and dashboard access event is logged into `audit_logs` with timestamps, actor IDs, client IP addresses, and verification metadata.

---

## 📁 Repository Structure

```
x:/CP-2026/
├── docker-compose.yml              # Complete container orchestration
├── README.md                       # Comprehensive system documentation
│
├── database/                       # PostgreSQL 16 DDL & Seed Scripts
│   ├── schema.sql                  # Multi-tenant tables, foreign keys, and indexes
│   └── seed_data.sql               # Rich TechNova Solutions benchmark dataset
│
├── ml-service/                     # Python 3.12 + FastAPI + Scikit-Learn
│   ├── requirements.txt            # ML dependencies
│   ├── Dockerfile                  # Container definition
│   ├── main.py                     # FastAPI application endpoints
│   ├── model/
│   │   ├── train.py                # Synthetic empirical generator & ensemble trainer
│   │   ├── predict.py              # Risk score inference & factor attribution
│   │   ├── nlp_sentiment.py        # Domain-tuned NLP sentiment & theme extractor
│   │   └── recommendation_engine.py# AI organizational action generator
│   ├── artifacts/                  # Serialized models (.joblib) & metadata (.json)
│   └── tests/
│       └── test_api.py             # 100% passing Pytest test suite
│
├── backend/                        # Java Spring Boot 3.3.4 Enterprise Backend
│   ├── pom.xml                     # Maven configuration (Security, JPA, POI, OpenPDF)
│   ├── Dockerfile                  # Multi-stage production build
│   └── src/main/
│       ├── resources/
│       │   └── application.yml     # Dual-profile configuration (H2 & PostgreSQL)
│       └── java/com/emotionsense/
│           ├── EmotionSenseApplication.java
│           ├── model/              # 15 JPA Entities (User, Survey, BurnoutAssessment, etc.)
│           ├── repository/         # 12 Spring Data JPA Repositories
│           ├── security/           # JWT Utils, Filter, SecurityConfig, TenantContext
│           ├── service/            # PrivacyService, MlClientService, DashboardService, etc.
│           ├── controller/         # REST Controllers (Auth, Dashboard, Survey, etc.)
│           └── config/
│               └── DataInitializer.java # Auto-bootstraps database on startup
│
└── frontend/                       # React 18 + TypeScript + Vite + Tailwind + Recharts
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── nginx.conf & Dockerfile
    └── src/
        ├── App.tsx                 # Routing & state coordinator
        ├── context/AuthContext.tsx # Role switching (HR Admin, Manager, Employee)
        ├── services/api.ts         # Resilient API service with live/offline demo support
        ├── types/index.ts          # Complete TypeScript domain contracts
        └── components/
            ├── Navbar.tsx          # Role switcher, alert bell, k-anonymity badge
            ├── Sidebar.tsx         # Navigation drawer
            ├── ExecutiveDashboard.tsx # KPIs, trend charts, risk distributions
            ├── TeamDeepDive.tsx    # Multidimensional ergonomics radar & metrics
            ├── SurveyPortal.tsx    # Pseudonymous pulse with live NLP preview
            ├── RecommendationCenter.tsx # AI interventions & lifecycle tracking
            ├── ReportsView.tsx     # One-click PDF & Excel report export
            └── AuditView.tsx       # Compliance & audit log viewer
```

---

## ⚡ Quick Start & Execution Guide

### Option 1: Standalone Native Launch (Recommended for Evaluation)

#### Step 1: Start the Python ML & Analytics Service
```bash
cd x:/CP-2026/ml-service
# Dependencies are pre-installed
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
- API Documentation (Swagger UI): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
- Run test suite: `pytest tests/test_api.py -v`

#### Step 2: Start the React Frontend Dashboard
```bash
cd x:/CP-2026/frontend
npm run dev
```
- Open your browser to `http://localhost:5173`
- The frontend features interactive role-switching in the top navigation bar:
  - **HR Admin** (`Sarah Jenkins`): Full organizational visibility, department benchmarks, export reports, and audit logs.
  - **Manager** (`Elena Rostova`): Team ergonomics deep dive, workload telemetry, and AI recommendation workflows.
  - **Employee** (`Alex Chen`): Confidential pseudonymous pulse survey submission with real-time NLP sentiment preview.

---

### Option 2: Docker Compose Orchestration
Run the full microservices stack (PostgreSQL, Redis, Backend, ML Service, Frontend) with a single command:
```bash
cd x:/CP-2026
docker compose up --build
```

---

## 🧪 Machine Learning & NLP Performance

The ML engine trains an ensemble regressor and classifier:
- **Random Forest Regressor**:
  - $R^2$ Score: `0.896`
  - RMSE: `3.45`
  - Target: Continuous Burnout Risk Index (0.0 – 100.0)
- **Gradient Boosting Classifier**:
  - Accuracy: `96.75%`
  - Classes: `LOW` (< 40), `MODERATE` (40 – 68), `HIGH` (≥ 68)
- **NLP Sentiment & Topic Analyzer**:
  - Computes polarity (-1.0 to +1.0) and subjective intensity.
  - Discovers workplace themes: `OVERTIME_AND_HOURS`, `MEETING_SATURATION`, `ON_CALL_AND_INCIDENTS`, `MANAGEMENT_AND_SUPPORT`, `STAFFING_AND_CAPACITY`, `EMOTIONAL_EXHAUSTION`.
  - Flags high-urgency operational distress alerts.

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Feature / Endpoint | HR_ADMIN | MANAGER | EMPLOYEE | ADMIN |
|---|:---:|:---:|:---:|:---:|
| Executive KPI Dashboard | ✅ | ✅ (Aggregated) | ❌ | ✅ |
| Team Workload Deep Dive | ✅ | ✅ | ❌ | ✅ |
| Submit Pseudonymous Pulse | ✅ | ✅ | ✅ | ✅ |
| Accept AI Recommendations | ✅ | ✅ | ❌ | ✅ |
| Export PDF & Excel Reports| ✅ | ❌ | ❌ | ✅ |
| Compliance & Audit Logs | ✅ | ❌ | ❌ | ✅ |

---

## 📜 Evaluation Checklist
- [x] **Employee Wellness Data**: Anonymous pulse surveys, workload indicators, overtime tracking, attendance & leave patterns.
- [x] **Burnout Prediction Engine**: Calculated team wellness score, trend projection, Scikit-learn ensemble model, risk categories.
- [x] **Real-Time Team Dashboard**: Executive wellness index, risk trends, department comparisons, telemetry alerts.
- [x] **AI-Powered Recommendations**: Workload rebalancing, meeting resets, mandatory recovery windows, organizational focus.
- [x] **Automated Reports**: Weekly/monthly HR reports, risk distributions, direct export to PDF and Excel.
- [x] **B2B Architecture**: Multi-tenant organizations, 4 RBAC roles, JWT authentication, PostgreSQL DDL schema, audit logging.
- [x] **Full Stack Delivery**: Java + Spring Boot backend, Python + FastAPI ML microservice, React + TypeScript + Recharts frontend.
