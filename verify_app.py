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


def verify_live_engine() -> None:
  eng = SmartReportEngine()
  cfg = eng.get_config()
  assert "input_price_per_1m_usd" in cfg
  assert "hourly_rate_usd" in cfg

  rep = eng.compute_expense_and_telemetry(engine_filter="ALL")
  assert (
      rep["kpis"]["total_agents"] >= 110
  ), f"Expected >= 110 agents, got {rep['kpis']['total_agents']}"
  assert (
      rep["kpis"]["total_datastores"] >= 20
  ), f"Expected >= 20 data stores, got {rep['kpis']['total_datastores']}"
  assert "formula_breakdown" in rep

  # Verify Item 4: Agent Platform Model Billing & Token Consumption (per model, per agent, per project/engine)
  mb = rep.get("model_billing") or {}
  assert "billing_info" in mb
  assert mb["billing_info"]["total_live_tokens"] >= 15_000_000, (
      f"Expected >= 15M live tokens from Cloud Monitoring, got {mb['billing_info']['total_live_tokens']}"
  )
  assert len(mb.get("by_model", [])) >= 10
  assert len(mb.get("by_agent", [])) >= 110
  assert len(mb.get("by_project_and_engine", [])) >= 15

  # Verify Item 1: Full Lineage Graph with all live agents (no [:6] truncation)
  lin = eng.get_lineage_graph(engine_filter="ALL")
  assert lin["counts"]["agents"] == rep["kpis"]["total_agents"], (
      f"Expected lineage agents ({lin['counts']['agents']}) == total_agents ({rep['kpis']['total_agents']})"
  )
  assert len(lin["nodes"]) >= 180
  assert len(lin["edges"]) >= 110

  # Verify Item 2: Natural Language Executive Summary (5 bullets) & Environment Recommendations via gemini-3.8-flash
  nav_llm = eng.generate_natural_language_report(engine_filter="ALL", use_llm=True)
  assert len(nav_llm.get("executive_summary_bullets", [])) == 5
  assert len(nav_llm.get("environment_recommendations", [])) >= 3
  assert "gemini-3.8-flash" in nav_llm.get("generated_by", "")
  assert len(nav_llm.get("tts_script", "")) > 100

  # Verify Item 3: TTS "Read Me the Report" synthesis via gemini-3.8-flash-tts
  tts_res = eng.synthesize_report_speech(
      text="Executive summary test for Gemini Enterprise Smart Reports.",
      voice_name="Kore",
  )
  assert tts_res.get("status") == "OK" and len(tts_res.get("audio_base64", "")) > 1000
  assert "gemini-3.8-flash-tts" in tts_res.get("voice_name", "")

  print(
      f"VERIFIED OK: {rep['kpis']['total_engines']} engines, "
      f"{rep['kpis']['total_agents']} agents (Lineage: {lin['counts']['agents']} agents / {len(lin['nodes'])} total nodes), "
      f"{rep['kpis']['total_datastores']} data stores, "
      f"{mb['billing_info']['total_live_tokens']:,} live Cloud Monitoring tokens across {len(mb['by_model'])} models, "
      f"5 Executive Summary bullets ({nav_llm['generated_by']}), "
      f"Gemini Flash TTS audio ({tts_res['voice_name']}, {len(tts_res['audio_base64'])} bytes), "
      f"${rep['kpis']['total_spend_usd']} total spend."
  )


if __name__ == "__main__":
  root = os.path.dirname(os.path.abspath(__file__))
  verify_zero_forbidden_references_or_secrets(root)
  verify_live_engine()
