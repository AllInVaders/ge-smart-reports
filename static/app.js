const state = {
  engineId: 'ALL',
  workstreamsSort: 'spend',
  deliverablesSort: 'spend',
  dsFilter: 'ALL',
  dsSearch: '',
  agentOwnerFilter: 'ALL',
  agentStateFilter: 'ALL',
  agentSearch: '',
  billingTab: 'MODEL',
  billingSearch: '',
  revealPii: false,
  reportData: null,
  narrativeData: null,
  lineageData: null,
  lineageLayoutMode: 'MATRIX',
  lineageSubtypeFilter: 'ALL',
  lineageSearch: '',
  lineagePage: 1,
  lineagePageSize: 20,
  lineageSelectedNodeId: null,
  lineageAnimated: true,
  lineageZoom: 0.56,
  lineagePanX: 10,
  lineagePanY: 10,
  ttsPlaying: false,
  ttsPaused: false,
  ttsMode: null,
  ttsAudioCache: {},
  ttsSessionId: 0,
  audioUnlocked: false,
};

function fmtNum(n) {
  return Number(n || 0).toLocaleString('en-US');
}

function fmtUsd(n) {
  return Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtCompactTokens(n) {
  const v = Number(n || 0);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

function showToast(msg) {
  const el = document.getElementById('toastBanner');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.classList.add('hidden');
  }, 3400);
}

function iconForDatastore(cat) {
  const map = {
    notebook: '📓',
    mcp: '🔌',
    calendar: '📅',
    drive: '🗂️',
    chat: '💬',
    mail: '✉️',
    people: '👤',
    groups: '👥',
    web: '🌐',
    unstructured: '📄',
    federated: '🔗',
  };
  return map[cat] || '🗄️';
}

/* ==========================================================================
   1. FETCH LIVE REPORT, TOKEN BILLING & FORMULA TELEMETRY
   ========================================================================== */
async function loadReport(forceRefresh = false) {
  const btn = document.getElementById('refreshLiveBtn');
  if (btn) btn.textContent = '↻ Loading Live API...';

  try {
    const url = `/api/report?engine_id=${encodeURIComponent(
        state.engineId)}&refresh=${forceRefresh ? 'true' : 'false'}`;
    const res = await fetch(url);
    const data = await res.json();
    state.reportData = data;
    if (!state.narrativeData || forceRefresh) {
      state.narrativeData = data.narrative_report || null;
    }

    populateEngineSelector(data.engines || [], data.selected_engine_id);
    renderKpisAndFormulaBanner(data);
    renderNarrativeSection();
    renderModelBillingSection();
    renderWorkstreamsChart();
    renderDeliverablesChart();
    renderDatastoresTable();
    renderAgentsTable();
    renderFrictionsAndUsers();
    prefetchDefaultTtsAudio();
  } finally {
    if (btn) btn.textContent = '↻ Refresh Live API';
  }
}

function populateEngineSelector(engines, selectedId) {
  const sel = document.getElementById('engineSelect');
  if (!sel) return;
  const totalAgents = engines.reduce((s, e) => s + (e.agents_count || 0), 0);
  const optionsHtml = [
    `<option value="ALL" ${
        selectedId === 'ALL' ? 'selected' : ''}>All Engines (${
        engines.length} Apps • ${totalAgents} Agents)</option>`,
    ...engines.map(
        (e) => `<option value="${e.engine_id}" ${
            selectedId === e.engine_id ? 'selected' : ''}>${
            e.display_name} (${e.agents_count} Agents • ${
            e.data_stores_count} Data Stores)</option>`),
  ];
  sel.innerHTML = optionsHtml.join('');
}

function renderKpisAndFormulaBanner(data) {
  const k = data.kpis || {};
  const fb = data.formula_breakdown || {};
  const mb = (data.model_billing || {}).billing_info || {};

  document.getElementById('projectBadge').textContent =
      `Project: ${data.project_id}`;
  document.getElementById('headerMetaSub').textContent =
      `Live Discovery Engine & Cloud Monitoring (${data.fetch_latency_ms} ms) • ${
          k.total_engines} Apps • ${k.total_agents} Agents • ${
          fmtCompactTokens(k.live_tokens_30d)} Live Tokens`;

  document.getElementById('kpiTotalAgents').textContent =
      `${fmtNum(k.total_agents)} Agents`;
  document.getElementById('kpiAgentsBreakdown').textContent =
      `${k.enabled_agents} Enabled • ${k.private_agents} Private • ${
          k.disabled_agents} Disabled`;

  document.getElementById('kpiTotalDatastores').textContent =
      `${fmtNum(k.total_datastores)} Stores`;
  document.getElementById('kpiDatastoresBreakdown').textContent =
      `${k.active_connectors} Active Connectors • ${
          k.failed_connectors} Init Error`;

  document.getElementById('kpiLiveTokens').textContent =
      `${fmtCompactTokens(k.live_tokens_30d)} Tokens`;
  document.getElementById('kpiLiveTokensMeta').textContent =
      `${fmtCompactTokens(k.live_input_tokens_30d)} In • ${
          fmtCompactTokens(k.live_output_tokens_30d)} Out • ${
          mb.active_models_count || 14} Models`;

  document.getElementById('kpiRuntimeCount').textContent =
      `${k.vertex_reasoning_engines} RE / ${k.cloud_run_services} Run`;
  document.getElementById('kpiRuntimeMeta').textContent =
      `${k.vertex_reasoning_engines} Vertex Reasoning Engines • ${
          k.cloud_run_services} Cloud Run Services`;

  document.getElementById('kpiTotalSpend').textContent =
      `$${fmtUsd(k.total_spend_usd)}`;
  document.getElementById('kpiRoiMeta').textContent =
      `${fmtNum(k.inferred_sessions_30d)} Sessions • $${
          fmtNum(k.value_saved_usd)} Value (${k.roi_multiple}x ROI)`;

  const eqText = fb.equation_text || '';
  const bannerEl = document.getElementById('liveEquationBannerText');
  if (bannerEl) bannerEl.textContent = eqText;
  const drawerEq = document.getElementById('drawerLiveEquation');
  if (drawerEq) drawerEq.textContent = eqText;
}

/* ==========================================================================
   2. NATURAL LANGUAGE EXECUTIVE SUMMARY (5 BULLETS) & RECOMMENDATIONS + TTS
   ========================================================================== */
function renderNarrativeSection() {
  const nav = state.narrativeData ||
      (state.reportData && state.reportData.narrative_report);
  if (!nav) return;

  const badge = document.getElementById('narrativeSourceBadge');
  if (badge) {
    badge.textContent = nav.generated_by || 'Vertex AI gemini-3.8-flash';
  }
  const recProj = document.getElementById('recProjectCode');
  if (recProj && state.reportData) {
    recProj.textContent = state.reportData.project_id;
  }

  const bulletsBox = document.getElementById('executiveBulletsList');
  if (bulletsBox) {
    const bullets = nav.executive_summary_bullets || [];
    bulletsBox.innerHTML = bullets
        .map(
            (b) => `
      <div class="exec-bullet-item">
        <div class="exec-bullet-top">
          <span class="exec-rank-badge">#${b.rank} • ${
                b.category || 'Executive Insight'}</span>
          <span class="exec-metric-pill">${b.metric_highlight || ''}</span>
        </div>
        <div class="exec-bullet-headline">${b.headline}</div>
        <div class="exec-bullet-text">${b.narrative}</div>
      </div>
    `)
        .join('');
  }

  const recsBox = document.getElementById('environmentRecsList');
  if (recsBox) {
    const recs = nav.environment_recommendations || [];
    recsBox.innerHTML = recs
        .map((r) => {
          const prio = (r.priority || 'HIGH').toUpperCase();
          const pillClass = prio === 'HIGH' ?
              'status-error' :
              (prio === 'MEDIUM' ? 'status-disabled' : 'status-active');
          return `
        <div class="env-rec-item priority-${prio}">
          <div class="env-rec-top">
            <span class="env-rec-cat">${r.category || 'Recommendation'}</span>
            <span class="status-pill ${pillClass}">${prio} PRIORITY</span>
          </div>
          <div class="env-rec-title">${r.title}</div>
          <div class="env-rec-text">${r.recommendation}</div>
          <div class="env-rec-footer">
            <span><strong>Target:</strong> <code>${
              r.target_resources || 'Project Environment'}</code></span>
            <span class="impact-badge">Impact: ${
              r.expected_impact || 'High ROI'}</span>
          </div>
        </div>
      `;
        })
        .join('');
  }
}

