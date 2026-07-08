// ── Student Data ──────────────────────────────────────────────────────────────
const student = {
  name: "Jane Smith",
  studentId: "MSW-2024-0487",
  address: "123 Main Street\nNew York, NY 10001",
  email: "jane.smith@university.edu",
  phone: "(212) 555-0123",

  cohort: {
    name: "MSW Cohort 2024-A",
    program: "Master of Social Work",
    year: "Second Year",
    advisor: "Prof. Michael Chen",
    advisorEmail: "m.chen@pacific.edu",
    advisorPhone: "(209) 555-0200",
    startSemester: "Fall 2024",
  },

  placement: {
    status: "active",           // "pending" | "active" | "completed"
    agency: "Community Health & Wellness Center",
    agencyAddress: "456 Park Avenue\nNew York, NY 10022",
    supervisor: "Dr. Sarah Johnson",
    supervisorEmail: "s.johnson@chwc.org",
    supervisorPhone: "(212) 555-0456",
    fieldStart: new Date(2026, 1, 3),    // Feb 3, 2026
    fieldEnd:   new Date(2026, 7, 28),   // Aug 28, 2026
  },

  hours: {
    required: 500,
    completed: 287,
    breakdown: [
      { label: "Direct Service",        hours: 189, color: "#6366f1" },
      { label: "Supervision",           hours: 42,  color: "#8b5cf6" },
      { label: "Group Work",            hours: 31,  color: "#06b6d4" },
      { label: "Admin & Documentation", hours: 25,  color: "#f59e0b" },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const today = new Date();
today.setHours(0, 0, 0, 0);

function dateOnly(d) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

function inRange(date, start, end) {
  return date >= start && date <= end;
}

function durationDays(start, end) {
  return Math.round((end - start) / 864e5) + 1;
}

function fmtDate(d, opts) {
  return d.toLocaleDateString("en-US", opts || { month: "short", day: "numeric", year: "numeric" });
}

// ── Header ────────────────────────────────────────────────────────────────────
function renderHeader() {
  const nameEl = document.getElementById("student-name");
  if (nameEl) nameEl.textContent = student.name;

  const metaEl = document.getElementById("student-meta");
  if (metaEl) metaEl.textContent =
    `${student.cohort.program} · ${student.cohort.year} · ID: ${student.studentId}`;

  const initials = student.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  document.getElementById("avatar").textContent = initials;

  const avatarNameEl = document.getElementById("avatar-user-name");
  if (avatarNameEl) avatarNameEl.textContent = student.name;

  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = today.getFullYear();

  const cfg = {
    active:    { label: "Active Placement",    dot: "bg-emerald-400 animate-pulse", pill: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    pending:   { label: "Pending Placement",   dot: "bg-amber-400",                 pill: "bg-amber-50 text-amber-700 border border-amber-200" },
    completed: { label: "Placement Completed", dot: "bg-slate-400",                 pill: "bg-slate-100 text-slate-600 border border-slate-200" },
  };
  const s = cfg[student.placement.status] || cfg.pending;
  const badgeEl = document.getElementById("status-badge");
  if (badgeEl) badgeEl.innerHTML =
    `<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${s.pill}">
       <span class="w-2 h-2 rounded-full flex-shrink-0 ${s.dot}"></span>
       ${s.label}
     </span>`;
}

// ── Info Cards ────────────────────────────────────────────────────────────────
function infoRow(label, value) {
  return `<div class="py-3">
    <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">${label}</p>
    <p class="text-sm text-slate-700 leading-snug whitespace-pre-line">${value}</p>
  </div>`;
}

function compactInfoRow(label, value) {
  return `<div class="py-1.5">
    <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">${label}</p>
    <p class="text-sm text-slate-700 leading-snug whitespace-pre-line">${value}</p>
  </div>`;
}

function renderPersonal() {
  document.getElementById("personal-info").innerHTML = [
    infoRow("Full Name",  student.name),
    infoRow("Student ID", student.studentId),
    infoRow("Address",    student.address),
    infoRow("Email",      `<a href="mailto:${student.email}" class="text-indigo-600 hover:underline">${student.email}</a>`),
    infoRow("Phone",      student.phone),
  ].join("");
}

function renderCohort() {
  document.getElementById("cohort-info").innerHTML = [
    infoRow("Cohort",          student.cohort.name),
    infoRow("Program",         student.cohort.program),
    infoRow("Year",            student.cohort.year),
    infoRow("Faculty Advisor", student.cohort.advisor),
    infoRow("Program Start",   student.cohort.startSemester),
  ].join("");
}

function renderAgency() {
  const pl = student.placement;
  const el = document.getElementById("agency-info");
  if (!el) return;
  el.innerHTML = [
    infoRow("Agency",           pl.agency),
    infoRow("Agency Address",   pl.agencyAddress),
    infoRow("Field Supervisor", pl.supervisor),
    infoRow("Supervisor Email", `<a href="mailto:${pl.supervisorEmail}" class="text-indigo-600 hover:underline">${pl.supervisorEmail}</a>`),
    infoRow("Supervisor Phone", pl.supervisorPhone),
  ].join("");
}

// ── Calendar ──────────────────────────────────────────────────────────────────
const fieldStart = dateOnly(student.placement.fieldStart);
const fieldEnd   = dateOnly(student.placement.fieldEnd);

let calendarDate = new Date(fieldStart.getFullYear(), fieldStart.getMonth(), 1);

function buildDayCell(d, year, month) {
  const date  = new Date(year, month, d);
  const dow   = date.getDay();
  const isTd  = isSameDay(date, today);
  const isSt  = isSameDay(date, fieldStart);
  const isEn  = isSameDay(date, fieldEnd);
  const inRng = inRange(date, fieldStart, fieldEnd);

  // Horizontal range strip (sits behind the day circle)
  let strip = "";
  if (inRng) {
    if (isSt && isEn) {
      // single-day range — no strip
    } else if (isSt) {
      // strip covers right half of cell only
      strip = `<div class="absolute inset-y-0.5 left-1/2 right-0 bg-indigo-100"></div>`;
    } else if (isEn) {
      // strip covers left half of cell only
      strip = `<div class="absolute inset-y-0.5 left-0 right-1/2 bg-indigo-100"></div>`;
    } else {
      // full-width strip; cap corners at row boundaries
      const capL = dow === 0 ? "rounded-l-full" : "";
      const capR = dow === 6 ? "rounded-r-full" : "";
      strip = `<div class="absolute inset-y-0.5 left-0 right-0 bg-indigo-100 ${capL} ${capR}"></div>`;
    }
  }

  // Day number / circle
  let inner = "";
  if (isSt || isEn) {
    const title = isSt ? "Fieldwork Start" : "Fieldwork End";
    inner = `<span class="relative z-10 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-sm" title="${title}">${d}</span>`;
  } else if (isTd) {
    const textClr = inRng ? "text-indigo-800 font-semibold" : "text-slate-800 font-semibold";
    inner = `<span class="relative z-10 w-8 h-8 flex items-center justify-center rounded-full ring-2 ring-indigo-500 ring-offset-1 ${textClr} text-sm" title="Today">${d}</span>`;
  } else if (inRng) {
    inner = `<span class="relative z-10 text-sm text-indigo-700 font-medium">${d}</span>`;
  } else {
    inner = `<span class="relative z-10 text-sm text-slate-400">${d}</span>`;
  }

  const title = isSt ? "Fieldwork Start" : isEn ? "Fieldwork End" : isTd ? "Today" : "";
  return `<div class="relative h-9 flex items-center justify-center" ${title ? `title="${title}"` : ""}>${strip}${inner}</div>`;
}

function renderCalendar(containerId = "calendar-section") {
  const year  = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDow    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Leading empty cells
  let cells = Array.from({ length: firstDow }, () => `<div></div>`).join("");
  for (let d = 1; d <= daysInMonth; d++) cells += buildDayCell(d, year, month);

  // Timeline progress (overall fieldwork)
  const totalDays   = durationDays(fieldStart, fieldEnd);
  const elapsedDays = today < fieldStart ? 0
                    : today > fieldEnd   ? totalDays
                    : durationDays(fieldStart, today);
  const timelinePct = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
  const daysLeft    = today > fieldEnd ? 0 : Math.max(0, durationDays(today, fieldEnd) - 1);

  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <!-- Month navigator -->
    <div class="flex items-center justify-between mb-4">
      <button id="${containerId}-prev"
        class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label="Previous month">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <span class="font-semibold text-slate-800">${MONTHS[month]} ${year}</span>
      <button id="${containerId}-next"
        class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label="Next month">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- Day-of-week headers -->
    <div class="grid grid-cols-7 mb-1">
      ${DAYS_SHORT.map(d => `<div class="text-center text-xs font-medium text-slate-400 py-1">${d}</div>`).join("")}
    </div>

    <!-- Day grid -->
    <div class="grid grid-cols-7">
      ${cells}
    </div>

    <!-- Legend -->
    <div class="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>Start / End
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded bg-indigo-100 inline-block"></span>In Fieldwork
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full ring-2 ring-indigo-500 ring-offset-1 inline-block"></span>Today
      </span>
    </div>

    <!-- Key dates -->
    <div class="grid grid-cols-3 gap-3 mt-4">
      <div class="bg-slate-50 rounded-xl p-3 text-center">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Start</p>
        <p class="text-xs font-semibold text-slate-700">${fmtDate(fieldStart)}</p>
      </div>
      <div class="bg-slate-50 rounded-xl p-3 text-center">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">End</p>
        <p class="text-xs font-semibold text-slate-700">${fmtDate(fieldEnd)}</p>
      </div>
      <div class="bg-indigo-50 rounded-xl p-3 text-center">
        <p class="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">Duration</p>
        <p class="text-xs font-semibold text-indigo-700">${totalDays} days</p>
      </div>
    </div>

    <!-- Fieldwork timeline progress -->
    <div class="mt-5 pt-4 border-t border-slate-100">
      <div class="flex justify-between items-baseline mb-2">
        <p class="text-xs font-semibold text-slate-500">Fieldwork Timeline</p>
        <p class="text-xs text-slate-400">${daysLeft > 0 ? `${daysLeft} days remaining` : today < fieldStart ? "Not started" : "Completed"}</p>
      </div>
      <!-- Timeline bar -->
      <div class="relative h-3 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-700"
          style="width:${timelinePct}%"></div>
      </div>
      <div class="flex justify-between text-[10px] text-slate-400 mt-1.5">
        <span>${fmtDate(fieldStart, { month: "short", day: "numeric" })}</span>
        <span class="font-medium text-indigo-600">${timelinePct}% elapsed</span>
        <span>${fmtDate(fieldEnd, { month: "short", day: "numeric" })}</span>
      </div>
    </div>
  `;

  document.getElementById(containerId + "-prev").addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
    renderCalendar(containerId);
  });
  document.getElementById(containerId + "-next").addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    renderCalendar(containerId);
  });
}

// ── Hours Tracker ─────────────────────────────────────────────────────────────
function renderHours() {
  const { required, completed, breakdown } = student.hours;
  const remaining = required - completed;
  const pct       = Math.round((completed / required) * 100);

  // SVG donut
  const R    = 54;
  const circ = 2 * Math.PI * R;
  const fill = (completed / required) * circ;

  const breakdownRows = breakdown.map(item => {
    const barW = Math.round((item.hours / completed) * 100);
    return `<div class="space-y-1">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full flex-shrink-0" style="background:${item.color}"></span>
          <span class="text-xs text-slate-600">${item.label}</span>
        </div>
        <span class="text-xs font-semibold text-slate-700">${item.hours}h</span>
      </div>
      <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700" style="width:${barW}%;background:${item.color}"></div>
      </div>
    </div>`;
  }).join("");

  document.getElementById("hours-section").innerHTML = `
    <!-- Donut chart -->
    <div class="flex justify-center mb-5">
      <div class="relative inline-flex items-center justify-center">
        <svg width="152" height="152" viewBox="0 0 152 152" class="donut-svg">
          <defs>
            <linearGradient id="hoursGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#6366f1"/>
              <stop offset="100%" stop-color="#8b5cf6"/>
            </linearGradient>
          </defs>
          <!-- Track -->
          <circle cx="76" cy="76" r="${R}" fill="none" stroke="#e2e8f0" stroke-width="14"/>
          <!-- Progress arc -->
          <circle cx="76" cy="76" r="${R}" fill="none"
            stroke="url(#hoursGrad)" stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${fill.toFixed(2)} ${(circ - fill).toFixed(2)}"
            transform="rotate(-90 76 76)"
            class="donut-arc"/>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-3xl font-bold text-slate-800 leading-none">${pct}%</span>
          <span class="text-xs text-slate-400 mt-1">Complete</span>
        </div>
      </div>
    </div>

    <!-- Stat pills -->
    <div class="grid grid-cols-2 gap-3 mb-5">
      <div class="bg-indigo-50 rounded-xl p-3 text-center">
        <p class="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">Completed</p>
        <p class="text-xl font-bold text-indigo-700 leading-none">${completed}<span class="text-xs font-normal ml-0.5">hrs</span></p>
      </div>
      <div class="bg-slate-50 rounded-xl p-3 text-center">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Remaining</p>
        <p class="text-xl font-bold text-slate-600 leading-none">${remaining}<span class="text-xs font-normal ml-0.5">hrs</span></p>
      </div>
    </div>

    <!-- Overall progress bar -->
    <div class="mb-5">
      <div class="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>Overall Progress</span>
        <span>${completed} / ${required} hrs</span>
      </div>
      <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
          style="width:${pct}%"></div>
      </div>
    </div>

    <!-- Breakdown -->
    <div class="pt-4 border-t border-slate-100">
      <p class="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4">Hours Breakdown</p>
      <div class="space-y-3.5">${breakdownRows}</div>
    </div>
  `;
}

// ── Placement Status Card ─────────────────────────────────────────────────────
function renderPlacementStatus() {
  const pl = student.placement;
  const cfg = {
    active:    { label: "Active",    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400 animate-pulse" },
    pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-400" },
    completed: { label: "Completed", cls: "bg-slate-100 text-slate-600 border border-slate-200",      dot: "bg-slate-400" },
  };
  const s = cfg[pl.status] || cfg.pending;
  const psEl = document.getElementById("placement-status-info");
  if (!psEl) return;
  psEl.innerHTML = [
    infoRow("Status", `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}"><span class="w-1.5 h-1.5 rounded-full ${s.dot}"></span>${s.label}</span>`),
    infoRow("Field Supervisor", pl.supervisor),
    infoRow("Supervisor Email", `<a href="mailto:${pl.supervisorEmail}" class="text-indigo-600 hover:underline">${pl.supervisorEmail}</a>`),
    infoRow("Supervisor Phone", pl.supervisorPhone),
    infoRow("Start Date", fmtDate(pl.fieldStart)),
    infoRow("End Date",   fmtDate(pl.fieldEnd)),
  ].join("");
}

// ── Tab Switching ─────────────────────────────────────────────────────────────
const STD_TAB_META = {
  home:    { heading: "Welcome, " + student.name },
  profile: { heading: "Profile" },
};

function switchStudentTab(tab) {
  ["home", "profile"].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle("hidden", t !== tab);
  });

  document.querySelectorAll(".std-tab").forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("std-active", isActive);
    const iconWrap = btn.querySelector(".std-icon-wrap");
    const icon     = btn.querySelector("svg");
    if (isActive) {
      iconWrap.classList.remove("std-icon-inactive");
      iconWrap.classList.add("std-icon-active");
      icon.classList.remove("text-slate-300");
      icon.classList.add("text-white");
    } else {
      iconWrap.classList.remove("std-icon-active");
      iconWrap.classList.add("std-icon-inactive");
      icon.classList.remove("text-white");
      icon.classList.add("text-slate-300");
    }
  });

  document.getElementById("page-heading").textContent = STD_TAB_META[tab].heading;
}

