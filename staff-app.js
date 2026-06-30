// ── Agency Data ───────────────────────────────────────────────────────────────
const agencies = [
  {
    id: 1, name: "Community Health & Wellness Center",
    contact: "Dr. Sarah Johnson", title: "Director of Field Education",
    email: "s.johnson@chwc.org", phone: "(212) 555-0456",
    address: "456 Park Avenue", county: "San Francisco County",
    contract: "Active",
  },
  {
    id: 2, name: "Bay Area Mental Health Services",
    contact: "Marcus Reid", title: "Community Outreach Manager",
    email: "m.reid@bamhs.org", phone: "(510) 555-0234",
    address: "88 Broadway Blvd, Oakland, CA 94607", county: "Alameda County",
    contract: "Active",
  },
  {
    id: 3, name: "Central Valley Youth Services",
    contact: "Lucia Flores", title: "Program Coordinator",
    email: "l.flores@cvys.org", phone: "(209) 555-0678",
    address: "321 Oak Street, Modesto, CA 95354", county: "Stanislaus County",
    contract: "Pending",
  },
  {
    id: 4, name: "Sacramento Family Support Center",
    contact: "Thomas Nguyen", title: "Field Supervisor",
    email: "t.nguyen@sfsc.org", phone: "(916) 555-0321",
    address: "750 Capitol Avenue, Sacramento, CA 95814", county: "Sacramento County",
    contract: "Active",
  },
  {
    id: 5, name: "Fresno Community Outreach",
    contact: "Angela Torres", title: "Social Work Supervisor",
    email: "a.torres@fco.org", phone: "(559) 555-0987",
    address: "199 Fulton Street, Fresno, CA 93721", county: "Fresno County",
    contract: "Active",
  },
  {
    id: 6, name: "Oakland Social Services Agency",
    contact: "Derek Miles", title: "Agency Director",
    email: "d.miles@ossa.org", phone: "(510) 555-0112",
    address: "500 Lake Merritt Blvd, Oakland, CA 94610", county: "Alameda County",
    contract: "Expired",
  },
  {
    id: 7, name: "Stockton Behavioral Health Clinic",
    contact: "Patricia Lim", title: "Clinical Director",
    email: "p.lim@sbhc.org", phone: "(209) 555-0445",
    address: "1040 W. Fremont Street, Stockton, CA 95203", county: "San Joaquin County",
    contract: "Active",
  },
  {
    id: 8, name: "San Jose Healthcare Partners",
    contact: "James Okafor", title: "Placement Liaison",
    email: "j.okafor@sjhp.org", phone: "(408) 555-0773",
    address: "2200 Alum Rock Avenue, San Jose, CA 95116", county: "Santa Clara County",
    contract: "Pending",
  },
];

