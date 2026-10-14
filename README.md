# Multi-Agent Research Pipeline (Phase 1 Evaluation)

Backend API implementation for the Final Year Project based on the **Overall System Architecture (Fig. 4.1)**.

---

## 📁 Project Directory Structure

```text
Major Project/
├── backend/
│   ├── .env                       # Environment variables
│   ├── .env.example               # Example template
│   ├── package.json               # Node.js dependencies
│   ├── server.js                  # Main Express app entrypoint
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection with graceful fallback
│   │   │
│   │   ├── models/                # Mongoose Models
│   │   │   ├── User.js            # User Schema + bcrypt hashing
│   │   │   ├── Document.js        # Ingested PDF/paper schema
│   │   │   └── ResearchSession.js # Full pipeline state schema
│   │   │
│   │   ├── middlewares/           # Custom Middlewares
│   │   │   ├── authMiddleware.js  # JWT Bearer token authentication
│   │   │   ├── errorMiddleware.js # 404 & centralized error handling
│   │   │   └── uploadMiddleware.js# Multer for PDF/document uploads
│   │   │
│   │   ├── controllers/           # Business Logic
│   │   │   ├── authController.js          # Register, Login, Get Profile
│   │   │   ├── documentController.js      # Upload & manage documents
│   │   │   ├── agentPipelineController.js # Modular endpoints for each agent
│   │   │   └── researchController.js      # End-to-end research session runner
│   │   │
│   │   ├── routes/                # Express API Routes
│   │   │   ├── authRoutes.js      # /api/v1/auth
│   │   │   ├── documentRoutes.js  # /api/v1/documents
│   │   │   ├── agentRoutes.js     # /api/v1/agents
│   │   │   └── researchRoutes.js  # /api/v1/research
│   │   │
│   │   ├── agents/                # Folder Structure for Phase 2 AI Agents
│   │   │   ├── planner/           # Module 1: Research Planner Agent
│   │   │   ├── retrieval/         # Module 2: Information Retrieval Agent
│   │   │   ├── analysis/          # Module 3: Analysis Agent
│   │   │   ├── verification/      # Module 4: Verification Agent
│   │   │   ├── knowledgeGraph/    # Module 5: Knowledge Graph Agent
│   │   │   └── synthesis/         # Module 6: Synthesis Agent
│   │   │
│   │   └── utils/
│   │       ├── generateToken.js   # JWT generator
│   │       └── apiResponse.js     # Standardized JSON response helper
│   │
│   └── uploads/                   # Local storage for uploaded research papers
│
└── postman/
    └── Multi_Agent_Research_Pipeline.postman_collection.json # 1-Click Postman import
```

---

## 🚀 Quick Start Guide

### 1. Run the Backend
Open a terminal in `Major Project/backend`:
```bash
npm run dev
# or
npm start
```
Server starts on: `http://localhost:5000`

---

## 🧪 Postman Testing (Phase 1 Evaluation)

### Import Collection
1. Open **Postman**.
2. Click **Import** (top left).
3. Drag & drop `postman/Multi_Agent_Research_Pipeline.postman_collection.json`.

### Demo Sequence to Show Evaluators
1. **Health Check:** `GET /health` $\rightarrow$ Demonstrates server status.
2. **User Registration:** `POST /api/v1/auth/register`
   - *Automated:* Postman test script automatically captures the returned JWT token and stores it in the `{{token}}` variable!
3. **Protected Profile:** `GET /api/v1/auth/me`
   - Demonstrates that `authMiddleware` verifies the JWT token properly.
4. **Document Ingestion:** `POST /api/v1/documents/upload`
   - Demonstrates paper ingestion (PDF/DOCX) using `multer`.
5. **Modular Agent Endpoints (Fig. 4.1):**
   - `POST /api/v1/agents/plan` (Research Planner Agent)
   - `POST /api/v1/agents/retrieve` (Information Retrieval Agent)
   - `POST /api/v1/agents/analyze` (Analysis Agent)
   - `POST /api/v1/agents/verify` (Verification Agent)
   - `POST /api/v1/agents/knowledge-graph` (Knowledge Graph Agent)
   - `POST /api/v1/agents/synthesize` (Synthesis Agent)
6. **End-to-End Session Execution:**
   - `POST /api/v1/research/sessions` $\rightarrow$ creates a research session (auto-stores `{{sessionId}}`).
   - `POST /api/v1/research/sessions/{{sessionId}}/execute` $\rightarrow$ executes all pipeline stages and updates the session in MongoDB.
