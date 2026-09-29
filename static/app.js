const state = {
  engineId: 'ALL',
  workstreamsSort: 'spend',
  deliverablesSort: 'spend',
  dsFilter: 'ALL',
  dsSearch: '',
  agentOwnerFilter: 'ALL',
  agentStateFilter: 'ALL',
  agentSearch: '',
  revealPii: false,
  reportData: null,
  lineageData: null,
  lineageSelectedNodeId: null,
  lineageAnimated: true,
  lineageZoom: 0.72,
  lineagePanX: 14,
  lineagePanY: 18,
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

function showToast(msg) {
  const el = document.getElementById('toastBanner');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.classList.add('hidden');
  }, 3200);
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
   1. FETCH LIVE REPORT & FORMULA TELEMETRY
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

    populateEngineSelector(data.engines || [], data.selected_engine_id);
    renderKpisAndFormulaBanner(data);
    renderWorkstreamsChart();
    renderDeliverablesChart();
    renderDatastoresTable();
    renderAgentsTable();
    renderFrictionsAndUsers();
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

  document.getElementById('projectBadge').textContent =
      `Project: ${data.project_id}`;
  document.getElementById('headerMetaSub').textContent =
      `Live Discovery Engine API (${data.fetch_latency_ms} ms) • ${
          k.total_engines} Apps • ${k.total_agents} Agents • ${
          k.total_datastores} Data Stores`;

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

  document.getElementById('kpiRuntimeCount').textContent =
      `${k.vertex_reasoning_engines} RE / ${k.cloud_run_services} Run`;
  document.getElementById('kpiRuntimeMeta').textContent =
      `${k.vertex_reasoning_engines} Vertex Reasoning Engines • ${
          k.cloud_run_services} Cloud Run Services`;

  document.getElementById('kpiLicensesCount').textContent =
      `${k.assigned_licenses} / ${k.total_licenses} Seats`;
  document.getElementById('kpiLicensesMeta').textContent =
      `${k.active_users_30d} Active (30d) • ${
          k.total_licenses - k.assigned_licenses} Unlicensed Attempt`;

  document.getElementById('kpiTotalSpend').textContent =
      `$${fmtUsd(k.total_spend_usd)}`;
  document.getElementById('kpiRoiMeta').textContent =
      `${fmtNum(k.inferred_sessions_30d)} Sessions • $${
          fmtNum(k.value_saved_usd)} Value (${k.roi_multiple}x ROI)`;

  const eqText = fb.equation_text || '';
  document.getElementById('liveEquationBannerText').textContent = eqText;
  const drawerEq = document.getElementById('drawerLiveEquation');
  if (drawerEq) drawerEq.textContent = eqText;
}

/* ==========================================================================
   2. GOOGLE-PALETTE WORKSTREAMS & DELIVERABLES PAIRED BARS
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
   3. CONNECTED DATA STORES TABLE (MATCHING GCP CONSOLE SCREENSHOT 1)
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
   4. REGISTERED AGENTS TABLE — ALL 100+ AGENTS (MATCHING SCREENSHOT 2)
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
                      a.engine_name} ${a.description}`
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
        <td>${statePill}</td>
        <td>${a.engine_name}</td>
        <td>${a.create_time_fmt}</td>
        <td>${a.update_time_fmt}</td>
        <td>$${fmtUsd(a.inferred_spend_usd)}</td>
      </tr>
    `;
      })
      .join('');
}

/* ==========================================================================
   5. INTERACTIVE REACTFLOW DATA & AGENT LINEAGE GRAPH
   ========================================================================== */
function fitLineageViewToContainer() {
  const container = document.getElementById('reactflowLineageContainer');
  if (container && container.clientWidth > 200) {
    const targetW = 1430;
    const z = Math.min(
        Math.max((container.clientWidth - 24) / targetW, 0.54), 0.95);
    state.lineageZoom = Number(z.toFixed(3));
    state.lineagePanX = 12;
    state.lineagePanY =
        Math.max(Math.round((container.clientHeight - 660 * z) / 2), 12);
  }
}

