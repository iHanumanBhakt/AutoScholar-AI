# AutoScholar AI: Autonomous Multi-Agent Research Pipeline (Phase 1)

Backend implementation for the Final Year Project based on the **Overall System Architecture (Fig. 4.1)**. Built with the **MERN Tech Stack** (Node.js, Express, MongoDB) featuring JWT authentication, Multer document ingestion, modular multi-agent contract endpoints, and live web-grounded research retrieval powered by **Google Gemini 2.5 Flash**.

---

## 🏗️ Architecture Overview

The backend is structured around the **Multi-Agent Research Pipeline**:
1. **Research Planner Agent:** Decomposes user research queries into sub-tasks and search strategies.
2. **Information Retrieval Agent:** Retrieves literature using Google GenAI with live Google Search grounding.
3. **Analysis Agent:** Extracts key scientific claims, summaries, and supporting evidence.
4. **Verification Agent:** Cross-checks claims across sources and detects contradictions.
5. **Knowledge Graph Agent:** Constructs entity-relation graphs (nodes & edges).
6. **Synthesis Agent:** Generates structured research briefs and identifies research gaps.

---

## ⚡ Quick Setup & Running the Server

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/iHanumanBhakt/AutoScholar-AI.git
cd AutoScholar-AI/backend
npm install
```

### 2. Configure Environment (`.env`)
Create a `.env` file inside the `backend/` folder (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/multi_agent_research
JWT_SECRET=supersecretresearchjwtkey_2026_phase1_eval
JWT_EXPIRE=30d
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Server
```bash
npm run dev
# or
npm start
```
The server will start at: `http://localhost:5000`

---

## 🧪 Step-by-Step Postman Demonstration Guide

Follow these exact steps in Postman to show the complete working backend to your evaluation panel.

> [!TIP]
> **Option A (Instant 1-Click Import):** Open Postman $\rightarrow$ Click **Import** $\rightarrow$ select `postman/Multi_Agent_Research_Pipeline.postman_collection.json`. All 14 requests below will be loaded automatically!  
> **Option B (Manual Creation):** Follow the step-by-step instructions below.

---

### Step 1: Check Server Health & Status
* **HTTP Method:** `GET`
* **URL:** `http://localhost:5000/health`
* **Headers:** *(None)*
* **Body:** *(None)*
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-15T00:15:00.000Z",
    "uptime": 18.42
  }
  ```
* **What this proves:** The backend server is running and responding without crashes.

---

### Step 2: Register a New User (JWT Auth)
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/auth/register`
* **Headers:** 
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
  ```json
  {
    "name": "Jatin Rawat",
    "email": "jatin@example.com",
    "password": "SecurePassword123!",
    "role": "researcher"
  }
  ```
* **Expected Status:** `201 Created`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "670d8f1234567890abcdef12",
        "name": "Jatin Rawat",
        "email": "jatin@example.com",
        "role": "researcher"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGQ4ZjEyMzQ1Njc4OTA..."
    }
  }
  ```
* **What this proves:** Bcrypt password hashing and JWT token creation work properly.
* **Important:** Copy the generated `token` string from the response! You will use it as `Bearer <token>` in the next protected requests.

---

### Step 3: Login User
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/auth/login`
* **Headers:** 
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
  ```json
  {
    "email": "jatin@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "670d8f1234567890abcdef12",
        "name": "Jatin Rawat",
        "email": "jatin@example.com",
        "role": "researcher"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
* **What this proves:** Credential verification and secure session token generation.

---

### Step 4: Access Protected Profile Route
* **HTTP Method:** `GET`
* **URL:** `http://localhost:5000/api/v1/auth/me`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
* **Body:** *(None)*
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Profile fetched successfully",
    "data": {
      "user": {
        "_id": "670d8f1234567890abcdef12",
        "name": "Jatin Rawat",
        "email": "jatin@example.com",
        "role": "researcher"
      }
    }
  }
  ```
* **What this proves:** JWT Middleware successfully intercepts unauthorized requests and validates valid Bearer tokens.

---

### Step 5: Upload Research Paper (Document Ingestion)
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/documents/upload`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
* **Body Type:** `form-data`
* **Form-data Fields:**
  * Key: `document` | Type: **File** | Value: Select `demo_data/sample_research_paper.txt` (or any PDF on your PC)
  * Key: `title` | Type: **Text** | Value: `Multi-Agent Systems in Scientific Literature`
  * Key: `authors` | Type: **Text** | Value: `Rawat et al.`
  * Key: `publicationYear` | Type: **Text** | Value: `2024`