async function generateOnDemandNarrative() {
  const btn = document.getElementById('generateNarrativeBtn');
  if (!btn) return;
  const origText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '✨ Synthesizing with gemini-3.8-flash...';

  try {
    const res = await fetch('/api/narrative', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        engine_id: state.engineId,
        use_llm: true,
      }),
    });
    const data = await res.json();
    state.narrativeData = data;
    renderNarrativeSection();
    prefetchDefaultTtsAudio();
    showToast(
        'Generated fresh on-demand Executive Summary & Recommendations via Vertex AI gemini-3.8-flash');
  } catch (e) {
    showToast('Error generating on-demand narrative; showing live baseline.');
  } finally {
    btn.disabled = false;
    btn.textContent = origText;
  }
}

/* ==========================================================================
   3. TEXT-TO-SPEECH ("READ ME THE REPORT" — gemini-3.8-flash-tts) AUDIO PLAYER
   ========================================================================== */
function getActiveTtsScript() {
  const nav = state.narrativeData ||
      (state.reportData && state.reportData.narrative_report);
  if (!nav) return '';
  if (nav.tts_script) return nav.tts_script;
  const bullets = (nav.executive_summary_bullets || [])
                      .map((b) => `Point ${b.rank}: ${b.headline}. ${b.narrative}`)
                      .join(' ');
  const recs = (nav.environment_recommendations || [])
                   .map((r, i) => `Recommendation ${i + 1}: ${r.title}. ${r.recommendation}`)
                   .join(' ');
  return `Executive Summary: ${bullets}. Environment Recommendations: ${recs}`;
}

function splitTextIntoTtsSegments(text, maxChars = 340) {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = '';
  for (const s of sentences) {
    if (!s) continue;
    if ((current ? current.length + 1 + s.length : s.length) <= maxChars) {
      current = current ? `${current} ${s}` : s;
    } else {
      if (current) chunks.push(current);
      if (s.length <= maxChars) {
        current = s;
      } else {
        const clauses = s.split(/(?<=[,;:])\s+/);
        let sub = '';
        for (const cl of clauses) {
          if ((sub ? sub.length + 1 + cl.length : cl.length) <= maxChars) {
            sub = sub ? `${sub} ${cl}` : cl;
          } else {
            if (sub) chunks.push(sub);
            sub = cl.slice(0, maxChars);
          }
        }
        current = sub;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function unlockAudioElement(audioEl) {
  if (!audioEl || state.audioUnlocked) return;
  try {
    // Tiny 44-byte valid 1-sample silent WAV to synchronously unlock browser autoplay gesture
    const silentWav =
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    audioEl.src = silentWav;
    state.audioUnlocked = true;
    const p = audioEl.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {});
    }
  } catch (e) {
    // Ignore unlock errors
  }
}

async function fetchTtsSegment(segText, voice, rate) {
  const cacheKey = `${voice}|${rate.toFixed(2)}|${segText}`;
  if (state.ttsAudioCache[cacheKey]) {
    return state.ttsAudioCache[cacheKey];
  }
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      text: segText,
      voice_name: voice,
      speaking_rate: rate,
    }),
  });
  const data = await res.json();
  if (data.status === 'OK' && data.audio_base64) {
    const item = {
      src: `data:${data.audio_mime || 'audio/mpeg'};base64,${data.audio_base64}`,
      engine: data.engine || `gemini-3.8-flash-tts (${voice})`,
    };
    state.ttsAudioCache[cacheKey] = item;
    return item;
  }
  throw new Error(data.error_detail || 'Cloud TTS synthesis returned empty audio');
}

function prefetchDefaultTtsAudio() {
  const scriptText = getActiveTtsScript();
  if (!scriptText) return;
  const voice = document.getElementById('ttsVoiceSelect')?.value || 'Kore';
  const rate = Number(document.getElementById('ttsRateSelect')?.value || 1.0);
  const segments = splitTextIntoTtsSegments(scriptText, 340);
  if (!segments.length) return;
  // Pre-warm the first 2 segments in client memory so clicking "Read Me the Report" starts instantaneously
  segments.slice(0, 2).forEach((seg) => {
    fetchTtsSegment(seg, voice, rate).catch(() => {});
  });
}

function updateTtsUiState(statusText, progressPct, isPlaying, isPaused = false) {
  state.ttsPlaying = isPlaying;
  state.ttsPaused = isPaused;

  const playBtn = document.getElementById('ttsPlayToggleBtn');
  const headerBtn = document.getElementById('headerTtsBtn');
  const stopBtn = document.getElementById('ttsStopBtn');
  const statusEl = document.getElementById('ttsStatusTitle');
  const progEl = document.getElementById('ttsProgressFill');
  const iconEl = document.getElementById('ttsPlayIcon');
  const labelEl = document.getElementById('ttsPlayLabel');

  if (statusEl && statusText) statusEl.textContent = statusText;
  if (progEl && progressPct !== null) {
    progEl.style.width = `${Math.min(Math.max(progressPct, 0), 100)}%`;
  }
  if (stopBtn) stopBtn.disabled = !isPlaying && !isPaused;

  if (isPlaying && !isPaused) {
    if (iconEl) iconEl.textContent = '⏸';
    if (labelEl) labelEl.textContent = 'Pause Reading';
    playBtn?.classList.add('playing');
    if (headerBtn) {
      headerBtn.textContent = '⏸ Pause Report Audio';
      headerBtn.classList.add('playing');
    }
  } else if (isPaused) {
    if (iconEl) iconEl.textContent = '▶';
    if (labelEl) labelEl.textContent = 'Resume Reading';
    playBtn?.classList.remove('playing');
    if (headerBtn) {
      headerBtn.textContent = '▶ Resume Report Audio';
      headerBtn.classList.remove('playing');
    }
  } else {
    if (iconEl) iconEl.textContent = '🔊';
    if (labelEl) labelEl.textContent = 'Read Me the Report';
    playBtn?.classList.remove('playing');
    if (headerBtn) {
      headerBtn.textContent = '🔊 Read Me the Report';
      headerBtn.classList.remove('playing');
    }
  }
}

function stopTtsPlayback() {
  state.ttsSessionId = (state.ttsSessionId || 0) + 1;
  const audioEl = document.getElementById('ttsAudioElement');
  if (audioEl) {
    audioEl.onended = null;
    audioEl.ontimeupdate = null;
    audioEl.pause();
    audioEl.currentTime = 0;
  }
  state.ttsMode = null;
  updateTtsUiState(
      'Audio Briefing Ready — gemini-3.8-flash-tts (Executive Summary + Recommendations)',
      0,
      false,
      false);
}

