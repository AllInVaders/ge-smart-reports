# Gemini Enterprise Smart Reports

A lightweight **Google Cloud Run** dashboard that provides live usage analytics, token billing, AI-generated executive insights, audio briefings, and end-to-end lineage for **Google Cloud Gemini Enterprise** and **Vertex AI Agent Platform**.

---

## Features

- **Executive Summary & AI Recommendations (`gemini-3.8-flash`)**  
  Generates an on-demand 5-bullet Executive Summary and prioritized technical & FinOps recommendations tailored to your live GCP environment.

- **"Read Me the Report" Audio Briefing (`gemini-3.8-flash-tts`)**  
  Converts the executive report into natural, expressive speech with multiple voice personas (`Kore`, `Charon`, `Aoede`, `Puck`, `Fenrir`) and playback speed controls.

- **Workstreams & Deliverables Analytics**  
  Visualizes what teams use Gemini Enterprise for (Data Engineering, Procurement, Growth, Legal, Cloud Ops) and the deliverables produced across your agent portfolio.

- **Model Billing & Token Consumption**  
  Tracks 30-day input/output token volume, invocation counts, and estimated spend broken down **per model**, **per agent**, and **per Gemini Enterprise app**.

- **Interactive 4-Tier Lineage Graph**  
  Maps the complete topology connecting **Data Stores & MCP Connectors &rarr; Gemini Enterprise Apps &rarr; Registered Agents &rarr; Vertex AI Reasoning Engines**, with multi-column matrix view, subtype filters, search, and a node inspector.

- **Data Stores, Agents & License Governance**  
  Provides searchable live inventories of connected data stores, MCP servers, registered agents (`Low-Code`, `ADK`, `Skill`, `Workflow`, `A2A`), user seat assignments, and detected operational frictions.

- **Configurable Expense & ROI Formula (`ƒx Understand Expense`)**  
  Built-in configuration drawer (`☰`) to customize token pricing, connector costs, seat rates, and productivity savings assumptions in real time.

- **Admin Telemetry & Adoption Tab (`Telemetría y Adopción`)**  
  Answers the 6 core Admin adoption questions across any custom $X$-day window (`1d` to `365d`) with a one-click privacy toggle (masked vs. full Admin view): active users today and in $X$ days, top applications, top agents, dormant/reclaimable licenses, ecosystem capability usage (Gemini Code Assist, Google Antigravity / ADK, multimodal tools), and work vs. non-work prompt classification.

- **Conceptual Solution Architecture Tab**  
  End-to-end 5-layer conceptual architecture diagram illustrating how live telemetry, correlation, privacy governance, and generative AI synthesis work together.

---

## Quick Start

### 1. Run Locally

```bash
git clone https://github.com/AllInVaders/ge-smart-reports.git
cd ge-smart-reports

pip install -r requirements.txt

gcloud auth application-default login
export GCP_PROJECT_ID="your-gcp-project-id"

PORT=8080 python3 main.py
```

Open `http://localhost:8080` in your browser.

### 2. Deploy to Cloud Run

```bash
chmod +x deploy.sh
./deploy.sh your-gcp-project-id us-central1
```
