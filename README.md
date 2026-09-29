# Gemini Enterprise Smart Reports (`ge-smart-reports`)

An open-source, lightweight **Cloud Run** observability, token billing, natural-language executive reporting, TTS audio briefing, and full lineage dashboard for **Google Cloud Gemini Enterprise (Discovery Engine)**, **Agent Platform (Vertex AI Reasoning Engines & Publisher Models)**, and **MCP Data Connectors**.

## Key Features

1. **100% Live GCP API Discovery (Zero Hardcoded Data)**
   - **Discovery Engine v1alpha / v1**: Dynamically discovers all Gemini Enterprise Apps (`engines`), paginates through all registered `agents` (`Low-Code`, `ADK / Vertex Reasoning Engine`, `Skill`, `Workflow`, `A2A`, and `Google-made`), extracts declared agent models (`llmAgentNode.model`, `agentNode.model`), inspects all `dataStores` and `collections/{id}/dataConnector` health states, and queries `userStores/default_user_store/userLicenses`.
   - **Vertex AI / Agent Platform (`v1beta1` & `v1`)**: Discovers all deployed Reasoning Engines (`reasoningEngines`) with full pagination and maps `adkAgentDefinition` lineage links.
   - **Cloud Monitoring (`v3`) & Cloud Billing (`v1`)**: Queries real-time 30-day token consumption (`aiplatform.googleapis.com/publisher/online_serving/token_count`) and model invocations (`model_invocation_count`) across all active Gemini models, linked to the project's live Cloud Billing account (`projects/{project}/billingInfo`).

2. **Agent Platform Model Billing & Token Consumption (Per Model, Per Agent, Per Project/App)**
   - **Per Model**: Live input tokens, output tokens, total tokens, invocation counts, `% token share`, and token spend (`$`) across every active publisher model (`gemini-3.8-flash`, `gemini-2.5-flash`, `gemini-omni-flash-preview`, `gemini-3.1-flash-image`, `gemini-3-pro-image`, `gemini-3.1-pro-preview`, `gemini-3.5-flash`, `gemini-2.5-pro`, `gemini-3.7-flash`, etc.).
   - **Per Agent**: Attributes token consumption (input, output, total tokens) and spend across all **122+ registered Gemini Enterprise agents** based on each agent's configured model, architecture intensity, and session activity.
   - **Per Project & App**: Rolls up total project token consumption and breaks down token volume and spend across each Gemini Enterprise Engine/App.

3. **Natural Language Executive Summary (5 Key Insights On-Demand) & Environment Recommendations + TTS ("Read Me the Report")**
   - **On-Demand AI Report (`POST /api/narrative`)**: Uses live **Vertex AI Gemini 2.5 Flash** (`gemini-2.5-flash:generateContent`) grounded on real-time API & Cloud Monitoring telemetry to generate:
     - **a) Executive Summary**: Top 5 most important data-backed bullets for leadership.
     - **b) Recommendations for Your Environment**: Prioritized (`HIGH`, `MEDIUM`, `OPTIMIZATION`) technical and FinOps actions citing exact models, connectors, and agents.
   - **"🔊 Read Me the Report" Text-to-Speech Player (`POST /api/tts`)**: Synthesizes high-definition neural speech via the **Google Cloud Text-to-Speech API** (`texttospeech.googleapis.com/v1/text:synthesize`, with Web Speech API fallback), complete with play/pause/stop controls, voice selection, speed control, and real-time progress tracking.

4. **Full 122-Agent Interactive 4-Tier ReactFlow Lineage Graph**
   - Renders the complete, untruncated project topology across **1. Connected Data Stores & MCP (29)** &rarr; **2. Gemini Enterprise Apps (19)** &rarr; **3. Registered Agents (122)** &rarr; **4. Vertex AI Reasoning Engines (43)** with Multi-Column Matrix view, Paginated Stream view (`20 agents/page`), Agent Subtype filters, and live node search.

5. **Transparent Expense & Productivity Formula Engine (`ƒx Understand Expense`)**
   - Accessible from the left **Burger Menu (`☰`)** to customize token pricing, turn counts, connector costs, seat rates, and productivity ROI parameters.

---

## Quick Start (Local Development)

```bash
git clone https://github.com/AllInVaders/ge-smart-reports.git
cd ge-smart-reports

pip install -r requirements.txt

gcloud auth login
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
