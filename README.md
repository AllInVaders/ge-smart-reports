# Gemini Enterprise Smart Reports (`ge-smart-reports` v3.2.0)

An open-source, lightweight **Google Cloud Run** observability, token billing, natural-language executive reporting (`gemini-3.8-flash`), expressive AI audio briefing (`gemini-3.8-flash-tts`), and full 4-tier interactive lineage dashboard for **Google Cloud Gemini Enterprise (Discovery Engine)**, **Agent Platform (Vertex AI Reasoning Engines & Publisher Models)**, and **MCP Data Connectors**.

---

## Key Capabilities

### 1. 100% Live GCP API Discovery (Zero Hardcoded Data)
- **Discovery Engine (`v1alpha` / `v1`)**:
  - Dynamically discovers all Gemini Enterprise Apps (`engines`) across `global`, `us`, and `eu` multi-regions.
  - Paginates through all registered `agents` (`pageSize=100` + `nextPageToken`) across every assistant (`Low-Code`, `ADK / Vertex Reasoning Engine`, `Skill`, `Workflow`, `A2A`, and `Google-made`), extracting declared agent models (`lowCodeAgentDefinition.nodes[].llmAgentNode.model`, `workflowAgentDefinition.agentFlow.nodes[].agentNode.model`) and runtime validation diagnostics (`dialogflowAgentToEngineSubType.validationErrors`).
  - Inspects all `dataStores` and `collections/{id}/dataConnector` health states (`ACTIVE`, `INITIALIZATION_FAILED`, `ConnectorRun` entity metrics, custom MCP servers, Google Workspace connectors, and unstructured stores).
  - Queries `userStores/default_user_store/userLicenses` for seat assignment states (`ASSIGNED` vs. `UNASSIGNED`) and last-login activity.
- **Vertex AI / Agent Platform (`v1beta1` & `v1`)**:
  - Discovers all deployed Vertex AI Reasoning Engines (`reasoningEngines`) with full pagination and links `adkAgentDefinition.provisionedReasoningEngine` resources to their upstream Gemini Enterprise agents.
- **Cloud Monitoring (`v3`) & Cloud Billing (`v1`)**:
  - Queries real-time 30-day publisher model token consumption (`aiplatform.googleapis.com/publisher/online_serving/token_count` grouped by `model_user_id`, `type` [`input`, `output`], and `location`) and invocation volume (`aiplatform.googleapis.com/publisher/online_serving/model_invocation_count`), linked to the project's live Cloud Billing account (`projects/{project}/billingInfo`).

### 2. Executive Summary & Environment Recommendations (`gemini-3.8-flash`) + Expressive TTS (`gemini-3.8-flash-tts`)
- **On-Demand Executive Report (`POST /api/narrative`)**:
  - Powered by **Vertex AI `gemini-3.8-flash`** (`locations/global/publishers/google/models/gemini-3.8-flash:generateContent`) grounded 100% on live Discovery Engine, Vertex AI, and Cloud Monitoring telemetry:
    - **a) Executive Summary — 5 Most Important Insights**: Data-backed leadership highlights covering portfolio scale, token velocity, productivity ROI, connector grounding, and operational health.
    - **b) Recommendations for Your Environment**: Prioritized (`HIGH`, `MEDIUM`, `OPTIMIZATION`) engineering and FinOps actions tailored to the live GCP project (context caching, model standardization on `gemini-3.8-flash`, connector quota remediation, draft agent validation fixes, and seat governance).
- **"🔊 Read Me the Report" Expressive Audio Briefing (`POST /api/tts`)**:
  - Powered by **`gemini-3.8-flash-tts`** (`texttospeech.googleapis.com/v1beta1/text:synthesize` & Vertex AI Gemini Flash TTS audio synthesis) with natural expressive voices (**`Kore`**, **`Charon`**, **`Aoede`**, **`Puck`**, and **`Fenrir`**), play/pause/stop controls, playback speed selector (`0.9x`–`1.5x`), and browser Web Speech fallback.

