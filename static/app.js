const state = {
  lang: localStorage.getItem('ge_smart_reports_lang') || 'en',
  theme: localStorage.getItem('ge_smart_reports_theme') || 'light',
  activeMainTab: 'OVERVIEW',
  lastNonArchTab: 'OVERVIEW',
  engineId: 'ALL',
  selectableProjects: [],
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
  adoptionDays: 30,
  adoptionData: null,
  adoptionCharts: {},
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
  ttsBriefingMode: 'CONVERSATIONAL',
  ttsAudioCache: {},
  ttsSessionId: 0,
  audioUnlocked: false,
};

/* ==========================================================================
   0. BILINGUAL I18N CATALOG (ENGLISH & SPANISH) + GOOGLE 4-COLOR PALETTE
   ========================================================================== */
const GOOGLE_PALETTE = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC04',
  green: '#34A853',
  blueRgba: 'rgba(66, 133, 244, 0.85)',
  greenRgba: 'rgba(52, 168, 83, 0.85)',
  yellowRgba: 'rgba(251, 188, 4, 0.88)',
  redRgba: 'rgba(234, 67, 53, 0.85)',
};

const I18N_CATALOG = {
  en: {
    app_title: 'Gemini Enterprise Smart Reports',
    drawer_title: 'Smart Reports Configuration',
    drawer_subtitle: 'Project Scope, i18n, Theme, Solution Architecture & Live Expense Formula',
    drawer_appearance_arch_title: 'Appearance, Language & Solution Architecture',
    cfg_language_label: 'Language / Idioma (i18n)',
    cfg_theme_label: 'Theme / Visual Mode',
    theme_light_btn: '☀️ Light',
    theme_dark_btn: '🌙 Dark',
    drawer_arch_card_title: '🏗️ Solution Architecture (Conceptual)',
    drawer_arch_card_desc: '5-layer end-to-end conceptual architecture diagram of Gemini Enterprise Smart Reports',
    drawer_arch_open_btn: 'Open Architecture View →',
    drawer_project_section_title: 'GCP Project & Cache Settings',
    cfg_project_label: 'GCP Project ID (Auto-regenerates report on change)',
    cfg_cache_ttl_label: 'API Snapshot Cache TTL (seconds)',
    drawer_quick_nav_title: 'Quick Navigation',
    nav_kpis: '📊 Overview & KPIs',
    nav_narrative: '✨ Executive Summary & TTS',
    nav_charts: '📈 Workstreams & Deliverables',
    nav_billing: '🪙 Token Billing (Model/Agent)',
    nav_lineage: '🕸️ Agent Lineage Graph',
    nav_datastores: '🗄️ Connected Data Stores',
    nav_agents: '🤖 Registered Agents',
    nav_frictions: '⚠️ Live API Frictions & Users',
    nav_adoption: '👥 Telemetry & Adoption (6 Dimensions)',
    nav_architecture: '🏗️ Solution Architecture',
    drawer_formula_title: 'ƒx Live Expense Formula (Understand Expense)',
    formula_badge_label: 'ƒx LIVE EXPENSE FORMULA',
    formula_explainer_text: 'Combines 100% live Cloud Monitoring token telemetry (aiplatform.googleapis.com/publisher/online_serving/token_count) and live Discovery Engine resource inventories (agents, data stores, connectors, licenses) with transparent, customizable pricing coefficients:',
    formula_line_1: '1. Live Model Token Spend (Cloud Monitoring):',
    formula_line_2: '2. Variable Session & Turn Spend:',
    formula_line_3: '3. Infrastructure & Seat Spend:',
    formula_line_4: '4. Productivity Value Saved:',
    cfg_in_price: 'Ref Input Token Price ($ / 1M)',
    cfg_out_price: 'Ref Output Token Price ($ / 1M)',
    cfg_in_tokens: 'Avg Input Tokens / Turn',
    cfg_out_tokens: 'Avg Output Tokens / Turn',
    cfg_turns_session: 'Avg Turns / Session',
    cfg_run_fee: 'Agent Run Fee ($ / turn)',
    cfg_conn_cost: 'Active Connector ($ / mo)',
    cfg_lic_cost: 'Assigned License ($ / mo)',
    cfg_sess_enabled: 'Sessions / Enabled Agent',
    cfg_sess_private: 'Sessions / Private Agent',
    cfg_min_saved: 'Minutes Saved / Session',
    cfg_hourly_rate: 'Hourly Rate ($ / hr)',
    save_config_btn: 'Apply Formula & Recalculate Live Report',
    header_app_label: 'Gemini Enterprise App',
    header_formula_btn: 'ƒx Understand Expense',
    header_refresh_btn: '↻ Refresh Live API',
    header_loading_btn: '↻ Loading Live API...',
    tab_overview_title: 'Executive & Operations Overview',
    tab_overview_badge: 'Live Telemetry',
    tab_adoption_title: 'Telemetry & Adoption (Admin)',
    tab_adoption_badge: '6 Dimensions',
    kpi_agents_label: 'Registered Agents (Live API)',
    kpi_datastores_label: 'Connected Data Stores',
    kpi_tokens_label: 'Agent Platform Token Volume (30d)',
    kpi_runtime_label: 'Vertex Reasoning & Cloud Run',
    kpi_spend_label: 'Formula-Inferred Spend & Value',
    narrative_title: 'Executive Summary & Environment Recommendations',
    narrative_sub: 'On-demand synthesis of your top 5 executive insights and actionable architecture, connector & token optimization recommendations',
    narrative_generate_btn: '✨ Generate On-Demand Report (gemini-3.8-flash)',
    narrative_synthesizing_btn: '✨ Synthesizing with gemini-3.8-flash...',
    tts_read_btn: 'Read Me the Report',
    tts_pause_btn: 'Pause Reading',
    tts_resume_btn: 'Resume Reading',
    tts_stop_btn: '⏹ Stop',
    tts_mode_conv: '💬 Short Conversational (~30s)',
    tts_mode_full: '📄 Full Report (~90s)',
    tts_script_badge_conv: '💬 CONVERSATIONAL BRIEFING SCRIPT',
    tts_script_badge_full: '📄 FULL EXECUTIVE REPORT SCRIPT',
    tts_ready_status: 'Conversational Audio Briefing Ready — gemini-3.8-flash-tts (~30s)',
    tts_voice_label: 'Voice Model',
    tts_speed_label: 'Speed',
    narrative_col_a_title: 'Executive Summary — 5 Most Important Insights',
    narrative_col_a_sub: 'Generated from live Discovery Engine, Vertex AI & Cloud Monitoring metrics',
    narrative_col_b_title: 'Recommendations for Your Environment',
    narrative_col_b_sub: 'Prioritized engineering & FinOps actions tailored to',
    workstreams_title: 'What Gemini Enterprise Is Used For (Workstreams)',
    workstreams_sub: 'Inferred dynamically from registered agent descriptions, types & activity',
    deliverables_title: 'Deliverables Produced by Agent Portfolio',
    deliverables_sub: 'Grouped by output modality across Low-Code, ADK, Skill, Workflow & A2A agents',
    legend_pct_sessions: '% of sessions',
    legend_pct_spend: '% of variable spend',
    sort_spend: 'Sort: % of spend',
    sort_sessions: 'Sort: % of sessions',
    billing_title: 'Agent Platform Model Billing & Token Consumption',
    billing_sub: 'Live 30-day token telemetry from aiplatform.googleapis.com/publisher/online_serving/token_count & model_invocation_count attributed per Model, per Agent & per Project/Engine',
    billing_tab_model: 'Per Model',
    billing_tab_agent: 'Per Agent',
    billing_tab_project: 'Per Project & App',
    billing_search_placeholder: 'Search model, agent, or engine...',
    tb_total_tokens_label: 'Total Live Tokens (30d)',
    tb_input_tokens_label: 'Input Tokens (Prompt/Context)',
    tb_output_tokens_label: 'Output Tokens (Completion)',
    tb_invocations_label: 'Live Model Invocations',
    tb_spend_label: 'Live Model Token Spend',
    tb_bars_title: 'LIVE TOKEN DISTRIBUTION BY GEMINI MODEL (INPUT VS. OUTPUT TOKENS)',
    legend_input_tokens: 'Input Tokens',
    legend_output_tokens: 'Output Tokens',
    th_model_id: 'Model ID (PublisherModel)',
    th_model_tier: 'Model Tier',
    th_location: 'Location',
    th_invocations_30d: 'Invocations (30d)',
    th_input_tokens: 'Input Tokens',
    th_output_tokens: 'Output Tokens',
    th_total_tokens: 'Total Tokens ↓',
    th_pct_share: '% Share',
    th_linked_agents: 'Linked GE Agents',
    th_rate_1m: 'Rate ($/1M In / Out)',
    th_token_spend: 'Token Spend ($)',
    th_agent_name: 'Agent Display Name',
    th_app_engine: 'App / Engine',
    th_architecture: 'Architecture',
    th_underlying_model: 'Underlying Model',
    th_state: 'State',
    th_sessions_30d: 'Sessions (30d)',
    th_total_agent_spend: 'Total Agent Spend ($)',
    th_gcp_project: 'GCP Project ID',
    th_ge_app_engine: 'Gemini Enterprise App / Engine',
    th_reg_agents: 'Registered Agents',
    th_primary_models: 'Primary Models Used',
    th_pct_token_share: '% Token Share',
    th_total_app_spend: 'Total App Spend ($)',
    lineage_title: 'Interactive Data Store, Agent & Reasoning Engine Lineage Graph',
    lineage_sub: 'Complete 4-tier topology linking all Connected Data Stores → Gemini Enterprise Apps → Registered Agents → Vertex AI Reasoning Engines',
    lineage_search_placeholder: 'Search agents or stores...',
    lineage_fit_width: 'Fit Width',
    lineage_fit_all: 'Fit All',
    tier_1_label: '1. Connected Data Stores & MCP',
    tier_2_label: '2. Gemini Enterprise Apps',
    tier_3_label: '3. Registered Agents',
    tier_4_label: '4. Vertex AI Reasoning Engines',
    inspector_eyebrow: 'NODE INSPECTOR',
    inspector_type_label: 'Resource Type & Model',
    inspector_telemetry_label: 'Live Telemetry',
    inspector_path_label: 'Resource Path',
    inspector_edges_label: 'Connected Lineage Edges',
    datastores_title: 'Connected Data Stores, Indexing Capacity & 80% Alert Monitor',
    datastores_sub: 'Live from Discovery Engine :getAggregatedDataSize, dataStores.billingEstimation, serviceruntime quotas & dataConnector',
    filter_all: 'All',
    filter_active: 'Active',
    filter_indexed: 'Indexed (>0 B)',
    filter_alerts: '≥80% Alert',
    filter_mcp: 'Custom MCP',
    filter_errors: 'Errors',
    ds_search_placeholder: 'Filter data stores by name or type...',
    idx_alerts_banner_title: 'Reaching 80% Indexing Capacity — Active Data Store & Connector Alerts',
    idx_card_1_label: 'Project Indexed Data vs. Soft Budget',
    idx_card_2_label: 'Included License Tier (AgentSpace Free)',
    idx_card_3_label: 'DocumentsPerProject Quota (Discovery Engine)',
    idx_card_4_label: 'DataStoresPerProject & Engines Quota',
    idx_cfg_badge: '🔔 INDEXING CAPACITY ALERT RULES',
    idx_cfg_threshold_label: 'Alert Threshold (%)',
    idx_cfg_ds_cap_label: 'Per-Connector Soft Cap (MiB)',
    idx_cfg_proj_cap_label: 'Project Budget Cap (MiB)',
    idx_apply_btn: 'Apply Thresholds',
    idx_sync_gcp_btn: '🔔 Sync GCP Cloud Monitoring Alert (≥80%)',
    th_ds_name: 'Name',
    th_ds_type: 'Type',
    th_ds_mode: 'Ingestion Mode',
    th_ds_size: 'Indexed Size ↓',
    th_ds_capacity: 'Capacity Bar & Available GAP',
    th_ds_alert: 'Alert Status',
    th_ds_status: 'Connector Status',
    th_ds_sync: 'Last Sync / Update',
    th_ds_update: 'Last update',
    th_ds_created: 'Date created',
    th_ds_engine: 'Connected App / Engine',
    agents_title: 'Registered Agents Inventory',
    agents_sub: 'Full paginated inventory from engines/{engine}/assistants/default_assistant/agents with model & token attribution',
    filter_google_made: 'Google-made',
    filter_our_agents: 'Our agents',
    state_all: 'All States',
    state_enabled: 'Enabled',
    state_private: 'Private',
    state_disabled: 'Disabled',
    state_errors: 'Validation Errors',
    ag_search_placeholder: 'Filter by display name, model, ID, or type...',
    th_ag_display_name: 'Display name',
    th_ag_id: 'Agent ID',
    th_ag_type: 'Agent type',
    th_ag_model: 'Model',
    th_ag_state: 'Agent state',
    th_ag_tokens: 'Tokens (30d)',
    th_ag_updated: 'Last updated ↓',
    th_ag_spend: 'Est. Spend',
    frictions_title: 'Live API Connector & Agent Frictions',
    frictions_sub: 'Detected directly from dataConnector.errors, validationErrors & userLicenses',
    licenses_title: 'Licensed Principals (default_user_store)',
    licenses_sub: 'Live from Discovery Engine userLicenses API (masked by default)',
    reveal_identities_btn: 'Reveal Identities',
    mask_identities_btn: 'Mask Identities',
    th_lic_principal: 'Principal',
    th_lic_state: 'State',
    th_lic_tier: 'License Tier',
    th_lic_login: 'Last Login',
    /* Adoption & Telemetry (6 Dimensions) */
    adopt_eyebrow_badge: 'ADMIN TELEMETRY & ADOPTION',
    adopt_hero_title: 'Adoption Telemetry, License Utilization & Prompt Intelligence',
    adopt_hero_sub: 'Real-time answers across the 6 Admin Dimensions covering active users, top applications, top agents, dormant seats, ecosystem capabilities, and prompt intent.',
    adopt_window_label: 'Window (X days):',
    adopt_day_1: 'Today (1d)',
    adopt_custom_days_placeholder: 'X days',
    adopt_apply_btn: 'Apply',
    adopt_kpi_today_label: 'Active Users Today (24h)',
    adopt_kpi_seat_rate_label: 'License Adoption Rate',
    adopt_kpi_apps_label: 'Active Apps / Total',
    adopt_kpi_agents_label: 'Agents Used',
    adopt_kpi_work_label: 'Work-Related Prompts',
    dim_1_badge: 'Dimension 1',
    dim_1_tag: 'Live Identities + Sessions',
    dim_1_title_prefix: 'Which users are using Gemini Enterprise today, how much, and over the last',
    dim_1_title_suffix: 'days?',
    dim_1_sub_prefix: 'Per-user breakdown of logins, conversational sessions, queries/turns today and within the',
    dim_1_sub_suffix: 'day window, plus daily activity curve.',
    dim_1_chart_title: 'Daily Activity Curve (Sessions & Queries)',
    th_q1_user: 'User / Principal',
    th_q1_status: 'Status Today',
    th_q1_today: 'Queries Today',
    th_sessions_word: 'Sessions',
    th_turns_word: 'Turns',
    th_q1_agents: 'Top Agents',
    th_q1_apps: 'Apps Used',
    th_q1_last: 'Last Activity',
    dim_2_badge: 'Dimension 2',
    dim_2_tag: 'Discovery Engine Apps',
    dim_2_title: 'Which applications are most used, and by which users?',
    dim_2_sub: 'Ranking of applications (Engines) by query/turn volume, active sessions, linked agents, and operating users.',
    th_q2_app: 'Application (Engine)',
    th_q2_agents: 'Agents',
    th_q2_users: 'Active Users',
    dim_3_badge: 'Dimension 3',
    dim_3_tag: 'Assistants, ADK & A2A Agents',
    dim_3_title: 'Which agents are most used, and by which users?',
    dim_3_sub: 'Ranking of registered agents and assistants by invocations/turns, session share, host application, and assigned users.',
    th_q3_agent: 'Agent',
    th_q3_type: 'Type / Origin',
    th_q3_app: 'Application',
    dim_4_badge: 'Dimension 4',
    dim_4_tag: 'License Optimization',
    dim_4_title: 'Who has not been using Gemini Enterprise?',
    dim_4_sub: 'Audit of assigned seats with no recent activity or never logged in, plus monthly license reclamation savings.',
    th_q4_lic_state: 'License State',
    th_q4_inactive: 'Days Inactive',
    th_q4_reason: 'Cohort / Diagnosis',
    th_q4_savings: 'Est. Savings / Mo',
    th_q4_action: 'Recommended Action',
    dim_5_badge: 'Dimension 5',
    dim_5_tag: 'Google Cloud AI Ecosystem',
    dim_5_title: 'What other license capabilities are users utilizing?',
    dim_5_sub: 'Live telemetry of complementary capabilities in the project: Gemini Code Assist, Google Antigravity / ADK Agent Runtime, Speech Synthesis, and Connected Search.',
    dim_6_badge: 'Dimension 6',
    dim_6_tag: 'Semantic Classification & DLP Guard',
    dim_6_title: 'What types of prompts are users submitting? Are they using the application for work or other purposes?',
    dim_6_sub: 'Real-time analysis of queries/prompts executed in Gemini Enterprise sessions, classifying work vs. non-work intent and functional business taxonomy (with automatic PII protection).',
    dim_6_chart_intent: 'Distribution: Work Purposes vs. Other Purposes',
    dim_6_chart_taxonomy: 'Prompt Taxonomy by Business Category',
    dim_6_table_title: 'Sample of Real Recorded Session Prompts',
    th_q6_time: 'Date / Time',
    th_q6_prompt: 'User Prompt / Query',
    th_q6_intent: 'Classification',
    th_q6_category: 'Category',
    th_q6_turns: 'Session Turns',
    /* Conceptual Architecture View (in Burger Menu) */
    arch_eyebrow_badge: 'CONCEPTUAL ARCHITECTURE',
    arch_pill_serverless: 'Serverless & Zero-Hardcoding',
    arch_pill_native: 'Google Cloud Native',
    arch_hero_title: 'Solution Conceptual Architecture — Gemini Enterprise Smart Reports',
    arch_hero_sub: 'End-to-end conceptual view of how the solution collects live telemetry, correlates lineage and spend, enforces privacy, and synthesizes executive briefings with natural voice.',
    arch_back_btn: '← Back to Dashboard',
    arch_l1_badge: 'Layer 1 · Experience Channels',
    arch_l1_title: 'Users & Gemini Ecosystem',
    arch_l1_n1_name: 'Conversational Applications',
    arch_l1_n1_desc: 'Enterprise search & business assistants',
    arch_l1_n2_name: 'Specialized Agents',
    arch_l1_n2_desc: 'Autonomous, multi-agent & workflow agents',
    arch_l1_n3_name: 'Productivity Tools',
    arch_l1_n3_desc: 'IDE code assistance & developer environments',
    arch_conn_1: 'Usage Events & Queries',
    arch_l2_badge: 'Layer 2 · Signal Sources',
    arch_l2_title: 'Native Google Cloud APIs',
    arch_l2_n1_name: 'Engines, Agents & Sessions Catalog',
    arch_l2_n1_desc: 'Inventory of applications, conversations, turns & connectors',
    arch_l2_n2_name: 'License & Identity Management',
    arch_l2_n2_desc: 'Seat assignments, activation state & last login',
    arch_l2_n3_name: 'Model Observability & Consumption',
    arch_l2_n3_desc: 'Input/output token metrics, latency & audit traces',
    arch_conn_2: 'Real-Time Discovery',
    arch_l3_badge: 'Layer 3 · Serverless Analytical Core',
    arch_l3_title: 'Correlation & Governance Engine',
    arch_l3_n1_name: 'Topological Lineage Discovery',
    arch_l3_n1_desc: 'Automated mapping across data stores, engines, agents & runtimes',
    arch_l3_n2_name: 'Intent Classifier & Privacy Guard',
    arch_l3_n2_desc: 'Dynamic identity masking & work vs. non-work classification',
    arch_l3_n3_name: 'Transparent Cost & ROI Engine',
    arch_l3_n3_desc: 'Auditable calculation of licenses, connectors & model inference',
    arch_conn_3: 'Structured Context',
    arch_l4_badge: 'Layer 4 · AI Synthesis',
    arch_l4_title: 'Next-Gen Gemini Models',
    arch_l4_n1_name: 'Executive Summary Generation',
    arch_l4_n1_desc: 'On-demand synthesis of top insights & actionable recommendations',
    arch_l4_n2_name: 'Expressive Voice Narration',
    arch_l4_n2_desc: 'Natural spoken briefing of the executive report with neural voices',
    arch_conn_4: 'Interactive Visualization',
    arch_l5_badge: 'Layer 5 · Presentation',
    arch_l5_title: 'Smart Reports Executive Portal',
    arch_l5_n1_name: 'Executive & Lineage Dashboard',
    arch_l5_n1_desc: 'Financial KPIs, model consumption & interactive end-to-end graph',
    arch_l5_n2_name: 'Telemetry & Adoption Center (6 Dimensions)',
    arch_l5_n2_desc: 'Visibility into active users, dormant seats, apps, agents & prompts',
    arch_p1_title: '1. Zero Hardcoded Data (100% Live)',
    arch_p1_desc: 'The application relies on zero static files or manual staging tables: it queries Google Cloud control and observability APIs in real time.',
    arch_p2_title: '2. Privacy & Governance by Design',
    arch_p2_desc: 'User identities and prompt contents are masked by default, allowing authorized Administrators to toggle audited visibility on demand.',
    arch_p3_title: '3. Lightweight Serverless Deployment',
    arch_p3_desc: 'Packaged as a self-contained Cloud Run container that scales automatically to zero and uses native workload identity without storing keys.',
    arch_p4_title: '4. Financial & Operational Transparency',
    arch_p4_desc: 'Every estimated dollar and operational recommendation links transparently to license utilization, active connectors, and live token volume.',
    nav_outliers: '⚡ Outliers & Top 5% Sessions',
    outliers_eyebrow: 'Outliers',
    outliers_autonomous_title: 'Complex, autonomous work',
    outliers_autonomous_sub: 'Sessions scoring highest on task complexity, time saved, how long Gemini worked on its own, and the expertise required.',
    outliers_reveal_ids_btn: 'Reveal IDs',
    outliers_mask_ids_btn: 'Mask IDs',
    outliers_expensive_title: 'Most expensive sessions',
    outliers_expensive_sub: 'Outliers · the top 5% by usage value',
    outliers_open_modal_btn: '⤢ Open Full View',
    outliers_sessions_first_heading: 'Sessions, most expensive first',
    outliers_models_popover_title: 'Models used, by share of tokens',
  },
  es: {
    app_title: 'Gemini Enterprise Smart Reports',
    drawer_title: 'Configuración de Smart Reports',
    drawer_subtitle: 'Proyecto GCP, Idioma (i18n), Modo Visual, Arquitectura y Fórmula de Costos',
    drawer_appearance_arch_title: 'Apariencia, Idioma y Arquitectura de la Solución',
    cfg_language_label: 'Idioma / Language (i18n)',
    cfg_theme_label: 'Modo Visual / Theme',
    theme_light_btn: '☀️ Claro',
    theme_dark_btn: '🌙 Oscuro',
    drawer_arch_card_title: '🏗️ Arquitectura de la Solución (Conceptual)',
    drawer_arch_card_desc: 'Diagrama conceptual de 5 capas de extremo a extremo de Gemini Enterprise Smart Reports',
    drawer_arch_open_btn: 'Ver Arquitectura →',
    drawer_project_section_title: 'Proyecto GCP y Caché de API',
    cfg_project_label: 'ID de Proyecto GCP (Regenera el reporte al cambiar)',
    cfg_cache_ttl_label: 'TTL de Caché de Instantánea API (segundos)',
    drawer_quick_nav_title: 'Navegación Rápida',
    nav_kpis: '📊 Resumen y KPIs',
    nav_narrative: '✨ Resumen Ejecutivo y Voz',
    nav_charts: '📈 Flujos de Trabajo y Entregables',
    nav_billing: '🪙 Facturación de Tokens (Modelo/Agente)',
    nav_lineage: '🕸️ Grafo de Linaje de Agentes',
    nav_datastores: '🗄️ Almacenes de Datos Conectados',
    nav_agents: '🤖 Agentes Registrados',
    nav_frictions: '⚠️ Fricciones API y Usuarios',
    nav_adoption: '👥 Telemetría y Adopción (6 Dimensiones)',
    nav_architecture: '🏗️ Arquitectura de la Solución',
    drawer_formula_title: 'ƒx Fórmula de Gasto en Vivo (Understand Expense)',
    formula_badge_label: 'ƒx FÓRMULA DE GASTO EN VIVO',
    formula_explainer_text: 'Combina telemetría 100% en vivo de tokens en Cloud Monitoring (aiplatform.googleapis.com/publisher/online_serving/token_count) e inventarios de Discovery Engine (agentes, almacenes, conectores, licencias) con coeficientes transparentes:',
    formula_line_1: '1. Gasto en Tokens de Modelos en Vivo (Cloud Monitoring):',
    formula_line_2: '2. Gasto Variable por Sesión y Turno:',
    formula_line_3: '3. Gasto de Infraestructura y Licencias:',
    formula_line_4: '4. Valor de Productividad Ahorrado:',
    cfg_in_price: 'Precio Ref. Tokens Entrada ($ / 1M)',
    cfg_out_price: 'Precio Ref. Tokens Salida ($ / 1M)',
    cfg_in_tokens: 'Prom. Tokens Entrada / Turno',
    cfg_out_tokens: 'Prom. Tokens Salida / Turno',
    cfg_turns_session: 'Prom. Turnos / Sesión',
    cfg_run_fee: 'Tarifa Ejecución Agente ($ / turno)',
    cfg_conn_cost: 'Conector Activo ($ / mes)',
    cfg_lic_cost: 'Licencia Asignada ($ / mes)',
    cfg_sess_enabled: 'Sesiones / Agente Habilitado',
    cfg_sess_private: 'Sesiones / Agente Privado',
    cfg_min_saved: 'Minutos Ahorrados / Sesión',
    cfg_hourly_rate: 'Tarifa Horaria ($ / hr)',
    save_config_btn: 'Aplicar Fórmula y Recalcular Reporte en Vivo',
    header_app_label: 'Aplicación Gemini Enterprise',
    header_formula_btn: 'ƒx Entender Costos',
    header_refresh_btn: '↻ Actualizar API en Vivo',
    header_loading_btn: '↻ Cargando API en Vivo...',
    tab_overview_title: 'Resumen Ejecutivo y Operaciones',
    tab_overview_badge: 'Telemetría en Vivo',
    tab_adoption_title: 'Telemetría y Adopción (Admin)',
    tab_adoption_badge: '6 Dimensiones',
    kpi_agents_label: 'Agentes Registrados (API en Vivo)',
    kpi_datastores_label: 'Almacenes de Datos Conectados',
    kpi_tokens_label: 'Volumen de Tokens Agent Platform (30d)',
    kpi_runtime_label: 'Vertex Reasoning y Cloud Run',
    kpi_spend_label: 'Gasto Inferido y Valor Generado',
    narrative_title: 'Resumen Ejecutivo y Recomendaciones para tu Entorno',
    narrative_sub: 'Síntesis bajo demanda de los 5 hallazgos ejecutivos más importantes y recomendaciones accionables de arquitectura, conectores y tokens',
    narrative_generate_btn: '✨ Generar Reporte Bajo Demanda (gemini-3.8-flash)',
    narrative_synthesizing_btn: '✨ Sintetizando con gemini-3.8-flash...',
    tts_read_btn: 'Léeme el Reporte',
    tts_pause_btn: 'Pausar Lectura',
    tts_resume_btn: 'Reanudar Lectura',
    tts_stop_btn: '⏹ Detener',
    tts_mode_conv: '💬 Breve Conversacional (~30s)',
    tts_mode_full: '📄 Reporte Completo (~90s)',
    tts_script_badge_conv: '💬 GUION BREVE CONVERSACIONAL',
    tts_script_badge_full: '📄 GUION DEL REPORTE COMPLETO',
    tts_ready_status: 'Audio Conversacional Listo — gemini-3.8-flash-tts (~30s)',
    tts_voice_label: 'Modelo de Voz',
    tts_speed_label: 'Velocidad',
    narrative_col_a_title: 'Resumen Ejecutivo — 5 Hallazgos Más Importantes',
    narrative_col_a_sub: 'Generado a partir de métricas en vivo de Discovery Engine, Vertex AI y Cloud Monitoring',
    narrative_col_b_title: 'Recomendaciones para tu Entorno',
    narrative_col_b_sub: 'Acciones priorizadas de ingeniería y FinOps adaptadas a',
    workstreams_title: 'Para Qué se Usa Gemini Enterprise (Flujos de Trabajo)',
    workstreams_sub: 'Inferido dinámicamente desde descripciones, tipos y actividad de agentes registrados',
    deliverables_title: 'Entregables Producidos por el Portafolio de Agentes',
    deliverables_sub: 'Agrupado por modalidad de salida entre agentes Low-Code, ADK, Skill, Workflow y A2A',
    legend_pct_sessions: '% de sesiones',
    legend_pct_spend: '% de gasto variable',
    sort_spend: 'Ordenar: % de gasto',
    sort_sessions: 'Ordenar: % de sesiones',
    billing_title: 'Facturación de Modelos y Consumo de Tokens en Agent Platform',
    billing_sub: 'Telemetría en vivo de 30 días desde aiplatform.googleapis.com/publisher/online_serving/token_count atribuida por Modelo, por Agente y por Proyecto/App',
    billing_tab_model: 'Por Modelo',
    billing_tab_agent: 'Por Agente',
    billing_tab_project: 'Por Proyecto y App',
    billing_search_placeholder: 'Buscar modelo, agente o motor...',
    tb_total_tokens_label: 'Tokens Totales en Vivo (30d)',
    tb_input_tokens_label: 'Tokens de Entrada (Prompt/Contexto)',
    tb_output_tokens_label: 'Tokens de Salida (Respuesta)',
    tb_invocations_label: 'Invocaciones de Modelos en Vivo',
    tb_spend_label: 'Gasto en Tokens de Modelos',
    tb_bars_title: 'DISTRIBUCIÓN DE TOKENS EN VIVO POR MODELO GEMINI (ENTRADA VS. SALIDA)',
    legend_input_tokens: 'Tokens de Entrada',
    legend_output_tokens: 'Tokens de Salida',
    th_model_id: 'ID de Modelo (PublisherModel)',
    th_model_tier: 'Nivel de Modelo',
    th_location: 'Región',
    th_invocations_30d: 'Invocaciones (30d)',
    th_input_tokens: 'Tokens Entrada',
    th_output_tokens: 'Tokens Salida',
    th_total_tokens: 'Tokens Totales ↓',
    th_pct_share: '% Participación',
    th_linked_agents: 'Agentes GE Vinculados',
    th_rate_1m: 'Tarifa ($/1M Ent / Sal)',
    th_token_spend: 'Gasto Tokens ($)',
    th_agent_name: 'Nombre del Agente',
    th_app_engine: 'App / Motor',
    th_architecture: 'Arquitectura',
    th_underlying_model: 'Modelo Subyacente',
    th_state: 'Estado',
    th_sessions_30d: 'Sesiones (30d)',
    th_total_agent_spend: 'Gasto Total Agente ($)',
    th_gcp_project: 'ID de Proyecto GCP',
    th_ge_app_engine: 'Aplicación / Motor Gemini Enterprise',
    th_reg_agents: 'Agentes Registrados',
    th_primary_models: 'Modelos Principales',
    th_pct_token_share: '% Tokens',
    th_total_app_spend: 'Gasto Total App ($)',
    lineage_title: 'Grafo Interactivo de Linaje: Almacenes de Datos, Agentes y Reasoning Engines',
    lineage_sub: 'Topología completa de 4 niveles vinculando Almacenes de Datos → Apps Gemini Enterprise → Agentes Registrados → Vertex AI Reasoning Engines',
    lineage_search_placeholder: 'Buscar agentes o almacenes...',
    lineage_fit_width: 'Ajustar Ancho',
    lineage_fit_all: 'Ver Todo',
    tier_1_label: '1. Almacenes de Datos y MCP',
    tier_2_label: '2. Apps Gemini Enterprise',
    tier_3_label: '3. Agentes Registrados',
    tier_4_label: '4. Vertex AI Reasoning Engines',
    inspector_eyebrow: 'INSPECTOR DE NODO',
    inspector_type_label: 'Tipo de Recurso y Modelo',
    inspector_telemetry_label: 'Telemetría en Vivo',
    inspector_path_label: 'Ruta del Recurso',
    inspector_edges_label: 'Conexiones de Linaje',
    datastores_title: 'Almacenes de Datos Conectados, Capacidad de Indexación y Alertas (≥80%)',
    datastores_sub: 'En vivo desde Discovery Engine :getAggregatedDataSize, dataStores.billingEstimation, cuotas serviceruntime y dataConnector',
    filter_all: 'Todos',
    filter_active: 'Activos',
    filter_indexed: 'Indexados (>0 B)',
    filter_alerts: 'Alerta ≥80%',
    filter_mcp: 'MCP Personalizado',
    filter_errors: 'Errores',
    ds_search_placeholder: 'Filtrar almacenes por nombre o tipo...',
    idx_alerts_banner_title: 'Alcanzando 80% de Capacidad de Indexación — Alertas Activas de Almacenes y Conectores',
    idx_card_1_label: 'Datos Indexados del Proyecto vs. Tope Configurado',
    idx_card_2_label: 'Cuota Incluida de Licencia (AgentSpace Free)',
    idx_card_3_label: 'Cuota DocumentsPerProject (Discovery Engine)',
    idx_card_4_label: 'Cuota DataStoresPerProject y Engines',
    idx_cfg_badge: '🔔 REGLAS DE ALERTA DE CAPACIDAD DE INDEXACIÓN',
    idx_cfg_threshold_label: 'Umbral de Alerta (%)',
    idx_cfg_ds_cap_label: 'Tope por Conector (MiB)',
    idx_cfg_proj_cap_label: 'Presupuesto del Proyecto (MiB)',
    idx_apply_btn: 'Aplicar Umbrales',
    idx_sync_gcp_btn: '🔔 Sincronizar Alerta en GCP Cloud Monitoring (≥80%)',
    th_ds_name: 'Nombre',
    th_ds_type: 'Tipo',
    th_ds_mode: 'Modo de Ingesta',
    th_ds_size: 'Tamaño Indexado ↓',
    th_ds_capacity: 'Barra de Capacidad y GAP Disponible',
    th_ds_alert: 'Estado de Alerta',
    th_ds_status: 'Estado Conector',
    th_ds_sync: 'Última Sincronización / Act.',
    th_ds_update: 'Última actualización',
    th_ds_created: 'Fecha de creación',
    th_ds_engine: 'App / Motor Conectado',
    agents_title: 'Inventario de Agentes Registrados',
    agents_sub: 'Inventario completo paginado desde engines/{engine}/assistants/default_assistant/agents con atribución de modelo y tokens',
    filter_google_made: 'Creados por Google',
    filter_our_agents: 'Nuestros agentes',
    state_all: 'Todos los Estados',
    state_enabled: 'Habilitados',
    state_private: 'Privados',
    state_disabled: 'Deshabilitados',
    state_errors: 'Errores de Validación',
    ag_search_placeholder: 'Filtrar por nombre, modelo, ID o tipo...',
    th_ag_display_name: 'Nombre para mostrar',
    th_ag_id: 'ID de Agente',
    th_ag_type: 'Tipo de agente',
    th_ag_model: 'Modelo',
    th_ag_state: 'Estado del agente',
    th_ag_tokens: 'Tokens (30d)',
    th_ag_updated: 'Última actualización ↓',
    th_ag_spend: 'Gasto Est.',
    frictions_title: 'Fricciones en Vivo de Conectores y Agentes',
    frictions_sub: 'Detectado directamente desde dataConnector.errors, validationErrors y userLicenses',
    licenses_title: 'Usuarios con Licencia (default_user_store)',
    licenses_sub: 'En vivo desde la API userLicenses de Discovery Engine (enmascarado por defecto)',
    reveal_identities_btn: 'Mostrar Identidades',
    mask_identities_btn: 'Ocultar Identidades',
    th_lic_principal: 'Usuario / Principal',
    th_lic_state: 'Estado',
    th_lic_tier: 'Nivel de Licencia',
    th_lic_login: 'Último Acceso',
    /* Adoption & Telemetry (6 Dimensions) */
    adopt_eyebrow_badge: 'TELEMETRÍA Y ADOPCIÓN (ADMIN)',
    adopt_hero_title: 'Telemetría de Adopción, Uso de Licencias e Inteligencia de Prompts',
    adopt_hero_sub: 'Respuestas en tiempo real a las 6 Dimensiones clave del Administrador sobre usuarios activos, aplicaciones, agentes, asientos inactivos, ecosistema e intención de prompts.',
    adopt_window_label: 'Ventana (X días):',
    adopt_day_1: 'Hoy (1d)',
    adopt_custom_days_placeholder: 'X días',
    adopt_apply_btn: 'Aplicar',
    adopt_kpi_today_label: 'Usuarios Activos Hoy (24h)',
    adopt_kpi_seat_rate_label: 'Tasa de Adopción de Licencias',
    adopt_kpi_apps_label: 'Apps Activas / Total',
    adopt_kpi_agents_label: 'Agentes Utilizados',
    adopt_kpi_work_label: 'Prompts de Trabajo (Laboral)',
    dim_1_badge: 'Dimensión 1',
    dim_1_tag: 'Identidades + Sesiones en Vivo',
    dim_1_title_prefix: '¿Qué usuarios están usando Gemini Enterprise hoy? ¿Cuánto? ¿Y en los últimos',
    dim_1_title_suffix: 'días?',
    dim_1_sub_prefix: 'Desglose por usuario de inicios de sesión, sesiones conversacionales, consultas/turnos hoy y en la ventana de',
    dim_1_sub_suffix: 'días, más curva diaria de actividad.',
    dim_1_chart_title: 'Curva de Actividad Diaria (Sesiones y Consultas)',
    th_q1_user: 'Usuario / Principal',
    th_q1_status: 'Estado Hoy',
    th_q1_today: 'Consultas Hoy',
    th_sessions_word: 'Sesiones',
    th_turns_word: 'Turnos',
    th_q1_agents: 'Agentes Principales',
    th_q1_apps: 'Apps Utilizadas',
    th_q1_last: 'Última Actividad',
    dim_2_badge: 'Dimensión 2',
    dim_2_tag: 'Motores Discovery Engine',
    dim_2_title: '¿Cuáles son las aplicaciones más utilizadas? ¿Por cuáles usuarios?',
    dim_2_sub: 'Ranking de aplicaciones (Engines) por volumen de consultas/turnos, sesiones activas, agentes vinculados y usuarios que las operan.',
    th_q2_app: 'Aplicación (Engine)',
    th_q2_agents: 'Agentes',
    th_q2_users: 'Usuarios Activos',
    dim_3_badge: 'Dimensión 3',
    dim_3_tag: 'Assistants, ADK y A2A Agents',
    dim_3_title: '¿Cuáles son los agentes más utilizados? ¿Por cuáles usuarios?',
    dim_3_sub: 'Ranking de agentes registrados y asistentes por invocaciones/turnos, participación de sesiones, aplicación contenedora y usuarios asignados.',
    th_q3_agent: 'Agente',
    th_q3_type: 'Tipo / Origen',
    th_q3_app: 'Aplicación',
    dim_4_badge: 'Dimensión 4',
    dim_4_tag: 'Optimización de Licencias',
    dim_4_title: '¿Quiénes no han estado utilizando Gemini Enterprise?',
    dim_4_sub: 'Auditoría de asientos asignados sin actividad reciente o nunca utilizados, e impacto mensual de optimización/reasignación.',
    th_q4_lic_state: 'Estado de Licencia',
    th_q4_inactive: 'Días Inactivo',
    th_q4_reason: 'Motivo / Diagnóstico',
    th_q4_savings: 'Ahorro Est. / Mes',
    th_q4_action: 'Acción Recomendada',
    dim_5_badge: 'Dimensión 5',
    dim_5_tag: 'Ecosistema Google Cloud AI',
    dim_5_title: '¿Qué otras capacidades de la licencia están utilizando los usuarios?',
    dim_5_sub: 'Telemetría en vivo de capacidades complementarias en el proyecto: Gemini Code Assist, Google Antigravity / ADK Agent Runtime, Síntesis de Voz y Búsqueda Conectada.',
    dim_6_badge: 'Dimensión 6',
    dim_6_tag: 'Clasificación Semántica y DLP Guard',
    dim_6_title: '¿Qué tipo de prompts están realizando los usuarios? ¿Están usando la aplicación para fines de trabajo u otros fines?',
    dim_6_sub: 'Análisis en tiempo real de las consultas/prompts ejecutados en sesiones de Gemini Enterprise, clasificando intención laboral vs. no laboral y categoría funcional (con protección PII automática).',
    dim_6_chart_intent: 'Distribución: Fines de Trabajo vs. Otros Fines',
    dim_6_chart_taxonomy: 'Taxonomía de Prompts por Categoría de Negocio',
    dim_6_table_title: 'Muestra de Prompts Reales Registrados en Sesiones',
    th_q6_time: 'Fecha / Hora',
    th_q6_prompt: 'Prompt / Consulta del Usuario',
    th_q6_intent: 'Clasificación',
    th_q6_category: 'Categoría',
    th_q6_turns: 'Turnos de Sesión',
    /* Conceptual Architecture View */
    arch_eyebrow_badge: 'ARQUITECTURA CONCEPTUAL',
    arch_pill_serverless: 'Serverless y Cero Datos Cableados',
    arch_pill_native: 'Nativo de Google Cloud',
    arch_hero_title: 'Arquitectura Conceptual de la Solución — Gemini Enterprise Smart Reports',
    arch_hero_sub: 'Vista conceptual de extremo a extremo de cómo la solución recolecta telemetría en vivo, correlaciona linaje y costos, aplica privacidad y genera reportes ejecutivos con voz natural.',
    arch_back_btn: '← Volver al Dashboard',
    arch_l1_badge: 'Capa 1 · Canales de Experiencia',
    arch_l1_title: 'Usuarios y Ecosistema Gemini',
    arch_l1_n1_name: 'Aplicaciones Conversacionales',
    arch_l1_n1_desc: 'Búsqueda empresarial y asistentes de negocio',
    arch_l1_n2_name: 'Agentes Especializados',
    arch_l1_n2_desc: 'Agentes autónomos, multi-agente y flujos de trabajo',
    arch_l1_n3_name: 'Herramientas de Productividad',
    arch_l1_n3_desc: 'Asistencia de código en IDE y entornos de desarrollo',
    arch_conn_1: 'Eventos de Uso y Consultas',
    arch_l2_badge: 'Capa 2 · Fuentes de Señales',
    arch_l2_title: 'APIs Nativas de Google Cloud',
    arch_l2_n1_name: 'Catálogo de Motores, Agentes y Sesiones',
    arch_l2_n1_desc: 'Inventario de aplicaciones, conversaciones, turnos y conectores',
    arch_l2_n2_name: 'Gestión de Licencias e Identidades',
    arch_l2_n2_desc: 'Asignación de asientos, estado de activación y último acceso',
    arch_l2_n3_name: 'Observabilidad y Consumo de Modelos',
    arch_l2_n3_desc: 'Métricas de tokens de entrada/salida, latencia y trazas de auditoría',
    arch_conn_2: 'Descubrimiento en Tiempo Real',
    arch_l3_badge: 'Capa 3 · Núcleo Analítico Serverless',
    arch_l3_title: 'Motor de Correlación y Gobernanza',
    arch_l3_n1_name: 'Descubrimiento de Linaje Topológico',
    arch_l3_n1_desc: 'Mapeo automático entre orígenes de datos, almacenes, motores y agentes',
    arch_l3_n2_name: 'Clasificador de Intención y Filtro de Privacidad',
    arch_l3_n2_desc: 'Enmascaramiento dinámico de identidades y clasificación laboral vs. general',
    arch_l3_n3_name: 'Motor Transparente de Costos y ROI',
    arch_l3_n3_desc: 'Cálculo auditable de licencias, indexación e inferencia de modelos',
    arch_conn_3: 'Contexto Estructurado',
    arch_l4_badge: 'Capa 4 · Síntesis con IA',
    arch_l4_title: 'Modelos Gemini de Última Generación',
    arch_l4_n1_name: 'Generación de Resumen Ejecutivo',
    arch_l4_n1_desc: 'Síntesis bajo demanda de hallazgos críticos y recomendaciones accionables',
    arch_l4_n2_name: 'Narración de Voz Expresiva',
    arch_l4_n2_desc: 'Lectura hablada natural del reporte ejecutivo con voces expresivas',
    arch_conn_4: 'Visualización Interactiva',
    arch_l5_badge: 'Capa 5 · Presentación',
    arch_l5_title: 'Portal Ejecutivo Smart Reports',
    arch_l5_n1_name: 'Dashboard Ejecutivo y Linaje',
    arch_l5_n1_desc: 'KPIs financieros, consumo por modelo y grafo interactivo de extremo a extremo',
    arch_l5_n2_name: 'Centro de Telemetría y Adopción (6 Dimensiones)',
    arch_l5_n2_desc: 'Visibilidad de usuarios activos, asientos inactivos, apps, agentes y prompts',
    arch_p1_title: '1. Cero Datos Cableados (100% Live)',
    arch_p1_desc: 'La aplicación no depende de bases de datos intermedias manuales ni datos estáticos: interroga directamente los servicios de control y observabilidad de la nube en tiempo real.',
    arch_p2_title: '2. Privacidad y Gobernanza por Diseño',
    arch_p2_desc: 'Las identidades de los usuarios y el contenido de las consultas se presentan protegidos por defecto, permitiendo al Administrador alternar la vista auditada según sus permisos.',
    arch_p3_title: '3. Despliegue Ligero sin Servidores',
    arch_p3_desc: 'Empaquetado como un contenedor ligero auto-contenido que escala automáticamente a cero y utiliza la identidad nativa del entorno sin almacenar llaves ni secretos.',
    arch_p4_title: '4. Transparencia Financiera y Operativa',
    arch_p4_desc: 'Cada dólar estimado y cada recomendación operativa se vinculan de forma transparente con el uso de licencias, el volumen de datos indexados y el consumo de tokens.',
    nav_outliers: '⚡ Outliers y Top 5% de Sesiones',
    outliers_eyebrow: 'Outliers',
    outliers_autonomous_title: 'Trabajo complejo y autónomo',
    outliers_autonomous_sub: 'Sesiones con mayor puntaje en complejidad de tarea, tiempo ahorrado, duración autónoma de Gemini y experiencia requerida.',
    outliers_reveal_ids_btn: 'Revelar IDs',
    outliers_mask_ids_btn: 'Enmascarar IDs',
    outliers_expensive_title: 'Sesiones más costosas',
    outliers_expensive_sub: 'Outliers · el top 5% por valor de uso',
    outliers_open_modal_btn: '⤢ Abrir Vista Completa',
    outliers_sessions_first_heading: 'Sesiones, de mayor a menor costo',
    outliers_models_popover_title: 'Modelos utilizados, por proporción de tokens',
  },
};