async function loadLineage() {
  const res = await fetch(
      `/api/lineage?engine_id=${encodeURIComponent(state.engineId)}`);
  const data = await res.json();
  state.lineageData = data;
  if (!state.lineageSelectedNodeId && data.nodes && data.nodes.length > 0) {
    state.lineageSelectedNodeId = data.nodes[0].id;
  }
  fitLineageViewToContainer();
  renderLineageCanvas();
  if (state.lineageSelectedNodeId) {
    updateLineageInspector(state.lineageSelectedNodeId);
  }
}

function renderLineageCanvas() {
  const container = document.getElementById('reactflowLineageContainer');
  if (!container || !state.lineageData) return;

  const nodes = state.lineageData.nodes || [];
  const edges = state.lineageData.edges || [];
  const nodeMap = {};
  nodes.forEach((n) => {
    nodeMap[n.id] = n;
  });

  const NODE_W = 245;
  const NODE_H = 92;

  const edgesSvgHtml = edges
      .map((e) => {
        const src = nodeMap[e.source];
        const tgt = nodeMap[e.target];
        if (!src || !tgt) return '';
        const x1 = src.position.x + NODE_W;
        const y1 = src.position.y + NODE_H / 2;
        const x2 = tgt.position.x;
        const y2 = tgt.position.y + NODE_H / 2;
        const dx = Math.max(Math.abs(x2 - x1) * 0.48, 42);
        const pathD =
            `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        const isSelected = state.lineageSelectedNodeId === e.source ||
            state.lineageSelectedNodeId === e.target;
        const strokeColor = e.status === 'WARNING' ?
            '#d93025' :
            (isSelected ? '#1e8e3e' : '#1a73e8');
        const animClass = (state.lineageAnimated && e.animated) ?
            'rf-edge-animated' :
            '';
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const labelW = Math.max((e.label || '').length * 6.0 + 12, 54);

        return `
      <g>
        <path d="${pathD}" class="rf-edge-path ${animClass}" stroke="${
            strokeColor}" marker-end="url(#rfArrow)" />
        ${
            e.label ?
                `
          <rect x="${midX - labelW / 2}" y="${midY - 9}" width="${
                    labelW}" height="17" class="rf-edge-label-bg" />
          <text x="${midX}" y="${
                    midY + 3}" text-anchor="middle" class="rf-edge-label-text">${
                    e.label}</text>
        ` :
                ''}
      </g>
    `;
      })
      .join('');

  const nodesHtml = nodes
      .map((n) => {
        const isSelected = state.lineageSelectedNodeId === n.id;
        const warnClass =
            n.data.status === 'WARNING' ? 'rf-node-warning' : '';
        return `
      <div class="rf-node rf-node-tier-${n.layer} ${warnClass} ${
            isSelected ? 'selected' : ''}"
           data-node-id="${n.id}"
           style="left: ${n.position.x}px; top: ${n.position.y}px;">
        <span class="rf-handle rf-handle-left"></span>
        <div class="rf-node-top">
          <span class="rf-node-cat">${n.layer.replace('_', ' ')}</span>
          <span class="rf-node-badge">${n.data.badge}</span>
        </div>
        <div class="rf-node-title">${n.data.title}</div>
        <div class="rf-node-sub">${n.data.subtitle}</div>
        <div class="rf-node-metrics">${n.data.metrics}</div>
        <span class="rf-handle rf-handle-right"></span>
      </div>
    `;
      })
      .join('');

  container.innerHTML = `
    <div id="rfStage" class="rf-stage" style="transform: translate(${
      state.lineagePanX}px, ${state.lineagePanY}px) scale(${
      state.lineageZoom});">
      <svg class="rf-edges-svg" viewBox="0 0 1450 680">
        <defs>
          <marker id="rfArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#1a73e8" />
          </marker>
        </defs>
        ${edgesSvgHtml}
      </svg>
      ${nodesHtml}
    </div>
  `;

  container.querySelectorAll('.rf-node').forEach((nodeEl) => {
    const nid = nodeEl.getAttribute('data-node-id');
    nodeEl.addEventListener('mousedown', (ev) => {
      ev.stopPropagation();
      state.lineageSelectedNodeId = nid;
      updateLineageInspector(nid);

      const nodeObj = (state.lineageData.nodes || []).find((x) => x.id === nid);
      if (!nodeObj) return;
      const startX = ev.clientX;
      const startY = ev.clientY;
      const origX = nodeObj.position.x;
      const origY = nodeObj.position.y;
      let dragged = false;

      const onMove = (me) => {
        const dx = (me.clientX - startX) / state.lineageZoom;
        const dy = (me.clientY - startY) / state.lineageZoom;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          dragged = true;
          nodeObj.position.x = Math.round(origX + dx);
          nodeObj.position.y = Math.round(origY + dy);
          renderLineageCanvas();
        }
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        if (!dragged) renderLineageCanvas();
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
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
  document.getElementById('inspEdgesList').innerHTML = rel
      .map((e) => {
        const isOut = e.source === nodeId;
        const peer = nodeMap[isOut ? e.target : e.source];
        const peerTitle = peer ? peer.data.title : (isOut ? e.target : e.source);
        return `
      <div class="insp-edge-pill">
        <strong>${isOut ? '→ Downstream:' : '← Upstream:'}</strong> ${peerTitle}
        <div class="muted" style="font-size: 11px;"><code>${
            e.label || 'Linked'}</code></div>
      </div>
    `;
      })
      .join('');
}

function setupLineageCanvasPan() {
  const container = document.getElementById('reactflowLineageContainer');
  if (!container) return;
  let panning = false;
  let sx = 0;
  let sy = 0;
  container.addEventListener('mousedown', (ev) => {
    if (ev.target.closest('.rf-node')) return;
    panning = true;
    sx = ev.clientX - state.lineagePanX;
    sy = ev.clientY - state.lineagePanY;
  });
  window.addEventListener('mousemove', (ev) => {
    if (!panning) return;
    state.lineagePanX = ev.clientX - sx;
    state.lineagePanY = ev.clientY - sy;
    const stage = document.getElementById('rfStage');
    if (stage) {
      stage.style.transform = `translate(${state.lineagePanX}px, ${
          state.lineagePanY}px) scale(${state.lineageZoom})`;
    }
  });
  window.addEventListener('mouseup', () => {
    panning = false;
  });
}

/* ==========================================================================
   6. LIVE API FRICTIONS & LICENSED USERS
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
   7. BURGER MENU CONFIG & "UNDERSTAND EXPENSE" FORMULA SYNC
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
   8. INITIALIZE EVENT LISTENERS
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
    loadReport(false);
    loadLineage();
  });

  document.getElementById('refreshLiveBtn')?.addEventListener('click', () => {
    loadReport(true);
    loadLineage();
    showToast('Refreshed live Discovery Engine & Vertex AI telemetry');
  });

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

  // Lineage controls
  document.getElementById('lineageZoomInBtn')?.addEventListener('click', () => {
    state.lineageZoom = Math.min(state.lineageZoom + 0.1, 1.3);
    renderLineageCanvas();
  });
  document.getElementById('lineageZoomOutBtn')
      ?.addEventListener('click', () => {
        state.lineageZoom = Math.max(state.lineageZoom - 0.1, 0.45);
        renderLineageCanvas();
      });
  document.getElementById('lineageFitViewBtn')
      ?.addEventListener('click', () => {
        fitLineageViewToContainer();
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
  loadConfig();
  loadReport(false);
  loadLineage();
});
