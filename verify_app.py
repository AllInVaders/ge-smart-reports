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
      rep["kpis"]["total_agents"] >= 100
  ), f"Expected >= 100 agents, got {rep['kpis']['total_agents']}"
  assert (
      rep["kpis"]["total_datastores"] >= 15
  ), f"Expected >= 15 data stores, got {rep['kpis']['total_datastores']}"
  assert "formula_breakdown" in rep

  lin = eng.get_lineage_graph(engine_filter="ALL")
  assert len(lin["nodes"]) > 0
  assert len(lin["edges"]) > 0

  print(
      f"VERIFIED OK: {rep['kpis']['total_engines']} engines, "
      f"{rep['kpis']['total_agents']} agents, "
      f"{rep['kpis']['total_datastores']} data stores, "
      f"${rep['kpis']['total_spend_usd']} formula spend."
  )


if __name__ == "__main__":
  root = os.path.dirname(os.path.abspath(__file__))
  verify_zero_forbidden_references_or_secrets(root)
  verify_live_engine()