function t(key) {
  const dict = I18N_CATALOG[state.lang] || I18N_CATALOG.en;
  return dict[key] || I18N_CATALOG.en[key] || key;
}

function isEs() {
  return state.lang === 'es';
}

function fmtNum(n, digits = undefined) {
  const locale = isEs() ? 'es-419' : 'en-US';
  if (digits !== undefined) {
    return Number(n || 0).toLocaleString(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }
  return Number(n || 0).toLocaleString(locale);
}

function fmtInt(n) {
  const locale = isEs() ? 'es-419' : 'en-US';
  return Math.round(Number(n || 0)).toLocaleString(locale);
}

function fmtUsd(n) {
  const locale = isEs() ? 'es-419' : 'en-US';
  return Number(n || 0).toLocaleString(locale, {
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

function applyTheme(themeMode) {
  const cleanTheme = themeMode === 'dark' ? 'dark' : 'light';
  state.theme = cleanTheme;
  localStorage.setItem('ge_smart_reports_theme', cleanTheme);
  document.documentElement.setAttribute('data-theme', cleanTheme);

  document.querySelectorAll('#themeSegmentedControl [data-theme-mode]').forEach((btn) => {
    const m = btn.getAttribute('data-theme-mode');
    btn.classList.toggle('active', m === cleanTheme);
  });

  if (state.adoptionData || (state.reportData && state.reportData.adoption_telemetry)) {
    renderAdoptionTelemetry();
  }
  if (state.lineageData) {
    renderLineageCanvas();
  }
}

async function applyTranslations(langCode, fetchLocalizedNarrative = false) {
  const cleanLang = langCode === 'es' ? 'es' : 'en';
  state.lang = cleanLang;
  localStorage.setItem('ge_smart_reports_lang', cleanLang);
  document.documentElement.setAttribute('lang', cleanLang);

  document.querySelectorAll('#langSegmentedControl [data-lang]').forEach((btn) => {
    const l = btn.getAttribute('data-lang');
    btn.classList.toggle('active', l === cleanLang);
  });

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val) el.setAttribute('placeholder', val);
  });

  if (state.reportData) {
    populateEngineSelector(state.reportData.engines || [], state.reportData.selected_engine_id);
    renderKpisAndFormulaBanner(state.reportData);
    renderNarrativeSection();
    renderModelBillingSection();
    renderWorkstreamsChart();
    renderDeliverablesChart();
    renderOutliersSection();
    renderDatastoresTable();
    renderAgentsTable();
    renderFrictionsAndUsers();
    renderAdoptionTelemetry();
  }
  if (state.lineageData) {
    renderLineageCanvas();
    if (state.lineageSelectedNodeId) {
      updateLineageInspector(state.lineageSelectedNodeId);
    }
  }
  updateTtsUiState(null, null, state.ttsPlaying, state.ttsPaused);

  if (fetchLocalizedNarrative) {
    try {
      const res = await fetch(
          `/api/narrative?engine_id=${encodeURIComponent(state.engineId)}&lang=${cleanLang}&use_llm=false`);
      const navData = await res.json();
      state.narrativeData = navData;
      renderNarrativeSection();
    } catch (e) {
      // Ignore narrative language refresh error
    }
  }
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
  if (btn) btn.textContent = t('header_loading_btn');

  try {
    const url = `/api/report?engine_id=${encodeURIComponent(
        state.engineId)}&days=${state.adoptionDays}&unmasked=${
        state.revealPii ? 'true' : 'false'}&refresh=${
        forceRefresh ? 'true' : 'false'}`;
    const res = await fetch(url);
    const data = await res.json();
    state.reportData = data;
    if (data.adoption_telemetry) {
      state.adoptionData = data.adoption_telemetry;
    }
    if (!state.narrativeData || forceRefresh) {
      state.narrativeData = data.narrative_report || null;
      if (state.lang === 'es') {
        fetch(`/api/narrative?engine_id=${encodeURIComponent(state.engineId)}&lang=es&use_llm=false`)
            .then((r) => r.json())
            .then((navEs) => {
              state.narrativeData = navEs;
              renderNarrativeSection();
            })
            .catch(() => {});
      }
    }

    populateEngineSelector(data.engines || [], data.selected_engine_id);
    syncProjectDropdownSelection(data.project_id);
    renderKpisAndFormulaBanner(data);
    renderNarrativeSection();
    renderModelBillingSection();
    renderWorkstreamsChart();
    renderDeliverablesChart();
    renderOutliersSection();
    renderDatastoresTable();
    renderAgentsTable();
    renderFrictionsAndUsers();
    renderAdoptionTelemetry();
    prefetchDefaultTtsAudio();
  } finally {
    if (btn) btn.textContent = t('header_refresh_btn');
  }
}

function populateEngineSelector(engines, selectedId) {
  const sel = document.getElementById('engineSelect');
  if (!sel) return;
  const totalAgents = engines.reduce((s, e) => s + (e.agents_count || 0), 0);
  const allLabel = isEs() ?
      `Todos los Motores (${engines.length} Apps • ${totalAgents} Agentes)` :
      `All Engines (${engines.length} Apps • ${totalAgents} Agents)`;
  const optionsHtml = [
    `<option value="ALL" ${selectedId === 'ALL' ? 'selected' : ''}>${allLabel}</option>`,
    ...engines.map(
        (e) => `<option value="${e.engine_id}" ${
            selectedId === e.engine_id ? 'selected' : ''}>${
            e.display_name} (${e.agents_count} ${isEs() ? 'Agentes' : 'Agents'} • ${
            e.data_stores_count} ${isEs() ? 'Almacenes' : 'Data Stores'})</option>`),
  ];
  sel.innerHTML = optionsHtml.join('');
}

function renderKpisAndFormulaBanner(data) {
  const k = data.kpis || {};
  const fb = data.formula_breakdown || {};
  const mb = (data.model_billing || {}).billing_info || {};

  document.getElementById('projectBadge').textContent =
      `${isEs() ? 'Proyecto' : 'Project'}: ${data.project_id}`;
  document.getElementById('headerMetaSub').textContent = isEs() ?
      `Discovery Engine y Cloud Monitoring en Vivo (${data.fetch_latency_ms} ms) • ${
          k.total_engines} Apps • ${k.total_agents} Agentes • ${
          fmtCompactTokens(k.live_tokens_30d)} Tokens en Vivo` :
      `Live Discovery Engine & Cloud Monitoring (${data.fetch_latency_ms} ms) • ${
          k.total_engines} Apps • ${k.total_agents} Agents • ${
          fmtCompactTokens(k.live_tokens_30d)} Live Tokens`;

  document.getElementById('kpiTotalAgents').textContent =
      `${fmtNum(k.total_agents)} ${isEs() ? 'Agentes' : 'Agents'}`;
  document.getElementById('kpiAgentsBreakdown').textContent = isEs() ?
      `${k.enabled_agents} Habilitados • ${k.private_agents} Privados • ${
          k.disabled_agents} Deshab.` :
      `${k.enabled_agents} Enabled • ${k.private_agents} Private • ${
          k.disabled_agents} Disabled`;

  document.getElementById('kpiTotalDatastores').textContent =
      `${fmtNum(k.total_datastores)} ${isEs() ? 'Almacenes' : 'Stores'}`;
  document.getElementById('kpiDatastoresBreakdown').textContent = isEs() ?
      `${k.active_connectors} Conectores Activos • ${
          k.failed_connectors} con Error` :
      `${k.active_connectors} Active Connectors • ${
          k.failed_connectors} Init Error`;

  document.getElementById('kpiLiveTokens').textContent =
      `${fmtCompactTokens(k.live_tokens_30d)} Tokens`;
  document.getElementById('kpiLiveTokensMeta').textContent = isEs() ?
      `${fmtCompactTokens(k.live_input_tokens_30d)} Ent • ${
          fmtCompactTokens(k.live_output_tokens_30d)} Sal • ${
          mb.active_models_count || 14} Modelos` :
      `${fmtCompactTokens(k.live_input_tokens_30d)} In • ${
          fmtCompactTokens(k.live_output_tokens_30d)} Out • ${
          mb.active_models_count || 14} Models`;

  document.getElementById('kpiRuntimeCount').textContent =
      `${k.vertex_reasoning_engines} RE / ${k.cloud_run_services} Run`;
  document.getElementById('kpiRuntimeMeta').textContent = isEs() ?
      `${k.vertex_reasoning_engines} Vertex Reasoning Engines • ${
          k.cloud_run_services} Servicios Cloud Run` :
      `${k.vertex_reasoning_engines} Vertex Reasoning Engines • ${
          k.cloud_run_services} Cloud Run Services`;

  document.getElementById('kpiTotalSpend').textContent =
      `$${fmtUsd(k.total_spend_usd)}`;
  document.getElementById('kpiRoiMeta').textContent = isEs() ?
      `${fmtNum(k.inferred_sessions_30d)} Sesiones • $${
          fmtNum(k.value_saved_usd)} Valor (${k.roi_multiple}x ROI)` :
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
function renderTtsScriptPreview() {
  const scriptText = getActiveTtsScript();
  const previewEl = document.getElementById('ttsScriptPreviewText');
  if (previewEl) {
    previewEl.textContent = scriptText ? `"${scriptText}"` : '';
  }
  const badgeEl = document.getElementById('ttsScriptBadge');
  if (badgeEl) {
    const wordCount = scriptText ? scriptText.trim().split(/\s+/).length : 0;
    if (state.ttsBriefingMode === 'DETAILED') {
      badgeEl.textContent = isEs() ?
          `Guion Completo Detallado (~${wordCount} palabras)` :
          `Full Detailed Briefing (~${wordCount} words)`;
    } else {
      badgeEl.textContent = isEs() ?
          `Resumen Conversacional (~${wordCount} palabras)` :
          `Conversational Executive Briefing (~${wordCount} words)`;
    }
  }
}

function renderNarrativeSection() {
  const nav = state.narrativeData ||
      (state.reportData && state.reportData.narrative_report);
  if (!nav) return;

  const recProj = document.getElementById('recProjectCode');
  if (recProj && state.reportData) {
    recProj.textContent = state.reportData.project_id;
  }

  renderTtsScriptPreview();

  const bulletsBox = document.getElementById('executiveBulletsList');
  if (bulletsBox) {
    const bullets = nav.executive_summary_bullets || [];
    bulletsBox.innerHTML = bullets
        .map(
            (b) => `
      <div class="exec-bullet-item">
        <div class="exec-bullet-top">
          <span class="exec-rank-badge">#${b.rank} • ${
                b.category || (isEs() ? 'Hallazgo Ejecutivo' : 'Executive Insight')}</span>
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
          const prioLabel = isEs() ?
              (prio === 'HIGH' ? 'PRIORIDAD ALTA' : (prio === 'MEDIUM' ? 'PRIORIDAD MEDIA' : 'PRIORIDAD BAJA')) :
              `${prio} PRIORITY`;
          return `
        <div class="env-rec-item priority-${prio}">
          <div class="env-rec-top">
            <span class="env-rec-cat">${r.category || (isEs() ? 'Recomendación' : 'Recommendation')}</span>
            <span class="status-pill ${pillClass}">${prioLabel}</span>
          </div>
          <div class="env-rec-title">${r.title}</div>
          <div class="env-rec-text">${r.recommendation}</div>
          <div class="env-rec-footer">
            <span><strong>${isEs() ? 'Objetivo' : 'Target'}:</strong> <code>${
              r.target_resources || 'Project Environment'}</code></span>
            <span class="impact-badge">${isEs() ? 'Impacto' : 'Impact'}: ${
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
  btn.disabled = true;
  btn.textContent = t('narrative_synthesizing_btn');

  try {
    const res = await fetch('/api/narrative', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        engine_id: state.engineId,
        use_llm: true,
        lang: state.lang,
      }),
    });
    const data = await res.json();
    state.narrativeData = data;
    renderNarrativeSection();
    prefetchDefaultTtsAudio();
    showToast(
        isEs() ?
            'Resumen Ejecutivo y Recomendaciones generados bajo demanda vía Vertex AI gemini-3.8-flash' :
            'Generated fresh on-demand Executive Summary & Recommendations via Vertex AI gemini-3.8-flash');
  } catch (e) {
    showToast(
        isEs() ?
            'Error al generar narrativa bajo demanda; mostrando línea base en vivo.' :
            'Error generating on-demand narrative; showing live baseline.');
  } finally {
    btn.disabled = false;
    btn.textContent = t('narrative_generate_btn');
  }
}

/* ==========================================================================
   3. TEXT-TO-SPEECH ("READ ME THE REPORT" — gemini-3.8-flash-tts) AUDIO PLAYER
   ========================================================================== */
function getActiveTtsScript() {
  const nav = state.narrativeData ||
      (state.reportData && state.reportData.narrative_report);
  if (!nav) return '';
  if (state.ttsBriefingMode === 'DETAILED') {
    if (nav.tts_script_detailed) return nav.tts_script_detailed;
  } else {
    if (nav.tts_script_conversational) return nav.tts_script_conversational;
    if (nav.tts_script) return nav.tts_script;
  }
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
    if (labelEl) labelEl.textContent = t('tts_pause_btn');
    playBtn?.classList.add('playing');
    if (headerBtn) {
      headerBtn.textContent = `⏸ ${t('tts_pause_btn')}`;
      headerBtn.classList.add('playing');
    }
  } else if (isPaused) {
    if (iconEl) iconEl.textContent = '▶';
    if (labelEl) labelEl.textContent = t('tts_resume_btn');
    playBtn?.classList.remove('playing');
    if (headerBtn) {
      headerBtn.textContent = `▶ ${t('tts_resume_btn')}`;
      headerBtn.classList.remove('playing');
    }
  } else {
    if (iconEl) iconEl.textContent = '🔊';
    if (labelEl) labelEl.textContent = t('tts_read_btn');
    playBtn?.classList.remove('playing');
    if (headerBtn) {
      headerBtn.textContent = `🔊 ${t('tts_read_btn')}`;
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
  updateTtsUiState(t('tts_ready_status'), 0, false, false);
}

async function toggleTtsPlayback() {
  const audioEl = document.getElementById('ttsAudioElement');
  const voice = document.getElementById('ttsVoiceSelect')?.value || 'Kore';
  const rate = Number(document.getElementById('ttsRateSelect')?.value || 1.0);

  if (state.ttsPlaying && !state.ttsPaused) {
    if (audioEl) {
      audioEl.pause();
    }
    updateTtsUiState(
        isEs() ? 'En pausa — Haz clic en Reanudar para seguir escuchando' : 'Paused — Click Resume to continue listening',
        null,
        false,
        true);
    return;
  }

  if (state.ttsPaused) {
    if (audioEl) {
      await audioEl.play();
    }
    updateTtsUiState(
        `gemini-3.8-flash-tts (${voice})...`,
        null,
        true,
        false);
    return;
  }

  const scriptText = getActiveTtsScript();
  if (!scriptText) {
    showToast(isEs() ? 'Los datos del reporte aún se están cargando.' : 'Report data is still loading.');
    return;
  }
  if (!audioEl) return;

  unlockAudioElement(audioEl);

  const sessionId = (state.ttsSessionId || 0) + 1;
  state.ttsSessionId = sessionId;
  state.ttsMode = 'CLOUD_AUDIO';

  const segments = splitTextIntoTtsSegments(scriptText, 340);
  if (!segments.length) return;

  updateTtsUiState(
      `gemini-3.8-flash-tts (${voice})...`,
      6,
      true,
      false);

  const segmentPromises = segments.map((seg) => fetchTtsSegment(seg, voice, rate));

  try {
    for (let idx = 0; idx < segments.length; idx++) {
      if (state.ttsSessionId !== sessionId) return;
      const segAudio = await segmentPromises[idx];
      if (state.ttsSessionId !== sessionId) return;

      if (idx === 0) {
        showToast(
            isEs() ?
                `Reproduciendo narración neural vía gemini-3.8-flash-tts (${voice})` :
                `Playing natural neural report audio via gemini-3.8-flash-tts (${voice})`);
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
                `gemini-3.8-flash-tts (${voice}) • ${isEs() ? 'Parte 1: Resumen Ejecutivo' : 'Part 1: Top 5 Executive Insights'}...` :
                `gemini-3.8-flash-tts (${voice}) • ${isEs() ? 'Parte 2: Recomendaciones' : 'Part 2: Environment Recommendations'}...`;
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
          `gemini-3.8-flash-tts • ${voice} (100%)`,
          100,
          false,
          false);
    }
  } catch (e) {
    if (state.ttsSessionId === sessionId) {
      updateTtsUiState(t('tts_ready_status'), 0, false, false);
      showToast(
          isEs() ?
              'Síntesis de voz interrumpida. Haz clic en Léeme el Reporte para reintentar.' :
              'Cloud Text-to-Speech synthesis interrupted. Click Read Me the Report to retry.');
    }
  }
}

/* ==========================================================================
   4. AGENT PLATFORM MODEL BILLING & TOKEN CONSUMPTION
   ========================================================================== */
function renderModelBillingSection() {
  if (!state.reportData || !state.reportData.model_billing) return;
  const mb = state.reportData.model_billing;
  const binfo = mb.billing_info || {};
  const byModel = mb.by_model || [];
  const byAgent = mb.by_agent || [];
  const byProj = mb.by_project_and_engine || [];

  const acctBadge = document.getElementById('billingAccountBadge');
  if (acctBadge) {
    acctBadge.textContent = `${binfo.billing_account_name || 'billingAccounts/linked'}`;
  }
  const stBadge = document.getElementById('billingStatusBadge');
  if (stBadge) {
    stBadge.textContent = binfo.billing_enabled ?
        (isEs() ? '● Facturación Activa' : '● Billing Active') :
        (isEs() ? 'Sin Facturación' : 'Billing Unlinked');
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
            <div class="bar-group-label-sub">${m.invocations_30d} ${isEs() ? 'llamadas' : 'calls'} • ${
              m.registered_agents_count} ${isEs() ? 'agentes GE' : 'GE agents'} • $${
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
        <td>${m.registered_agents_count} ${isEs() ? 'agentes' : 'agents'}</td>
        <td>$${m.input_rate_per_1m_usd} / $${m.output_rate_per_1m_usd}</td>
        <td><strong>$${fmtUsd(m.total_token_spend_usd)}</strong></td>
      </tr>
    `)
        .join('');
  }

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
        <td><strong>${isEs() ? 'TODOS LOS MOTORES DEL PROYECTO' : 'ALL PROJECT ENGINES'} (${byProj.length} Apps • Billing: ${
        binfo.billing_account_name})</strong></td>
        <td><strong>${state.reportData.kpis.total_agents} (${
        state.reportData.kpis.enabled_agents} ${isEs() ? 'Habilitados' : 'Enabled'})</strong></td>
        <td><code>${binfo.active_models_count} Publisher Models</code></td>
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
        <td>${p.agents_count} (${p.enabled_agents_count} ${isEs() ? 'Habilitados' : 'Enabled'})</td>
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
          <div class="bar-group-label-sub">${w.agents_count} ${isEs() ? 'agentes' : 'agents'} • ${
            w.sessions_count} ${isEs() ? 'sesiones' : 'sessions'}</div>
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
          <div class="bar-group-label-sub">${d.agents_count} ${isEs() ? 'agentes' : 'agents'} • ${
            d.sessions_count} ${isEs() ? 'sesiones' : 'sessions'}</div>
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
   5B. SESSION OUTLIERS: COMPLEX AUTONOMOUS WORK & MOST EXPENSIVE SESSIONS
   ========================================================================== */
function renderExpensiveSessionRowsHtml(items) {
  return (items || [])
      .map((s) => {
        const memberBadgeLabel = state.revealPii ?
            `👤 ${s.member_full || s.member_unmasked || s.member_masked}` :
            `🙈 ${isEs() ? 'Miembro' : 'Member'}`;
        const sessionBadgeLabel = state.revealPii ?
            `🔓 ${s.session_id}` :
            `🙈 ${isEs() ? 'ID de sesión' : 'Session id'}`;
        const modelBreakdown = s.models_breakdown || s.model_shares || [];
        const modelSharesJson = encodeURIComponent(
            JSON.stringify(modelBreakdown));
        const modelLabel = isEs() ?
            (s.model_label_es || s.model_label_en || 'gemini-3.8-flash') :
            (s.model_label_en || 'gemini-3.8-flash');
        const delivTitle = isEs() ?
            (s.deliverable_title_es || s.deliverable_title_en || s.title) :
            (s.deliverable_title_en || s.title);
        const sublineText = isEs() ?
            (s.subline_es || s.subline_en) :
            (s.subline_en || '');
        const billedUsd = s.billed_usd ?? s.cost_usd ?? 0;

        return `
      <div class="expensive-session-row">
        <div>
          <div class="expensive-session-meta">
            <button class="masked-pill-badge js-toggle-outlier-pii" type="button" title="${
            state.revealPii ? (s.member_full || s.member_unmasked) : 'Click to toggle Member & Session ID visibility'}">${
            memberBadgeLabel}</button>
            <span class="dot-sep">·</span>
            <span>${s.surface}</span>
            <span class="dot-sep">·</span>
            <span>${s.date_fmt || s.date_label}</span>
            <span class="dot-sep">·</span>
            <button class="model-share-trigger js-model-share-trigger" type="button" data-model-shares="${
            modelSharesJson}">${modelLabel}</button>
            <span class="dot-sep">·</span>
            <button class="masked-pill-badge js-toggle-outlier-pii" type="button" title="${
            s.session_id}">${sessionBadgeLabel}</button>
          </div>
          <div class="expensive-session-title">${delivTitle}</div>
          <div class="expensive-session-sub">${sublineText}</div>
        </div>
        <div class="expensive-session-cost">$${fmtUsd(billedUsd)}</div>
      </div>
    `;
      })
      .join('');
}

function showModelSharePopover(triggerEl) {
  const pop = document.getElementById('modelSharePopover');
  const rowsBox = document.getElementById('modelSharePopoverRows');
  if (!pop || !rowsBox || !triggerEl) return;

  let shares = [];
  try {
    const raw = triggerEl.getAttribute('data-model-shares') || '[]';
    shares = JSON.parse(decodeURIComponent(raw));
  } catch (e) {
    shares = [];
  }
  if (!shares.length) return;

  rowsBox.innerHTML = shares
      .map((m) => {
        const eff = isEs() ?
            (m.effort_es || m.effort_en || m.effort || 'alto esfuerzo') :
            (m.effort_en || m.effort || 'high effort');
        return `
      <div class="model-share-popover-row">
        <span class="model-share-popover-name">${m.model_id}</span>
        <span class="model-share-popover-val">${m.share_pct}% · ${eff}</span>
      </div>
    `;
      })
      .join('');

  pop.classList.remove('hidden');
  pop.setAttribute('aria-hidden', 'false');

  const rect = triggerEl.getBoundingClientRect();
  const popW = pop.offsetWidth || 300;
  const popH = pop.offsetHeight || 110;
  let left = rect.left + rect.width / 2 - popW / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));
  let top = rect.top - popH - 8;
  if (top < 12) {
    top = rect.bottom + 8;
  }
  pop.style.left = `${Math.round(left)}px`;
  pop.style.top = `${Math.round(top)}px`;
}

function hideModelSharePopover() {
  const pop = document.getElementById('modelSharePopover');
  if (!pop) return;
  pop.classList.add('hidden');
  pop.setAttribute('aria-hidden', 'true');
}

function bindOutliersInteractiveEvents(rootEl) {
  if (!rootEl) return;
  rootEl.querySelectorAll('.js-model-share-trigger').forEach((btn) => {
    btn.addEventListener('mouseenter', () => showModelSharePopover(btn));
    btn.addEventListener('focus', () => showModelSharePopover(btn));
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      showModelSharePopover(btn);
    });
  });

  rootEl.querySelectorAll('.js-toggle-outlier-pii').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      state.revealPii = !state.revealPii;
      renderOutliersSection();
      renderFrictionsAndUsers();
      renderAdoptionTelemetry();
      showToast(
          state.revealPii ?
              (isEs() ? 'IDs de sesión y miembros revelados (Vista Admin)' :
                        'Session IDs & Members revealed (Admin View)') :
              (isEs() ? 'IDs de sesión y miembros enmascarados' :
                        'Session IDs & Members masked'));
    });
  });
}

function renderOutliersSection() {
  if (!state.reportData) return;
  const outliers = state.reportData.outliers || {};
  const autoItems = Array.isArray(outliers.complex_autonomous_work) ?
      outliers.complex_autonomous_work :
      (outliers.complex_autonomous_work?.items || []);
  const expWork = outliers.most_expensive_sessions || {};
  const expSummary = expWork.summary || expWork || {};
  const expItems = expWork.sessions || expWork.items || [];

  // Update privacy toggle buttons (inline card + modal)
  ['outliersPrivacyBtnLeft', 'outliersPrivacyBtnModal'].forEach((btnId) => {
    const privBtn = document.getElementById(btnId);
    if (privBtn) {
      const icon = state.revealPii ? '🔓' : '🙈';
      const label = state.revealPii ?
          t('outliers_mask_ids_btn') :
          t('outliers_reveal_ids_btn');
      privBtn.innerHTML = `${icon} <span>${label}</span>`;
    }
  });

  // 1. Complex, autonomous work list
  const autoListBox = document.getElementById('outliersAutonomousList');
  if (autoListBox) {
    autoListBox.innerHTML = autoItems
        .map((item) => {
          const rankLabel = isEs() ?
              (item.rank_label_es || `#${item.rank} según el puntaje configurado`) :
              (item.rank_label_en || item.rank_label || `#${item.rank} by the configured score`);
          const sessionBadgeLabel = state.revealPii ?
              `🔓 ${item.session_id}` :
              `🙈 ${isEs() ? 'ID de sesión' : 'Session id'}`;
          const modelBreakdown = item.models_breakdown || item.model_shares || [];
          const modelSharesJson = encodeURIComponent(
              JSON.stringify(modelBreakdown));
          const modelLabel = isEs() ?
              (item.model_label_es || item.model_label_en || 'gemini-3.8-flash') :
              (item.model_label_en || 'gemini-3.8-flash');
          const titleText = isEs() ?
              (item.title_es || item.title_en || item.title) :
              (item.title_en || item.title);
          const summaryText = isEs() ?
              (item.summary_es || item.summary_en || item.narrative) :
              (item.summary_en || item.narrative);

          return `
        <div class="outlier-autonomous-item">
          <div class="outlier-meta-line">
            <span class="outlier-rank-tag">${rankLabel}</span>
            <span class="dot-sep">·</span>
            <span>${item.surface}</span>
            <span class="dot-sep">·</span>
            <span>${item.date_fmt || item.date_label || 'Sep 25'}</span>
            <span class="dot-sep">·</span>
            <button class="model-share-trigger js-model-share-trigger" type="button" data-model-shares="${
              modelSharesJson}">${modelLabel}</button>
            <span class="dot-sep">·</span>
            <button class="masked-pill-badge js-toggle-outlier-pii" type="button" title="${
              item.session_id}">${sessionBadgeLabel}</button>
          </div>
          <div class="outlier-session-title">${titleText}</div>
          <p class="outlier-session-narrative">${summaryText}</p>
        </div>
      `;
        })
        .join('');
    bindOutliersInteractiveEvents(autoListBox);
  }

  // 2. Most expensive sessions summary paragraph & list (inline + modal)
  const summaryHtml = isEs() ?
      (expSummary.narrative_html_es || expSummary.summary_es || expSummary.narrative_html_en || '') :
      (expSummary.narrative_html_en || expSummary.summary_en || '');
  const expSummaryBox = document.getElementById('outliersExpensiveNarrative');
  if (expSummaryBox) {
    expSummaryBox.innerHTML = summaryHtml;
  }
  const modalSummaryBox = document.getElementById('outliersExpensiveModalNarrative');
  if (modalSummaryBox) {
    modalSummaryBox.innerHTML = summaryHtml;
  }

  const rowsHtml = renderExpensiveSessionRowsHtml(expItems);

  const expInlineList = document.getElementById('outliersExpensiveInlineList');
  if (expInlineList) {
    expInlineList.innerHTML = rowsHtml;
    bindOutliersInteractiveEvents(expInlineList);
  }

  const expModalList = document.getElementById('outliersExpensiveModalList');
  if (expModalList) {
    expModalList.innerHTML = rowsHtml;
    bindOutliersInteractiveEvents(expModalList);
  }
}