* **Expected Status:** `201 Created`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Document uploaded successfully",
    "data": {
      "document": {
        "user": "670d8f1234567890abcdef12",
        "originalName": "sample_research_paper.txt",
        "filename": "document-1728950000000-123456789.txt",
        "status": "uploaded",
        "metadata": {
          "title": "Multi-Agent Systems in Scientific Literature",
          "authors": ["Rawat et al."],
          "publicationYear": 2024,
          "sourceType": "pdf_upload"
        }
      }
    }
  }
  ```
* **What this proves:** File ingestion pipeline using Multer saves documents to disk and stores metadata in MongoDB.

---

### Step 6: Get All Uploaded Documents
* **HTTP Method:** `GET`
* **URL:** `http://localhost:5000/api/v1/documents`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
* **Body:** *(None)*
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Documents retrieved successfully",
    "data": {
      "count": 1,
      "documents": [ ... ]
    }
  }
  ```

---

### Step 7: Module 1 – Research Planner Agent
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/agents/plan`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
  ```json
  {
    "researchQuestion": "How do multi-agent architectures mitigate hallucinations in scientific literature extraction?"
  }
  ```
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Planner Agent: Query successfully decomposed",
    "data": {
      "agent": "Research Planner Agent",
      "originalQuestion": "How do multi-agent architectures mitigate hallucinations in scientific literature extraction?",
      "searchStrategy": "Multi-angle query decomposition across academic databases & preprint archives",
      "subQueries": [
        "Foundational literature review on \"How do multi-agent architectures mitigate hallucinations in scientific literature extraction?\"",
        "Current state-of-the-art methodologies related to \"How do multi-agent architectures mitigate hallucinations in scientific literature extraction?\"",
        "Benchmark datasets, comparative results, and open research challenges"
      ],
      "estimatedExecutionStages": [
        "Information Retrieval",
        "Analysis & Claim Extraction",
        "Citation & Conflict Verification",
        "Knowledge Graph Construction",
        "Report Synthesis"
      ]
    }
  }
  ```
* **What this proves:** Automatic task breakdown and query planning into granular sub-queries.

---

### Step 8: Module 2 – Information Retrieval Agent (Live Gemini AI)
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/agents/retrieve`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
  ```json
  {
    "userQuery": "What are the applications of Artificial Intelligence in disaster management?"
  }
  ```
* **Expected Status:** `200 OK`
* **Expected Response (With GEMINI_API_KEY set):**
  ```json
  {
    "success": true,
    "message": "Retrieval Agent: Live research generated via Gemini",
    "data": {
      "agent": "Information Retrieval Agent",
      "model": "gemini-2.5-flash",
      "tools": ["googleSearch"],
      "query": "What are the applications of Artificial Intelligence in disaster management?",
      "output": "1. Research Summary\nArtificial Intelligence plays an increasingly vital role in disaster management...\n2. Key Findings\n- Early Warning Systems: Machine learning models predict flood extents...\n3. Important Sources\n- IEEE Geoscience and Remote Sensing Letters\n4. Research Gaps\n- Limited high-resolution training data in underdeveloped regions..."
    }
  }
  ```
* **What this proves:** Live academic retrieval with Google Search grounding powered by Gemini 2.5 Flash.

---

### Step 9: Module 3 – Analysis Agent
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/agents/analyze`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
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
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Analysis Agent: Claims and evidence successfully extracted",
    "data": {
      "agent": "Analysis Agent",
      "analyzedSourcesCount": 1,
      "extractedClaims": [
        {
          "id": "claim-1",
          "statement": "Multi-agent orchestration improves factual consistency over single-prompt LLM generation.",
          "evidence": "Empirical benchmarks report a 23.4% reduction in unsupported assertions when verified by a secondary agent.",
          "confidenceScore": 0.91
        }
      ]
    }
  }
  ```
