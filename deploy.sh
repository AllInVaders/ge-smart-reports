#!/usr/bin/env bash
# Deploy Gemini Enterprise Smart Reports to Google Cloud Run.
set -euo pipefail

PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null || echo "")}"
REGION="${2:-us-central1}"
SERVICE_NAME="${3:-ge-smart-reports}"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Usage: ./deploy.sh <GCP_PROJECT_ID> [REGION] [SERVICE_NAME]"
  exit 1
fi

if ! gcloud auth print-access-token --quiet >/dev/null 2>&1; then
  if [[ -f "${HOME}/.config/gcloud/application_default_credentials.json" ]]; then
    export CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE="${HOME}/.config/gcloud/application_default_credentials.json"
  fi
fi

echo "Deploying ${SERVICE_NAME} to project=${PROJECT_ID} region=${REGION}..."
gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID},GCP_REGION=${REGION}" \
  --allow-unauthenticated \
  --quiet
