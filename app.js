(() => {
  "use strict";

  /* ---------- Storage ---------- */

  const STORAGE_PREFIX = "steady.";
  const KEYS = {
    doses: STORAGE_PREFIX + "doses",
    weights: STORAGE_PREFIX + "weights",
    glucose: STORAGE_PREFIX + "glucose",
    food: STORAGE_PREFIX + "food",
    markers: STORAGE_PREFIX + "markers",
    facePhoto: STORAGE_PREFIX + "facePhoto",
  };

  function loadList(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Failed to load", key, err);
      return [];
    }
  }

  function saveList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
      return true;
    } catch (err) {
      console.error("Failed to save", key, err);
      toast("Couldn't save — storage may be full.");
      return false;
    }
  }

  function loadValue(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.error("Failed to load", key, err);
      return fallback;
    }
  }

  function saveValue(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error("Failed to save", key, err);
      toast("Couldn't save — storage may be full.");
      return false;
    }
  }

  /* ---------- Utilities ---------- */

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function todayISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function addDays(isoDate, days) {
    const d = new Date(isoDate + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d;
  }

  function formatDate(isoDate) {
    if (!isoDate) return "—";
    const d = new Date(isoDate + "T00:00:00");
    if (isNaN(d)) return isoDate;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function formatDateShort(isoDate) {
    const d = new Date(isoDate + "T00:00:00");
    if (isNaN(d)) return isoDate;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function sortByDateDesc(list) {
    return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (a.createdAt || 0) < (b.createdAt || 0) ? 1 : -1));
  }

  function sortByDateAsc(list) {
    return [...list].sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : (a.createdAt || 0) > (b.createdAt || 0) ? 1 : -1));
  }

  let toastTimer = null;
  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("visible"), 2200);
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---------- App state ---------- */

  const state = {
    tab: "today",
    logTab: "dose",
  };

  const screenMeta = {
    today: { title: "Today", subtitle: "Calm snapshot for daily tracking." },
    logs: { title: "Logs", subtitle: "Add a new entry in under 30 seconds." },
    progress: { title: "Progress", subtitle: "Trends across your recent logs." },
    tips: { title: "Tips", subtitle: "General guidance — not medical advice." },
  };

  const app = document.getElementById("app");
  const screenTitle = document.getElementById("screenTitle");
  const screenSubtitle = document.getElementById("screenSubtitle");

  function setTab(tab, opts) {
    state.tab = tab;
    if (opts && opts.logTab) state.logTab = opts.logTab;
    document.querySelectorAll(".tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    screenTitle.textContent = screenMeta[tab].title;
    screenSubtitle.textContent = screenMeta[tab].subtitle;
    render();
  }

  function render() {
    app.innerHTML = "";
    if (state.tab === "today") renderToday();
    else if (state.tab === "logs") renderLogs();
    else if (state.tab === "progress") renderProgress();
    else if (state.tab === "tips") renderTips();
  }

  /* ---------- Today ---------- */

  function renderToday() {
    const tpl = document.getElementById("today-template");
    app.appendChild(tpl.content.cloneNode(true));

    const doses = sortByDateDesc(loadList(KEYS.doses));
    const weights = sortByDateAsc(loadList(KEYS.weights));
    const glucose = sortByDateDesc(loadList(KEYS.glucose));
    const food = loadList(KEYS.food);

    const dashboardDose = document.getElementById("dashboardDose");
    const nextDoseDate = document.getElementById("nextDoseDate");
    if (doses.length) {
      dashboardDose.textContent = `${doses[0].dose} mg`;
      const next = addDays(doses[0].date, 7);
      nextDoseDate.textContent = `Est. ${next.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    } else {
      dashboardDose.textContent = "—";
      nextDoseDate.textContent = "Add first dose";
    }

    const latestWeight = document.getElementById("latestWeight");
    const weightDelta = document.getElementById("weightDelta");
    if (weights.length) {
      const last = weights[weights.length - 1];
      const first = weights[0];
      latestWeight.textContent = last.weight;
      if (weights.length > 1) {
        const diff = +(last.weight - first.weight).toFixed(1);
        const sign = diff > 0 ? "+" : "";
        weightDelta.textContent = `${sign}${diff} kg since first log`;
        weightDelta.className = "metric-chip " + (diff < 0 ? "green" : diff > 0 ? "rose" : "blue");
      } else {
        weightDelta.textContent = "No trend yet";
        weightDelta.className = "metric-chip blue";
      }
    } else {
      latestWeight.textContent = "—";
      weightDelta.textContent = "No trend yet";
    }

    const latestGlucose = document.getElementById("latestGlucose");
    latestGlucose.textContent = glucose.length ? glucose[0].reading : "—";

    document.querySelector('[data-action="go-dose"]').addEventListener("click", () => setTab("logs", { logTab: "dose" }));
    document.querySelector('[data-action="go-glucose"]').addEventListener("click", () => setTab("logs", { logTab: "glucose" }));

    renderFeed(doses, weights, glucose, food);
  }

  function renderFeed(doses, weights, glucose, food) {
    const feed = document.getElementById("recentFeed");
    const items = [];

    doses.forEach((d) => items.push({
      type: "dose", date: d.date, createdAt: d.createdAt,
      main: `${d.dose} mg dose`, meta: d.site ? `Site: ${d.site}` : "",
    }));
    weights.forEach((w) => items.push({
      type: "weight", date: w.date, createdAt: w.createdAt,
      main: `${w.weight} kg`, meta: "",
    }));
    glucose.forEach((g) => items.push({
      type: "glucose", date: g.date, createdAt: g.createdAt,
      main: `${g.reading} mg/dL`, meta: labelTiming(g.timing),
    }));
    food.forEach((f) => items.push({
      type: "food", date: f.date, createdAt: f.createdAt,
      main: f.meal ? f.meal : "Food & water log", meta: `${f.water || 0} glasses water`,
    }));

    items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (a.createdAt || 0) < (b.createdAt || 0) ? 1 : -1));

    if (!items.length) {
      feed.innerHTML = '<p class="feed-empty">Nothing logged yet. Add your first entry from the Logs tab.</p>';
      return;
    }

    feed.innerHTML = items.slice(0, 8).map((it) => `
      <div class="feed-item">
        <div>
          <span class="feed-tag ${it.type}">${it.type}</span>
          <div>${escapeHtml(it.main)}</div>
          <div class="feed-meta">${escapeHtml(it.meta)}</div>
        </div>
        <div class="feed-meta">${formatDateShort(it.date)}</div>
      </div>
    `).join("");
  }

  function labelTiming(t) {
    return { fasting: "Fasting", before_meal: "Before meal", after_meal: "2hr after meal", bedtime: "Bedtime" }[t] || t || "";
  }

  /* ---------- Logs ---------- */

  const DOSE_STEPS = ["0.25", "0.5", "1", "1.7", "2.4"];

  function renderLogs() {
    const tpl = document.getElementById("logs-template");
    app.appendChild(tpl.content.cloneNode(true));

    document.querySelectorAll(".segment").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.logTab === state.logTab);
      btn.addEventListener("click", () => {
        state.logTab = btn.dataset.logTab;
        renderLogPanel();
        document.querySelectorAll(".segment").forEach((b) => b.classList.toggle("active", b === btn));
      });
    });

    renderLogPanel();
  }

  function renderLogPanel() {
    const panel = document.getElementById("logPanel");
    panel.innerHTML = "";
    if (state.logTab === "dose") renderDosePanel(panel);
    else if (state.logTab === "weight") renderWeightPanel(panel);
    else if (state.logTab === "glucose") renderGlucosePanel(panel);
    else if (state.logTab === "food") renderFoodPanel(panel);
  }

  function renderDosePanel(panel) {
    panel.innerHTML = `
      <form class="card form-card" id="doseForm">
        <div class="field">
          <label for="doseDate">Date</label>
          <input type="date" id="doseDate" value="${todayISO()}" required />
        </div>
        <div class="field">
          <label for="doseAmount">Dose (mg)</label>
          <select id="doseAmount" required>
            ${DOSE_STEPS.map((d) => `<option value="${d}">${d} mg</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="doseSite">Injection site</label>
          <input type="text" id="doseSite" placeholder="e.g. Left thigh" />
        </div>
        <div class="field">
          <label for="doseSideEffects">Side effects</label>
          <textarea id="doseSideEffects" placeholder="Optional"></textarea>
        </div>
        <div class="field">
          <label for="doseNotes">Notes</label>
          <textarea id="doseNotes" placeholder="Optional"></textarea>
        </div>
        <button type="submit" class="primary">Save dose</button>
      </form>
      <div class="entry-list" id="doseList"></div>
    `;

    panel.querySelector("#doseForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const entry = {
        id: uid(),
        createdAt: Date.now(),
        date: panel.querySelector("#doseDate").value || todayISO(),
        dose: panel.querySelector("#doseAmount").value,
        site: panel.querySelector("#doseSite").value.trim(),
        sideEffects: panel.querySelector("#doseSideEffects").value.trim(),
        notes: panel.querySelector("#doseNotes").value.trim(),
      };
      const list = loadList(KEYS.doses);
      list.push(entry);
      if (saveList(KEYS.doses, list)) {
        toast("Dose logged.");
        renderDosePanel(panel);
      }
    });

    const list = sortByDateDesc(loadList(KEYS.doses));
    const listEl = panel.querySelector("#doseList");
    if (!list.length) {
      listEl.innerHTML = '<p class="feed-empty">No doses logged yet.</p>';
    } else {
      listEl.innerHTML = `<h3>Past doses</h3>` + list.map((d) => `
        <div class="entry-item" data-id="${d.id}">
          <div>
            <div class="entry-main">${d.dose} mg — ${formatDate(d.date)}</div>
            ${d.site ? `<div class="entry-meta">Site: ${escapeHtml(d.site)}</div>` : ""}
            ${d.sideEffects ? `<div class="entry-notes">Side effects: ${escapeHtml(d.sideEffects)}</div>` : ""}
            ${d.notes ? `<div class="entry-notes">${escapeHtml(d.notes)}</div>` : ""}
          </div>
          <button class="delete-btn" data-delete="dose" data-id="${d.id}" aria-label="Delete dose entry">×</button>
        </div>
      `).join("");
      wireDelete(listEl, KEYS.doses, () => renderDosePanel(panel));
    }
  }

  function renderWeightPanel(panel) {
    panel.innerHTML = `
      <form class="card form-card" id="weightForm">
        <div class="field">
          <label for="weightDate">Date</label>
          <input type="date" id="weightDate" value="${todayISO()}" required />
        </div>
        <div class="field">
          <label for="weightValue">Weight (kg)</label>
          <input type="number" id="weightValue" step="0.1" min="0" placeholder="e.g. 82.4" required />
        </div>
        <button type="submit" class="primary">Save weight</button>
      </form>
      <div class="entry-list" id="weightList"></div>
    `;

    panel.querySelector("#weightForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const val = parseFloat(panel.querySelector("#weightValue").value);
      if (isNaN(val)) return;
      const entry = { id: uid(), createdAt: Date.now(), date: panel.querySelector("#weightDate").value || todayISO(), weight: val };
      const list = loadList(KEYS.weights);
      list.push(entry);
      if (saveList(KEYS.weights, list)) {
        toast("Weight logged.");
        renderWeightPanel(panel);
      }
    });

    const list = sortByDateDesc(loadList(KEYS.weights));
    const listEl = panel.querySelector("#weightList");
    if (!list.length) {
      listEl.innerHTML = '<p class="feed-empty">No weight entries yet.</p>';
    } else {
      listEl.innerHTML = `<h3>Past entries</h3>` + list.map((w) => `
        <div class="entry-item" data-id="${w.id}">
          <div>
            <div class="entry-main">${w.weight} kg</div>
            <div class="entry-meta">${formatDate(w.date)}</div>
          </div>
          <button class="delete-btn" data-delete="weight" data-id="${w.id}" aria-label="Delete weight entry">×</button>
        </div>
      `).join("");
      wireDelete(listEl, KEYS.weights, () => renderWeightPanel(panel));
    }
  }

  function renderGlucosePanel(panel) {
    panel.innerHTML = `
      <form class="card form-card" id="glucoseForm">
        <div class="field">
          <label for="glucoseDate">Date</label>
          <input type="date" id="glucoseDate" value="${todayISO()}" required />
        </div>
        <div class="field">
          <label for="glucoseTiming">Timing</label>
          <select id="glucoseTiming">
            <option value="fasting">Fasting</option>
            <option value="before_meal">Before meal</option>
            <option value="after_meal">2hr after meal</option>
            <option value="bedtime">Bedtime</option>
          </select>
        </div>
        <div class="field">
          <label for="glucoseReading">Reading (mg/dL)</label>
          <input type="number" id="glucoseReading" min="0" placeholder="e.g. 98" required />
        </div>
        <div class="field">
          <label for="glucoseNotes">Notes</label>
          <textarea id="glucoseNotes" placeholder="Optional"></textarea>
        </div>
        <button type="submit" class="primary">Save reading</button>
      </form>
      <div class="entry-list" id="glucoseList"></div>
    `;

    panel.querySelector("#glucoseForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const val = parseInt(panel.querySelector("#glucoseReading").value, 10);
      if (isNaN(val)) return;
      const entry = {
        id: uid(),
        createdAt: Date.now(),
        date: panel.querySelector("#glucoseDate").value || todayISO(),
        timing: panel.querySelector("#glucoseTiming").value,
        reading: val,
        notes: panel.querySelector("#glucoseNotes").value.trim(),
      };
      const list = loadList(KEYS.glucose);
      list.push(entry);
      if (saveList(KEYS.glucose, list)) {
        toast("Reading logged.");
        renderGlucosePanel(panel);
      }
    });

    const list = sortByDateDesc(loadList(KEYS.glucose));
    const listEl = panel.querySelector("#glucoseList");
    if (!list.length) {
      listEl.innerHTML = '<p class="feed-empty">No glucose readings yet.</p>';
    } else {
      listEl.innerHTML = `<h3>Past readings</h3>` + list.map((g) => `
        <div class="entry-item" data-id="${g.id}">
          <div>
            <div class="entry-main">${g.reading} mg/dL — ${labelTiming(g.timing)}</div>
            <div class="entry-meta">${formatDate(g.date)}</div>
            ${g.notes ? `<div class="entry-notes">${escapeHtml(g.notes)}</div>` : ""}
          </div>
          <button class="delete-btn" data-delete="glucose" data-id="${g.id}" aria-label="Delete glucose entry">×</button>
        </div>
      `).join("");
      wireDelete(listEl, KEYS.glucose, () => renderGlucosePanel(panel));
    }
  }

  function renderFoodPanel(panel) {
    panel.innerHTML = `
      <form class="card form-card" id="foodForm">
        <div class="field">
          <label for="foodDate">Date</label>
          <input type="date" id="foodDate" value="${todayISO()}" required />
        </div>
        <div class="field">
          <label for="foodMeal">Meal description</label>
          <textarea id="foodMeal" placeholder="e.g. Grilled chicken, salad, rice"></textarea>
        </div>
        <div class="checkbox-row">
          <label class="checkbox-pill"><input type="checkbox" id="foodProtein" /> Protein goal met</label>
          <label class="checkbox-pill"><input type="checkbox" id="foodFiber" /> High-fiber foods</label>
          <label class="checkbox-pill"><input type="checkbox" id="foodVeg" /> Vegetables eaten</label>
        </div>
        <div class="field">
          <label for="foodWater">Water (glasses)</label>
          <input type="number" id="foodWater" min="0" placeholder="e.g. 6" />
        </div>
        <div class="field">
          <label for="foodNotes">Notes</label>
          <textarea id="foodNotes" placeholder="Optional"></textarea>
        </div>
        <button type="submit" class="primary">Save log</button>
      </form>
      <div class="entry-list" id="foodList"></div>
    `;

    panel.querySelector("#foodForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const entry = {
        id: uid(),
        createdAt: Date.now(),
        date: panel.querySelector("#foodDate").value || todayISO(),
        meal: panel.querySelector("#foodMeal").value.trim(),
        protein: panel.querySelector("#foodProtein").checked,
        fiber: panel.querySelector("#foodFiber").checked,
        veg: panel.querySelector("#foodVeg").checked,
        water: parseInt(panel.querySelector("#foodWater").value, 10) || 0,
        notes: panel.querySelector("#foodNotes").value.trim(),
      };
      const list = loadList(KEYS.food);
      list.push(entry);
      if (saveList(KEYS.food, list)) {
        toast("Food log saved.");
        renderFoodPanel(panel);
      }
    });

    const list = sortByDateDesc(loadList(KEYS.food));
    const listEl = panel.querySelector("#foodList");
    if (!list.length) {
      listEl.innerHTML = '<p class="feed-empty">No food logs yet.</p>';
    } else {
      listEl.innerHTML = `<h3>Past logs</h3>` + list.map((f) => {
        const tags = [f.protein && "Protein", f.fiber && "Fiber", f.veg && "Veg"].filter(Boolean).join(" · ");
        return `
        <div class="entry-item" data-id="${f.id}">
          <div>
            <div class="entry-main">${f.meal ? escapeHtml(f.meal) : "Food & water log"}</div>
            <div class="entry-meta">${formatDate(f.date)}${tags ? " · " + tags : ""} · ${f.water || 0} glasses water</div>
            ${f.notes ? `<div class="entry-notes">${escapeHtml(f.notes)}</div>` : ""}
          </div>
          <button class="delete-btn" data-delete="food" data-id="${f.id}" aria-label="Delete food entry">×</button>
        </div>
      `;
      }).join("");
      wireDelete(listEl, KEYS.food, () => renderFoodPanel(panel));
    }
  }

  function wireDelete(container, key, onDeleted) {
    container.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const list = loadList(key).filter((item) => item.id !== id);
        if (saveList(key, list)) {
          toast("Entry deleted.");
          onDeleted();
        }
      });
    });
  }

  /* ---------- Progress ---------- */

  function renderProgress() {
    const tpl = document.getElementById("progress-template");
    app.appendChild(tpl.content.cloneNode(true));

    const weights = sortByDateAsc(loadList(KEYS.weights));
    const cutoff = addDays(todayISO(), -30).toISOString().slice(0, 10);
    const recentWeights = weights.filter((w) => w.date >= cutoff);

    document.getElementById("weightLogCount").textContent = recentWeights.length;

    const trendDelta = document.getElementById("trendDelta");
    if (weights.length > 1) {
      const diff = +(weights[weights.length - 1].weight - weights[0].weight).toFixed(1);
      const sign = diff > 0 ? "+" : "";
      trendDelta.textContent = `${sign}${diff} kg`;
    } else {
      trendDelta.textContent = "—";
    }

    drawWeightChart(document.getElementById("weightChart"), weights);
    renderWeekDots();
    renderMarkers();

    const doses = loadList(KEYS.doses);
    const giCount = doses.filter((d) => d.sideEffects && d.sideEffects.trim().length > 0).length;
    document.getElementById("giCount").textContent = `${giCount} log${giCount === 1 ? "" : "s"}`;
  }

  function drawWeightChart(canvas, weights) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || canvas.parentElement.clientWidth || 300;
    const cssHeight = 180;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.height = cssHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    if (weights.length < 2) {
      ctx.fillStyle = "#94a29b";
      ctx.font = "13px sans-serif";
      ctx.fillText("Log weight at least twice to see a trend.", 8, cssHeight / 2);
      return;
    }

    const pad = 24;
    const values = weights.map((w) => w.weight);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const xStep = (cssWidth - pad * 2) / (weights.length - 1);
    const points = weights.map((w, i) => {
      const x = pad + i * xStep;
      const y = pad + (1 - (w.weight - min) / range) * (cssHeight - pad * 2);
      return [x, y];
    });

    ctx.strokeStyle = "#2563a6";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();

    ctx.fillStyle = "#2563a6";
    points.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function renderWeekDots() {
    const container = document.getElementById("weekDots");
    const doses = loadList(KEYS.doses);
    const weights = loadList(KEYS.weights);
    const glucose = loadList(KEYS.glucose);
    const food = loadList(KEYS.food);
    const loggedDates = new Set([...doses, ...weights, ...glucose, ...food].map((e) => e.date));

    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(addDays(todayISO(), -i).toISOString().slice(0, 10));
    }

    container.innerHTML = days.map((d) => {
      const dow = new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "narrow" });
      const filled = loggedDates.has(d);
      return `<div class="week-dot"><span class="dot ${filled ? "filled" : ""}"></span>${dow}</div>`;
    }).join("");
  }

  function renderMarkers() {
    const markers = loadValue(KEYS.markers, { waist: "—", sleep: "—", mood: "—" });
    const waistEl = document.getElementById("markerWaist");
    const sleepEl = document.getElementById("markerSleep");
    const moodEl = document.getElementById("markerMood");
    waistEl.textContent = markers.waist || "—";
    sleepEl.textContent = markers.sleep || "—";
    moodEl.textContent = markers.mood || "—";

    [waistEl, sleepEl, moodEl].forEach((el) => {
      el.addEventListener("focus", () => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      });
      el.addEventListener("blur", () => {
        const current = loadValue(KEYS.markers, {});
        current[el.dataset.marker] = el.textContent.trim() || "—";
        el.textContent = current[el.dataset.marker];
        saveValue(KEYS.markers, current);
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          el.blur();
        }
      });
    });
  }

  /* ---------- Tips ---------- */

  function renderTips() {
    const tpl = document.getElementById("tips-template");
    app.appendChild(tpl.content.cloneNode(true));

    const input = document.getElementById("facePhoto");
    const preview = document.getElementById("facePreview");
    const clearBtn = document.getElementById("clearFacePhoto");

    const saved = loadValue(KEYS.facePhoto, null);
    if (saved) {
      preview.src = saved;
      preview.classList.remove("hidden");
    }

    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (saveValue(KEYS.facePhoto, reader.result)) {
          preview.src = reader.result;
          preview.classList.remove("hidden");
          toast("Photo saved.");
        }
      };
      reader.readAsDataURL(file);
    });

    clearBtn.addEventListener("click", () => {
      localStorage.removeItem(KEYS.facePhoto);
      preview.src = "";
      preview.classList.add("hidden");
      input.value = "";
      toast("Photo cleared.");
    });
  }

  /* ---------- Init ---------- */

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => setTab(btn.dataset.tab));
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  render();
})();
