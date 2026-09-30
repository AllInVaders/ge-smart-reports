"""Gemini Enterprise Smart Reports — FastAPI & Stdlib HTTP Backend Server."""

from __future__ import annotations

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
from typing import Any
import urllib.parse

from smart_report_engine import SmartReportEngine

engine = SmartReportEngine()
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

try:
  from fastapi import FastAPI, Query, Request
  from fastapi.responses import FileResponse, JSONResponse
  from fastapi.staticfiles import StaticFiles

  HAS_FASTAPI = True
except ImportError:
  HAS_FASTAPI = False

if HAS_FASTAPI:
  app = FastAPI(
      title="Gemini Enterprise Smart Reports",
      description=(
          "Open-source, 100% live Discovery Engine API, Cloud Monitoring Token Billing,"
          " Natural Language Executive Summary (gemini-3.8-flash), TTS (gemini-3.8-flash-tts) & Lineage Reporting Dashboard."
      ),
      version="3.4.0",
  )
  app.mount("/static", StaticFiles(directory=static_dir), name="static")

  @app.get("/")
  async def index() -> FileResponse:
    return FileResponse(os.path.join(static_dir, "index.html"))

  @app.get("/api/health")
  async def api_health() -> JSONResponse:
    return JSONResponse({
        "status": "ok",
        "project_id": engine.project_id,
        "version": "3.4.0",
    })

  @app.get("/api/projects")
  async def api_projects() -> JSONResponse:
    return JSONResponse(engine.list_selectable_projects())

  @app.get("/api/report")
  async def api_report(
      engine_id: str = Query(default="ALL"),
      refresh: bool = Query(default=False),
  ) -> JSONResponse:
    data = engine.compute_expense_and_telemetry(
        engine_filter=engine_id, force_refresh=refresh
    )
    return JSONResponse(data)

  @app.get("/api/adoption")
  async def api_adoption(
      engine_id: str = Query(default="ALL"),
      days: int = Query(default=30),
      unmasked: bool = Query(default=False),
      refresh: bool = Query(default=False),
  ) -> JSONResponse:
    data = engine.compute_admin_adoption_telemetry(
        engine_filter=engine_id,
        days_window=days,
        include_unmasked=unmasked,
        force_refresh=refresh,
    )
    return JSONResponse(data)

  @app.get("/api/lineage")
  async def api_lineage(
      engine_id: str = Query(default="ALL"),
  ) -> JSONResponse:
    data = engine.get_lineage_graph(engine_filter=engine_id)
    return JSONResponse(data)

  @app.get("/api/narrative")
  async def api_narrative_get(
      engine_id: str = Query(default="ALL"),
      use_llm: bool = Query(default=True),
      lang: str = Query(default="en"),
  ) -> JSONResponse:
    data = engine.generate_natural_language_report(
        engine_filter=engine_id, use_llm=use_llm, lang=lang
    )
    return JSONResponse(data)

  @app.post("/api/narrative")
  async def api_narrative_post(req: Request) -> JSONResponse:
    payload: dict[str, Any] = await req.json()
    eid = str(payload.get("engine_id") or "ALL")
    use_llm = bool(payload.get("use_llm", True))
    lang = str(payload.get("lang") or "en")
    data = engine.generate_natural_language_report(
        engine_filter=eid, use_llm=use_llm, lang=lang
    )
    return JSONResponse(data)

  @app.post("/api/tts")
  async def api_tts(req: Request) -> JSONResponse:
    payload: dict[str, Any] = await req.json()
    text = str(payload.get("text") or "")
    voice = str(payload.get("voice_name") or "Kore")
    rate = float(payload.get("speaking_rate") or 1.0)
    data = engine.synthesize_report_speech(
        text=text, voice_name=voice, speaking_rate=rate
    )
    return JSONResponse(data)

  @app.get("/api/config")
  async def api_get_config() -> JSONResponse:
    return JSONResponse(engine.get_config())

  @app.post("/api/config")
  async def api_update_config(req: Request) -> JSONResponse:
    payload: dict[str, Any] = await req.json()
    updated = engine.update_config(payload)
    return JSONResponse({"status": "UPDATED", "config": updated})


