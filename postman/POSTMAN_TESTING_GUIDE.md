# AutoScholar AI - Postman Testing & Evaluation Manual

This guide documents all API methods, routes, sample payloads, and expected responses to demonstrate the backend during the evaluation.

---

## ⚡ Setup Checklist Before Testing
1. Make sure your server is running:
   ```bash
   cd backend
   npm run dev
   ```
   Server will listen on `http://localhost:5000`.
2. In Postman:
   - Click **Import** $\rightarrow$ select `postman/Multi_Agent_Research_Pipeline.postman_collection.json`.
   - (Optional) Import `postman/AutoScholar_AI_Local.postman_environment.json`.

---

## 📋 Complete API Catalog & Testing Guide

### 1. Health & Server Info
#### `GET /health`
* **Purpose:** Proves server is active, returns uptime and timestamp.
* **Headers:** None
* **Expected Response (`200 OK`):**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-15T...",
    "uptime": 12.4
  }
  ```

---

### 2. User Authentication (JWT + Bcrypt)
#### `POST /api/v1/auth/register`
* **Purpose:** Registers a user account and hashes the password with bcrypt.
* **Headers:** `Content-Type: application/json`
* **Body (Raw JSON):**
  ```json
  {
    "name": "Jatin Rawat",
    "email": "jatin@example.com",
    "password": "SecurePassword123!",
    "role": "researcher"
  }
  ```
* **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "670d8f...",
        "name": "Jatin Rawat",
        "email": "jatin@example.com",
        "role": "researcher"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```
* *Postman Test Script:* Automatically saves `token` into `{{token}}`.

#### `POST /api/v1/auth/login`
* **Purpose:** Authenticates existing user and issues JWT.
* **Body (Raw JSON):**
  ```json
  {
    "email": "jatin@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Expected Response (`200 OK`):** Returns user profile and new JWT.

#### `GET /api/v1/auth/me` (Protected Route)
* **Purpose:** Demonstrates JWT Middleware protection.
* **Headers:** `Authorization: Bearer {{token}}`
* **Expected Response (`200 OK`):** Returns current user details. (Returns `401 Unauthorized` if token is missing).

---

### 3. Document Ingestion (Data Source)
#### `POST /api/v1/documents/upload`
* **Purpose:** Uploads academic paper (PDF/TXT) via Multer.
* **Headers:** `Authorization: Bearer {{token}}`
* **Body:** `form-data`
  * `document`: Select File $\rightarrow$ choose `demo_data/sample_research_paper.txt`
  * `title`: "Multi-Agent Systems in Scientific Literature"
  * `authors`: "Rawat et al."
  * `publicationYear`: "2024"
* **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Document uploaded successfully",
    "data": {
      "document": {
        "originalName": "sample_research_paper.txt",
        "filename": "document-172895...txt",
        "status": "uploaded"
      }
    }
  }
  ```

#### `GET /api/v1/documents`
* **Purpose:** Lists all research documents ingested by the authenticated user.
* **Headers:** `Authorization: Bearer {{token}}`

---

### 4. Multi-Agent Pipeline Stages (Fig. 4.1 in Architecture)

#### Stage 1: Research Planner Agent
* **Route:** `POST /api/v1/agents/plan`
* **Headers:** `Authorization: Bearer {{token}}`, `Content-Type: application/json`
* **Body:**
  ```json
  {
    "researchQuestion": "How do multi-agent architectures mitigate hallucinations in scientific extraction?"
  }
  ```
* **Expected Response (`200 OK`):** Returns decomposed sub-queries, planned stages, and search strategy.

#### Stage 2: Information Retrieval Agent (Powered by Gemini + Google Search Grounding)
* **Route:** `POST /api/v1/agents/retrieve`
* **Headers:** `Authorization: Bearer {{token}}`, `Content-Type: application/json`
* **Body:**
  ```json
  {
    "userQuery": "What are the applications of Artificial Intelligence in disaster management?"
  }
  ```
* **Expected Response (`200 OK`):** Returns live Google GenAI response with research summary, key findings, important sources, and research gaps!

#### Stage 3: Analysis Agent
* **Route:** `POST /api/v1/agents/analyze`
* **Headers:** `Authorization: Bearer {{token}}`, `Content-Type: application/json`
* **Body:**
  ```json
  {
    "sources": [
      {
        "title": "Advancements in Multi-Agent Collaborative Frameworks",
        "url": "https://arxiv.org/abs/2401.00001"
      }
    ]
  }
  ```
* **Expected Response (`200 OK`):** Returns extracted claims, scientific evidence, and confidence scores.

#### Stage 4: Verification Agent
* **Route:** `POST /api/v1/agents/verify`
* **Headers:** `Authorization: Bearer {{token}}`, `Content-Type: application/json`
* **Body:**
  ```json
  {
    "claims": [
      {
        "statement": "Multi-agent orchestration improves factual consistency.",
        "sourceRef": "Advancements in Multi-Agent Collaborative Frameworks"
      }
    ]
  }
  ```
* **Expected Response (`200 OK`):** Verifies citation fidelity and detects conflicts between sources.

#### Stage 5: Knowledge Graph Agent
* **Route:** `POST /api/v1/agents/knowledge-graph`
* **Headers:** `Authorization: Bearer {{token}}`, `Content-Type: application/json`
* **Body:**
  ```json
  {
    "topic": "Multi-Agent Scientific Research"
  }
  ```
* **Expected Response (`200 OK`):** Returns structured graph schema (`nodes` and `edges`).

#### Stage 6: Synthesis Agent
* **Route:** `POST /api/v1/agents/synthesize`
* **Headers:** `Authorization: Bearer {{token}}`, `Content-Type: application/json`
* **Body:**
  ```json
  {
    "topic": "Multi-Agent Scientific Research"
  }
  ```
* **Expected Response (`200 OK`):** Returns synthesized markdown research report with trends and research gaps.

---

### 5. End-to-End Research Sessions
#### `POST /api/v1/research/sessions`
* **Purpose:** Creates a tracked session record in MongoDB.
* **Body:**
  ```json
  {
    "title": "Survey on Autonomous Multi-Agent Research Assistants",
    "researchQuestion": "What are the main architectural paradigms for agentic information synthesis?"
  }
  ```
* *Postman Test Script:* Automatically saves `sessionId` into `{{sessionId}}`.

#### `POST /api/v1/research/sessions/{{sessionId}}/execute`
* **Purpose:** Runs all 6 pipeline stages sequentially and stores the comprehensive report in MongoDB.