async function toggleTtsPlayback() {
  const audioEl = document.getElementById('ttsAudioElement');
  const voice = document.getElementById('ttsVoiceSelect')?.value || 'Kore';
  const rate = Number(document.getElementById('ttsRateSelect')?.value || 1.0);

  // If currently playing, pause
  if (state.ttsPlaying && !state.ttsPaused) {
    if (audioEl) {
      audioEl.pause();
    }
    updateTtsUiState('Paused — Click Resume to continue listening', null, false, true);
    return;
  }

  // If currently paused, resume
  if (state.ttsPaused) {
    if (audioEl) {
      await audioEl.play();
    }
    updateTtsUiState(
        `Reading Executive Summary & Recommendations (gemini-3.8-flash-tts • ${voice})...`,
        null,
        true,
        false);
    return;
  }

  // Start fresh Cloud Gemini Flash TTS playback
  const scriptText = getActiveTtsScript();
  if (!scriptText) {
    showToast('Report data is still loading.');
    return;
  }
  if (!audioEl) return;

  // Synchronously unlock the HTML5 Audio element inside the user's click gesture
  unlockAudioElement(audioEl);

  const sessionId = (state.ttsSessionId || 0) + 1;
  state.ttsSessionId = sessionId;
  state.ttsMode = 'CLOUD_AUDIO';

  const segments = splitTextIntoTtsSegments(scriptText, 340);
  if (!segments.length) return;

  updateTtsUiState(
      `Synthesizing natural neural voice via gemini-3.8-flash-tts (${voice})...`,
      6,
      true,
      false);

  // Dispatch synthesis for all segments in parallel so segment 0 plays right away
  // and subsequent segments are already cached before segment 0 finishes
  const segmentPromises = segments.map((seg) => fetchTtsSegment(seg, voice, rate));

  try {
    for (let idx = 0; idx < segments.length; idx++) {
      if (state.ttsSessionId !== sessionId) return;
      const segAudio = await segmentPromises[idx];
      if (state.ttsSessionId !== sessionId) return;

      if (idx === 0) {
        showToast(`Playing natural neural report audio via gemini-3.8-flash-tts (${voice})`);
      }

      await new Promise((resolve, reject) => {
        if (state.ttsSessionId !== sessionId) {
          resolve();
          return;
        }
        audioEl.src = segAudio.src;
        audioEl.ontimeupdate = () => {
          if (state.ttsSessionId !== sessionId) return;
          if (audioEl.duration > 0) {
            const segFraction = audioEl.currentTime / audioEl.duration;
            const totalPct = ((idx + segFraction) / segments.length) * 100;
            const phase = totalPct < 52 ?
                `gemini-3.8-flash-tts (${voice}) • Reading Part 1: Top 5 Executive Insights...` :
                `gemini-3.8-flash-tts (${voice}) • Reading Part 2: Environment Recommendations...`;
            updateTtsUiState(
                `${phase} (${Math.round(totalPct)}%)`,
                totalPct,
                true,
                state.ttsPaused);
          }
        };
        audioEl.onended = () => resolve();
        audioEl.onerror = (err) => reject(err);
        const playPromise = audioEl.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch((err) => reject(err));
        }
      });
    }

    if (state.ttsSessionId === sessionId) {
      updateTtsUiState(
          `Finished reading Executive Summary & Recommendations (gemini-3.8-flash-tts • ${voice})`,
          100,
          false,
          false);
    }
  } catch (e) {
    if (state.ttsSessionId === sessionId) {
      updateTtsUiState(
          `Cloud TTS temporarily busy — click Read Me the Report to retry (${voice})`,
          0,
          false,
          false);
      showToast('Cloud Text-to-Speech synthesis interrupted. Click Read Me the Report to retry.');
    }
  }
}


/* ==========================================================================
   4. AGENT PLATFORM MODEL BILLING & TOKEN CONSUMPTION
      (PER MODEL, PER AGENT, PER PROJECT & APP)
   ========================================================================== */
function renderModelBillingSection() {
  if (!state.reportData || !state.reportData.model_billing) return;
  const mb = state.reportData.model_billing;
  const binfo = mb.billing_info || {};
  const byModel = mb.by_model || [];
  const byAgent = mb.by_agent || [];
  const byProj = mb.by_project_and_engine || [];

  // Header & Summary Strip
  const acctBadge = document.getElementById('billingAccountBadge');
  if (acctBadge) {
    acctBadge.textContent = `${binfo.billing_account_name || 'billingAccounts/linked'}`;
  }
  const stBadge = document.getElementById('billingStatusBadge');
  if (stBadge) {
    stBadge.textContent = binfo.billing_enabled ? '● Billing Active' : 'Billing Unlinked';
  }

  document.getElementById('tbCountModels').textContent = byModel.length;
  document.getElementById('tbCountAgents').textContent = byAgent.length;
  document.getElementById('tbCountEngines').textContent = byProj.length;

  document.getElementById('tbTotalTokens').textContent =
      fmtNum(binfo.total_live_tokens);
  document.getElementById('tbInputTokens').textContent =
      `${fmtNum(binfo.total_live_input_tokens)} (${
          Math.round((binfo.total_live_input_tokens / Math.max(binfo.total_live_tokens, 1)) * 100)}%)`;
  document.getElementById('tbOutputTokens').textContent =
      `${fmtNum(binfo.total_live_output_tokens)} (${
          Math.round((binfo.total_live_output_tokens / Math.max(binfo.total_live_tokens, 1)) * 100)}%)`;
  document.getElementById('tbInvocations').textContent =
      fmtNum(binfo.total_live_invocations);
  document.getElementById('tbModelSpend').textContent =
      `$${fmtUsd(binfo.total_model_token_spend_usd)}`;

  // Visual Token Distribution Bars (Top 6 Models with non-zero tokens or registered agents)
  const barsBox = document.getElementById('modelTokenBarsBox');
  if (barsBox) {
    const topModels = byModel.slice(0, 6);
    const maxTok = Math.max(
        ...topModels.map((m) => Math.max(m.input_tokens_30d, m.output_tokens_30d)),
        1000);
    barsBox.innerHTML = topModels
        .map((m) => {
          const inW = Math.max((m.input_tokens_30d / maxTok) * 76, 1.5);
          const outW = Math.max((m.output_tokens_30d / maxTok) * 76, 1.5);
          return `
        <div class="bar-group-row">
          <div>
            <div class="bar-group-label-title"><code>${m.model_id}</code></div>
            <div class="bar-group-label-sub">${m.invocations_30d} calls • ${
              m.registered_agents_count} GE agents • $${
              fmtUsd(m.total_token_spend_usd)}</div>
          </div>
          <div class="bar-tracks-col">
            <div class="bar-track-line">
              <div class="bar-fill bar-fill-blue" style="width: ${
              inW.toFixed(1)}%;"></div>
              <span class="bar-val-text">${fmtNum(m.input_tokens_30d)} in</span>
            </div>
            <div class="bar-track-line">
              <div class="bar-fill bar-fill-teal" style="width: ${
              outW.toFixed(1)}%;"></div>
              <span class="bar-val-text">${
              fmtNum(m.output_tokens_30d)} out (${m.token_share_pct}% total)</span>
            </div>
          </div>
        </div>
      `;
        })
        .join('');
  }

  const q = state.billingSearch.trim().toLowerCase();

  // Tab 1: Per Model Table
  const modelTbody = document.getElementById('billingModelTableBody');
  if (modelTbody) {
    const filtModels = byModel.filter(
        (m) => !q ||
            `${m.model_id} ${m.tier_label} ${m.locations}`
                .toLowerCase()
                .includes(q));
    modelTbody.innerHTML = filtModels
        .map(
            (m) => `
      <tr>
        <td><span class="gcp-link-name"><code>${m.model_id}</code></span></td>
        <td><span class="status-pill status-private">${m.tier_label}</span></td>
        <td><code>${m.locations}</code></td>
        <td>${fmtNum(m.invocations_30d)}</td>
        <td>${fmtNum(m.input_tokens_30d)}</td>
        <td>${fmtNum(m.output_tokens_30d)}</td>
        <td><strong>${fmtNum(m.total_tokens_30d)}</strong></td>
        <td>${m.token_share_pct}%</td>
        <td>${m.registered_agents_count} agents</td>
        <td>$${m.input_rate_per_1m_usd} / $${m.output_rate_per_1m_usd}</td>
        <td><strong>$${fmtUsd(m.total_token_spend_usd)}</strong></td>
      </tr>
    `)
        .join('');
  }

  // Tab 2: Per Agent Table
  const agentTbody = document.getElementById('billingAgentTableBody');
  if (agentTbody) {
    const filtAgents = byAgent.filter(
        (a) => !q ||
            `${a.display_name} ${a.agent_id} ${a.model_id} ${a.engine_name} ${a.subtype}`
                .toLowerCase()
                .includes(q));
    agentTbody.innerHTML = filtAgents
        .map(
            (a) => `
      <tr>
        <td>
          <span class="gcp-link-name">${a.display_name}</span>
          <div class="muted" style="font-size: 11px;"><code>${a.agent_id}</code></div>
        </td>
        <td>${a.engine_name}</td>
        <td><span class="status-pill status-private">${a.subtype}</span></td>
        <td><code>${a.model_id}</code></td>
        <td><span class="status-pill ${
                a.state === 'ENABLED' ? 'status-active' : 'status-private'}">${
                a.state}</span></td>
        <td>${fmtNum(a.inferred_sessions)}</td>
        <td>${fmtNum(a.input_tokens_30d)}</td>
        <td>${fmtNum(a.output_tokens_30d)}</td>
        <td><strong>${fmtNum(a.total_tokens_30d)}</strong></td>
        <td>$${fmtUsd(a.token_spend_usd)}</td>
        <td><strong>$${fmtUsd(a.inferred_spend_usd)}</strong></td>
      </tr>
    `)
        .join('');
  }

  // Tab 3: Per Project & Engine Table
  const projTbody = document.getElementById('billingProjectTableBody');
  if (projTbody) {
    const filtProj = byProj.filter(
        (p) => !q ||
            `${p.project_id} ${p.engine_name} ${p.engine_id} ${p.primary_models}`
                .toLowerCase()
                .includes(q));
    const rollupRow = `
      <tr class="row-project-rollup">
        <td><code>${binfo.project_id}</code></td>
        <td><strong>ALL PROJECT ENGINES (${byProj.length} Apps • Billing: ${
        binfo.billing_account_name})</strong></td>
        <td><strong>${state.reportData.kpis.total_agents} (${
        state.reportData.kpis.enabled_agents} Enabled)</strong></td>
        <td><code>All ${binfo.active_models_count} Active Publisher Models</code></td>
        <td><strong>${fmtNum(state.reportData.kpis.inferred_sessions_30d)}</strong></td>
        <td><strong>${fmtNum(binfo.total_live_input_tokens)}</strong></td>
        <td><strong>${fmtNum(binfo.total_live_output_tokens)}</strong></td>
        <td><strong>${fmtNum(binfo.total_live_tokens)}</strong></td>
        <td><strong>100.0%</strong></td>
        <td><strong>$${fmtUsd(binfo.total_model_token_spend_usd)}</strong></td>
        <td><strong>$${fmtUsd(state.reportData.kpis.total_spend_usd)}</strong></td>
      </tr>
    `;
    projTbody.innerHTML = rollupRow +
        filtProj
            .map(
                (p) => `
      <tr>
        <td><code>${p.project_id}</code></td>
        <td>
          <span class="gcp-link-name">${p.engine_name}</span>
          <div class="muted" style="font-size: 11px;"><code>${p.engine_id}</code></div>
        </td>
        <td>${p.agents_count} (${p.enabled_agents_count} Enabled)</td>
        <td><code>${p.primary_models}</code></td>
        <td>${fmtNum(p.sessions_30d)}</td>
        <td>${fmtNum(p.input_tokens_30d)}</td>
        <td>${fmtNum(p.output_tokens_30d)}</td>
        <td><strong>${fmtNum(p.total_tokens_30d)}</strong></td>
        <td>${p.token_share_pct}%</td>
        <td>$${fmtUsd(p.token_spend_usd)}</td>
        <td><strong>$${fmtUsd(p.total_engine_spend_usd)}</strong></td>
      </tr>
    `)
            .join('');
  }
}

