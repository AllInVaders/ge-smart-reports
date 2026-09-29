# Gemini Enterprise Smart Reports (`ge-smart-reports`)

An open-source, lightweight **Cloud Run** observability and reporting dashboard for **Google Cloud Gemini Enterprise (Discovery Engine)**, **Vertex AI Reasoning Engines**, and **MCP Data Connectors**.

## Key Features

1. **100% Live GCP API Discovery (Zero Hardcoded Data)**
   - **Discovery Engine v1alpha / v1**: Dynamically discovers all Gemini Enterprise Apps (`engines`), paginates through all registered `agents` (`Low-Code`, `ADK / Vertex Reasoning Engine`, `Skill`, `Workflow`, `A2A`, and `Google-made`), inspects all `dataStores` and `collections/{id}/dataConnector` health states, and queries `userStores/default_user_store/userLicenses`.
   - **Vertex AI Reasoning Engines (`v1beta1`)**: Discovers all deployed Reasoning Engines and maps `adkAgentDefinition` lineage links.
   - **Cloud Run Services (`v2`) & Cloud Logging (`v2`)**: Discovers active Cloud Run MCP/API services and recent audit/runtime logs.

2. **Transparent Expense & Productivity Formula Engine (`ƒx Understand Expense`)**
   - Because Discovery Engine APIs return resource inventories and activity counts rather than billing invoices, all `$` spend and ROI figures are calculated via a transparent, user-configurable mathematical formula inside the left **Burger Menu (`☰`)**:
     - **Variable Session & Token Spend**:
       $$\text{Variable Spend} = \sum_{a \in \text{Agents}} \text{Sessions}_a \times \text{Turns} \times \left(\frac{\text{InTokens} \cdot P_{\text{in}} + \text{OutTokens} \cdot P_{\text{out}}}{10^6} + C_{\text{invocation}}\right) \times \text{ArchIntensity}_a$$
     - **Infrastructure & Seat Spend**:
       $$\text{Fixed Spend} = (N_{\text{active\_connectors}} \times C_{\text{connector\_mo}}) + (N_{\text{assigned\_licenses}} \times C_{\text{license\_mo}})$$
     - **Productivity Value Saved**:
       $$\text{Value Saved} = \left(\frac{\text{TotalSessions} \times \text{MinutesSavedPerSession}}{60}\right) \times \text{HourlyRate}$$

3. **Connected Data Stores & Registered Agents (100+) Inventory**
   - Replicates and enriches the Google Cloud Console **Connected data stores** and **Agents** tables with instant search, ownership tabs (`All | Google-made | Our agents`), state filters (`Enabled | Private | Disabled | Validation Errors`), and live API friction detection (`INITIALIZATION_FAILED` connectors, Low-Code `validationErrors`, and unlicensed login attempts).

4. **Interactive 4-Tier ReactFlow Lineage Graph**
   - Visualizes live topology across **1. Gemini Enterprise Apps** &rarr; **2. Connected Data Stores & MCP** &rarr; **3. Registered Agents** &rarr; **4. Vertex AI Reasoning Engines**.

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Google Cloud SDK (`gcloud`) authenticated with permissions to read Discovery Engine, Vertex AI, and Cloud Run (`roles/discoveryengine.viewer`, `roles/aiplatform.viewer`, `roles/run.viewer`).

```bash
git clone https://github.com/AllInVaders/ge-smart-reports.git
cd ge-smart-reports

pip install -r requirements.txt

# Authenticate with Application Default Credentials / gcloud
gcloud auth login
export GCP_PROJECT_ID="your-gcp-project-id"

# Start the server
PORT=8080 python3 main.py
```

Open `http://localhost:8080` in your browser.

---

## 1-Command Cloud Run Deployment

```bash
chmod +x deploy.sh
./deploy.sh your-gcp-project-id us-central1
```

Or deploy directly via `gcloud`:

```bash
gcloud run deploy ge-smart-reports \
  --source . \
  --project YOUR_GCP_PROJECT_ID \
  --region us-central1 \
  --allow-unauthenticated
```

Ensure the Cloud Run runtime service account has `roles/discoveryengine.viewer`, `roles/aiplatform.viewer`, `roles/run.viewer`, and `roles/logging.viewer` on the target project.