// ── Theme Management ──────────────────────────────────────────────────────────
const THEME_KEY = "fepms-theme";

function applyTheme(mode) {
  const isDark = mode === "dark" ||
    (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem(THEME_KEY, mode);
  document.querySelectorAll(".theme-option").forEach(btn => {
    btn.classList.toggle("theme-option-active", btn.dataset.theme === mode);
  });
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "auto";
  applyTheme(saved);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if ((localStorage.getItem(THEME_KEY) || "auto") === "auto") applyTheme("auto");
  });
}

// ── Text Size Management ───────────────────────────────────────────────────
const TEXT_SIZE_KEY = "fepms-text-size";
const TEXT_SIZE_SCALE = { small: "87.5%", medium: "100%", large: "112.5%" };

function applyTextSize(size) {
  document.documentElement.style.fontSize = TEXT_SIZE_SCALE[size] || TEXT_SIZE_SCALE.medium;
  localStorage.setItem(TEXT_SIZE_KEY, size);
  document.querySelectorAll(".text-size-option").forEach(btn => {
    btn.classList.toggle("text-size-option-active", btn.dataset.textSize === size);
  });
}

function initTextSize() {
  applyTextSize(localStorage.getItem(TEXT_SIZE_KEY) || "medium");
}

// ── Avatar Dropdown ───────────────────────────────────────────────────────────
function toggleAvatarDropdown() {
  document.getElementById("avatar-dropdown").classList.toggle("hidden");
}

