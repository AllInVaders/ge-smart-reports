"""Verification suite for Gemini Enterprise Smart Reports (`ge-smart-reports`)."""

from __future__ import annotations

import os
import re
from smart_report_engine import SmartReportEngine


def verify_zero_forbidden_references_or_secrets(root_dir: str) -> None:
  forbidden_words = re.compile(
      r"\b(anthropic|claude|falabella)\b", re.IGNORECASE
  )
  secret_patterns = re.compile(
      r"(AIza[0-9A-Za-z_-]{35}|ya29\.[0-9A-Za-z_-]+|ghp_[0-9A-Za-z]{30,})"
  )

  for dirpath, dirnames, filenames in os.walk(root_dir):
    dirnames[:] = [
        d for d in dirnames if d not in (".git", "__pycache__", ".venv")
    ]
    for fname in filenames:
      if fname == "verify_app.py" or fname.endswith((".pyc", ".png", ".jpg")):
        continue
      fpath = os.path.join(dirpath, fname)
      with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
      m_word = forbidden_words.search(content)
      assert (
          not m_word
      ), f"Forbidden reference '{m_word.group(0)}' found in {fpath}"
      m_sec = secret_patterns.search(content)
      assert not m_sec, f"Potential secret token found in {fpath}"


def verify_frontend_v34_requirements(root_dir: str) -> None:
  with open(os.path.join(root_dir, "static", "index.html"), "r", encoding="utf-8") as f:
    html = f.read()
  with open(os.path.join(root_dir, "static", "styles.css"), "r", encoding="utf-8") as f:
    css = f.read()
  with open(os.path.join(root_dir, "static", "app.js"), "r", encoding="utf-8") as f:
    js = f.read()

  # 1. Solution Architecture moved out of #primaryViewTabs into Burger Menu config
  assert "id=\"tabBtnArchitecture\"" not in html, "Solution Architecture tab button must be removed from top tab bar"
  assert "id=\"openArchitectureFromDrawerBtn\"" in html, "Solution Architecture launcher must be inside Burger Menu drawer"
  assert "id=\"backToDashboardFromArchBtn\"" in html, "Back to Dashboard button must be inside Architecture view"

  # 2. "Dimension 1..6" instead of "Pregunta 1..6"
  assert "Pregunta 1" not in html and "Pregunta 1" not in js, "Pregunta 1..6 must be replaced with Dimension 1..6"
  for idx in range(1, 7):
    assert f"Dimension {idx}" in html
    assert f"Dimensión {idx}" in js

  # 3. Internationalization (EN / ES) in Burger Menu config
  assert "id=\"langSegmentedControl\"" in html
  assert "data-lang=\"en\"" in html and "data-lang=\"es\"" in html
  assert "I18N_CATALOG" in js and "applyTranslations" in js

  # 4. Light / Dark Mode in Burger Menu config
  assert "id=\"themeSegmentedControl\"" in html
  assert "data-theme-mode=\"light\"" in html and "data-theme-mode=\"dark\"" in html
  assert "[data-theme=\"dark\"]" in css and "applyTheme" in js

  # 5. Canonical 4-Color Google Brand Palette (#4285F4, #EA4335, #FBBC04, #34A853)
  for google_hex in ("#4285F4", "#EA4335", "#FBBC04", "#34A853"):
    assert google_hex.lower() in css.lower(), f"Missing canonical Google color {google_hex} in styles.css"
    assert google_hex.lower() in js.lower(), f"Missing canonical Google color {google_hex} in app.js"

  # 6. GCP Project ID dropdown (<select id="cfgProjectId">) in Burger Menu with auto-regeneration on change
  assert "<select id=\"cfgProjectId\"" in html, "cfgProjectId must be a <select> dropdown"
  assert "onProjectDropdownChange" in js