### 3. Workstreams & Deliverables Portfolio Analytics
- Positioned **immediately below the Executive Summary & Environment Recommendations** section for executive visibility:
  - **What Gemini Enterprise Is Used For (Workstreams)**: Dynamic classification of agent sessions and variable spend across Data Engineering/SQL, Procurement/Supply Chain, Growth/Marketing, Legal/Contract Governance, Software/Cloud Ops, and HR/Talent workflows.
  - **Deliverables Produced by Agent Portfolio**: Breakdown of output modalities across Enterprise Search Synthesis, Procurement RFPs, Contract Redlines, Campaign Assets, and Multi-Agent Orchestration.

### 4. Agent Platform Model Billing & Token Consumption (Per Model, Per Agent, Per Project/App)
- **Per Model**: Live 30-day input tokens, output tokens, total tokens, invocation counts, `% token share`, unit pricing (`$/1M`), and token spend (`$`) across every active publisher model (`gemini-3.8-flash`, `gemini-omni-flash-preview`, `gemini-3.1-flash-image`, `gemini-3-pro-image`, `gemini-3.1-pro-preview`, `gemini-3.5-flash`, `gemini-3.7-flash`, etc.).
- **Per Agent**: Attributes token consumption (input, output, total tokens) and spend across all registered Gemini Enterprise agents based on each agent's declared model, architectural intensity, and session activity.
- **Per Project & App**: Rolls up total project token consumption and breaks down token volume and spend across each Gemini Enterprise Engine/App.

### 5. Interactive 4-Tier ReactFlow Lineage Graph
- Renders the complete project topology across **1. Connected Data Stores & MCP** &rarr; **2. Gemini Enterprise Apps** &rarr; **3. Registered Agents** &rarr; **4. Vertex AI Reasoning Engines**:
  - **Multi-Column Matrix View**: Displays all registered agents simultaneously in a clean 4-sub-column matrix with dimmed background edges (`opacity: 0.16`) and foreground highlighted selection paths so high-fanout hubs never create overlapping edge walls.
  - **Paginated Stream View (`20 agents/page`) & ADK Focus View**: Filter by agent subtype (`ADK`, `Low-Code`, `Skill`, `Workflow`, `A2A`, `Managed`) or search by agent/store name.
  - **Node Inspector**: Displays full resource paths (`word-break: break-all`), live token telemetry, and clickable upstream/downstream lineage edges.

### 6. Burger Menu Configuration & Live Expense Formula (`ƒx Understand Expense`)
- Accessible from the top-left **Burger Menu (`☰`)** (`Smart Reports Configuration`):
  - Hosts the **`ƒx LIVE EXPENSE FORMULA`** banner and interactive equation breakdown combining live Cloud Monitoring token spend, variable session/turn spend, active data connector costs, assigned user seat licenses, and engineering hours saved.
  - Allows real-time customization and recalculation (`POST /api/config`) of token rates, turns per session, connector monthly cost, seat license cost, minutes saved per session, and hourly engineering rate.

---

## REST API Endpoints

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Health check returning active `project_id` and service version (`3.2.0`) |
| `/api/report` | `GET` | Full live Discovery Engine, Vertex AI, Cloud Monitoring token billing, workstreams, deliverables, and expense report (`?engine_id=ALL&refresh=false`) |
| `/api/lineage` | `GET` | Complete 4-tier ReactFlow lineage graph nodes and edges (`?engine_id=ALL`) |
| `/api/narrative` | `POST` | On-demand `gemini-3.8-flash` Executive Summary (5 bullets) & Environment Recommendations |
| `/api/tts` | `POST` | Synthesizes natural expressive audio (`gemini-3.8-flash-tts`, voices: `Kore`, `Charon`, `Aoede`, `Puck`, `Fenrir`) |
| `/api/config` | `GET` / `POST` | Reads or updates live expense & productivity formula parameters |

---

## Quick Start (Local Development)

```bash
git clone https://github.com/AllInVaders/ge-smart-reports.git
cd ge-smart-reports

pip install -r requirements.txt

gcloud auth application-default login
export GCP_PROJECT_ID="your-gcp-project-id"

PORT=8080 python3 main.py
```

Open `http://localhost:8080` in your browser.

---

## 1-Command Cloud Run Deployment

```bash
chmod +x deploy.sh
./deploy.sh your-gcp-project-id us-central1
```

Or deploy directly with `gcloud`:

```bash
gcloud run deploy ge-smart-reports \
  --source . \
  --project your-gcp-project-id \
  --region us-central1 \
  --allow-unauthenticated
```