function openSettings() {
  document.getElementById("avatar-dropdown").classList.add("hidden");
  document.getElementById("settings-modal").classList.remove("hidden");
}

function closeSettings() {
  document.getElementById("settings-modal").classList.add("hidden");
}

function handleExit() {
  if (confirm("Sign out of the Field Education Program?")) {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;background:#f8fafc;">
        <div style="text-align:center;color:#64748b;padding:2rem">
          <p style="font-size:1.5rem;font-weight:700;color:#1e293b;margin-bottom:0.5rem">Signed Out</p>
          <p>You have been signed out of the Field Education Program.</p>
        </div>
      </div>`;
  }
}

// ── Home Tab Renders ──────────────────────────────────────────────────────────
function renderHomePlacementStatus() {
  const el = document.getElementById("home-placement-status");
  if (!el) return;
  const pl = student.placement;
  const cfg = {
    active:    { label: "Active",    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400 animate-pulse" },
    pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-400" },
    completed: { label: "Completed", cls: "bg-slate-100 text-slate-600 border border-slate-200",      dot: "bg-slate-400" },
  };
  const s = cfg[pl.status] || cfg.pending;
  el.innerHTML = [
    compactInfoRow("Status", `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.cls}"><span class="w-1.5 h-1.5 rounded-full ${s.dot}"></span>${s.label}</span>`),
    compactInfoRow("Start Date", fmtDate(pl.fieldStart)),
    compactInfoRow("End Date",   fmtDate(pl.fieldEnd)),
  ].join("");
}