const CONTRACT_STYLES = {
  Active:  { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400 animate-pulse" },
  Pending: { pill: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-400" },
  Expired: { pill: "bg-red-50 text-red-600 border border-red-200",             dot: "bg-red-400" },
};

// ── Roster Data ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "fepms-coordinator-notes";

const roster = [
  {
    id: 1, name: "Jane Smith", phone: "(415) 555-0123", cohort: "Fall 2024",
    format: "Hybrid", enrollment: "Full-Time",
    city: "San Francisco", county: "San Francisco County",
    concentration: "Behavioral Health",
    liaison: "Annette", status: "Active",
    notes: "Strong rapport with site supervisor. On track for 500-hour requirement by August.",
  },
  {
    id: 2, name: "Marcus Lee", phone: "(209) 555-0456", cohort: "Spring 2024",
    format: "Online", enrollment: "Part-Time",
    city: "Stockton", county: "San Joaquin County",
    concentration: "Health Care",
    liaison: "Vanessa", status: "Active",
    notes: "",
  },
  {
    id: 3, name: "Priya Patel", phone: "(916) 555-0789", cohort: "Fall 2025",
    format: "Hybrid", enrollment: "Full-Time",
    city: "Sacramento", county: "Sacramento County",
    concentration: "Behavioral Health",
    liaison: "Halide", status: "Pending",
    notes: "Awaiting signed affiliation agreement from agency before start date can be confirmed.",
  },
  {
    id: 4, name: "Diego Ramirez", phone: "(209) 555-0234", cohort: "Spring 2024",
    format: "Online", enrollment: "Full-Time",
    city: "Modesto", county: "Stanislaus County",
    concentration: "Health Care",
    liaison: "Annette", status: "Active",
    notes: "",
  },
  {
    id: 5, name: "Olivia Chen", phone: "(510) 555-0345", cohort: "Spring 2023",
    format: "Hybrid", enrollment: "Part-Time",
    city: "Oakland", county: "Alameda County",
    concentration: "Behavioral Health",
    liaison: "Vanessa", status: "Completed",
    notes: "Completed all required hours on 5/30. Final evaluation submitted by site supervisor.",
  },
  {
    id: 6, name: "Tyler Brooks", phone: "(559) 555-0567", cohort: "Fall 2024",
    format: "Online", enrollment: "Full-Time",
    city: "Fresno", county: "Fresno County",
    concentration: "Health Care",
    liaison: "Halide", status: "Active",
    notes: "Flagged low hours logged for two consecutive weeks — following up with agency supervisor.",
  },
  {
    id: 7, name: "Amara Johnson", phone: "(408) 555-0678", cohort: "Fall 2025",
    format: "Hybrid", enrollment: "Full-Time",
    city: "San Jose", county: "Santa Clara County",
    concentration: "Behavioral Health",
    liaison: "Annette", status: "Pending",
    notes: "",
  },
  {
    id: 8, name: "Kevin Nguyen", phone: "(209) 555-0890", cohort: "Spring 2024",
    format: "Online", enrollment: "Part-Time",
    city: "Stockton", county: "San Joaquin County",
    concentration: "Health Care",
    liaison: "Vanessa", status: "Active",
    notes: "",
  },
  {
    id: 9, name: "Sofia Garcia", phone: "(916) 555-0912", cohort: "Fall 2024",
    format: "Hybrid", enrollment: "Full-Time",
    city: "Sacramento", county: "Sacramento County",
    concentration: "Behavioral Health",
    liaison: "Halide", status: "Active",
    notes: "Mid-placement evaluation scheduled for next site visit.",
  },
  {
    id: 10, name: "Ben Carter", phone: "(209) 555-0111", cohort: "Fall 2025",
    format: "Online", enrollment: "Full-Time",
    city: "Stockton", county: "San Joaquin County",
    concentration: "Health Care",
    liaison: "Annette", status: "Pending",
    notes: "",
  },
];

// Pacific email convention: first initial + "_" + last name, lowercased, at u.pacific.edu.
// A trailing number is appended only to disambiguate students who'd otherwise share an address.
// This is a placeholder — coordinators will enter real Pacific emails manually later.
function assignPacificEmails(students) {
  const seen = {};
  students.forEach(s => {
    const [first, ...rest] = s.name.trim().split(/\s+/);
    const last = rest.join("").toLowerCase().replace(/[^a-z]/g, "");
    const base = `${first[0].toLowerCase()}_${last}`;
    const count = (seen[base] = (seen[base] || 0) + 1);
    s.email = `${base}${count > 1 ? count : ""}@u.pacific.edu`;
  });
}
assignPacificEmails(roster);

// Load any saved notes from a previous session
function loadSavedNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    roster.forEach(s => { if (saved[s.id] !== undefined) s.notes = saved[s.id]; });
  } catch (e) { /* ignore corrupt storage */ }
}