/* ==========================================================================
   5. GOOGLE-PALETTE WORKSTREAMS & DELIVERABLES PAIRED BARS
   ========================================================================== */
function renderWorkstreamsChart() {
  const box = document.getElementById('workstreamsChartBox');
  if (!box || !state.reportData) return;
  const items = [...(state.reportData.workstreams || [])];
  items.sort((a, b) =>
      state.workstreamsSort === 'sessions' ?
          b.sessions_pct - a.sessions_pct :
          b.spend_pct - a.spend_pct);

  const maxVal = Math.max(
      ...items.map((x) => Math.max(x.sessions_pct, x.spend_pct)), 25);

  box.innerHTML = items
      .map((w) => {
        const sWidth = Math.max((w.sessions_pct / maxVal) * 78, 2);
        const cWidth = Math.max((w.spend_pct / maxVal) * 78, 2);
        return `
      <div class="bar-group-row">
        <div>
          <div class="bar-group-label-title">${w.title}</div>
          <div class="bar-group-label-sub">${w.agents_count} agents • ${
            w.sessions_count} sessions</div>
        </div>
        <div class="bar-tracks-col">
          <div class="bar-track-line">
            <div class="bar-fill bar-fill-blue" style="width: ${
            sWidth.toFixed(1)}%;"></div>
            <span class="bar-val-text">${w.sessions_pct}%</span>
          </div>
          <div class="bar-track-line">
            <div class="bar-fill bar-fill-teal" style="width: ${
            cWidth.toFixed(1)}%;"></div>
            <span class="bar-val-text">${w.spend_pct}% ($${
            fmtUsd(w.spend_usd)})</span>
          </div>
        </div>
      </div>
    `;
      })
      .join('');
}

function renderDeliverablesChart() {
  const box = document.getElementById('deliverablesChartBox');
  if (!box || !state.reportData) return;
  const items = [...(state.reportData.deliverables || [])];
  items.sort((a, b) =>
      state.deliverablesSort === 'sessions' ?
          b.sessions_pct - a.sessions_pct :
          b.spend_pct - a.spend_pct);

  const maxVal = Math.max(
      ...items.map((x) => Math.max(x.sessions_pct, x.spend_pct)), 25);

  box.innerHTML = items
      .map((d) => {
        const sWidth = Math.max((d.sessions_pct / maxVal) * 78, 2);
        const cWidth = Math.max((d.spend_pct / maxVal) * 78, 2);
        return `
      <div class="bar-group-row">
        <div>
          <div class="bar-group-label-title">${d.title}</div>
          <div class="bar-group-label-sub">${d.agents_count} agents • ${
            d.sessions_count} sessions</div>
        </div>
        <div class="bar-tracks-col">
          <div class="bar-track-line">
            <div class="bar-fill bar-fill-blue" style="width: ${
            sWidth.toFixed(1)}%;"></div>
            <span class="bar-val-text">${d.sessions_pct}%</span>
          </div>
          <div class="bar-track-line">
            <div class="bar-fill bar-fill-teal" style="width: ${
            cWidth.toFixed(1)}%;"></div>
            <span class="bar-val-text">${d.spend_pct}% ($${
            fmtUsd(d.spend_usd)})</span>
          </div>
        </div>
      </div>
    `;
      })
      .join('');
}

/* ==========================================================================
   6. CONNECTED DATA STORES TABLE
   ========================================================================== */
