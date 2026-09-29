-- Gemini Enterprise Smart Reports — Optional BigQuery Star-Schema Views
-- Replace ${PROJECT_ID} and ${DATASET_ID} with your target GCP Project and BigQuery Dataset.

CREATE SCHEMA IF NOT EXISTS `${PROJECT_ID}.${DATASET_ID}`
OPTIONS (
  description = 'Gemini Enterprise Smart Reports telemetry warehouse',
  location = 'US'
);

CREATE TABLE IF NOT EXISTS `${PROJECT_ID}.${DATASET_ID}.ge_agent_telemetry` (
  snapshot_timestamp TIMESTAMP NOT NULL,
  project_id STRING NOT NULL,
  engine_id STRING NOT NULL,
  engine_name STRING,
  agent_id STRING NOT NULL,
  display_name STRING,
  agent_type STRING,
  ownership STRING,
  state STRING,
  reasoning_engine_id STRING,
  create_time TIMESTAMP,
  update_time TIMESTAMP,
  inferred_sessions INT64,
  inferred_spend_usd FLOAT64
);

CREATE TABLE IF NOT EXISTS `${PROJECT_ID}.${DATASET_ID}.ge_connected_datastores` (
  snapshot_timestamp TIMESTAMP NOT NULL,
  project_id STRING NOT NULL,
  datastore_id STRING NOT NULL,
  collection_id STRING,
  display_name STRING,
  datastore_type STRING,
  status STRING,
  last_sync_time TIMESTAMP,
  update_time TIMESTAMP,
  create_time TIMESTAMP,
  connected_engines STRING
);

CREATE TABLE IF NOT EXISTS `${PROJECT_ID}.${DATASET_ID}.ge_user_licenses` (
  snapshot_timestamp TIMESTAMP NOT NULL,
  project_id STRING NOT NULL,
  user_pseudo_id STRING NOT NULL,
  assignment_state STRING,
  license_tier STRING,
  create_time TIMESTAMP,
  last_login_time TIMESTAMP
);
