/* =============================================================================
 * Phase 0 spike runner — runs S1–S4 from INSIDE a Tableau Cloud dashboard.
 * Separate page (spike.html + spike.trex) so production build_table_copy.js is untouched.
 *
 *   S2  Resolve which published workbook this dashboard lives in      (Worker /resolve)
 *   S1  Fetch that workbook's XML and prove it matches the live dashboard (Worker /twb)
 *   S4  REST view data: which worksheets are reachable as views          (Worker /views, /viewdata)
 *   S3  Hidden Embedding API viz: auth + summary data for other dashboards (browser only)
 *
 * SpikeCore holds the pure logic (unit-tested in Node); the UI block below only runs in Tableau.
 * ============================================================================= */

var SpikeCore = (function () {

  function kids(el, tag) {
    const out = [];
    if (!el) return out;
    for (let i = 0; i < el.childNodes.length; i++) {
      const c = el.childNodes[i];
      if (c.nodeType === 1 && c.nodeName === tag) out.push(c);
    }
    return out;
  }

  /** Structural facts about a .twb, checked against what the extension sees live. */
  function analyzeTwb(xml, extWorksheetNames, currentDashboardName) {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const root = doc && doc.documentElement;
    if (!root || root.nodeName !== "workbook" || doc.getElementsByTagName("parsererror").length) {
      return { ok: false, error: "Not a Tableau workbook XML (root is <" + (root && root.nodeName) + ">)" };
    }
    const worksheets = kids(kids(root, "worksheets")[0], "worksheet").map(w => w.getAttribute("name"));
    const wsSet = new Set(worksheets);

    // Generic rule: a dashboard's worksheets are its zones whose name is a worksheet name.
    const dashboards = kids(kids(root, "dashboards")[0], "dashboard").map(d => {
      const names = new Set();
      const zones = d.getElementsByTagName("zone");
      for (let i = 0; i < zones.length; i++) {
        const n = zones[i].getAttribute("name");
        if (n && wsSet.has(n)) names.add(n);
      }
      return { name: d.getAttribute("name"), worksheets: [...names] };
    });

    // Tab order + visibility come from <windows>, in document order.
    const windows = kids(kids(root, "windows")[0], "window").map(w => ({
      name: w.getAttribute("name"),
      cls: w.getAttribute("class"),
      hidden: w.getAttribute("hidden") === "true",
    }));

    const current = dashboards.find(d => d.name === currentDashboardName) || null;
    const ext = [...new Set(extWorksheetNames)];
    const missing = ext.filter(n => !wsSet.has(n));
    const zoneSet = new Set(current ? current.worksheets : []);
    const sameAsLive = !!current && ext.length === zoneSet.size && ext.every(n => zoneSet.has(n));

    return {
      ok: true,
      version: root.getAttribute("version"),
      sourceBuild: root.getAttribute("source-build"),
      worksheets, dashboards, windows,
      tabOrder: windows.filter(w => !w.hidden).map(w => w.name),
      hiddenSheets: windows.filter(w => w.hidden).map(w => w.name),
      currentDashboardFound: !!current,
      extWorksheetsMissingFromTwb: missing,
      dashboardZonesMatchLive: sameAsLive,
    };
  }

  /** RFC-4180-ish CSV: header row + record count (quoted commas/newlines handled). */
  function parseCsv(text) {
    text = String(text || "").replace(/^\uFEFF/, "");
    const rows = []; let row = [], field = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += ch;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return { headers: rows[0] || [], rowCount: Math.max(0, rows.length - 1), sample: rows.slice(1, 3) };
  }

  function embedUrl(server, site, embedPath) {
    const base = String(server).replace(/\/+$/, "");
    return `${base}${site ? "/t/" + encodeURIComponent(site) : ""}/views/${embedPath}`;
  }

  /** Does an Embedding API DataTable satisfy the contract buildViewModel relies on? */
  function checkDataShape(table) {
    const problems = [];
    if (!table || !Array.isArray(table.columns)) problems.push("columns[] missing");
    else table.columns.forEach((c, i) => {
      if (typeof c.fieldName !== "string") problems.push(`columns[${i}].fieldName missing`);
      if (c.dataType === undefined) problems.push(`columns[${i}].dataType missing`);
    });
    if (!table || !Array.isArray(table.data)) problems.push("data[][] missing");
    else if (table.data.length) {
      const r0 = table.data[0];
      if (!Array.isArray(r0)) problems.push("data[0] is not an array");
      else r0.forEach((dv, i) => {
        if (!dv || !("value" in dv)) problems.push(`data[0][${i}].value missing`);
        if (!dv || !("formattedValue" in dv)) problems.push(`data[0][${i}].formattedValue missing`);
      });
    }
    return { ok: problems.length === 0, problems: problems.slice(0, 10) };
  }

  /** Sheet names Tableau Cloud doesn't publish as views (hidden worksheets). */
  function worksheetsNotViews(twbWorksheets, viewNames) {
    const v = new Set(viewNames);
    return twbWorksheets.filter(n => !v.has(n));
  }

  return { analyzeTwb, parseCsv, embedUrl, checkDataShape, worksheetsNotViews };
})();