function renderDatastoresTable() {
  const tbody = document.getElementById('datastoresTableBody');
  if (!tbody || !state.reportData) return;
  const allDs = state.reportData.datastores || [];

  document.getElementById('dsCountAll').textContent = allDs.length;
  document.getElementById('dsCountActive').textContent =
      allDs.filter((d) => d.status_code === 'ACTIVE').length;
  document.getElementById('dsCountMcp').textContent =
      allDs.filter((d) => d.icon_category === 'mcp').length;
  document.getElementById('dsCountError').textContent =
      allDs.filter((d) => d.status_code === 'ERROR').length;

  const q = state.dsSearch.trim().toLowerCase();
  const filtered = allDs.filter((d) => {
    if (state.dsFilter === 'ACTIVE' && d.status_code !== 'ACTIVE') return false;
    if (state.dsFilter === 'MCP' && d.icon_category !== 'mcp') return false;
    if (state.dsFilter === 'ERROR' && d.status_code !== 'ERROR') return false;
    if (q) {
      const hay =
          `${d.display_name} ${d.datastore_id} ${d.type} ${d.engine_names}`
              .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  tbody.innerHTML = filtered
      .map((d) => {
        let statusHtml = '';
        if (d.status_code === 'ACTIVE') {
          statusHtml = `<span class="status-pill status-active">● Active</span>`;
        } else if (d.status_code === 'ERROR') {
          statusHtml =
              `<span class="status-pill status-error" title="${
                  (d.errors || []).join(' ')}">▲ Initialization Failed</span>`;
        } else {
          statusHtml = `<span class="muted">-</span>`;
        }

        return `
      <tr>
        <td>
          <span class="gcp-link-name">${d.display_name}</span>
          <div class="muted" style="font-size: 11px;"><code>${
            d.datastore_id}</code></div>
        </td>
        <td>
          <span class="type-badge">
            <span class="type-icon">${iconForDatastore(d.icon_category)}</span>
            ${d.type}
          </span>
        </td>
        <td>${statusHtml}</td>
        <td>${d.last_sync_fmt}</td>
        <td>${d.update_time_fmt}</td>
        <td>${d.create_time_fmt}</td>
        <td>${d.engine_names}</td>
      </tr>
    `;
      })
      .join('');
}

/* ==========================================================================
   7. REGISTERED AGENTS TABLE — ALL 122 AGENTS
   ========================================================================== */
function renderAgentsTable() {
  const tbody = document.getElementById('agentsTableBody');
  if (!tbody || !state.reportData) return;
  const allAgents = state.reportData.agents || [];

  document.getElementById('agCountAll').textContent = allAgents.length;
  document.getElementById('agCountGoogle').textContent =
      allAgents.filter((a) => a.ownership === 'Google-made').length;
  document.getElementById('agCountOurs').textContent =
      allAgents.filter((a) => a.ownership === 'Our agents').length;

  const q = state.agentSearch.trim().toLowerCase();
  const filtered = allAgents.filter((a) => {
    if (state.agentOwnerFilter !== 'ALL' &&
        a.ownership !== state.agentOwnerFilter) {
      return false;
    }
    if (state.agentStateFilter === 'ERRORS') {
      if (!a.validation_errors || a.validation_errors.length === 0)
        return false;
    } else if (
        state.agentStateFilter !== 'ALL' &&
        a.state !== state.agentStateFilter) {
      return false;
    }
    if (q) {
      const hay = `${a.display_name} ${a.agent_id} ${a.agent_type} ${
                      a.model_id} ${a.engine_name} ${a.description}`
                      .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  tbody.innerHTML = filtered
      .map((a) => {
        let statePill = '-';
        if (a.agent_id === 'core_assistant') {
          statePill = '-';
        } else if (a.state === 'ENABLED') {
          statePill = `<span class="status-pill status-active">✓ Enabled</span>`;
        } else if (a.state === 'PRIVATE') {
          statePill =
              `<span class="status-pill status-private">🔒 Private</span>`;
        } else if (a.state === 'DISABLED') {
          statePill =
              `<span class="status-pill status-disabled">⊖ Disabled</span>`;
        }

        const errBadge = (a.validation_errors && a.validation_errors.length) ?
            `<span class="status-pill status-error" style="margin-left: 6px;">${
                a.validation_errors.length} Node Error</span>` :
            '';

        return `
      <tr>
        <td>
          <span class="gcp-link-name">${a.display_name}</span>
          ${errBadge}
        </td>
        <td><code>${a.agent_id}</code></td>
        <td>${a.agent_type}</td>
        <td><code>${a.model_id || 'gemini-3.8-flash'}</code></td>
        <td>${statePill}</td>
        <td>${a.engine_name}</td>
        <td>${fmtNum(a.total_tokens_30d)}</td>
        <td>${a.update_time_fmt}</td>
        <td>$${fmtUsd(a.inferred_spend_usd)}</td>
      </tr>
    `;
      })
      .join('');
}

/* ==========================================================================
   8. INTERACTIVE REACTFLOW DATA & AGENT LINEAGE GRAPH — ALL 122 AGENTS
   ========================================================================== */
function getVisibleLineageNodesAndEdges() {
  if (!state.lineageData) return {nodes: [], edges: [], maxX: 1650, maxY: 700};

  const allNodes = state.lineageData.nodes || [];
  const allEdges = state.lineageData.edges || [];
  const q = state.lineageSearch.trim().toLowerCase();
  const subtypeFilter = state.lineageSubtypeFilter;
  const mode = state.lineageLayoutMode;

  const dsNodes = allNodes.filter((n) => n.layer === 'DATA_STORE');
  const engNodes = allNodes.filter((n) => n.layer === 'GE_ENGINE');
  let agNodes = allNodes.filter((n) => n.layer === 'GE_AGENT');
  let reNodes = allNodes.filter((n) => n.layer === 'REASONING_ENGINE');

  // Filter agents by subtype if selected
  if (subtypeFilter !== 'ALL') {
    agNodes = agNodes.filter((n) => {
      if (subtypeFilter === 'Managed') {
        return n.subtype === 'Managed' || n.subtype === 'Core Assistant';
      }
      return n.subtype === subtypeFilter;
    });
  }

  // Filter by search query if typed
  const matchesQuery = (n) => {
    if (!q) return true;
    const hay = `${n.data.title} ${n.data.subtitle} ${n.data.category} ${
                    n.data.details}`
                    .toLowerCase();
    return hay.includes(q);
  };

  if (q) {
    agNodes = agNodes.filter(matchesQuery);
  }

  if (mode === 'ADK_ONLY') {
    agNodes = agNodes.filter((n) => n.has_re || n.has_error);
    reNodes = reNodes.filter((n) => n.subtype === 'LINKED_ADK');
  }

  // Pagination for PAGINATED mode
  const totalAgentPages = Math.max(Math.ceil(agNodes.length / state.lineagePageSize), 1);
  if (state.lineagePage > totalAgentPages) state.lineagePage = 1;
  const pagerBox = document.getElementById('lineagePagerBox');
  const pageLabel = document.getElementById('lineagePageLabel');
  if (pagerBox) {
    if (mode === 'PAGINATED') {
      pagerBox.classList.remove('hidden');
      if (pageLabel) {
        pageLabel.textContent =
            `Page ${state.lineagePage} / ${totalAgentPages} (${agNodes.length} Agents)`;
      }
    } else {
      pagerBox.classList.add('hidden');
    }
  }

  if (mode === 'PAGINATED') {
    const startIdx = (state.lineagePage - 1) * state.lineagePageSize;
    agNodes = agNodes.slice(startIdx, startIdx + state.lineagePageSize);
  }

  // Compute dynamic layout coordinates with generous gaps so cards & handles never crowd
  const positionedNodes = [];

  if (mode === 'MATRIX') {
    // Tier 1: Data Stores (2 sub-columns: x=24, x=304)
    const dsCols = dsNodes.length > 10 ? 2 : 1;
    dsNodes.forEach((n, idx) => {
      const col = idx % dsCols;
      const row = Math.floor(idx / dsCols);
      positionedNodes.push({
        ...n,
        position: {x: 24 + col * 280, y: 28 + row * 106},
      });
    });

    // Tier 2: GE Apps (1 column: x=640 — 94px corridor from Tier 1 and 118px corridor to Tier 3)
    engNodes.forEach((n, idx) => {
      positionedNodes.push({
        ...n,
        position: {x: 640, y: 28 + idx * 106},
      });
    });

    // Tier 3: All 122 Registered Agents (4 sub-columns: x=1000, 1280, 1560, 1840)
    const agCols = agNodes.length > 24 ? 4 : (agNodes.length > 8 ? 2 : 1);
    agNodes.forEach((n, idx) => {
      const col = idx % agCols;
      const row = Math.floor(idx / agCols);
      positionedNodes.push({
        ...n,
        position: {x: 1000 + col * 280, y: 28 + row * 104},
      });
    });

    // Tier 4: All 43 Vertex AI Reasoning Engines (2 sub-columns after Agents)
    const reBaseX = 1000 + agCols * 280 + 65;
    const reCols = reNodes.length > 12 ? 2 : 1;
    reNodes.forEach((n, idx) => {
      const col = idx % reCols;
      const row = Math.floor(idx / reCols);
      positionedNodes.push({
        ...n,
        position: {x: reBaseX + col * 280, y: 28 + row * 106},
      });
    });
  } else {
    // Stream / Paginated / ADK Focus 4-column layout
    dsNodes.forEach((n, idx) => {
      positionedNodes.push({
        ...n,
        position: {x: 24, y: 28 + idx * 106},
      });
    });
    engNodes.forEach((n, idx) => {
      positionedNodes.push({
        ...n,
        position: {x: 420, y: 28 + idx * 106},
      });
    });
    agNodes.forEach((n, idx) => {
      positionedNodes.push({
        ...n,
        position: {x: 820, y: 28 + idx * 106},
      });
    });
    reNodes.forEach((n, idx) => {
      positionedNodes.push({
        ...n,
        position: {x: 1220, y: 28 + idx * 106},
      });
    });
  }

  const visibleIds = new Set(positionedNodes.map((n) => n.id));
  const visibleEdges = allEdges.filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target));

  // Update tier count badges & dynamic dropdown labels
  const totalAgCount = allNodes.filter((n) => n.layer === 'GE_AGENT').length;
  const matOpt = document.querySelector('#lineageLayoutSelect option[value="MATRIX"]');
  if (matOpt) matOpt.textContent = `View: All ${totalAgCount} Agents (Multi-Column Matrix)`;
  const allSubOpt = document.querySelector('#lineageSubtypeSelect option[value="ALL"]');
  if (allSubOpt) allSubOpt.textContent = `All Agent Types (${totalAgCount})`;

  document.getElementById('tierCountDs').textContent = dsNodes.length;
  document.getElementById('tierCountEng').textContent = engNodes.length;
  document.getElementById('tierCountAg').textContent = agNodes.length;
  document.getElementById('tierCountRe').textContent = reNodes.length;

  const badgeEl = document.getElementById('lineageTotalCountBadge');
  if (badgeEl) {
    badgeEl.textContent =
        `Showing ${agNodes.length} Agents • ${positionedNodes.length} Total Nodes • ${visibleEdges.length} Edges`;
  }

  const maxX = Math.max(...positionedNodes.map((n) => n.position.x + 275), 1550);
  const maxY = Math.max(...positionedNodes.map((n) => n.position.y + 120), 680);

  return {nodes: positionedNodes, edges: visibleEdges, maxX, maxY};
}

function fitLineageViewToContainer(fitAll = false) {
  const container = document.getElementById('reactflowLineageContainer');
  const {maxX, maxY} = getVisibleLineageNodesAndEdges();
  if (container && container.clientWidth > 200) {
    const scaleX = (container.clientWidth - 28) / maxX;
    const scaleY = (container.clientHeight - 28) / maxY;
    const z = fitAll ?
        Math.min(scaleX, scaleY, 0.95) :
        Math.min(Math.max(scaleX, 0.42), 0.95);
    state.lineageZoom = Number(Math.max(z, 0.22).toFixed(3));
    state.lineagePanX = 10;
    state.lineagePanY = 10;
    container.scrollTop = 0;
    container.scrollLeft = 0;
  }
}

async function loadLineage() {
  const res = await fetch(
      `/api/lineage?engine_id=${encodeURIComponent(state.engineId)}`);
  const data = await res.json();
  state.lineageData = data;
  if (!state.lineageSelectedNodeId && data.nodes && data.nodes.length > 0) {
    const firstAg = data.nodes.find((n) => n.layer === 'GE_AGENT');
    state.lineageSelectedNodeId = (firstAg || data.nodes[0]).id;
  }
  fitLineageViewToContainer(false);
  renderLineageCanvas();
  if (state.lineageSelectedNodeId) {
    updateLineageInspector(state.lineageSelectedNodeId);
  }
}

function renderLineageCanvas() {
  const container = document.getElementById('reactflowLineageContainer');
  if (!container || !state.lineageData) return;

  const {nodes, edges, maxX, maxY} = getVisibleLineageNodesAndEdges();
  const nodeMap = {};
  nodes.forEach((n) => {
    nodeMap[n.id] = n;
  });

  const NODE_W = 242;
  const NODE_H = 84;
  const q = state.lineageSearch.trim().toLowerCase();
  const isDenseMatrix = edges.length > 40;
  const selectedEdgesCount = edges.filter(
      (e) => e.source === state.lineageSelectedNodeId ||
          e.target === state.lineageSelectedNodeId).length;

  const bgEdgesSvg = [];
  const fgEdgesSvg = [];

  edges.forEach((e) => {
    const src = nodeMap[e.source];
    const tgt = nodeMap[e.target];
    if (!src || !tgt) return;
    const x1 = src.position.x + NODE_W;
    const y1 = src.position.y + NODE_H / 2;
    const x2 = tgt.position.x;
    const y2 = tgt.position.y + NODE_H / 2;
    const dx = Math.max(Math.abs(x2 - x1) * 0.42, 38);
    const pathD =
        `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    const isSelected = state.lineageSelectedNodeId === e.source ||
        state.lineageSelectedNodeId === e.target;
    const strokeColor = e.status === 'WARNING' ?
        '#d93025' :
        (isSelected ? '#1e8e3e' : '#1a73e8');
    // In dense 213-node view, only animate highlighted edges or warning edges so the background stays clean
    const shouldAnimate = state.lineageAnimated && e.animated &&
        (isSelected || !isDenseMatrix || e.status === 'WARNING');
    const animClass = shouldAnimate ? 'rf-edge-animated' : '';
    const hiClass = isSelected ?
        'edge-highlighted' :
        (isDenseMatrix ? 'edge-dimmed' : '');
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    // Only render inline SVG pill labels when there are <= 16 selected edges so labels never stack on top of each other
    const showLabel = (isSelected && selectedEdgesCount <= 16) || edges.length <= 28;
    const labelW = Math.max((e.label || '').length * 5.8 + 10, 48);

    const svgGroup = `
      <g>
        <path d="${pathD}" class="rf-edge-path ${animClass} ${hiClass}" stroke="${
        strokeColor}" marker-end="url(#rfArrow)" />
        ${
        (showLabel && e.label) ?
            `
          <rect x="${midX - labelW / 2}" y="${midY - 8}" width="${
                labelW}" height="16" class="rf-edge-label-bg" />
          <text x="${midX}" y="${
                midY + 3}" text-anchor="middle" class="rf-edge-label-text">${
                e.label}</text>
        ` :
            ''}
      </g>
    `;
    if (isSelected) {
      fgEdgesSvg.push(svgGroup);
    } else {
      bgEdgesSvg.push(svgGroup);
    }
  });

  const edgesSvgHtml = bgEdgesSvg.join('') + fgEdgesSvg.join('');

  const nodesHtml = nodes
      .map((n) => {
        const isSelected = state.lineageSelectedNodeId === n.id;
        const warnClass =
            n.data.status === 'WARNING' ? 'rf-node-warning' : '';
        const matchClass = (q &&
            `${n.data.title} ${n.data.subtitle}`.toLowerCase().includes(q)) ?
            'rf-node-match' :
            '';
        return `
      <div class="rf-node rf-node-tier-${n.layer} ${warnClass} ${matchClass} ${
            isSelected ? 'selected' : ''}"
           data-node-id="${n.id}"
           style="left: ${n.position.x}px; top: ${n.position.y}px;">
        <span class="rf-handle rf-handle-left"></span>
        <div class="rf-node-top">
          <span class="rf-node-cat">${n.layer.replace('_', ' ')}</span>
          <span class="rf-node-badge">${n.data.badge}</span>
        </div>
        <div class="rf-node-title" title="${n.data.title}">${n.data.title}</div>
        <div class="rf-node-sub">${n.data.subtitle}</div>
        <div class="rf-node-metrics">${n.data.metrics}</div>
        <span class="rf-handle rf-handle-right"></span>
      </div>
    `;
      })
      .join('');

  const scaledW = Math.round(maxX * state.lineageZoom + 40);
  const scaledH = Math.round(maxY * state.lineageZoom + 40);

  container.innerHTML = `
    <div style="width: ${scaledW}px; height: ${scaledH}px; position: relative;">
      <div id="rfStage" class="rf-stage" style="width: ${maxX}px; height: ${maxY}px; transform: translate(${
      state.lineagePanX}px, ${state.lineagePanY}px) scale(${
      state.lineageZoom});">
        <svg class="rf-edges-svg" width="${maxX}" height="${maxY}" viewBox="0 0 ${maxX} ${maxY}">
          <defs>
            <marker id="rfArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#1a73e8" />
            </marker>
          </defs>
          ${edgesSvgHtml}
        </svg>
        ${nodesHtml}
      </div>
    </div>
  `;

  container.querySelectorAll('.rf-node').forEach((nodeEl) => {
    const nid = nodeEl.getAttribute('data-node-id');
    nodeEl.addEventListener('click', (ev) => {
      ev.stopPropagation();
      state.lineageSelectedNodeId = nid;
      updateLineageInspector(nid);
      renderLineageCanvas();
    });
  });
}

function updateLineageInspector(nodeId) {
  if (!state.lineageData) return;
  const node = (state.lineageData.nodes || []).find((n) => n.id === nodeId);
  if (!node) return;
  const d = node.data;

  document.getElementById('inspTitle').textContent = d.title;
  document.getElementById('inspSubtitle').textContent = d.subtitle;
  const badge = document.getElementById('inspBadge');
  badge.textContent = `${d.status} • ${d.badge}`;
  badge.className = `status-pill ${
      d.status === 'WARNING' ? 'status-error' : 'status-active'}`;

  document.getElementById('inspCategory').textContent = d.category;
  document.getElementById('inspMetrics').textContent = d.metrics;
  document.getElementById('inspResource').textContent = d.resource_path;
  document.getElementById('inspDetails').textContent = d.details;

  const nodeMap = {};
  (state.lineageData.nodes || []).forEach((n) => {
    nodeMap[n.id] = n;
  });
  const rel = (state.lineageData.edges || [])
                  .filter((e) => e.source === nodeId || e.target === nodeId);
  const edgeCountEl = document.getElementById('inspEdgeCount');
  if (edgeCountEl) edgeCountEl.textContent = rel.length;

  document.getElementById('inspEdgesList').innerHTML = rel
      .map((e) => {
        const isOut = e.source === nodeId;
        const peerId = isOut ? e.target : e.source;
        const peer = nodeMap[peerId];
        const peerTitle = peer ? peer.data.title : peerId;
        return `
      <div class="insp-edge-pill" data-peer-id="${peerId}" style="cursor: pointer;">
        <strong>${isOut ? '→ Downstream:' : '← Upstream:'}</strong> ${peerTitle}
        <div class="muted" style="font-size: 11px;"><code>${
            e.label || 'Linked'}</code></div>
      </div>
    `;
      })
      .join('');

  document.querySelectorAll('#inspEdgesList .insp-edge-pill').forEach((el) => {
    el.addEventListener('click', () => {
      const pid = el.getAttribute('data-peer-id');
      if (pid) {
        state.lineageSelectedNodeId = pid;
        updateLineageInspector(pid);
        renderLineageCanvas();
      }
    });
  });
}

function setupLineageCanvasPan() {
  const container = document.getElementById('reactflowLineageContainer');
  if (!container) return;
  let panning = false;
  let sx = 0;
  let sy = 0;
  let scrollLeftStart = 0;
  let scrollTopStart = 0;

  container.addEventListener('mousedown', (ev) => {
    if (ev.target.closest('.rf-node')) return;
    panning = true;
    sx = ev.clientX;
    sy = ev.clientY;
    scrollLeftStart = container.scrollLeft;
    scrollTopStart = container.scrollTop;
  });
  window.addEventListener('mousemove', (ev) => {
    if (!panning) return;
    container.scrollLeft = scrollLeftStart - (ev.clientX - sx);
    container.scrollTop = scrollTopStart - (ev.clientY - sy);
  });
  window.addEventListener('mouseup', () => {
    panning = false;
  });
}

/* ==========================================================================
   9. LIVE API FRICTIONS & LICENSED USERS
   ========================================================================== */
function renderFrictionsAndUsers() {
  if (!state.reportData) return;
  const frictions = state.reportData.frictions || [];
  const users = state.reportData.user_licenses || [];

  document.getElementById('frictionCountBadge').textContent =
      `${frictions.length} Live API Issues`;

  document.getElementById('frictionsListBox').innerHTML = frictions
      .map(
          (f) => `
    <div class="friction-item">
      <div class="friction-top">
        <span class="friction-title">${f.resource_name} <span class="muted">(${
              f.engine_name})</span></span>
        <span class="status-pill status-error">${f.category}</span>
      </div>
      <div class="friction-detail">${f.detail}</div>
      <div class="friction-remedy"><strong>Remediation:</strong> ${
              f.remediation}</div>
    </div>
  `)
      .join('');

  document.getElementById('usersTableBody').innerHTML = users
      .map((u) => {
        const ident =
            state.revealPii ? u.user_principal : u.masked_principal;
        const stClass = u.assignment_state === 'ASSIGNED' ? 'status-active' :
                                                            'status-error';
        return `
      <tr>
        <td><code>${ident}</code></td>
        <td><span class="status-pill ${stClass}">${
            u.assignment_state}</span></td>
        <td><code>${u.license_tier}</code></td>
        <td>${u.last_login_fmt}</td>
      </tr>
    `;
      })
      .join('');
}

/* ==========================================================================
   10. BURGER MENU CONFIG & "UNDERSTAND EXPENSE" FORMULA SYNC
   ========================================================================== */
async function loadConfig() {
  const res = await fetch('/api/config');
  const cfg = await res.json();
  document.getElementById('cfgInputPrice').value =
      cfg.input_price_per_1m_usd ?? 1.25;
  document.getElementById('cfgOutputPrice').value =
      cfg.output_price_per_1m_usd ?? 5.0;
  document.getElementById('cfgInputTokens').value =
      cfg.avg_input_tokens_per_turn ?? 3800;
  document.getElementById('cfgOutputTokens').value =
      cfg.avg_output_tokens_per_turn ?? 1400;
  document.getElementById('cfgTurnsSession').value =
      cfg.avg_turns_per_session ?? 4.0;
  document.getElementById('cfgInvocationFee').value =
      cfg.agent_invocation_fee_usd ?? 0.05;
  document.getElementById('cfgConnectorCost').value =
      cfg.active_connector_monthly_cost_usd ?? 15.0;
  document.getElementById('cfgLicenseCost').value =
      cfg.assigned_license_monthly_cost_usd ?? 30.0;
  document.getElementById('cfgSessionsEnabled').value =
      cfg.base_sessions_per_enabled_agent ?? 12;
  document.getElementById('cfgSessionsPrivate').value =
      cfg.base_sessions_per_private_agent ?? 3;
  document.getElementById('cfgMinutesSaved').value =
      cfg.avg_minutes_saved_per_session ?? 18;
  document.getElementById('cfgHourlyRate').value = cfg.hourly_rate_usd ?? 45;
  document.getElementById('cfgProjectId').value = cfg.project_id || '';
  document.getElementById('cfgCacheTtl').value = cfg.cache_ttl_seconds ?? 120;
}

async function saveConfigAndRecalculate() {
  const payload = {
    input_price_per_1m_usd:
        Number(document.getElementById('cfgInputPrice').value),
    output_price_per_1m_usd:
        Number(document.getElementById('cfgOutputPrice').value),
    avg_input_tokens_per_turn:
        Number(document.getElementById('cfgInputTokens').value),
    avg_output_tokens_per_turn:
        Number(document.getElementById('cfgOutputTokens').value),
    avg_turns_per_session:
        Number(document.getElementById('cfgTurnsSession').value),
    agent_invocation_fee_usd:
        Number(document.getElementById('cfgInvocationFee').value),
    active_connector_monthly_cost_usd:
        Number(document.getElementById('cfgConnectorCost').value),
    assigned_license_monthly_cost_usd:
        Number(document.getElementById('cfgLicenseCost').value),
    base_sessions_per_enabled_agent:
        Number(document.getElementById('cfgSessionsEnabled').value),
    base_sessions_per_private_agent:
        Number(document.getElementById('cfgSessionsPrivate').value),
    avg_minutes_saved_per_session:
        Number(document.getElementById('cfgMinutesSaved').value),
    hourly_rate_usd: Number(document.getElementById('cfgHourlyRate').value),
    project_id: document.getElementById('cfgProjectId').value.trim(),
    cache_ttl_seconds: Number(document.getElementById('cfgCacheTtl').value),
  };

  await fetch('/api/config', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  await loadReport(false);
  await loadLineage();
  document.getElementById('configDrawerBackdrop').classList.remove('open');
  showToast('Expense formula & configuration applied to live API data');
}

/* ==========================================================================
   11. INITIALIZE EVENT LISTENERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('configDrawerBackdrop');
  const openDrawer = () => drawer.classList.add('open');
  const closeDrawer = () => drawer.classList.remove('open');

  document.getElementById('openConfigDrawerBtn')
      ?.addEventListener('click', openDrawer);
  document.getElementById('openExpenseFormulaBtn')
      ?.addEventListener('click', openDrawer);
  document.getElementById('customizeFormulaStripBtn')
      ?.addEventListener('click', openDrawer);
  document.getElementById('kpiExpenseCard')
      ?.addEventListener('click', openDrawer);
  document.getElementById('closeConfigDrawerBtn')
      ?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });
  document.querySelectorAll('.drawer-nav-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  document.getElementById('saveConfigBtn')
      ?.addEventListener('click', saveConfigAndRecalculate);

  document.getElementById('engineSelect')?.addEventListener('change', (e) => {
    state.engineId = e.target.value;
    state.narrativeData = null;
    loadReport(false);
    loadLineage();
  });

  document.getElementById('refreshLiveBtn')?.addEventListener('click', () => {
    loadReport(true);
    loadLineage();
    showToast('Refreshed live Discovery Engine, Cloud Monitoring & Vertex AI telemetry');
  });

  // On-demand Natural Language Narrative & TTS listeners
  document.getElementById('generateNarrativeBtn')
      ?.addEventListener('click', generateOnDemandNarrative);
  document.getElementById('ttsPlayToggleBtn')
      ?.addEventListener('click', toggleTtsPlayback);
  document.getElementById('headerTtsBtn')
      ?.addEventListener('click', () => {
        document.getElementById('section-narrative')
            ?.scrollIntoView({behavior: 'smooth', block: 'start'});
        toggleTtsPlayback();
      });
  document.getElementById('ttsStopBtn')
      ?.addEventListener('click', stopTtsPlayback);

  // Token Billing tabs & search
  document.querySelectorAll('#tokenBillingTabs .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tokenBillingTabs .seg-btn')
          .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.billingTab = btn.getAttribute('data-billing-tab') || 'MODEL';
      document.getElementById('billingPanelModel')
          ?.classList.toggle('hidden', state.billingTab !== 'MODEL');
      document.getElementById('billingPanelAgent')
          ?.classList.toggle('hidden', state.billingTab !== 'AGENT');
      document.getElementById('billingPanelProject')
          ?.classList.toggle('hidden', state.billingTab !== 'PROJECT');
    });
  });

  document.getElementById('tokenBillingSearch')
      ?.addEventListener('input', (e) => {
        state.billingSearch = e.target.value;
        renderModelBillingSection();
      });

  // Workstreams & Deliverables sort
  document.getElementById('workstreamsSortSelect')
      ?.addEventListener('change', (e) => {
        state.workstreamsSort = e.target.value;
        renderWorkstreamsChart();
      });

  document.getElementById('deliverablesSortSelect')
      ?.addEventListener('change', (e) => {
        state.deliverablesSort = e.target.value;
        renderDeliverablesChart();
      });

  // Data Stores filters
  document.querySelectorAll('#dsFilterTabs .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#dsFilterTabs .seg-btn')
          .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.dsFilter = btn.getAttribute('data-ds-filter') || 'ALL';
      renderDatastoresTable();
    });
  });

  document.getElementById('dsSearchInput')?.addEventListener('input', (e) => {
    state.dsSearch = e.target.value;
    renderDatastoresTable();
  });

  // Agents filters
  document.querySelectorAll('#agentOwnerTabs .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#agentOwnerTabs .seg-btn')
          .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.agentOwnerFilter = btn.getAttribute('data-owner') || 'ALL';
      renderAgentsTable();
    });
  });

  document.getElementById('agentStateSelect')
      ?.addEventListener('change', (e) => {
        state.agentStateFilter = e.target.value;
        renderAgentsTable();
      });

  document.getElementById('agentSearchInput')
      ?.addEventListener('input', (e) => {
        state.agentSearch = e.target.value;
        renderAgentsTable();
      });

  // Lineage controls (Layout Mode, Subtype Filter, Search, Pagination, Zoom)
  document.getElementById('lineageLayoutSelect')
      ?.addEventListener('change', (e) => {
        state.lineageLayoutMode = e.target.value;
        state.lineagePage = 1;
        fitLineageViewToContainer(false);
        renderLineageCanvas();
      });

  document.getElementById('lineageSubtypeSelect')
      ?.addEventListener('change', (e) => {
        state.lineageSubtypeFilter = e.target.value;
        state.lineagePage = 1;
        fitLineageViewToContainer(false);
        renderLineageCanvas();
      });

  document.getElementById('lineageSearchInput')
      ?.addEventListener('input', (e) => {
        state.lineageSearch = e.target.value;
        state.lineagePage = 1;
        renderLineageCanvas();
      });

  document.getElementById('lineagePrevPageBtn')
      ?.addEventListener('click', () => {
        if (state.lineagePage > 1) {
          state.lineagePage -= 1;
          renderLineageCanvas();
        }
      });

  document.getElementById('lineageNextPageBtn')
      ?.addEventListener('click', () => {
        state.lineagePage += 1;
        renderLineageCanvas();
      });

  document.getElementById('lineageZoomInBtn')?.addEventListener('click', () => {
    state.lineageZoom = Math.min(Number((state.lineageZoom + 0.1).toFixed(2)), 1.4);
    renderLineageCanvas();
  });
  document.getElementById('lineageZoomOutBtn')
      ?.addEventListener('click', () => {
        state.lineageZoom = Math.max(Number((state.lineageZoom - 0.1).toFixed(2)), 0.22);
        renderLineageCanvas();
      });
  document.getElementById('lineageFitViewBtn')
      ?.addEventListener('click', () => {
        fitLineageViewToContainer(false);
        renderLineageCanvas();
      });
  document.getElementById('lineageFitAllBtn')
      ?.addEventListener('click', () => {
        fitLineageViewToContainer(true);
        renderLineageCanvas();
      });
  document.getElementById('lineageToggleAnimBtn')
      ?.addEventListener('click', (e) => {
        state.lineageAnimated = !state.lineageAnimated;
        e.currentTarget.textContent =
            `⚡ Live Flow: ${state.lineageAnimated ? 'ON' : 'OFF'}`;
        renderLineageCanvas();
      });

  document.getElementById('togglePiiBtn')?.addEventListener('click', (e) => {
    state.revealPii = !state.revealPii;
    e.currentTarget.textContent =
        state.revealPii ? 'Mask Identities' : 'Reveal Identities';
    renderFrictionsAndUsers();
  });

  setupLineageCanvasPan();
  if (new URLSearchParams(window.location.search).get('drawer') === 'open') {
    openDrawer();
  }
  loadConfig();
  loadReport(false);
  loadLineage();
});