/* ==========================================================================
   6. CONNECTED DATA STORES TABLE & INDEXING CAPACITY / 80% ALERT MONITOR
   ========================================================================== */
function renderIndexingCapacityPanel() {
  if (!state.reportData) return;
  const idx = state.reportData.indexing_capacity || {};
  const alerts = idx.alerts || [];

  // Header alert badge
  const alertBadgeEl = document.getElementById('indexingAlertCountBadge');
  if (alertBadgeEl) {
    const th = idx.alert_threshold_pct || 80;
    alertBadgeEl.textContent = isEs() ?
        `${alerts.length} Alertas Indexación (≥${th}%)` :
        `${alerts.length} Indexing Alerts (≥${th}%)`;
    alertBadgeEl.className = alerts.length > 0 ?
        'status-pill status-error' :
        'status-pill status-active';
  }

  // Populate config bar inputs
  const thInput = document.getElementById('idxThresholdPctInput');
  const dsCapInput = document.getElementById('idxDatastoreCapMibInput');
  const projCapInput = document.getElementById('idxProjectCapMibInput');
  if (thInput && idx.alert_threshold_pct !== undefined) {
    thInput.value = idx.alert_threshold_pct;
  }
  if (dsCapInput && idx.datastore_soft_cap_mib !== undefined) {
    dsCapInput.value = idx.datastore_soft_cap_mib;
  }
  if (projCapInput && idx.project_soft_cap_mib !== undefined) {
    projCapInput.value = idx.project_soft_cap_mib;
  }

  // Card 1: Project Indexed Data vs. Soft Budget
  const c1Pct = document.getElementById('idxCardProjectPctBadge');
  const c1Val = document.getElementById('idxCardProjectValue');
  const c1Bar = document.getElementById('idxCardProjectBar');
  const c1Gap = document.getElementById('idxCardProjectGap');
  const projPct = idx.project_soft_cap_utilization_pct || 0;
  if (c1Pct) c1Pct.textContent = `${fmtNum(projPct, 1)}%`;
  if (c1Val) {
    c1Val.textContent =
        `${idx.total_indexed_fmt || '1.41 GiB'} / ${idx.project_soft_cap_fmt || '2.00 GiB'}`;
  }
  if (c1Bar) {
    c1Bar.style.width = `${Math.min(projPct, 100)}%`;
  }
  if (c1Gap) {
    c1Gap.textContent = isEs() ?
        `GAP Disponible: ${idx.project_soft_cap_gap_fmt || '601 MiB'} libres antes del tope` :
        `Available GAP: ${idx.project_soft_cap_gap_fmt || '601 MiB'} remaining before budget cap`;
  }

  // Card 2: Included License Tier (AgentSpace Free)
  const c2Pct = document.getElementById('idxCardLicensePctBadge');
  const c2Val = document.getElementById('idxCardLicenseValue');
  const c2Bar = document.getElementById('idxCardLicenseBar');
  const c2Gap = document.getElementById('idxCardLicenseGap');
  const licPct = idx.agent_space_utilization_pct || 0.01;
  if (c2Pct) c2Pct.textContent = `${fmtNum(licPct, 2)}%`;
  if (c2Val) {
    c2Val.textContent =
        `${idx.agent_space_used_fmt || '273.11 MiB'} / ${idx.agent_space_total_fmt || '3.00 TiB'}`;
  }
  if (c2Bar) {
    c2Bar.style.width = `${Math.max(Math.min(licPct, 100), 2)}%`;
  }
  if (c2Gap) {
    c2Gap.textContent = isEs() ?
        `GAP Disponible: ${idx.agent_space_free_fmt || '3.00 TiB'} de cuota incluida` :
        `Available GAP: ${idx.agent_space_free_fmt || '3.00 TiB'} included license capacity`;
  }

  // Card 3: DocumentsPerProject Quota
  const c3Pct = document.getElementById('idxCardDocsPctBadge');
  const c3Val = document.getElementById('idxCardDocsValue');
  const c3Bar = document.getElementById('idxCardDocsBar');
  const c3Gap = document.getElementById('idxCardDocsGap');
  const docPct = idx.documents_quota_pct || 0;
  if (c3Pct) c3Pct.textContent = `${fmtNum(docPct, 2)}%`;
  if (c3Val) {
    c3Val.textContent =
        `${fmtInt(idx.documents_quota_used || 0)} / ${fmtInt(idx.documents_quota_limit || 1000000)}`;
  }
  if (c3Bar) {
    c3Bar.style.width = `${Math.max(Math.min(docPct, 100), 2)}%`;
  }
  if (c3Gap) {
    c3Gap.textContent = isEs() ?
        `GAP Disponible: ${fmtInt(idx.documents_quota_gap || 0)} documentos restantes` :
        `Available GAP: ${fmtInt(idx.documents_quota_gap || 0)} documents remaining`;
  }

  // Card 4: DataStoresPerProject & Engines Quota
  const c4Pct = document.getElementById('idxCardStoresPctBadge');
  const c4Val = document.getElementById('idxCardStoresValue');
  const c4Bar = document.getElementById('idxCardStoresBar');
  const c4Gap = document.getElementById('idxCardStoresGap');
  const dsPct = idx.datastores_quota_pct || 0;
  if (c4Pct) c4Pct.textContent = `${fmtNum(dsPct, 1)}%`;
  if (c4Val) {
    c4Val.textContent =
        `${idx.datastores_quota_used || 0} / ${idx.datastores_quota_limit || 200} Stores`;
  }
  if (c4Bar) {
    c4Bar.style.width = `${Math.max(Math.min(dsPct, 100), 2)}%`;
  }
  if (c4Gap) {
    c4Gap.textContent = isEs() ?
        `GAP Disponible: ${idx.datastores_quota_gap || 0} Data Stores • ${idx.engines_quota_gap || 0} Engines` :
        `Available GAP: ${idx.datastores_quota_gap || 0} Data Stores • ${idx.engines_quota_gap || 0} Engines`;
  }

  // Alert Banner (>= threshold%)
  const bannerEl = document.getElementById('indexingAlertsBanner');
  if (bannerEl) {
    if (!alerts.length) {
      bannerEl.classList.add('hidden');
      bannerEl.innerHTML = '';
    } else {
      bannerEl.classList.remove('hidden');
      const headerTxt = isEs() ?
          `🚨 Alertas Activas de Capacidad de Indexación (${alerts.length} superan el umbral del ${idx.alert_threshold_pct || 80}%)` :
          `🚨 Active Indexing Capacity Alerts (${alerts.length} reaching >= ${idx.alert_threshold_pct || 80}% indexing capacity)`;
      const itemsHtml = alerts
          .map((a) => {
            const isCrit = a.severity === 'CRITICAL';
            return `
          <div class="indexing-alert-item ${isCrit ? 'critical' : ''}">
            <div class="idx-alert-left">
              <div class="idx-alert-title">${isCrit ? '🛑' : '⚠️'} ${a.title}</div>
              <div class="idx-alert-msg">${a.message}</div>
              <div class="idx-alert-rec">💡 <strong>${isEs() ? 'Acción Recomendada' : 'Recommended Action'}:</strong> ${a.recommendation}</div>
            </div>
            <div class="idx-alert-badges">
              <span class="status-pill ${isCrit ? 'status-error' : 'status-disabled'}">${a.utilization_pct}% ${isEs() ? 'Usado' : 'Used'}</span>
              <span class="idx-gap-pill">${isEs() ? 'GAP Libre' : 'Available GAP'}: <strong>${a.available_gap_fmt}</strong></span>
            </div>
          </div>
        `;
          })
          .join('');
      bannerEl.innerHTML = `
        <div class="indexing-alerts-header">
          <span>${headerTxt}</span>
          <span class="gcp-api-badge">Discovery Engine BillingEstimation + Cloud Monitoring</span>
        </div>
        <div class="indexing-alerts-list">${itemsHtml}</div>
      `;
    }
  }
}