/* ============================== UI (Tableau only) ============================== */
if (typeof window !== "undefined" && window.tableau && window.document) (function () {
  const $ = id => document.getElementById(id);
  const results = [];                     // flat: {spike, check, status, detail}
  const state = { dashboard: null, extWorksheets: [], workbookId: null, xml: null, twb: null, views: null };
  const CFG_KEYS = ["workerUrl", "server", "site", "spikeKey"];

  function log(spike, check, status, detail) {
    results.push({ spike, check, status, detail: typeof detail === "string" ? detail : JSON.stringify(detail) });
    render();
  }
  function render() {
    $("results").innerHTML = results.map(r =>
      `<tr class="${r.status}"><td>${r.spike}</td><td>${esc(r.check)}</td><td>${r.status}</td><td>${esc(r.detail)}</td></tr>`).join("");
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function cfg() { const o = {}; CFG_KEYS.forEach(k => o[k] = $(k).value.trim()); o.workerUrl = o.workerUrl.replace(/\/+$/, ""); return o; }
  function loadCfg() {
    CFG_KEYS.forEach(k => {
      let v = null;
      try { v = tableau.extensions.settings.get("spike_" + k); } catch (e) { /* ignore */ }
      if (v == null) try { v = localStorage.getItem("spike_" + k); } catch (e) { /* ignore */ }
      if (v != null) $(k).value = v;
    });
  }
  async function saveCfg() {
    const c = cfg();
    CFG_KEYS.forEach(k => {
      try { localStorage.setItem("spike_" + k, c[k]); } catch (e) { /* ignore */ }
      try { tableau.extensions.settings.set("spike_" + k, c[k]); } catch (e) { /* ignore */ }
    });
    try { await tableau.extensions.settings.saveAsync(); } catch (e) { /* viewing mode: localStorage only */ }
  }

  async function worker(path, init = {}) {
    const c = cfg();
    if (!c.workerUrl) throw new Error("Worker URL is empty");
    const headers = { ...(init.headers || {}) };
    if (c.spikeKey) headers["X-Spike-Key"] = c.spikeKey;
    const t0 = performance.now();
    let res;
    try { res = await fetch(c.workerUrl + path, { ...init, headers }); }
    catch (e) {
      const secs = ((performance.now() - t0) / 1000).toFixed(1);
      throw new Error(`Failed to fetch after ${secs}s — ` + (secs > 90
        ? "likely a timeout (the tunnel gives up after ~100s); check the receptionist terminal"
        : "the receptionist or tunnel didn't answer; check both terminals are running"));
    }
    if (!res.ok) {
      let body = ""; try { body = await res.text(); } catch (e) { /* ignore */ }
      throw new Error(`${res.status} ${path}: ${body.slice(0, 400)}`);
    }
    return res;
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
  }

  // ── S2 ────────────────────────────────────────────────────────────────────
  async function runS2() {
    try {
      const h = await (await worker("/health")).json();
      log("S2", "Worker sign-in (PAT)", "PASS", `site ${h.site}, ${h.signInMs} ms`);
    } catch (e) { log("S2", "Worker sign-in (PAT)", "FAIL", e.message); return false; }

    try {
      const r = await (await worker("/resolve", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dashboardName: state.dashboard.name, worksheetNames: state.extWorksheets }),
      })).json();
      log("S2", "Resolution source", r.source === "metadata" ? "PASS" : "WARN",
        r.source + (r.metadataError ? " (Metadata API error: " + r.metadataError + ")" : "") + `, ${r.ms} ms`);
      if (r.metadataWarnings && r.metadataWarnings.length) log("S2", "Metadata API notices", "INFO", r.metadataWarnings.join(", ") + " (harmless: results limited to what the PAT user can see)");
      log("S2", "Candidates", "INFO", r.candidates.map(c =>
        `${c.projectName}/${c.workbookName} score=${c.score.toFixed(2)}${c.exact ? " exact" : ""}`).join(" | ") || "none");
      if (r.decision === "unique") {
        state.workbookId = r.candidates[0].workbookId;
        log("S2", "Decision", "PASS", `unique → ${r.candidates[0].workbookName} (${state.workbookId})`);
      } else if (r.decision === "ambiguous" && r.candidates.length) {
        state.workbookId = r.candidates[0].workbookId;
        const pick = r.candidates[0];
        log("S2", "Decision", "WARN", `ambiguous (${r.candidates.length} matching workbooks) — using ${pick.projectName}/${pick.workbookName} (${pick.workbookId}) for the remaining spikes; production asks the author once`);
      } else {
        log("S2", "Decision", "FAIL", "no candidate (new workbook? Metadata indexing can lag a few minutes after publish)");
        return false;
      }
      $("wbid").value = state.workbookId;
      return true;
    } catch (e) { log("S2", "Resolve call", "FAIL", e.message); return false; }
  }

  // ── S1 ────────────────────────────────────────────────────────────────────
  async function runS1() {
    state.workbookId = $("wbid").value.trim() || state.workbookId;
    if (!state.workbookId) { log("S1", "Workbook ID", "FAIL", "run S2 first or paste a workbook LUID"); return false; }
    try {
      const t0 = performance.now();
      const res = await worker("/twb/" + state.workbookId);
      const xml = await res.text();
      state.xml = xml;
      log("S1", "Download via REST", "PASS",
        `${res.headers.get("X-Source-Format")} ${res.headers.get("X-Source-Bytes")} bytes → XML ${xml.length} chars; ` +
        `Tableau ${res.headers.get("X-Fetch-Ms")} ms, round-trip ${Math.round(performance.now() - t0)} ms`);
      log("S1", "XML fingerprint (compare with manual upload)", "INFO", "sha256:" + await sha256(xml));
    } catch (e) {
      log("S1", "Download via REST", "FAIL", e.message +
        (/403|40[0-9]/.test(e.message) ? " — check the PAT user has Download/ExportXml on this workbook" : ""));
      return false;
    }
    const a = SpikeCore.analyzeTwb(state.xml, state.extWorksheets, state.dashboard.name);
    state.twb = a;
    if (!a.ok) { log("S1", "Parse XML", "FAIL", a.error); return false; }
    log("S1", "Parse XML", "PASS", `v${a.version}, ${a.worksheets.length} worksheets, ${a.dashboards.length} dashboards`);
    log("S1", "Current dashboard present", a.currentDashboardFound ? "PASS" : "FAIL", state.dashboard.name);
    log("S1", "Live worksheets all in XML", a.extWorksheetsMissingFromTwb.length ? "FAIL" : "PASS",
      a.extWorksheetsMissingFromTwb.length ? "missing: " + a.extWorksheetsMissingFromTwb.join(", ") : `${state.extWorksheets.length}/${state.extWorksheets.length}`);
    log("S1", "Dashboard zones = live worksheets", a.dashboardZonesMatchLive ? "PASS" : "WARN",
      a.dashboardZonesMatchLive ? "exact" : "differs — unsaved edits, or the zone rule needs a tweak");
    log("S1", "Tab order (from <windows>)", "INFO", a.tabOrder.join(" → "));
    log("S1", "Hidden sheets (from <windows>)", "INFO", a.hiddenSheets.join(", ") || "none");
    fillDashboardPicker();
    $("dl_twb").disabled = false;
    return true;
  }

  function downloadTwb() {
    if (!state.xml) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([state.xml], { type: "application/xml" }));
    a.download = (state.dashboard.name || "workbook") + "_from_rest.twb";
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ── S4 ────────────────────────────────────────────────────────────────────
  async function loadViews() {
    if (state.views) return state.views;
    const { views } = await (await worker(`/workbooks/${state.workbookId}/views`)).json();
    state.views = views;
    return views;
  }

  async function runS4() {
    if (!state.twb) { log("S4", "Pre-req", "FAIL", "run S1 first"); return false; }
    let views;
    try { views = await loadViews(); } catch (e) { log("S4", "List views", "FAIL", e.message); return false; }
    log("S4", "Published views", "INFO", `${views.length}: ${views.map(v => v.name).join(", ")}`);
    const notViews = SpikeCore.worksheetsNotViews(state.twb.worksheets, views.map(v => v.name));
    log("S4", "Worksheets NOT reachable as views", notViews.length ? "WARN" : "PASS",
      notViews.length ? `${notViews.length}: ${notViews.join(", ")}` : "all worksheets are views");

    const dashNames = new Set(state.twb.dashboards.map(d => d.name));
    for (const v of views.slice(0, 20)) {
      try {
        const res = await worker(`/viewdata/${v.id}`);
        const csv = SpikeCore.parseCsv(await res.text());
        const kind = dashNames.has(v.name) ? "dashboard" : "worksheet";
        log("S4", `View data: ${v.name} (${kind})`, "INFO",
          `${csv.rowCount} rows, ${res.headers.get("X-Fetch-Ms")} ms, headers: ${csv.headers.join(" | ")}` +
          (kind === "dashboard" ? " ← check which worksheet this is" : ""));
      } catch (e) { log("S4", `View data: ${v.name}`, "FAIL", e.message); }
    }
    log("S4", "Finished", "INFO", `${Math.min(views.length, 20)} view(s) tried`);
    return true;
  }

  // ── S3 ────────────────────────────────────────────────────────────────────
  function fillDashboardPicker() {
    const sel = $("target_dash");
    sel.innerHTML = state.twb.dashboards
      .filter(d => d.name !== state.dashboard.name)
      .map(d => `<option>${esc(d.name)}</option>`).join("") || "<option value=''>(no other dashboards)</option>";
  }

  let embedLib = null;
  async function loadEmbeddingLib() {
    if (embedLib) return embedLib;
    if (window.customElements && customElements.get("tableau-viz")) return (embedLib = {});   // already loaded
    const server = cfg().server.replace(/\/+$/, "");
    // Pod-specific URL: using a different pod's library is a known cause of CORS errors on Tableau Cloud.
    embedLib = await import(`${server}/javascripts/api/tableau.embedding.3.latest.min.js`);
    return embedLib;
  }

  function waitForViz(viz, timeoutMs) {
    return new Promise(resolve => {
      const t = setTimeout(() => resolve({ ok: false, reason: `timeout ${timeoutMs / 1000}s — viz never became interactive (usually a sign-in page = auth/cookie problem)` }), timeoutMs);
      viz.addEventListener("firstinteractive", () => { clearTimeout(t); resolve({ ok: true }); });
      viz.addEventListener("vizloaderror", e => {
        clearTimeout(t);
        let d = e && e.detail; try { d = JSON.stringify(d); } catch (x) { /* ignore */ }
        resolve({ ok: false, reason: "vizloaderror: " + d });
      });
    });
  }

  async function readWorksheet(ws) {
    const t0 = performance.now();
    const reader = await ws.getSummaryDataReaderAsync(undefined, { ignoreSelection: true });
    try {
      const table = await reader.getAllPagesAsync();
      return { table, ms: Math.round(performance.now() - t0) };
    } finally { await reader.releaseAsync(); }
  }

  async function runS3() {
    const c = cfg();
    const target = $("target_dash").value;
    if (!state.twb) { log("S3", "Pre-req", "FAIL", "run S1 first"); return false; }
    if (!target) { log("S3", "Pre-req", "INFO", "this workbook has only 1 dashboard — run S3 on a workbook with 2+ dashboards"); return false; }
    let views;
    try { views = await loadViews(); } catch (e) { log("S3", "List views", "FAIL", e.message); return false; }
    const view = views.find(v => v.name === target);
    if (!view) { log("S3", "Target is a published view", "FAIL", `"${target}" is hidden/not published — cannot embed it directly`); return false; }

    try { await loadEmbeddingLib(); log("S3", "Load Embedding API v3 (pod URL)", "PASS", c.server); }
    catch (e) { log("S3", "Load Embedding API v3 (pod URL)", "FAIL", e.message); return false; }

    const src = SpikeCore.embedUrl(c.server, c.site, view.embedPath);
    const host = $("viz_host");
    host.innerHTML = "";
    const viz = document.createElement("tableau-viz");
    viz.setAttribute("src", src);
    viz.setAttribute("toolbar", "hidden");
    viz.setAttribute("hide-tabs", "");
    viz.setAttribute("width", "1200");
    viz.setAttribute("height", "900");
    const t0 = performance.now();
    const waiting = waitForViz(viz, 90000);
    host.appendChild(viz);
    const ready = await waiting;
    if (!ready.ok) {
      log("S3", "Hidden viz authenticates + loads", "FAIL", ready.reason + ` | ${navigator.userAgent}`);
      $("viz_host").classList.add("peek");   // show it so the tester can see what loaded (sign-in page?)
      return false;
    }
    log("S3", "Hidden viz authenticates + loads", "PASS", `${Math.round(performance.now() - t0)} ms | ${navigator.userAgent}`);

    const sheet = viz.workbook.activeSheet;
    const wss = sheet.sheetType === "dashboard" ? sheet.worksheets : [sheet];
    const viewNames = new Set(views.map(v => v.name));
    let allShapeOk = true;
    for (const ws of wss) {
      try {
        const { table, ms } = await readWorksheet(ws);
        const shape = SpikeCore.checkDataShape(table);
        allShapeOk = allShapeOk && shape.ok;
        const hidden = !viewNames.has(ws.name);
        log("S3", `Summary data: ${ws.name}${hidden ? " (hidden worksheet)" : ""}`, shape.ok ? "PASS" : "FAIL",
          `${table.totalRowCount != null ? table.totalRowCount : table.data.length} rows × ${table.columns.length} cols, ${ms} ms` +
          (shape.ok ? `; first cell "${table.data[0] && table.data[0][0] ? table.data[0][0].formattedValue : ""}"` : "; " + shape.problems.join("; ")));
      } catch (e) { allShapeOk = false; log("S3", `Summary data: ${ws.name}`, "FAIL", e.message); }
    }
    log("S3", "Data shape matches buildViewModel contract", allShapeOk ? "PASS" : "FAIL", "columns[].fieldName/dataType, data[r][c].value/formattedValue");

    // Optional: switch dashboards inside the same viz (much faster than reloading, if it works).
    const other = (viz.workbook.publishedSheetsInfo || []).find(s => s.name !== target && s.sheetType === "dashboard");
    if (other) {
      try {
        const t1 = performance.now();
        await viz.workbook.activateSheetAsync(other.name);
        log("S3", "activateSheetAsync to another dashboard", "PASS", `${other.name}, ${Math.round(performance.now() - t1)} ms`);
      } catch (e) { log("S3", "activateSheetAsync to another dashboard", "WARN", e.message + " — fallback: reload viz per dashboard"); }
    } else log("S3", "activateSheetAsync to another dashboard", "INFO", "no second published dashboard to try");
    return true;
  }

  async function runAll() {
    $("run_all").disabled = true;
    try {
      await saveCfg();
      if (await runS2() && await runS1()) { await runS4(); await runS3(); }
    } finally {
      $("run_all").disabled = false;
      log("ALL", "Run all finished", "INFO", "safe to Copy report now");
    }
  }

  function copyReport() {
    const header = `Phase 0 spike — ${new Date().toISOString()} — dashboard "${state.dashboard && state.dashboard.name}" — ` +
      `Tableau ${tableau.extensions.environment.tableauVersion} (${tableau.extensions.environment.context}) — ${navigator.userAgent}\n`;
    const text = header + ["Spike\tCheck\tStatus\tDetail", ...results.map(r => [r.spike, r.check, r.status, r.detail].join("\t"))].join("\n");
    const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); $("copy_report").textContent = "Copied ✓"; } catch (e) { /* ignore */ }
    ta.remove();
    setTimeout(() => { $("copy_report").textContent = "Copy report (TSV)"; }, 1500);
  }

  tableau.extensions.initializeAsync().then(() => {
    state.dashboard = tableau.extensions.dashboardContent.dashboard;
    state.extWorksheets = state.dashboard.worksheets.map(w => w.name);
    const env = tableau.extensions.environment;
    $("ctx").textContent = `Dashboard "${state.dashboard.name}" · ${state.extWorksheets.length} worksheets · Tableau ${env.tableauVersion} · ${env.context}/${env.mode}`;
    loadCfg();
    $("run_all").onclick = runAll;
    $("run_s2").onclick = async () => { await saveCfg(); await runS2(); };
    $("run_s1").onclick = async () => { await saveCfg(); await runS1(); };
    $("run_s4").onclick = async () => { await saveCfg(); await runS4(); };
    $("run_s3").onclick = async () => { await saveCfg(); await runS3(); };
    $("dl_twb").onclick = downloadTwb;
    $("copy_report").onclick = copyReport;
    $("clear").onclick = () => { results.length = 0; render(); };
  }, err => { document.body.textContent = "initializeAsync failed: " + err; });
})();
