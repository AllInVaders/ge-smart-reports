"""CLI Utility to export a live Gemini Enterprise Smart Reports snapshot to JSON."""

from __future__ import annotations

import argparse
import json
from smart_report_engine import SmartReportEngine


def main() -> None:
  parser = argparse.ArgumentParser(
      description="Export live Gemini Enterprise Smart Reports snapshot."
  )
  parser.add_argument(
      "--project",
      default=None,
      help="Target GCP Project ID (auto-detected if omitted)",
  )
  parser.add_argument(
      "--engine",
      default="ALL",
      help="Filter by Discovery Engine ID (default: ALL)",
  )
  parser.add_argument(
      "--output",
      default="",
      help="Optional path to write JSON report output",
  )
  args = parser.parse_args()

  engine = SmartReportEngine(project_id=args.project)
  report = engine.compute_expense_and_telemetry(
      engine_filter=args.engine, force_refresh=True
  )

  if args.output:
    with open(args.output, "w", encoding="utf-8") as f:
      json.dump(report, f, indent=2)
    print(f"Saved live snapshot to {args.output}")
  else:
    print(json.dumps(report["kpis"], indent=2))
    print(report["formula_breakdown"]["equation_text"])


if __name__ == "__main__":
  main()