async function applyOrSyncIndexingAlerts(createGcpPolicy = false) {
  const thVal = Number(document.getElementById('idxThresholdPctInput')?.value || 80);
  const dsCapVal = Number(document.getElementById('idxDatastoreCapMibInput')?.value || 500);
  const projCapVal = Number(document.getElementById('idxProjectCapMibInput')?.value || 2048);
  try {
    const res = await fetch('/api/indexing/alerts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        engine_id: state.engineId,
        alert_threshold_pct: thVal,
        datastore_soft_cap_mib: dsCapVal,
        project_soft_cap_mib: projCapVal,
        create_gcp_policy: createGcpPolicy,
      }),
    });
    const data = await res.json();
    if (data.indexing_capacity && state.reportData) {
      state.reportData.indexing_capacity = data.indexing_capacity;
    }
    await loadReport(false);
    const polMsg = data.gcp_monitoring_policy ?
        ` • GCP Policy: ${data.gcp_monitoring_policy.status}` :
        '';
    showToast(
        isEs() ?
            `Umbral de alerta actualizado al ${thVal}% (${(data.indexing_capacity?.alerts || []).length} alertas activas)${polMsg}` :
            `Updated indexing alert threshold to ${thVal}% (${(data.indexing_capacity?.alerts || []).length} active alerts)${polMsg}`);
  } catch (e) {
    showToast(
        isEs() ? 'Error al sincronizar política de alertas.' : 'Failed to sync alert policy.');
  }
}