class _StdlibHandler(SimpleHTTPRequestHandler):
  """Zero-dependency HTTP handler fallback for local execution without FastAPI."""

  def _send_json(self, obj: Any, status: int = 200) -> None:
    body = json.dumps(obj).encode("utf-8")
    self.send_response(status)
    self.send_header("Content-Type", "application/json; charset=utf-8")
    self.send_header("Content-Length", str(len(body)))
    self.end_headers()
    self.wfile.write(body)

  def do_GET(self) -> None:
    parsed = urllib.parse.urlparse(self.path)
    qs = urllib.parse.parse_qs(parsed.query)
    path = parsed.path

    if path == "/api/health":
      self._send_json(
          {"status": "ok", "project_id": engine.project_id, "version": "3.4.0"}
      )
      return
    if path == "/api/projects":
      self._send_json(engine.list_selectable_projects())
      return
    if path == "/api/report":
      eid = (qs.get("engine_id") or ["ALL"])[0]
      ref = (qs.get("refresh") or ["false"])[0].lower() == "true"
      self._send_json(
          engine.compute_expense_and_telemetry(
              engine_filter=eid, force_refresh=ref
          )
      )
      return
    if path == "/api/adoption":
      eid = (qs.get("engine_id") or ["ALL"])[0]
      try:
        days = int((qs.get("days") or ["30"])[0])
      except ValueError:
        days = 30
      unmasked = (qs.get("unmasked") or ["false"])[0].lower() == "true"
      ref = (qs.get("refresh") or ["false"])[0].lower() == "true"
      self._send_json(
          engine.compute_admin_adoption_telemetry(
              engine_filter=eid,
              days_window=days,
              include_unmasked=unmasked,
              force_refresh=ref,
          )
      )
      return
    if path == "/api/lineage":
      eid = (qs.get("engine_id") or ["ALL"])[0]
      self._send_json(engine.get_lineage_graph(engine_filter=eid))
      return
    if path == "/api/narrative":
      eid = (qs.get("engine_id") or ["ALL"])[0]
      use_llm = (qs.get("use_llm") or ["true"])[0].lower() == "true"
      lang = (qs.get("lang") or ["en"])[0]
      self._send_json(
          engine.generate_natural_language_report(
              engine_filter=eid, use_llm=use_llm, lang=lang
          )
      )
      return
    if path == "/api/config":
      self._send_json(engine.get_config())
      return

    if path in ("/", "/index.html"):
      fpath = os.path.join(static_dir, "index.html")
    elif path.startswith("/static/"):
      rel = path[len("/static/") :]
      fpath = os.path.join(static_dir, rel)
    else:
      self.send_error(404, "Not Found")
      return

    if not os.path.isfile(fpath):
      self.send_error(404, "File Not Found")
      return
    ctype, _ = mimetypes.guess_type(fpath)
    with open(fpath, "rb") as f:
      data = f.read()
    self.send_response(200)
    self.send_header("Content-Type", ctype or "application/octet-stream")
    self.send_header("Content-Length", str(len(data)))
    self.end_headers()
    self.wfile.write(data)

  def do_POST(self) -> None:
    parsed = urllib.parse.urlparse(self.path)
    length = int(self.headers.get("Content-Length", "0"))
    raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
    payload = json.loads(raw) if raw else {}

    if parsed.path == "/api/config":
      updated = engine.update_config(payload)
      self._send_json({"status": "UPDATED", "config": updated})
      return
    if parsed.path == "/api/narrative":
      eid = str(payload.get("engine_id") or "ALL")
      use_llm = bool(payload.get("use_llm", True))
      lang = str(payload.get("lang") or "en")
      self._send_json(
          engine.generate_natural_language_report(
              engine_filter=eid, use_llm=use_llm, lang=lang
          )
      )
      return
    if parsed.path == "/api/tts":
      text = str(payload.get("text") or "")
      voice = str(payload.get("voice_name") or "Kore")
      rate = float(payload.get("speaking_rate") or 1.0)
      self._send_json(
          engine.synthesize_report_speech(
              text=text, voice_name=voice, speaking_rate=rate
          )
      )
      return
    self.send_error(404, "Not Found")


if __name__ == "__main__":
  port = int(os.environ.get("PORT", "8080"))
  if HAS_FASTAPI:
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=port)
  else:
    print(f"Starting stdlib HTTP server on http://0.0.0.0:{port}")
    server = ThreadingHTTPServer(("0.0.0.0", port), _StdlibHandler)
    server.serve_forever()