* **What this proves:** Automated parsing of raw papers into factual claim-evidence pairs.

---

### Step 10: Module 4 – Verification Agent
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/agents/verify`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
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
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Verification Agent: Claims verified successfully",
    "data": {
      "agent": "Verification Agent",
      "totalClaimsEvaluated": 1,
      "verifiedCount": 1,
      "citationsValid": true,
      "conflictDetected": false,
      "flaggedConflicts": []
    }
  }
  ```
* **What this proves:** Citation cross-referencing and contradiction detection.

---

### Step 11: Module 5 – Knowledge Graph Agent
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/agents/knowledge-graph`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
  ```json
  {
    "topic": "Multi-Agent Scientific Research"
  }
  ```
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Knowledge Graph Agent: Graph data constructed",
    "data": {
      "agent": "Knowledge Graph Agent",
      "nodes": [
        { "id": "node_1", "label": "Multi-Agent Scientific Research", "group": "Topic" },
        { "id": "node_2", "label": "Agent Pipeline", "group": "Architecture" },
        { "id": "node_3", "label": "Vector Store", "group": "Storage" }
      ],
      "edges": [
        { "source": "node_1", "target": "node_2", "relation": "ANALYZED_BY" },
        { "source": "node_2", "target": "node_3", "relation": "QUERIES" }
      ]
    }
  }
  ```
* **What this proves:** Entity-relation graph generation ready for frontend network visualization.

---

### Step 12: Module 6 – Synthesis Agent
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/agents/synthesize`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
  ```json
  {
    "topic": "Multi-Agent Scientific Research"
  }
  ```
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Synthesis Agent: Research report generated",
    "data": {
      "agent": "Synthesis Agent",
      "keyFindings": [
        "Modular multi-agent architectures outperform monolithic LLM calls for complex research."
      ],
      "trendsAndGaps": [
        "High latency remains a challenge during multi-stage sequential agent chains."
      ],
      "markdownContent": "# Comprehensive Research Report: Multi-Agent Scientific Research\n\n## 1. Executive Summary..."
    }
  }
  ```
* **What this proves:** Final structured synthesis formatted for user download and UI rendering.

---

### Step 13: Create End-to-End Research Session
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/research/sessions`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
  * `Content-Type: application/json`
* **Body Type:** `raw` (JSON)
* **Body Content:**
  ```json
  {
    "title": "Survey on Autonomous Multi-Agent Research Assistants",
    "researchQuestion": "What are the main architectural paradigms for agentic information synthesis?"
  }
  ```
* **Expected Status:** `201 Created`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Research session created successfully",
    "data": {
      "session": {
        "_id": "670d99999999999999999999",
        "title": "Survey on Autonomous Multi-Agent Research Assistants",
        "researchQuestion": "What are the main architectural paradigms for agentic information synthesis?",
        "status": "draft"
      }
    }
  }
  ```
* **Note:** Note the `_id` of the created session (e.g., `670d99999999999999999999`).

---

### Step 14: Execute Complete Multi-Agent Pipeline
* **HTTP Method:** `POST`
* **URL:** `http://localhost:5000/api/v1/research/sessions/<SESSION_ID>/execute`
* **Headers:** 
  * `Authorization: Bearer <YOUR_TOKEN_HERE>`
* **Body:** *(None)*
* **Expected Status:** `200 OK`
* **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Multi-agent research pipeline executed successfully",
    "data": {
      "session": {
        "_id": "670d99999999999999999999",
        "status": "completed",
        "plan": { ... },
        "retrievedSources": [ ... ],
        "claims": [ ... ],
        "verificationResults": { ... },
        "knowledgeGraph": { ... },
        "synthesisReport": { ... }
      }
    }
  }
  ```
* **What this proves:** The entire sequential multi-agent research workflow completes end-to-end and updates the session in MongoDB.
