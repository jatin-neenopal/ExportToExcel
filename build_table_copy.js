/* =============================================================================
 * PHASE 1 — Auto-fetch the workbook from Tableau Cloud
 * Changes for build_table_copy.js. 4 pieces, each labelled with WHERE it goes.
 * Nothing above line ~1348 (the formatting engine) changes.
 * ============================================================================= */


/* ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 1 of 4 — NEW BLOCK
 * WHERE: paste directly ABOVE this existing line:
 *     /* ── buildLayoutMap ─────────────────────────────────── *\/
 * (i.e. right after the getFormatModel() function ends)
 * ───────────────────────────────────────────────────────────────────────────── */
  /* =============================================================================
   * AUTO-FETCH FROM TABLEAU CLOUD (Phase 1)
   * -----------------------------------------------------------------------------
   * Replaces the manual "Load Workbook" step on Tableau Cloud:
   *   1. ask the backend (Worker) which published workbook holds this dashboard
   *   2. download that workbook's XML through the backend
   *   3. parse it exactly like a manually uploaded file
   * The manual 📁 button stays as a fallback (Tableau Desktop, backend down).
   * The PAT never reaches this file — only the backend holds it.
   * ============================================================================= */
  const DEFAULT_BACKEND_URL = "";      // production: the hosted Worker URL, e.g. "https://export-backend.example.workers.dev"
  let TITLE_MAP_CACHE = null;          // titles from the most recent load (auto or manual)
  let WORKBOOK_READY = Promise.resolve();   // export waits on this while auto-load runs

  /** Read a value saved by this extension: workbook settings first, then this browser. */
  function readSaved(key) {
    let v = null;
    try { v = tableau.extensions.settings.get(key); } catch (e) { /* ignore */ }
    if (!v) { try { v = localStorage.getItem("tfx_" + key); } catch (e) { /* ignore */ } }
    return v || "";
  }

  /** Save values to workbook settings (works in edit mode) and this browser (works always). */
  async function writeSaved(pairs) {
    Object.keys(pairs).forEach(k => {
      const v = pairs[k];
      try { localStorage.setItem("tfx_" + k, v); } catch (e) { /* ignore */ }
      try {
        if (v === "") tableau.extensions.settings.erase(k);
        else tableau.extensions.settings.set(k, v);
      } catch (e) { /* ignore */ }
    });
    try { await tableau.extensions.settings.saveAsync(); }
    catch (e) { console.warn("[AutoFetch] settings.saveAsync failed (viewing mode?) — kept in this browser only:", e.message); }
  }

  function getBackendConfig() {
    return {
      url: (readSaved("backendUrl") || DEFAULT_BACKEND_URL).trim().replace(/\/+$/, ""),
      key: readSaved("backendKey").trim(),
    };
  }

  /** Call the backend. Throws a readable Error on network failure or non-2xx. */
  async function backendFetch(path, init = {}) {
    const { url, key } = getBackendConfig();
    if (!url) throw new Error("No backend URL configured");
    const headers = { ...(init.headers || {}) };
    if (key) headers["X-Spike-Key"] = key;
    let res;
    try { res = await fetch(url + path, { ...init, headers }); }
    catch (e) { throw new Error(`Could not reach the backend (${url}) — is it running?`); }
    if (!res.ok) {
      let text = "";
      try { text = await res.text(); } catch (e) { /* ignore */ }
      let msg = text;
      try { msg = JSON.parse(text).error || text; } catch (e) { /* not JSON */ }
      throw new Error(`Backend ${res.status}: ${String(msg).slice(0, 300)}`);
    }
    return res;
  }

  function showWorkbookStatus(text) {
    const el = document.getElementById("twb_file_label");
    if (el) el.textContent = text;
  }

  function describeModel(titleMap, formatModel) {
    const sheets = Object.values((formatModel && formatModel.sheets) || {});
    const colour = sheets.filter(s => (s.panes || []).some(p => (p.encodings || []).some(e => e.channel === "color"))).length;
    return `${Object.keys(titleMap || {}).length} titles, formatting for ${sheets.length} sheets (${colour} with colour)`;
  }

  /**
   * Parse workbook XML into the title map + format model and make them the active ones.
   * Shared by manual upload and auto-fetch, so both behave identically.
   * persistToSettings: manual uploads are saved into the workbook (old behaviour);
   * auto-fetch is not, because it re-downloads the latest version on every open.
   */
  async function applyWorkbookXml(xmlString, sourceName, persistToSettings) {
    const titleMap = parseTwbXmlInBrowser(xmlString);
    const formatModel = parseTableauFormatting(xmlString);
    TITLE_MAP_CACHE = titleMap;
    FORMAT_MODEL_CACHE = formatModel;
    console.log(`[Workbook] ${sourceName}: ${describeModel(titleMap, formatModel)}`);

    if (persistToSettings) {
      tableau.extensions.settings.set("twbTitleMap", JSON.stringify(titleMap));
      try {
        tableau.extensions.settings.set("twbFormatModel", JSON.stringify(formatModel));
      } catch (e) {
        console.warn("[Workbook] Format model too large for settings – kept in memory only:", e.message);
      }
      tableau.extensions.settings.set("twbFileName", sourceName);
      try { await tableau.extensions.settings.saveAsync(); }
      catch (e) { console.warn("[Workbook] settings.saveAsync failed (model kept in memory):", e.message); }
    }
    return { titleMap, formatModel };
  }

  /**
   * Safety check: does the downloaded XML really contain this dashboard and its worksheets?
   * Catches a stale saved workbook ID (e.g. the workbook was copied with "Save As").
   */
  function twbMatchesDashboard(xmlString, dashboard) {
    const doc = new DOMParser().parseFromString(xmlString, "text/xml");
    const root = doc && doc.documentElement;
    if (!root || root.nodeName !== "workbook") return false;
    const names = tag => {
      const holder = getDirectChildByTag(root, tag + "s");
      const out = new Set();
      if (!holder) return out;
      for (let i = 0; i < holder.childNodes.length; i++) {
        const c = holder.childNodes[i];
        if (c.nodeType === 1 && c.tagName === tag) out.add(c.getAttribute("name"));
      }
      return out;
    };
    const dashboards = names("dashboard"), worksheets = names("worksheet");
    return dashboards.has(dashboard.name) && dashboard.worksheets.every(ws => worksheets.has(ws.name));
  }

  /** Which published workbook is this? Saved answer first, otherwise ask the backend. */
  async function resolveWorkbook(dashboard) {
    const savedId = readSaved("twbWorkbookId");
    if (savedId) return { id: savedId, name: readSaved("twbWorkbookName") || "workbook", fromSaved: true };

    const res = await backendFetch("/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dashboardName: dashboard.name, worksheetNames: dashboard.worksheets.map(w => w.name) }),
    });
    const r = await res.json();
    const pick = c => ({ id: c.workbookId, name: c.workbookName, project: c.projectName });
    if (r.decision === "unique") return pick(r.candidates[0]);
    if (r.decision === "ambiguous") {
      const exact = r.candidates.filter(c => c.exact);
      const list = (exact.length ? exact : r.candidates.filter(c => c.score > 0)).map(pick);
      return { ambiguous: true, candidates: list };
    }
    throw new Error(`no published workbook contains dashboard "${dashboard.name}"`);
  }

  /** Several workbooks match (e.g. copies in two projects): let the user pick once. */
  function askUserToChooseWorkbook(candidates) {
    return new Promise(resolve => {
      const label = document.getElementById("twb_file_label");
      const box = document.createElement("div");
      box.id = "twb_picker";
      box.className = "twb-picker";
      const select = document.createElement("select");
      candidates.forEach((c, i) => {
        const o = document.createElement("option");
        o.value = String(i);
        o.textContent = `${c.project ? c.project + " / " : ""}${c.name}`;
        select.appendChild(o);
      });
      const ok = document.createElement("button");
      ok.className = "btn-load";
      ok.textContent = "Use this workbook";
      ok.addEventListener("click", () => { box.remove(); resolve(candidates[Number(select.value)]); });
      box.appendChild(select);
      box.appendChild(ok);
      if (label && label.parentNode) label.parentNode.insertBefore(box, label.nextSibling);
      else document.body.appendChild(box);
    });
  }

  /** Auto-load on open. Never throws: on any problem it explains and leaves 📁 as the fallback. */
  async function autoLoadWorkbook(dashboard) {
    const env = tableau.extensions.environment || {};
    const savedFile = readSaved("twbFileName");
    const fallback = savedFile ? ` — using previously loaded ${savedFile}` : " — use 📁 to load the workbook manually";

    if (env.context === "desktop") {
      if (!savedFile) showWorkbookStatus("Tableau Desktop: auto-load needs Tableau Cloud — use 📁 to load the workbook");
      return;
    }
    if (!getBackendConfig().url) {
      if (!savedFile) showWorkbookStatus("Auto-load not set up (Advanced → Backend URL)" + fallback);
      return;
    }

    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        showWorkbookStatus("⏳ Finding this workbook on Tableau Cloud…");
        let wb = await resolveWorkbook(dashboard);
        if (wb.ambiguous) {
          showWorkbookStatus(`${wb.candidates.length} published workbooks contain this dashboard — pick the right one:`);
          wb = await askUserToChooseWorkbook(wb.candidates);
        }

        showWorkbookStatus(`⏳ Downloading "${wb.name}" from Tableau Cloud…`);
        let xml;
        try {
          xml = await (await backendFetch("/twb/" + encodeURIComponent(wb.id))).text();
        } catch (e) {
          if (wb.fromSaved && /Backend 404/.test(e.message)) {          // saved workbook was deleted/moved
            await writeSaved({ twbWorkbookId: "", twbWorkbookName: "" });
            continue;
          }
          throw e;
        }

        if (!twbMatchesDashboard(xml, dashboard)) {
          if (wb.fromSaved) {                                            // saved ID points at another workbook
            await writeSaved({ twbWorkbookId: "", twbWorkbookName: "" });
            continue;
          }
          throw new Error("the downloaded workbook doesn't contain this dashboard");
        }

        const { titleMap, formatModel } = await applyWorkbookXml(xml, wb.name, false);
        if (!wb.fromSaved) await writeSaved({ twbWorkbookId: wb.id, twbWorkbookName: wb.name });
        showWorkbookStatus(`✅ ${wb.name} (auto, Tableau Cloud) — ${describeModel(titleMap, formatModel)}`);
        return;
      }
      throw new Error("could not identify this workbook");
    } catch (e) {
      console.warn("[AutoFetch]", e);
      showWorkbookStatus(`⚠️ Auto-load failed: ${e.message}${fallback}`);
    }
  }

  /** Advanced panel: backend URL + key, saved with the workbook. Saving reconnects. */
  function setupBackendSettings(dashboard) {
    const urlIn = document.getElementById("backend_url");
    const keyIn = document.getElementById("backend_key");
    const saveBtn = document.getElementById("backend_save");
    if (!urlIn || !keyIn || !saveBtn) return;
    const cfg = getBackendConfig();
    urlIn.value = readSaved("backendUrl");
    urlIn.placeholder = DEFAULT_BACKEND_URL || "https://…trycloudflare.com";
    keyIn.value = cfg.key;
    saveBtn.addEventListener("click", async () => {
      saveBtn.disabled = true;
      await writeSaved({ backendUrl: urlIn.value.trim(), backendKey: keyIn.value.trim() });
      WORKBOOK_READY = autoLoadWorkbook(dashboard);
      await WORKBOOK_READY;
      saveBtn.disabled = false;
    });
  }


/* ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 2 of 4 — REPLACE the whole loadWorkbookFile() function
 * (including its comment header) with this version.
 * ───────────────────────────────────────────────────────────────────────────── */
  /* =============================================================================
   * loadWorkbookFile() - Loads .twb/.twbx and parses BOTH titles AND colors
   * ============================================================================= */
  async function loadWorkbookFile() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".twb,.twbx";
      input.style.display = "none";
      document.body.appendChild(input);

      input.onchange = async (event) => {
        document.body.removeChild(input);

        const file = event.target.files[0];
        if (!file) {
          console.log("[loadWorkbookFile] No file selected");
          resolve({});
          return;
        }

        console.log(`[loadWorkbookFile] Reading: ${file.name}`);

        try {
          let xmlString;
          const ext = file.name.split(".").pop().toLowerCase();

          if (ext === "twb") {
            xmlString = await new Promise((res, rej) => {
              const reader = new FileReader();
              reader.onload = (e) => res(e.target.result);
              reader.onerror = () => rej(new Error("FileReader failed reading .twb"));
              reader.readAsText(file, "utf-8");
            });
          } else if (ext === "twbx") {
            const arrayBuffer = await new Promise((res, rej) => {
              const reader = new FileReader();
              reader.onload = (e) => res(e.target.result);
              reader.onerror = () => rej(new Error("FileReader failed reading .twbx"));
              reader.readAsArrayBuffer(file);
            });

            if (typeof JSZip === "undefined") {
              throw new Error("JSZip not loaded. Add the JSZip script tag to index.html.");
            }

            const zip = await JSZip.loadAsync(arrayBuffer);
            const twbEntry = Object.values(zip.files).find(
              f => !f.dir && f.name.endsWith(".twb")
            );

            if (!twbEntry) {
              throw new Error("No .twb file found inside the .twbx archive.");
            }

            xmlString = await twbEntry.async("string");
          } else {
            throw new Error(`Unsupported file type ".${ext}". Please select a .twb or .twbx file.`);
          }

          // Same parsing path as the Tableau Cloud auto-fetch; manual files are also saved into the workbook.
          const { titleMap, formatModel } = await applyWorkbookXml(xmlString, file.name, true);
          showWorkbookStatus(`✅ ${file.name} (manual) — ${describeModel(titleMap, formatModel)}`);

          resolve(titleMap);

        } catch (err) {
          console.error("[loadWorkbookFile] Error:", err.message);
          alert(`Could not read workbook file:\n${err.message}`);
          resolve({});
        }
      };

      input.oncancel = () => {
        document.body.removeChild(input);
        resolve({});
      };

      input.click();
    });
  }


/* ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 3 of 4 — REPLACE the whole getTitleMap() function with this version.
 * ───────────────────────────────────────────────────────────────────────────── */
  function getTitleMap() {
    if (TITLE_MAP_CACHE) return TITLE_MAP_CACHE;          // latest auto-fetch or manual load
    try {
      const saved = tableau.extensions.settings.get("twbTitleMap");
      if (!saved) return {};
      return JSON.parse(saved);
    } catch (err) {
      console.warn("[getTitleMap] Could not read settings:", err.message);
      return {};
    }
  }


/* ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 4 of 4 — REPLACE the start-up lines inside initializeAsync().then(...)
 * FROM this line:   const loadBtn = document.getElementById("load_workbook_btn");
 * UP TO (not including) this line:   async function exportToExcel() {
 * Do NOT touch exportToExcel() itself.
 * ───────────────────────────────────────────────────────────────────────────── */
      const loadBtn = document.getElementById("load_workbook_btn");
      if (loadBtn) {
        loadBtn.addEventListener("click", async () => {
          loadBtn.disabled = true;
          loadBtn.textContent = "⏳ Loading...";
          await loadWorkbookFile();
          loadBtn.disabled = false;
          loadBtn.textContent = "📁 Load workbook file manually (.twb / .twbx)";
        });
      }

      const fileLabel = document.getElementById("twb_file_label");
      if (fileLabel) {
        const savedFileName = tableau.extensions.settings.get("twbFileName");
        const savedTitleMap = tableau.extensions.settings.get("twbTitleMap");
        const savedFormat = tableau.extensions.settings.get("twbFormatModel");
        if (savedFileName && savedTitleMap) {
          const titleCount = Object.keys(JSON.parse(savedTitleMap)).length;
          const sheetCount = savedFormat ? Object.keys(JSON.parse(savedFormat).sheets || {}).length : 0;
          fileLabel.textContent = `✅ ${savedFileName} — ${titleCount} titles, formatting for ${sheetCount} sheets`;
        } else {
          fileLabel.textContent = "No workbook loaded — click 📁 to load titles and colors";
        }
      }

      // Phase 1: fetch the workbook from Tableau Cloud automatically (falls back to 📁 on any problem).
      setupBackendSettings(dashboard);
      WORKBOOK_READY = autoLoadWorkbook(dashboard);

      const exportBtn = document.getElementById("export_button");
      if (exportBtn) {
        exportBtn.addEventListener("click", async () => {
          // If the auto-load is still running, wait for it so the export uses the right formatting.
          const original = exportBtn.textContent;
          exportBtn.disabled = true;
          exportBtn.textContent = "⏳ Loading workbook…";
          try { await WORKBOOK_READY; } finally {
            exportBtn.textContent = original;
            exportBtn.disabled = false;
          }
          exportToExcel();
        });
      }