def verify_live_engine() -> None:
  eng = SmartReportEngine()
  cfg = eng.get_config()
  assert "input_price_per_1m_usd" in cfg
  assert "hourly_rate_usd" in cfg

  # Verify Selectable GCP Projects list (Item 6)
  projs = eng.list_selectable_projects()
  proj_ids = [p["project_id"] for p in projs.get("projects", [])]
  assert "genai-demos-avr-2024" in proj_ids, f"Expected genai-demos-avr-2024 in projects: {proj_ids}"
  assert len(proj_ids) >= 2

  rep = eng.compute_expense_and_telemetry(engine_filter="ALL")
  assert (
      rep["kpis"]["total_agents"] >= 110
  ), f"Expected >= 110 agents, got {rep['kpis']['total_agents']}"
  assert (
      rep["kpis"]["total_datastores"] >= 20
  ), f"Expected >= 20 data stores, got {rep['kpis']['total_datastores']}"
  assert "formula_breakdown" in rep

  # Verify Agent Platform Model Billing & Token Consumption
  mb = rep.get("model_billing") or {}
  assert "billing_info" in mb
  assert mb["billing_info"]["total_live_tokens"] >= 15_000_000, (
      f"Expected >= 15M live tokens from Cloud Monitoring, got {mb['billing_info']['total_live_tokens']}"
  )
  assert len(mb.get("by_model", [])) >= 10
  assert len(mb.get("by_agent", [])) >= 110
  assert len(mb.get("by_project_and_engine", [])) >= 15

  # Verify Full Lineage Graph with all live agents
  lin = eng.get_lineage_graph(engine_filter="ALL")
  assert lin["counts"]["agents"] == rep["kpis"]["total_agents"], (
      f"Expected lineage agents ({lin['counts']['agents']}) == total_agents ({rep['kpis']['total_agents']})"
  )
  assert len(lin["nodes"]) >= 180
  assert len(lin["edges"]) >= 110

  # Verify Natural Language Executive Summary (5 bullets) & Environment Recommendations in EN & ES
  nav_en = eng.generate_natural_language_report(engine_filter="ALL", use_llm=True, lang="en")
  assert len(nav_en.get("executive_summary_bullets", [])) == 5
  assert len(nav_en.get("environment_recommendations", [])) >= 3
  assert "gemini-3.8-flash" in nav_en.get("generated_by", "")

  nav_es = eng.generate_natural_language_report(engine_filter="ALL", use_llm=False, lang="es")
  assert len(nav_es.get("executive_summary_bullets", [])) == 5
  assert nav_es.get("lang") == "es"

  # Verify TTS "Read Me the Report" synthesis via gemini-3.8-flash-tts
  tts_res = eng.synthesize_report_speech(
      text="Executive summary test for Gemini Enterprise Smart Reports.",
      voice_name="Kore",
  )
  assert tts_res.get("status") == "OK" and len(tts_res.get("audio_base64", "")) > 1000
  assert "gemini-3.8-flash-tts" in tts_res.get("voice_name", "")

  # Verify Admin Telemetry & Adoption (6 Dimensions + Privacy Toggle + X-Days Window)
  ad_masked = rep.get("adoption_telemetry") or {}
  assert ad_masked.get("days_window") == 30
  assert ad_masked.get("include_unmasked") is False
  sk = ad_masked.get("summary_kpis") or {}
  assert sk.get("users_active_today", 0) >= 1
  assert sk.get("users_active_window", 0) >= 3
  assert sk.get("sessions_window", 0) >= 100
  assert len(ad_masked["q1_active_users"]["active_users"]) >= 3
  assert "***" in ad_masked["q1_active_users"]["active_users"][0]["display_principal"]
  assert len(ad_masked["q2_top_apps"]["apps"]) >= 5
  assert len(ad_masked["q3_top_agents"]["agents"]) >= 8
  assert ad_masked["q4_non_users"]["total_non_users"] >= 15
  assert ad_masked["q4_non_users"]["reclaimable_monthly_usd"] > 0
  assert len(ad_masked["q5_license_capabilities"]["ecosystem_capabilities"]) >= 5
  assert len(ad_masked["q5_license_capabilities"]["multimodal_tools_usage"]) >= 5
  assert ad_masked["q6_prompt_intelligence"]["work_pct"] > 50.0
  assert len(ad_masked["q6_prompt_intelligence"]["categories"]) >= 4

  # Verify Unmasked Admin View & Custom 7-day Window
  ad_unmasked = eng.compute_admin_adoption_telemetry(
      engine_filter="ALL", days_window=7, include_unmasked=True
  )
  assert ad_unmasked["days_window"] == 7
  assert ad_unmasked["include_unmasked"] is True
  assert "***" not in ad_unmasked["q1_active_users"]["active_users"][0]["display_principal"]

  print(
      f"VERIFIED OK (v3.4.0): {len(proj_ids)} selectable GCP projects ({', '.join(proj_ids[:3])}), "
      f"{rep['kpis']['total_engines']} engines, "
      f"{rep['kpis']['total_agents']} agents (Lineage: {lin['counts']['agents']} agents / {len(lin['nodes'])} total nodes), "
      f"{rep['kpis']['total_datastores']} data stores, "
      f"{mb['billing_info']['total_live_tokens']:,} live Cloud Monitoring tokens across {len(mb['by_model'])} models, "
      f"EN+ES i18n, Light/Dark Mode, 4-Color Google Palette, Dimension 1..6, "
      f"${rep['kpis']['total_spend_usd']} total spend."
  )


if __name__ == "__main__":
  root = os.path.dirname(os.path.abspath(__file__))
  verify_zero_forbidden_references_or_secrets(root)
  verify_frontend_v34_requirements(root)
  verify_live_engine()