function persistNotes() {
  const map = {};
  roster.forEach(s => { map[s.id] = s.notes; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

// ── Badge helpers ────────────────────────────────────────────────────────────
function badge(text, cls) {
  return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}">${text}</span>`;
}

const COHORT_STYLES       = "bg-cyan-50 text-cyan-700 border border-cyan-200";
const FORMAT_STYLES       = { Online: "bg-sky-50 text-sky-700 border border-sky-200", Hybrid: "bg-violet-50 text-violet-700 border border-violet-200" };
const ENROLLMENT_STYLES   = { "Full-Time": "bg-indigo-50 text-indigo-700 border border-indigo-200", "Part-Time": "bg-slate-100 text-slate-600 border border-slate-200" };
const CONCENTRATION_STYLES = { "Behavioral Health": "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200", "Health Care": "bg-emerald-50 text-emerald-700 border border-emerald-200" };
const LIAISON_STYLES      = { Annette: "bg-blue-50 text-blue-700 border border-blue-200", Vanessa: "bg-pink-50 text-pink-700 border border-pink-200", Halide: "bg-amber-50 text-amber-700 border border-amber-200" };
const STATUS_STYLES       = {
  Active:    { dot: "bg-emerald-400 animate-pulse", pill: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  Pending:   { dot: "bg-amber-400",                 pill: "bg-amber-50 text-amber-700 border border-amber-200" },
  Completed: { dot: "bg-slate-400",                 pill: "bg-slate-100 text-slate-600 border border-slate-200" },
};

function statusBadge(status) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.pill}">
    <span class="w-1.5 h-1.5 rounded-full ${s.dot}"></span>${status}
  </span>`;
}

function initials(name) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

// ── Filtering & Search ──────────────────────────────────────────────────────
function getFilters() {
  return {
    search: document.getElementById("search-input").value.trim().toLowerCase(),
    cohort: document.getElementById("filter-cohort").value,
    concentration: document.getElementById("filter-concentration").value,
    liaison: document.getElementById("filter-liaison").value,
    status: document.getElementById("filter-status").value,
    format: document.getElementById("filter-format").value,
  };
}

function applyFilters() {
  const f = getFilters();
  return roster.filter(s => {
    if (f.search && !s.name.toLowerCase().includes(f.search)) return false;
    if (f.cohort && s.cohort !== f.cohort) return false;
    if (f.concentration && s.concentration !== f.concentration) return false;
    if (f.liaison && s.liaison !== f.liaison) return false;
    if (f.status && s.status !== f.status) return false;
    if (f.format && s.format !== f.format) return false;
    return true;
  });
}

// ── Column Sorting ───────────────────────────────────────────────────────────
const COLUMNS = [
  { key: "name",          label: "Student" },
  { key: "status",        label: "Placement Status" },
  { key: "cohort",        label: "Cohort" },
  { key: "format",        label: "Format" },
  { key: "enrollment",    label: "Enrollment" },
  { key: "city",          label: "Location" },
  { key: "concentration", label: "Concentration" },
  { key: "email",         label: "Pacific Email" },
  { key: "liaison",       label: "Field Liaison" },
  { key: "notes",         label: "Notes" },
];

let sortKey = "name";
let sortDir = "asc"; // "asc" | "desc"

function renderTableHeader() {
  document.getElementById("roster-head-row").innerHTML = COLUMNS.map(col => `
    <th class="th-cell sortable" data-sort="${col.key}">
      ${col.label}<svg class="sort-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
    </th>
  `).join("");

  document.querySelectorAll(".th-cell.sortable").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (sortKey === key) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortKey = key;
        sortDir = "asc";
      }
      renderRoster();
    });
  });
}

function updateSortIndicators() {
  document.querySelectorAll(".th-cell.sortable").forEach(th => {
    const active = th.dataset.sort === sortKey;
    th.classList.toggle("sort-active", active);
    th.classList.toggle("sort-desc", active && sortDir === "desc");
  });
}

function applySort(list) {
  if (!sortKey) return list;
  return [...list].sort((a, b) => {
    const av = String(a[sortKey] ?? "").toLowerCase();
    const bv = String(b[sortKey] ?? "").toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
}

// ── Stat Cards ───────────────────────────────────────────────────────────────
function renderStats() {
  const total = roster.length;
  const active = roster.filter(s => s.status === "Active").length;
  const pending = roster.filter(s => s.status === "Pending").length;
  const completed = roster.filter(s => s.status === "Completed").length;

  const stats = [
    { label: "Total Students", value: total, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "teal" },
    { label: "Active Placements", value: active, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
    { label: "Pending", value: pending, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "amber" },
    { label: "Completed", value: completed, icon: "M5 13l4 4L19 7", color: "slate" },
  ];

  document.getElementById("stat-cards").innerHTML = stats.map(s => `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-${s.color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${s.icon}"/>
        </svg>
      </div>
      <div>
        <p class="text-xl font-bold text-slate-800 leading-none">${s.value}</p>
        <p class="text-xs text-slate-400 mt-1">${s.label}</p>
      </div>
    </div>
  `).join("");
}

// ── Roster Table ─────────────────────────────────────────────────────────────
function renderRoster() {
  const filtered = applySort(applyFilters());
  updateSortIndicators();
  const tbody = document.getElementById("roster-body");
  const emptyState = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    tbody.innerHTML = filtered.map(s => `
      <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
        <td class="td-cell">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">${initials(s.name)}</div>
            <div>
              <p class="font-medium text-slate-700">${s.name}</p>
              <p class="text-xs text-slate-400">${s.phone}</p>
            </div>
          </div>
        </td>
        <td class="td-cell">${statusBadge(s.status)}</td>
        <td class="td-cell">${badge(s.cohort, COHORT_STYLES)}</td>
        <td class="td-cell">${badge(s.format, FORMAT_STYLES[s.format])}</td>
        <td class="td-cell">${badge(s.enrollment, ENROLLMENT_STYLES[s.enrollment])}</td>
        <td class="td-cell">
          <p class="text-slate-700">${s.city}</p>
          <p class="text-xs text-slate-400">${s.county}</p>
        </td>
        <td class="td-cell">${badge(s.concentration, CONCENTRATION_STYLES[s.concentration])}</td>
        <td class="td-cell text-slate-500 text-xs">${s.email}</td>
        <td class="td-cell">${badge(s.liaison, LIAISON_STYLES[s.liaison])}</td>
        <td class="td-cell">
          <button data-id="${s.id}" class="notes-btn flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border ${s.notes ? "border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100" : "border-slate-200 text-slate-400 hover:bg-slate-50"} transition-colors">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            ${s.notes ? "View / Edit" : "Add Note"}
          </button>
        </td>
      </tr>
    `).join("");
  }

  resultCount.textContent = `Showing ${filtered.length} of ${roster.length} students`;

  document.querySelectorAll(".notes-btn").forEach(btn => {
    btn.addEventListener("click", () => openNotesModal(Number(btn.dataset.id)));
  });
}

// ── Notes Modal ──────────────────────────────────────────────────────────────
let activeStudentId = null;

function openNotesModal(id) {
  const student = roster.find(s => s.id === id);
  if (!student) return;
  activeStudentId = id;

  document.getElementById("modal-student-name").textContent = student.name;
  document.getElementById("modal-student-meta").textContent =
    `${student.concentration} · ${student.liaison} (Liaison) · ${student.status}`;
  document.getElementById("modal-notes-textarea").value = student.notes;
  document.getElementById("modal-save-status").textContent = "";

  document.getElementById("modal-detail-grid").innerHTML = [
    ["Cohort", student.cohort],
    ["Format", student.format],
    ["Enrollment", student.enrollment],
    ["Location", `${student.city}, ${student.county}`],
    ["Phone", student.phone],
    ["Pacific Email", student.email],
    ["Field Liaison", student.liaison],
  ].map(([label, value]) => `
    <div>
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">${label}</p>
      <p class="text-slate-700 font-medium">${value}</p>
    </div>
  `).join("");

  const modal = document.getElementById("notes-modal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("modal-notes-textarea").focus();
}

function closeNotesModal() {
  document.getElementById("notes-modal").classList.add("hidden");
  document.body.style.overflow = "";
  activeStudentId = null;
}

function saveNotes() {
  if (activeStudentId === null) return;
  const student = roster.find(s => s.id === activeStudentId);
  student.notes = document.getElementById("modal-notes-textarea").value.trim();
  persistNotes();
  document.getElementById("modal-save-status").textContent = "Saved ✓";
  renderRoster();
  setTimeout(closeNotesModal, 450);
}

// ── Agency Renderer ───────────────────────────────────────────────────────────
function getAgencyFilters() {
  return {
    search: document.getElementById("agency-search").value.trim().toLowerCase(),
    contract: document.getElementById("filter-contract").value,
  };
}

function renderAgencies() {
  const { search, contract } = getAgencyFilters();
  const filtered = agencies.filter(a => {
    if (search && !a.name.toLowerCase().includes(search)) return false;
    if (contract && a.contract !== contract) return false;
    return true;
  });

  const grid    = document.getElementById("agency-cards");
  const empty   = document.getElementById("agency-empty");
  const count   = document.getElementById("agency-count");

  if (filtered.length === 0) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
    grid.innerHTML = filtered.map(a => {
      const cs = CONTRACT_STYLES[a.contract] || CONTRACT_STYLES.Pending;
      return `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
          <!-- Header -->
          <div class="flex items-start justify-between gap-3">
            <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-slate-800 text-sm leading-snug">${a.name}</h3>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${cs.pill}">
              <span class="w-1.5 h-1.5 rounded-full ${cs.dot}"></span>${a.contract} Contract
            </span>
          </div>

          <!-- Contact -->
          <div class="border-t border-slate-50 pt-4 grid grid-cols-1 gap-4">
            <div>
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Contact Person</p>
              <p class="text-sm font-semibold text-slate-700">${a.contact}</p>
              <p class="text-xs text-slate-400 mb-2">${a.title}</p>
              <div class="space-y-1">
                <a href="mailto:${a.email}" class="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  ${a.email}
                </a>
                <p class="flex items-center gap-1.5 text-xs text-slate-600">
                  <svg class="w-3.5 h-3.5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  ${a.phone}
                </p>
              </div>
            </div>
            <div class="border-t border-slate-50 pt-3">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Location</p>
              <p class="flex items-start gap-1.5 text-xs text-slate-600">
                <svg class="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>${a.address}<br/><span class="text-slate-400">${a.county}</span></span>
              </p>
            </div>
          </div>
        </div>`;
    }).join("");
  }
  count.textContent = `Showing ${filtered.length} of ${agencies.length} agencies`;
}

// ── Tab Switching ─────────────────────────────────────────────────────────────
const TAB_META = {
  students: {
    heading: "Student Roster",
    subheading: "Monitor placements, liaisons, and notes across your caseload.",
  },
  agencies: {
    heading: "Agency Directory",
    subheading: "View contracted agencies, contact information, and contract status.",
  },
};

let activeTab = "students";

function switchTab(tab) {
  activeTab = tab;
  document.getElementById("tab-students").classList.toggle("hidden", tab !== "students");
  document.getElementById("tab-agencies").classList.toggle("hidden", tab !== "agencies");
  document.querySelectorAll(".sidebar-tab").forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("sidebar-active", isActive);
    const iconWrap = btn.querySelector(".sidebar-icon-wrap");
    const icon     = btn.querySelector("svg");
    if (isActive) {
      iconWrap.classList.remove("bg-slate-200");
      iconWrap.classList.add("bg-teal-500");
      icon.classList.remove("text-slate-500");
      icon.classList.add("text-white");
    } else {
      iconWrap.classList.remove("bg-teal-500");
      iconWrap.classList.add("bg-slate-200");
      icon.classList.remove("text-white");
      icon.classList.add("text-slate-500");
    }
  });
  document.getElementById("page-heading").textContent    = TAB_META[tab].heading;
  document.getElementById("page-subheading").textContent = TAB_META[tab].subheading;
}

// ── Event Wiring ─────────────────────────────────────────────────────────────
function resetFilters() {
  document.getElementById("search-input").value = "";
  document.getElementById("filter-cohort").value = "";
  document.getElementById("filter-concentration").value = "";
  document.getElementById("filter-liaison").value = "";
  document.getElementById("filter-status").value = "";
  document.getElementById("filter-format").value = "";
  renderRoster();
}

function resetAgencyFilters() {
  document.getElementById("agency-search").value = "";
  document.getElementById("filter-contract").value = "";
  renderAgencies();
}

function wireEvents() {
  ["search-input", "filter-cohort", "filter-concentration", "filter-liaison", "filter-status", "filter-format"]
    .forEach(id => document.getElementById(id).addEventListener("input", renderRoster));

  document.getElementById("clear-filters").addEventListener("click", resetFilters);
  document.getElementById("header-reset").addEventListener("click", () => {
    activeTab === "students" ? resetFilters() : resetAgencyFilters();
  });

  document.getElementById("agency-search").addEventListener("input", renderAgencies);
  document.getElementById("filter-contract").addEventListener("input", renderAgencies);
  document.getElementById("clear-agency-filters").addEventListener("click", resetAgencyFilters);

  document.querySelectorAll(".sidebar-tab").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("modal-close").addEventListener("click", closeNotesModal);
  document.getElementById("modal-cancel").addEventListener("click", closeNotesModal);
  document.getElementById("notes-backdrop").addEventListener("click", closeNotesModal);
  document.getElementById("modal-save").addEventListener("click", saveNotes);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && activeStudentId !== null) closeNotesModal();
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
const today = new Date();
document.getElementById("nav-date").textContent =
  today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
document.getElementById("footer-year").textContent = today.getFullYear();

loadSavedNotes();
renderStats();
renderTableHeader();
renderRoster();
renderAgencies();
wireEvents();