function renderHomeLocation() {
  const el = document.getElementById("home-location");
  if (!el) return;
  const pl = student.placement;
  el.innerHTML = [
    compactInfoRow("Agency",  pl.agency),
    compactInfoRow("Address", pl.agencyAddress),
  ].join("");
}

function renderHomeAcademicContact() {
  const el = document.getElementById("home-academic-contact");
  if (!el) return;
  const pl = student.placement;
  el.innerHTML = `
    <div class="py-2 grid grid-cols-2 gap-x-4">
      <div>
        ${compactInfoRow("Field Liaison", student.cohort.advisor)}
        ${compactInfoRow("Email", student.cohort.advisorEmail)}
        ${compactInfoRow("Phone", student.cohort.advisorPhone)}
      </div>
      <div class="border-l border-slate-100 pl-4">
        ${compactInfoRow("Field Supervisor", pl.supervisor)}
        ${compactInfoRow("Email", pl.supervisorEmail)}
        ${compactInfoRow("Phone", pl.supervisorPhone)}
      </div>
    </div>
  `;
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.querySelectorAll(".std-tab").forEach(btn => {
  btn.addEventListener("click", () => switchStudentTab(btn.dataset.tab));
});

initTheme();
initTextSize();

renderHeader();
document.getElementById("page-heading").textContent = STD_TAB_META.home.heading;
renderPersonal();
renderHomePlacementStatus();
renderHomeLocation();
renderHomeAcademicContact();
renderCalendar("home-calendar-section");

document.addEventListener("click", e => {
  const avatarWrap = document.getElementById("avatar-menu-wrap");
  const avatarDd   = document.getElementById("avatar-dropdown");
  if (avatarWrap && !avatarWrap.contains(e.target)) avatarDd.classList.add("hidden");

  const notifWrap = document.getElementById("notif-wrap");
  const notifDd   = document.getElementById("notif-dropdown");
  if (notifWrap && !notifWrap.contains(e.target)) notifDd.classList.add("hidden");
});

function toggleNotifications() {
  document.getElementById("notif-dropdown").classList.toggle("hidden");
  document.getElementById("avatar-dropdown").classList.add("hidden");
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.getElementById("avatar-dropdown").classList.add("hidden");
    closeSettings();
  }
});