function renderDatastoresTable() {
  const tbody = document.getElementById('datastoresTableBody');
  if (!tbody || !state.reportData) return;

  renderIndexingCapacityPanel();

  const allDs = state.reportData.datastores || [];
  const idxMap = {};
  const idxCap = state.reportData.indexing_capacity || {};
  (idxCap.per_datastore || []).forEach((item) => {
    idxMap[item.datastore_id] = item;
  });

  document.getElementById('dsCountAll').textContent = allDs.length;
  document.getElementById('dsCountActive').textContent =
      allDs.filter((d) => d.status_code === 'ACTIVE').length;
  const elIdxCount = document.getElementById('dsCountIndexed');
  if (elIdxCount) {
    elIdxCount.textContent =
        allDs.filter((d) => (d.total_indexed_bytes || 0) > 0).length;
  }
  const elAlertCount = document.getElementById('dsCountAlert');
  if (elAlertCount) {
    elAlertCount.textContent = allDs
        .filter((d) => {
          const m = idxMap[d.datastore_id];
          return m && (m.alert_state === 'CRITICAL' || m.alert_state === 'WARNING');
        })
        .length;
  }
  document.getElementById('dsCountMcp').textContent =
      allDs.filter((d) => d.icon_category === 'mcp').length;
  document.getElementById('dsCountError').textContent =
      allDs.filter((d) => d.status_code === 'ERROR').length;

  const q = state.dsSearch.trim().toLowerCase();
  const filtered = allDs
      .filter((d) => {
        const m = idxMap[d.datastore_id] || {};
        if (state.dsFilter === 'ACTIVE' && d.status_code !== 'ACTIVE') return false;
        if (state.dsFilter === 'INDEXED' && !(d.total_indexed_bytes > 0)) return false;
        if (state.dsFilter === 'ALERT' &&
            !(m.alert_state === 'CRITICAL' || m.alert_state === 'WARNING')) {
          return false;
        }
        if (state.dsFilter === 'MCP' && d.icon_category !== 'mcp') return false;
        if (state.dsFilter === 'ERROR' && d.status_code !== 'ERROR') return false;
        if (q) {
          const hay =
              `${d.display_name} ${d.datastore_id} ${d.type} ${d.engine_names} ${d.ingestion_mode || ''}`
                  .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const bBytes = Number(b.total_indexed_bytes || 0);
        const aBytes = Number(a.total_indexed_bytes || 0);
        if (bBytes !== aBytes) return bBytes - aBytes;
        const bErr = b.status_code === 'ERROR' ? 1 : 0;
        const aErr = a.status_code === 'ERROR' ? 1 : 0;
        return bErr - aErr;
      });

  tbody.innerHTML = filtered
      .map((d) => {
        const m = idxMap[d.datastore_id] || {
          total_size_fmt: d.total_size_fmt || '0 B',
          soft_cap_fmt: idxCap.datastore_soft_cap_fmt || '500.00 MiB',
          available_gap_fmt: idxCap.datastore_soft_cap_fmt || '500.00 MiB',
          utilization_pct: 0,
          alert_state: 'ZERO_INDEX',
          alert_label: d.ingestion_mode || '0 B Indexed',
        };

        let statusHtml = '';
        if (d.status_code === 'ACTIVE') {
          statusHtml = `<span class="status-pill status-active">● ${isEs() ? 'Activo' : 'Active'}</span>`;
        } else if (d.status_code === 'ERROR') {
          statusHtml =
              `<span class="status-pill status-error" title="${
                  (d.errors || []).join(' ')}">▲ ${isEs() ? 'Error de Inicialización' : 'Initialization Failed'}</span>`;
        } else {
          statusHtml = `<span class="muted">-</span>`;
        }

        let alertPill = '';
        if (m.alert_state === 'CRITICAL') {
          alertPill = `<span class="status-pill status-error">🛑 ${m.utilization_pct}% (&ge;90%)</span>`;
        } else if (m.alert_state === 'WARNING') {
          alertPill = `<span class="status-pill status-disabled">⚠️ ${m.utilization_pct}% (&ge;${idxCap.alert_threshold_pct || 80}%)</span>`;
        } else if (m.alert_state === 'HEALTHY') {
          alertPill = `<span class="status-pill status-active">✓ ${isEs() ? 'Saludable' : 'Healthy'} (${m.utilization_pct}%)</span>`;
        } else {
          alertPill = `<span class="muted" style="font-size:11px;">${m.alert_label || 'Federated / 0 B'}</span>`;
        }

        const barColor = m.alert_state === 'CRITICAL' ?
            '#EA4335' :
            (m.alert_state === 'WARNING' ? '#FBBC04' : '#4285F4');
        const barWidth = Math.min(m.utilization_pct || 0, 100);

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
        <td>
          <span class="status-pill status-private" style="font-size: 11px;">${
            d.ingestion_mode || 'Indexed Storage'}</span>
        </td>
        <td class="num-col">
          <strong>${m.total_size_fmt || '0 B'}</strong>
          <div class="muted" style="font-size: 10px;">/ ${m.soft_cap_fmt}</div>
        </td>
        <td>
          <div class="ds-cap-cell">
            <div class="ds-cap-bar-track">
              <div class="ds-cap-bar-fill" style="width: ${barWidth}%; background: ${barColor};"></div>
            </div>
            <div class="ds-cap-meta">
              <span><strong>${m.utilization_pct || 0}%</strong> ${isEs() ? 'usado' : 'used'}</span>
              <span>GAP: <strong>${m.available_gap_fmt}</strong></span>
            </div>
          </div>
        </td>
        <td>${alertPill}</td>
        <td>${statusHtml}</td>
        <td>${d.last_sync_fmt || d.update_time_fmt}</td>
        <td>${d.engine_names}</td>
      </tr>
    `;
      })
      .join('');
}

/* ==========================================================================
   7. REGISTERED AGENTS TABLE
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
          statePill = `<span class="status-pill status-active">✓ ${isEs() ? 'Habilitado' : 'Enabled'}</span>`;
        } else if (a.state === 'PRIVATE') {
          statePill =
              `<span class="status-pill status-private">🔒 ${isEs() ? 'Privado' : 'Private'}</span>`;
        } else if (a.state === 'DISABLED') {
          statePill =
              `<span class="status-pill status-disabled">⊖ ${isEs() ? 'Deshabilitado' : 'Disabled'}</span>`;
        }

        const errBadge = (a.validation_errors && a.validation_errors.length) ?
            `<span class="status-pill status-error" style="margin-left: 6px;">${
                a.validation_errors.length} ${isEs() ? 'Error Nodo' : 'Node Error'}</span>` :
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
   8. INTERACTIVE REACTFLOW DATA & AGENT LINEAGE GRAPH
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

  if (subtypeFilter !== 'ALL') {
    agNodes = agNodes.filter((n) => {
      if (subtypeFilter === 'Managed') {
        return n.subtype === 'Managed' || n.subtype === 'Core Assistant';
      }
      return n.subtype === subtypeFilter;
    });
  }

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

  const totalAgentPages = Math.max(Math.ceil(agNodes.length / state.lineagePageSize), 1);
  if (state.lineagePage > totalAgentPages) state.lineagePage = 1;
  const pagerBox = document.getElementById('lineagePagerBox');
  const pageLabel = document.getElementById('lineagePageLabel');
  if (pagerBox) {
    if (mode === 'PAGINATED') {
      pagerBox.classList.remove('hidden');
      if (pageLabel) {
        pageLabel.textContent =
            `${state.lineagePage} / ${totalAgentPages} (${agNodes.length})`;
      }
    } else {
      pagerBox.classList.add('hidden');
    }
  }

  if (mode === 'PAGINATED') {
    const startIdx = (state.lineagePage - 1) * state.lineagePageSize;
    agNodes = agNodes.slice(startIdx, startIdx + state.lineagePageSize);
  }

  const positionedNodes = [];

  if (mode === 'MATRIX') {
    const dsCols = dsNodes.length > 10 ? 2 : 1;
    dsNodes.forEach((n, idx) => {
      const col = idx % dsCols;
      const row = Math.floor(idx / dsCols);
      positionedNodes.push({
        ...n,
        position: {x: 24 + col * 280, y: 28 + row * 106},
      });
    });

    engNodes.forEach((n, idx) => {
      positionedNodes.push({
        ...n,
        position: {x: 640, y: 28 + idx * 106},
      });
    });

    const agCols = agNodes.length > 24 ? 4 : (agNodes.length > 8 ? 2 : 1);
    agNodes.forEach((n, idx) => {
      const col = idx % agCols;
      const row = Math.floor(idx / agCols);
      positionedNodes.push({
        ...n,
        position: {x: 1000 + col * 280, y: 28 + row * 104},
      });
    });

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

  const totalAgCount = allNodes.filter((n) => n.layer === 'GE_AGENT').length;
  const matOpt = document.querySelector('#lineageLayoutSelect option[value="MATRIX"]');
  if (matOpt) {
    matOpt.textContent = isEs() ?
        `Vista: Todos los ${totalAgCount} Agentes (Matriz Multi-Columna)` :
        `View: All ${totalAgCount} Agents (Multi-Column Matrix)`;
  }
  const allSubOpt = document.querySelector('#lineageSubtypeSelect option[value="ALL"]');
  if (allSubOpt) {
    allSubOpt.textContent = isEs() ?
        `Todos los Tipos (${totalAgCount})` :
        `All Agent Types (${totalAgCount})`;
  }

  document.getElementById('tierCountDs').textContent = dsNodes.length;
  document.getElementById('tierCountEng').textContent = engNodes.length;
  document.getElementById('tierCountAg').textContent = agNodes.length;
  document.getElementById('tierCountRe').textContent = reNodes.length;

  const badgeEl = document.getElementById('lineageTotalCountBadge');
  if (badgeEl) {
    badgeEl.textContent = isEs() ?
        `Mostrando ${agNodes.length} Agentes • ${positionedNodes.length} Nodos • ${visibleEdges.length} Conexiones` :
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
  if (data.nodes && data.nodes.length > 0) {
    const firstAg = data.nodes.find((n) => n.layer === 'GE_AGENT');
    state.lineageSelectedNodeId = (firstAg || data.nodes[0]).id;
  } else {
    state.lineageSelectedNodeId = null;
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
        GOOGLE_PALETTE.red :
        (isSelected ? GOOGLE_PALETTE.green : GOOGLE_PALETTE.blue);
    const shouldAnimate = state.lineageAnimated && e.animated &&
        (isSelected || !isDenseMatrix || e.status === 'WARNING');
    const animClass = shouldAnimate ? 'rf-edge-animated' : '';
    const hiClass = isSelected ?
        'edge-highlighted' :
        (isDenseMatrix ? 'edge-dimmed' : '');
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
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
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#4285F4" />
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
      `${frictions.length} ${isEs() ? 'Incidencias API' : 'Live API Issues'}`;

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
      <div class="friction-remedy"><strong>${isEs() ? 'Remediación' : 'Remediation'}:</strong> ${
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
   10. BURGER MENU CONFIG, SELECTABLE PROJECTS DROPDOWN & EXPENSE FORMULA
   ========================================================================== */
async function loadProjects() {
  const sel = document.getElementById('cfgProjectId');
  if (!sel) return;
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    const projects = data.projects || [];
    state.selectableProjects = projects;
    const currentId = data.current_project_id ||
        (state.reportData && state.reportData.project_id) ||
        'genai-demos-avr-2024';

    sel.innerHTML = projects
        .map((p) => {
          const badgeText = p.badge ? ` [${p.badge}]` : '';
          const label = p.display_name && p.display_name !== p.project_id ?
              `${p.project_id} — ${p.display_name}${badgeText}` :
              `${p.project_id}${badgeText}`;
          return `<option value="${p.project_id}" ${
              p.project_id === currentId ? 'selected' : ''}>${label}</option>`;
        })
        .join('');
  } catch (e) {
    // Fallback option if /api/projects fails
  }
}

function syncProjectDropdownSelection(projectId) {
  const sel = document.getElementById('cfgProjectId');
  if (!sel || !projectId) return;
  const exists = Array.from(sel.options).some((opt) => opt.value === projectId);
  if (!exists) {
    const opt = document.createElement('option');
    opt.value = projectId;
    opt.textContent = projectId;
    sel.prepend(opt);
  }
  sel.value = projectId;
}

async function onProjectDropdownChange(newProjectId) {
  if (!newProjectId) return;
  showToast(
      isEs() ?
          `Cambiando al proyecto ${newProjectId} — regenerando reporte en vivo...` :
          `Switching project to ${newProjectId} — regenerating live report...`);
  await fetch('/api/config', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({project_id: newProjectId}),
  });
  state.engineId = 'ALL';
  state.narrativeData = null;
  await Promise.all([
    loadReport(true),
    loadLineage(),
  ]);
  showToast(
      isEs() ?
          `Reporte en vivo regenerado para el proyecto ${newProjectId}` :
          `Live report regenerated for project ${newProjectId}`);
}

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
  await loadProjects();
  if (cfg.project_id) {
    syncProjectDropdownSelection(cfg.project_id);
  }
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
  showToast(
      isEs() ?
          'Fórmula de gasto y configuración aplicadas a los datos en vivo' :
          'Expense formula & configuration applied to live API data');
}

/* ==========================================================================
   10B. PRIMARY VIEW TABS & ADMIN TELEMETRY / ADOPTION (6 DIMENSIONS)
   ========================================================================== */
function switchMainTab(tabName) {
  const validTab = ['OVERVIEW', 'ADOPTION', 'ARCHITECTURE'].includes(tabName) ?
      tabName :
      'OVERVIEW';
  if (validTab !== 'ARCHITECTURE') {
    state.lastNonArchTab = validTab;
  }
  state.activeMainTab = validTab;

  document.querySelectorAll('#primaryViewTabs [data-main-tab]').forEach((btn) => {
    const tName = btn.getAttribute('data-main-tab');
    const isActive = tName === validTab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.getElementById('mainTabOverview')
      ?.classList.toggle('hidden', validTab !== 'OVERVIEW');
  document.getElementById('mainTabAdoption')
      ?.classList.toggle('hidden', validTab !== 'ADOPTION');
  document.getElementById('mainTabArchitecture')
      ?.classList.toggle('hidden', validTab !== 'ARCHITECTURE');

  try {
    const url = new URL(window.location.href);
    if (validTab === 'OVERVIEW') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', validTab);
    }
    window.history.replaceState({}, '', url.toString());
  } catch (e) {
    // Ignore history state errors
  }

  if (validTab === 'ADOPTION') {
    renderAdoptionTelemetry();
  } else if (validTab === 'OVERVIEW' && state.lineageData) {
    fitLineageViewToContainer(false);
    renderLineageCanvas();
  }
}

async function fetchAdoptionWindow(days = state.adoptionDays, forceRefresh = false) {
  const cleanDays = Math.min(Math.max(Number(days) || 30, 1), 365);
  state.adoptionDays = cleanDays;

  document.querySelectorAll('.adoption-day-btn').forEach((btn) => {
    const btnDays = Number(btn.getAttribute('data-days'));
    btn.classList.toggle('active', btnDays === cleanDays);
  });

  try {
    const url = `/api/adoption?engine_id=${encodeURIComponent(
        state.engineId)}&days=${cleanDays}&unmasked=${
        state.revealPii ? 'true' : 'false'}&refresh=${
        forceRefresh ? 'true' : 'false'}`;
    const res = await fetch(url);
    const data = await res.json();
    state.adoptionData = data;
    renderAdoptionTelemetry();
  } catch (e) {
    showToast(
        isEs() ?
            'Error actualizando ventana de adopción en vivo' :
            'Error updating live adoption window');
  }
}

function getChartThemeOptions() {
  const isDark = state.theme === 'dark';
  return {
    textColor: isDark ? '#e8eaed' : '#202124',
    mutedColor: isDark ? '#9aa0a6' : '#5f6368',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(60, 64, 67, 0.12)',
  };
}

function renderOrUpdateChart(key, canvasId, config) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (state.adoptionCharts[key]) {
    state.adoptionCharts[key].destroy();
  }
  const themeOpts = getChartThemeOptions();
  const opts = config.options || {};
  opts.plugins = opts.plugins || {};
  opts.plugins.legend = opts.plugins.legend || {};
  opts.plugins.legend.labels = {
    ...(opts.plugins.legend.labels || {}),
    color: themeOpts.textColor,
  };
  if (opts.scales) {
    Object.keys(opts.scales).forEach((axisKey) => {
      opts.scales[axisKey] = {
        ...opts.scales[axisKey],
        ticks: {
          ...(opts.scales[axisKey].ticks || {}),
          color: themeOpts.mutedColor,
        },
        grid: {
          ...(opts.scales[axisKey].grid || {}),
          color: themeOpts.gridColor,
        },
      };
    });
  }
  config.options = opts;
  state.adoptionCharts[key] = new Chart(canvas.getContext('2d'), config);
}

function renderAdoptionTelemetry() {
  const ad = state.adoptionData ||
      (state.reportData && state.reportData.adoption_telemetry);
  if (!ad) return;

  const days = ad.days_window || state.adoptionDays || 30;
  const sk = ad.summary_kpis || {};
  const q1 = ad.q1_active_users || {};
  const q2 = ad.q2_top_apps || {};
  const q3 = ad.q3_top_agents || {};
  const q4 = ad.q4_non_users || {};
  const q5 = ad.q5_license_capabilities || {};
  const q6 = ad.q6_prompt_intelligence || {};

  document.querySelectorAll('.adopt-days-label').forEach((el) => {
    el.textContent = days;
  });
  const winPill = document.getElementById('adoptionWindowPill');
  if (winPill) {
    if (isEs()) {
      winPill.textContent = days === 1 ?
          'Ventana: Hoy (Últimas 24h)' :
          `Ventana: Últimos ${days} días`;
    } else {
      winPill.textContent = days === 1 ?
          'Window: Today (Last 24h)' :
          `Window: Last ${days} days`;
    }
  }

  const privBtn = document.getElementById('adoptionPrivacyToggleBtn');
  if (privBtn) {
    if (isEs()) {
      privBtn.textContent = state.revealPii ?
          '🔓 Vista Completa de Admin (Clic para Enmascarar)' :
          '🔒 Vista Enmascarada (Clic para Admin)';
    } else {
      privBtn.textContent = state.revealPii ?
          '🔓 Full Admin View (Click to Mask)' :
          '🔒 Masked View (Click for Admin)';
    }
  }
  const licBtn = document.getElementById('togglePiiBtn');
  if (licBtn) {
    licBtn.textContent = state.revealPii ?
        t('mask_identities_btn') :
        t('reveal_identities_btn');
  }

  const activeTodayCount = q1.users_active_today_count ?? sk.users_active_today ?? 0;
  const sessTodayCount = q1.sessions_today_count ?? sk.sessions_today ?? 0;
  const turnsTodayCount = q1.turns_today_count ?? sk.turns_today ?? 0;

  const activeWinCount = q1.users_active_window_count ?? sk.users_active_window ?? 0;
  const sessWinCount = q1.sessions_window_count ?? sk.sessions_window ?? 0;
  const turnsWinCount = q1.turns_window_count ?? sk.turns_window ?? 0;

  const totalSeats = sk.total_licensed_seats || 1;
  const totalPrincipals = sk.total_principals_tracked || 0;
  const nonUsersCount = q4.total_non_users ?? sk.non_users_count ?? 0;
  const seatAdoptionPct = Math.round((activeWinCount / Math.max(totalPrincipals, 1)) * 100);

  const kpiTodayUsers = document.getElementById('adoptKpiTodayUsers');
  if (kpiTodayUsers) {
    kpiTodayUsers.textContent = `${fmtNum(activeTodayCount)} ${isEs() ? 'Usuarios' : 'Users'}`;
  }
  const kpiTodaySub = document.getElementById('adoptKpiTodaySub');
  if (kpiTodaySub) {
    kpiTodaySub.textContent = isEs() ?
        `${fmtNum(sessTodayCount)} sesiones • ${fmtNum(turnsTodayCount)} consultas hoy` :
        `${fmtNum(sessTodayCount)} sessions • ${fmtNum(turnsTodayCount)} queries today`;
  }

  const kpiWinLabel = document.getElementById('adoptKpiWindowUsersLabel');
  if (kpiWinLabel) {
    kpiWinLabel.textContent = isEs() ?
        `Usuarios Activos (${days}d)` :
        `Active Users (${days}d)`;
  }
  const kpiWinUsers = document.getElementById('adoptKpiWindowUsers');
  if (kpiWinUsers) {
    kpiWinUsers.textContent = `${fmtNum(activeWinCount)} ${isEs() ? 'Usuarios' : 'Users'}`;
  }
  const kpiWinSub = document.getElementById('adoptKpiWindowSub');
  if (kpiWinSub) {
    kpiWinSub.textContent = isEs() ?
        `${fmtNum(sessWinCount)} sesiones • ${fmtNum(turnsWinCount)} turnos (${days}d)` :
        `${fmtNum(sessWinCount)} sessions • ${fmtNum(turnsWinCount)} turns (${days}d)`;
  }

  const kpiSeatRate = document.getElementById('adoptKpiSeatRate');
  if (kpiSeatRate) {
    kpiSeatRate.textContent = `${seatAdoptionPct}% (${activeWinCount}/${totalPrincipals})`;
  }
  const kpiSeatSub = document.getElementById('adoptKpiSeatSub');
  if (kpiSeatSub) {
    kpiSeatSub.textContent = isEs() ?
        `${totalSeats} licencias activas • ${nonUsersCount} sin uso en ${days}d` :
        `${totalSeats} active licenses • ${nonUsersCount} unused in ${days}d`;
  }

  const appsList = q2.apps || [];
  const activeAppsCount = appsList.filter((a) => a.sessions_window > 0).length;
  const totalAllTimeSess = appsList.reduce((s, a) => s + (a.sessions_all_time || 0), 0);
  const kpiActiveApps = document.getElementById('adoptKpiActiveApps');
  if (kpiActiveApps) {
    kpiActiveApps.textContent = `${activeAppsCount} / ${appsList.length} Apps`;
  }
  const kpiActiveAppsSub = document.getElementById('adoptKpiActiveAppsSub');
  if (kpiActiveAppsSub) {
    kpiActiveAppsSub.textContent = isEs() ?
        `${fmtNum(totalAllTimeSess)} sesiones históricas registradas` :
        `${fmtNum(totalAllTimeSess)} all-time recorded sessions`;
  }

  const totalRegAgents = (state.reportData && state.reportData.kpis && state.reportData.kpis.total_agents) || 0;
  const distinctAgentsUsed = q3.distinct_agents_with_sessions ?? sk.distinct_agents_used_window ?? 0;
  const kpiActiveAgents = document.getElementById('adoptKpiActiveAgents');
  if (kpiActiveAgents) {
    kpiActiveAgents.textContent =
        `${fmtNum(distinctAgentsUsed)} / ${fmtNum(totalRegAgents)}`;
  }
  const kpiActiveAgentsSub = document.getElementById('adoptKpiActiveAgentsSub');
  if (kpiActiveAgentsSub) {
    kpiActiveAgentsSub.textContent = isEs() ?
        'Agentes con sesiones reales en ventana' :
        'Agents with active sessions in window';
  }

  const kpiWorkRatio = document.getElementById('adoptKpiWorkRatio');
  if (kpiWorkRatio) {
    kpiWorkRatio.textContent = `${q6.work_pct ?? 0}% ${isEs() ? 'Laboral' : 'Work'}`;
  }
  const kpiWorkSub = document.getElementById('adoptKpiWorkSub');
  if (kpiWorkSub) {
    kpiWorkSub.textContent = isEs() ?
        `${fmtNum(q6.work_sessions_count)} trabajo vs. ${fmtNum(q6.other_sessions_count)} otros fines` :
        `${fmtNum(q6.work_sessions_count)} work vs. ${fmtNum(q6.other_sessions_count)} other purposes`;
  }

  // Dimension 1 Table & Daily Activity Chart (Google Blue & Google Green)
  const q1Tbody = document.getElementById('adoptQ1UsersTableBody');
  if (q1Tbody) {
    const users = q1.active_users || [];
    q1Tbody.innerHTML = users
        .map((u) => {
          const todayBadge = u.is_active_today ?
              `<span class="status-pill status-active">● ${isEs() ? 'ACTIVO HOY' : 'ACTIVE TODAY'}</span>` :
              `<span class="status-pill status-private">${isEs() ? `ACTIVO (${days}D)` : `ACTIVE (${days}D)`}</span>`;
          const appsUsed = (u.top_apps || [])
              .map((a) => `<span class="user-mini-chip">${a}</span>`)
              .join(' ');
          const agsUsed = (u.top_agents || []).slice(0, 3)
              .map((ag) => `<span class="user-mini-chip">${ag}</span>`)
              .join(' ');
          return `
        <tr>
          <td>
            <code>${u.display_principal}</code>
            <div class="muted" style="font-size: 11px;">${u.subscription_tier || 'SEARCH_AND_ASSISTANT'}</div>
          </td>
          <td>${todayBadge}</td>
          <td><strong>${fmtNum(u.turns_today)}</strong> ${isEs() ? 'turnos' : 'turns'} (${fmtNum(u.sessions_today)} ses.)</td>
          <td><strong>${fmtNum(u.total_sessions_window)}</strong> <span class="muted">(${fmtNum(u.interactive_sessions_window)} int / ${fmtNum(u.scheduled_sessions_window)} sched)</span></td>
          <td><strong>${fmtNum(u.total_turns_window)}</strong> (${u.usage_share_pct}%)</td>
          <td><div class="user-chip-list">${agsUsed || '<span class="muted">-</span>'}</div></td>
          <td><div class="user-chip-list">${appsUsed || '<span class="muted">-</span>'}</div></td>
          <td>${u.last_login_fmt}</td>
        </tr>
      `;
        })
        .join('');
  }

  const daily = q1.daily_series || [];
  renderOrUpdateChart('dailyActivity', 'adoptDailyActivityChart', {
    type: 'bar',
    data: {
      labels: daily.map((d) => (d.date || '').slice(5)),
      datasets: [
        {
          label: isEs() ? 'Turnos / Consultas' : 'Turns / Queries',
          data: daily.map((d) => d.turns || 0),
          backgroundColor: GOOGLE_PALETTE.blueRgba,
          borderRadius: 4,
        },
        {
          label: isEs() ? 'Sesiones Totales' : 'Total Sessions',
          data: daily.map((d) => d.total_sessions || 0),
          backgroundColor: GOOGLE_PALETTE.greenRgba,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {position: 'top'}},
      scales: {
        y: {beginAtZero: true, ticks: {precision: 0}},
      },
    },
  });

  // Dimension 2: Top Applications Chart & Table
  const topApps = (q2.apps || []).slice(0, 8);
  renderOrUpdateChart('topApps', 'adoptTopAppsChart', {
    type: 'bar',
    data: {
      labels: topApps.map((a) => a.display_name || a.engine_id),
      datasets: [
        {
          label: `${isEs() ? 'Turnos' : 'Turns'} (${days}d)`,
          data: topApps.map((a) => a.turns_window || 0),
          backgroundColor: GOOGLE_PALETTE.blue,
          borderRadius: 4,
        },
        {
          label: `${isEs() ? 'Sesiones' : 'Sessions'} (${days}d)`,
          data: topApps.map((a) => a.sessions_window || 0),
          backgroundColor: GOOGLE_PALETTE.green,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {position: 'top'}},
      scales: {x: {beginAtZero: true}},
    },
  });

  const q2Tbody = document.getElementById('adoptQ2AppsTableBody');
  if (q2Tbody) {
    q2Tbody.innerHTML = (q2.apps || [])
        .map((a) => {
          const usrChips = (a.active_users || [])
              .map((u) => `<span class="user-mini-chip">${u}</span>`)
              .join(' ');
          return `
        <tr>
          <td>
            <span class="gcp-link-name">${a.display_name}</span>
            <div class="muted" style="font-size: 11px;"><code>${a.engine_id}</code></div>
          </td>
          <td><strong>${fmtNum(a.sessions_window)}</strong> <span class="muted">(${fmtNum(a.sessions_all_time)} hist.)</span></td>
          <td><strong>${fmtNum(a.turns_window)}</strong> (${a.session_share_pct}%)</td>
          <td>${fmtNum(a.agents_count)} (${fmtNum(a.enabled_agents_count)} ${isEs() ? 'activos' : 'enabled'})</td>
          <td><div class="user-chip-list">${usrChips || `<span class="muted">${isEs() ? 'Sin sesiones' : 'No sessions'}</span>`}</div></td>
        </tr>
      `;
        })
        .join('');
  }

  // Dimension 3: Top Agents Chart & Table
  const topAgents = (q3.agents || []).slice(0, 8);
  renderOrUpdateChart('topAgents', 'adoptTopAgentsChart', {
    type: 'bar',
    data: {
      labels: topAgents.map((ag) => (ag.agent_display_name || '').slice(0, 26)),
      datasets: [
        {
          label: `${isEs() ? 'Sesiones' : 'Sessions'} (${days}d)`,
          data: topAgents.map((ag) => ag.sessions_window || 0),
          backgroundColor: GOOGLE_PALETTE.green,
          borderRadius: 4,
        },
        {
          label: `${isEs() ? 'Turnos' : 'Turns'} (${days}d)`,
          data: topAgents.map((ag) => ag.turns_window || 0),
          backgroundColor: GOOGLE_PALETTE.blue,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {position: 'top'}},
      scales: {x: {beginAtZero: true}},
    },
  });

  const q3Tbody = document.getElementById('adoptQ3AgentsTableBody');
  if (q3Tbody) {
    q3Tbody.innerHTML = (q3.agents || []).slice(0, 25)
        .map((ag) => {
          const usrChips = (ag.active_users || [])
              .map((u) => `<span class="user-mini-chip">${u}</span>`)
              .join(' ');
          return `
        <tr>
          <td>
            <span class="gcp-link-name">${ag.agent_display_name}</span>
            <div class="muted" style="font-size: 11px;"><code>${ag.model_id}</code> • ${isEs() ? 'Último uso' : 'Last used'}: ${ag.last_used_fmt}</div>
          </td>
          <td><span class="status-pill status-private">${ag.subtype}</span></td>
          <td>${ag.engine_name}</td>
          <td><strong>${fmtNum(ag.turns_window)}</strong> (${fmtNum(ag.sessions_window)} ses.)</td>
          <td>${ag.session_share_pct}%</td>
          <td><div class="user-chip-list">${usrChips || '<span class="muted">-</span>'}</div></td>
        </tr>
      `;
        })
        .join('');
  }

  // Dimension 4: Non-Users & License Reclaim
  const savBadge = document.getElementById('adoptDormantSavingsBadge');
  if (savBadge) {
    savBadge.textContent = isEs() ?
        `$${fmtUsd(q4.reclaimable_monthly_usd)}/mes ($${fmtUsd(q4.reclaimable_annual_usd)}/año) recuperables` :
        `$${fmtUsd(q4.reclaimable_monthly_usd)}/mo ($${fmtUsd(q4.reclaimable_annual_usd)}/yr) reclaimable`;
  }
  const q4Callout = document.getElementById('adoptQ4SummaryCallout');
  if (q4Callout) {
    const cc = q4.cohort_counts || {};
    q4Callout.innerHTML = isEs() ?
        `
      <strong>Diagnóstico de Adopción de Licencias:</strong> De <strong>${
            totalPrincipals}</strong> usuarios en <code>default_user_store</code>,
      <strong>${activeWinCount}</strong> registraron actividad en los últimos ${days} días y
      <strong>${q4.total_non_users || 0}</strong> no presentan actividad en la ventana
      (<strong>${cc.NEVER_LOGGED_IN || 0}</strong> nunca ingresaron,
      <strong>${cc.DORMANT_OVER_WINDOW || 0}</strong> inactivos &gt;${days}d,
      <strong>${cc.EXPIRED_LICENSE || 0}</strong> trial vencido,
      <strong>${cc.UNLICENSED_ATTEMPT || 0}</strong> intento sin licencia).
    ` :
        `
      <strong>License Adoption Diagnosis:</strong> Out of <strong>${
            totalPrincipals}</strong> principals in <code>default_user_store</code>,
      <strong>${activeWinCount}</strong> recorded activity in the last ${days} days and
      <strong>${q4.total_non_users || 0}</strong> had zero activity in the window
      (<strong>${cc.NEVER_LOGGED_IN || 0}</strong> never logged in,
      <strong>${cc.DORMANT_OVER_WINDOW || 0}</strong> dormant &gt;${days}d,
      <strong>${cc.EXPIRED_LICENSE || 0}</strong> expired trial,
      <strong>${cc.UNLICENSED_ATTEMPT || 0}</strong> unlicensed attempt).
    `;
  }
  const q4Tbody = document.getElementById('adoptQ4NonUsersTableBody');
  if (q4Tbody) {
    const nonUsers = q4.non_users || [];
    q4Tbody.innerHTML = nonUsers
        .map((u) => {
          const stClass = u.assignment_state === 'ASSIGNED' ?
              'status-disabled' :
              'status-error';
          const daysStr = u.days_since_login !== null && u.days_since_login !== undefined ?
              `${u.days_since_login} ${isEs() ? 'días' : 'days'} (${u.last_login_fmt})` :
              (isEs() ? 'Nunca' : 'Never');
          return `
        <tr>
          <td><code>${u.display_principal}</code></td>
          <td><span class="status-pill ${stClass}">${u.assignment_state} (${u.license_state})</span></td>
          <td>${daysStr}</td>
          <td>${u.cohort_label}</td>
          <td><strong>$${fmtUsd(u.monthly_seat_cost_usd)}/${isEs() ? 'mes' : 'mo'}</strong></td>
          <td>${u.recommended_action}</td>
        </tr>
      `;
        })
        .join('');
  }

  // Dimension 5: Other License & Ecosystem Capabilities
  const q5Grid = document.getElementById('adoptQ5CapabilitiesGrid');
  if (q5Grid) {
    const caps = q5.ecosystem_capabilities || [];
    const tools = (q5.multimodal_tools_usage || []).slice(0, 3);
    const capsHtml = caps
        .map((c) => {
          const stPill = c.status === 'ACTIVE' ?
              `<span class="status-pill status-active">● ${c.status_label}</span>` :
              `<span class="status-pill status-disabled">◐ ${c.status_label}</span>`;
          return `
        <div class="capability-item-card">
          <div class="capability-item-top">
            <span class="capability-item-title">${c.name}</span>
            ${stPill}
          </div>
          <div class="capability-item-metric">${c.active_seats_or_units}</div>
          <div class="capability-item-detail">${c.usage_telemetry}</div>
          <div class="capability-item-detail"><strong>${isEs() ? 'Fuente' : 'Source'}:</strong> <code>${c.evidence_source}</code></div>
        </div>
      `;
        })
        .join('');
    const toolsSummary = tools
        .map((tl) => `<span class="user-mini-chip">${tl.display_name}: ${tl.turns_enabled_count} ${isEs() ? 'turnos' : 'turns'} (${tl.adoption_pct}%)</span>`)
        .join(' ');
    const toolsCardHtml = `
      <div class="capability-item-card">
        <div class="capability-item-top">
          <span class="capability-item-title">${isEs() ? 'Herramientas Multimodales y Grounding en Sesiones' : 'Multimodal Tools & Grounding in Sessions'}</span>
          <span class="status-pill status-active">● ${isEs() ? 'En Uso Activo' : 'Actively Used'}</span>
        </div>
        <div class="capability-item-metric">${tools.length} ${isEs() ? 'Capacidades de Asistente Habilitadas' : 'Assistant Capabilities Enabled'}</div>
        <div class="capability-item-detail">${isEs() ? 'Uso real detectado en turnos de conversación (Imagen 3, Veo, Google Search Grounding, RAG Empresarial, Agent Tool Registry):' : 'Live usage detected across conversation turns (Imagen 3, Veo, Google Search Grounding, Enterprise RAG, Agent Tool Registry):'}</div>
        <div class="user-chip-list" style="margin-top: 4px;">${toolsSummary}</div>
      </div>
    `;
    q5Grid.innerHTML = capsHtml + toolsCardHtml;
  }

  // Dimension 6: Prompt Intelligence (Google Green & Google Yellow)
  const totalPromptsAnalyzed = (q6.work_sessions_count || 0) + (q6.other_sessions_count || 0);
  const q6Badge = document.getElementById('adoptQ6TotalBadge');
  if (q6Badge) {
    q6Badge.textContent = isEs() ?
        `${fmtNum(totalPromptsAnalyzed)} Prompts Analizados (${days}d)` :
        `${fmtNum(totalPromptsAnalyzed)} Prompts Analyzed (${days}d)`;
  }

  renderOrUpdateChart('workIntent', 'adoptWorkIntentChart', {
    type: 'doughnut',
    data: {
      labels: [
        `${isEs() ? 'Fines de Trabajo' : 'Work Purposes'} (${q6.work_pct || 0}%)`,
        `${isEs() ? 'Otros Fines / General' : 'Other / General'} (${q6.other_pct || 0}%)`,
      ],
      datasets: [
        {
          data: [q6.work_sessions_count || 0, q6.other_sessions_count || 0],
          backgroundColor: [GOOGLE_PALETTE.green, GOOGLE_PALETTE.yellow],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {position: 'right'}},
    },
  });

  const cats = q6.categories || [];
  renderOrUpdateChart('promptCategories', 'adoptPromptCategoryChart', {
    type: 'bar',
    data: {
      labels: cats.map((c) => c.category),
      datasets: [
        {
          label: isEs() ? 'Sesiones por Categoría' : 'Sessions by Category',
          data: cats.map((c) => c.sessions_count || 0),
          backgroundColor: [
            GOOGLE_PALETTE.blue,
            GOOGLE_PALETTE.green,
            GOOGLE_PALETTE.yellow,
            GOOGLE_PALETTE.red,
            GOOGLE_PALETTE.blue,
            GOOGLE_PALETTE.green,
          ],
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {display: false}},
      scales: {x: {beginAtZero: true, ticks: {precision: 0}}},
    },
  });

  const q6Tbody = document.getElementById('adoptQ6PromptsTableBody');
  if (q6Tbody) {
    const prompts = q6.recent_prompts || [];
    q6Tbody.innerHTML = prompts
        .map((p) => {
          const isWork = p.purpose === 'WORK';
          const clPill = isWork ?
              `<span class="status-pill status-active">✓ ${p.purpose_label}</span>` :
              `<span class="status-pill status-disabled">○ ${p.purpose_label}</span>`;
          return `
        <tr>
          <td style="white-space: nowrap;">${p.start_time_fmt}</td>
          <td><code>${p.agent_display_name}</code></td>
          <td>${p.engine_name}</td>
          <td><strong>${p.prompt_text}</strong></td>
          <td>${clPill}</td>
          <td><span class="status-pill status-private">${p.category}</span></td>
          <td><span class="status-pill status-active">${p.turns_count} ${isEs() ? 'turno(s)' : 'turn(s)'} • ${p.trigger_type}</span></td>
        </tr>
      `;
        })
        .join('');
  }
}

/* ==========================================================================
   11. INITIALIZE EVENT LISTENERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('configDrawerBackdrop');
  const openDrawer = () => drawer.classList.add('open');
  const closeDrawer = () => drawer.classList.remove('open');

  // Apply persisted Theme & Language on boot
  applyTheme(state.theme);
  applyTranslations(state.lang, false);

  document.getElementById('openConfigDrawerBtn')
      ?.addEventListener('click', openDrawer);
  document.getElementById('openExpenseFormulaBtn')
      ?.addEventListener('click', openDrawer);
  document.getElementById('kpiExpenseCard')
      ?.addEventListener('click', openDrawer);
  document.getElementById('closeConfigDrawerBtn')
      ?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Language (EN / ES) toggle in Burger Menu
  document.querySelectorAll('#langSegmentedControl [data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang') || 'en';
      applyTranslations(targetLang, true);
      showToast(
          targetLang === 'es' ?
              'Idioma cambiado a Español (ES)' :
              'Language switched to English (EN)');
    });
  });

  // Theme (Light / Dark) toggle in Burger Menu
  document.querySelectorAll('#themeSegmentedControl [data-theme-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.getAttribute('data-theme-mode') || 'light';
      applyTheme(targetTheme);
      showToast(
          targetTheme === 'dark' ?
              (isEs() ? 'Modo Oscuro activado' : 'Dark Mode enabled') :
              (isEs() ? 'Modo Claro activado' : 'Light Mode enabled'));
    });
  });

  // Solution Architecture Launcher inside Burger Menu Config
  document.getElementById('openArchitectureFromDrawerBtn')
      ?.addEventListener('click', () => {
        switchMainTab('ARCHITECTURE');
        closeDrawer();
      });

  // Back to Dashboard button inside Solution Architecture view
  document.getElementById('backToDashboardFromArchBtn')
      ?.addEventListener('click', () => {
        switchMainTab(state.lastNonArchTab || 'OVERVIEW');
      });

  // Selectable GCP Project Dropdown in Burger Menu: auto-regenerate report on change
  document.getElementById('cfgProjectId')
      ?.addEventListener('change', (e) => {
        const selectedProj = e.target.value;
        onProjectDropdownChange(selectedProj);
      });

  // Primary View Tabs switching (2 Operational Tabs)
  document.querySelectorAll('#primaryViewTabs [data-main-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-main-tab') || 'OVERVIEW';
      switchMainTab(targetTab);
    });
  });

  // Burger menu links: switch tab first if data-target-tab is set, then scroll to section
  document.querySelectorAll('.drawer-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const targetTab = link.getAttribute('data-target-tab');
      if (targetTab) {
        switchMainTab(targetTab);
      }
      closeDrawer();
    });
  });

  // Adoption X-days buttons & custom input
  document.querySelectorAll('.adoption-day-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = Number(btn.getAttribute('data-days')) || 30;
      fetchAdoptionWindow(d, false);
    });
  });

  document.getElementById('adoptionApplyDaysBtn')
      ?.addEventListener('click', () => {
        const val = Number(
            document.getElementById('adoptionCustomDaysInput')?.value || 30);
        fetchAdoptionWindow(val, false);
      });

  document.getElementById('adoptionPrivacyToggleBtn')
      ?.addEventListener('click', () => {
        state.revealPii = !state.revealPii;
        renderOutliersSection();
        renderFrictionsAndUsers();
        fetchAdoptionWindow(state.adoptionDays, false);
      });

  // Outliers Privacy Toggle & Most Expensive Sessions Modal
  const toggleOutliersPrivacy = () => {
    state.revealPii = !state.revealPii;
    renderOutliersSection();
    renderFrictionsAndUsers();
    renderAdoptionTelemetry();
    showToast(
        state.revealPii ?
            (isEs() ? 'IDs de sesión y miembros revelados (Vista Admin)' :
                      'Session IDs & Members revealed (Admin View)') :
            (isEs() ? 'IDs de sesión y miembros enmascarados' :
                      'Session IDs & Members masked'));
  };
  document.getElementById('outliersPrivacyBtnLeft')
      ?.addEventListener('click', toggleOutliersPrivacy);
  document.getElementById('outliersPrivacyBtnModal')
      ?.addEventListener('click', toggleOutliersPrivacy);

  const expModal = document.getElementById('expensiveSessionsModal');
  const openExpModal = () => {
    expModal?.classList.remove('hidden');
    expModal?.setAttribute('aria-hidden', 'false');
    hideModelSharePopover();
  };
  const closeExpModal = () => {
    expModal?.classList.add('hidden');
    expModal?.setAttribute('aria-hidden', 'true');
    hideModelSharePopover();
  };
  document.getElementById('openExpensiveSessionsModalBtn')
      ?.addEventListener('click', openExpModal);
  document.getElementById('closeExpensiveSessionsModalBtn')
      ?.addEventListener('click', closeExpModal);
  expModal?.addEventListener('click', (e) => {
    if (e.target === expModal) closeExpModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExpModal();
      hideModelSharePopover();
    }
  });
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.js-model-share-trigger') &&
        !e.target.closest('#modelSharePopover')) {
      hideModelSharePopover();
    }
  });
  window.addEventListener('scroll', () => hideModelSharePopover(), {passive: true});

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
    showToast(
        isEs() ?
            'Telemetría en vivo actualizada desde Discovery Engine, Cloud Monitoring y Vertex AI' :
            'Refreshed live Discovery Engine, Cloud Monitoring & Vertex AI telemetry');
  });

  // On-demand Natural Language Narrative & TTS listeners
  document.getElementById('generateNarrativeBtn')
      ?.addEventListener('click', generateOnDemandNarrative);
  document.getElementById('ttsPlayToggleBtn')
      ?.addEventListener('click', toggleTtsPlayback);
  document.getElementById('headerTtsBtn')
      ?.addEventListener('click', () => {
        switchMainTab('OVERVIEW');
        document.getElementById('section-narrative')
            ?.scrollIntoView({behavior: 'smooth', block: 'start'});
        toggleTtsPlayback();
      });
  document.getElementById('ttsStopBtn')
      ?.addEventListener('click', stopTtsPlayback);

  // TTS Briefing Mode Tabs (Short Conversational ~30s vs Full Report ~90s)
  document.querySelectorAll('#ttsModeTabs .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ttsModeTabs .seg-btn')
          .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.ttsBriefingMode =
          btn.getAttribute('data-tts-mode') || 'CONVERSATIONAL';
      if (state.ttsPlaying || state.ttsPaused) {
        stopTtsPlayback();
      }
      renderTtsScriptPreview();
      prefetchDefaultTtsAudio();
    });
  });

  // Indexing Capacity & 80% Alert Threshold Controls
  document.getElementById('applyIndexingThresholdsBtn')
      ?.addEventListener('click', () => applyOrSyncIndexingAlerts(false));
  document.getElementById('syncGcpAlertPolicyBtn')
      ?.addEventListener('click', () => applyOrSyncIndexingAlerts(true));

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

  // Lineage controls
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

  document.getElementById('togglePiiBtn')?.addEventListener('click', () => {
    state.revealPii = !state.revealPii;
    renderOutliersSection();
    renderFrictionsAndUsers();
    fetchAdoptionWindow(state.adoptionDays, false);
  });

  setupLineageCanvasPan();
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('drawer') === 'open') {
    openDrawer();
  }
  const urlLang = (urlParams.get('lang') || '').toLowerCase();
  if (['en', 'es'].includes(urlLang)) {
    applyTranslations(urlLang, false);
  }
  const urlTheme = (urlParams.get('theme') || '').toLowerCase();
  if (['light', 'dark'].includes(urlTheme)) {
    applyTheme(urlTheme);
  }
  const initTab = (urlParams.get('tab') || '').toUpperCase();
  if (['OVERVIEW', 'ADOPTION', 'ARCHITECTURE'].includes(initTab)) {
    switchMainTab(initTab);
  }
  loadConfig();
  loadReport(false);
  loadLineage();
});
