#!/usr/bin/env bash
# Deploy Gemini Enterprise Observability & Smart Reports to Google Cloud Run.
# Usage: ./deploy.sh <GCP_PROJECT_ID> [REGION] [SERVICE_NAME]
set -euo pipefail

PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null || echo "")}"
REGION="${2:-us-central1}"
SERVICE_NAME="${3:-ge-smart-reports}"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Usage: ./deploy.sh <GCP_PROJECT_ID> [REGION] [SERVICE_NAME]"
  exit 1
fi

# Fallback to Application Default Credentials if standard gcloud user auth is not active
if ! gcloud auth print-access-token --quiet >/dev/null 2>&1; then
  if [[ -f "${HOME}/.config/gcloud/application_default_credentials.json" ]]; then
    export CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE="${HOME}/.config/gcloud/application_default_credentials.json"
  fi
fi

echo "==> Ensuring required Google Cloud APIs are enabled on project: ${PROJECT_ID}..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  discoveryengine.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com \
  aiplatform.googleapis.com \
  cloudbilling.googleapis.com \
  cloudresourcemanager.googleapis.com \
  serviceusage.googleapis.com \
  --project "${PROJECT_ID}" \
  --quiet || true

echo "==> Deploying ${SERVICE_NAME} to Cloud Run (project=${PROJECT_ID}, region=${REGION})..."
gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID},GCP_REGION=${REGION}" \
  --allow-unauthenticated \
  --quiet

SERVICE_URL="$(gcloud run services describe "${SERVICE_NAME}" --project "${PROJECT_ID}" --region "${REGION}" --format='value(status.url)' 2>/dev/null || echo "")"
if [[ -n "${SERVICE_URL}" ]]; then
  echo "==> Deployment complete! Live URL: ${SERVICE_URL}"
fi
