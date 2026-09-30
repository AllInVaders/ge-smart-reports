# Gemini Enterprise Observability & Smart Reports

A lightweight **Google Cloud Run** observability and executive reporting application for **Google Cloud Gemini Enterprise** and **Vertex AI Agent Platform** — delivering live usage telemetry, token billing, 6-dimension adoption intelligence, interactive 4-tier lineage, AI-generated executive insights, and expressive audio briefings.

---

## Features

- **Executive Summary & AI Recommendations (`gemini-3.8-flash`)**  
  Generates an on-demand 5-bullet Executive Summary and prioritized technical & FinOps recommendations tailored to your live GCP environment (in English or Spanish).

- **"Read Me the Report" Audio Briefing (`gemini-3.8-flash-tts`)**  
  Synthesizes the executive report into natural, expressive speech with multiple voice personas (`Kore`, `Charon`, `Aoede`, `Puck`, `Fenrir`) and playback speed controls.

- **Workstreams & Deliverables Analytics**  
  Visualizes what teams use Gemini Enterprise for (Data Engineering, Procurement, Growth, Legal, Cloud Ops) and the deliverables produced across your agent portfolio.

- **Model Billing & Token Consumption**  
  Tracks 30-day input/output token volume, invocation counts, and estimated spend broken down **per model**, **per agent**, and **per Gemini Enterprise app**.

- **Interactive 4-Tier Lineage Graph**  
  Maps the end-to-end topology connecting **Data Stores & MCP Connectors &rarr; Gemini Enterprise Apps &rarr; Registered Agents &rarr; Vertex AI Reasoning Engines**, with multi-column matrix layout, subtype filters, search, and a node inspector.

- **Data Stores, Agents & License Governance**  
  Provides searchable live inventories of connected data stores, MCP servers, registered agents (`Low-Code`, `ADK`, `Skill`, `Workflow`, `A2A`), user seat assignments, and detected operational frictions.

- **Telemetry & Adoption Tab (`6 Dimensions`)**  
  Answers the 6 core Admin adoption dimensions (`Dimension 1`–`Dimension 6`) across any custom $X$-day window (`1d` to `365d`) with a one-click privacy toggle (masked vs. full Admin view):
  1. **Dimension 1**: Active users today (`24h`) and across the last $X$ days
  2. **Dimension 2**: Most used Gemini Enterprise applications and their top users
  3. **Dimension 3**: Most used agents (`Core Assistant`, `Workflow`, `Low-Code`, `ADK`, `A2A`) and their users
  4. **Dimension 4**: Licensed non-users, dormant seats, and reclaimable monthly spend
  5. **Dimension 5**: Ecosystem capability usage (Gemini Code Assist, Google Antigravity / ADK, multimodal tools)
  6. **Dimension 6**: Prompt intent classification (Work vs. Non-Work purposes and functional categories)

- **Burger Menu Configuration (`☰`)**  
  - **Multi-Project Dropdown**: Select any active GCP project to automatically regenerate the live report, lineage graph, and adoption telemetry.
  - **Internationalization (`i18n`)**: Instant toggle between **English (`EN`)** and **Español (`ES`)**.
  - **Appearance**: Instant toggle between **Light (`☀️`)** and **Dark (`🌙`)** themes using the canonical 4-color Google Brand palette.
  - **Solution Architecture (Conceptual)**: Built-in 5-layer conceptual architecture view.
  - **Live Expense Formula (`ƒx Understand Expense`)**: Transparent, customizable token, connector, license, and ROI parameters.

---

## Quick Start

### 1. Run Locally

```bash
git clone https://github.com/cloud-ai-fde/ge-observability.git
cd ge-observability

pip install -r requirements.txt

gcloud auth application-default login
export GCP_PROJECT_ID="your-gcp-project-id"

PORT=8080 python3 main.py
```

Open `http://localhost:8080` in your browser.

### 2. Deploy to Google Cloud Run

```bash
chmod +x deploy.sh
./deploy.sh your-gcp-project-id us-central1
```
