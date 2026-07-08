// ── Shared persistence helpers ───────────────────────────────────────────────
// Roster/agencies/templates are seeded from these defaults on first load, then
// live in localStorage from then on — this is what lets the (future) admin
// dashboard's edits actually stick and show up here on reload.
const ROSTER_KEY    = "fepms-roster";
const AGENCIES_KEY  = "fepms-agencies";
const TEMPLATES_KEY = "fepms-templates";

function loadOrSeed(key, defaults) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) { /* fall through to reseed */ }
  const seeded = JSON.parse(JSON.stringify(defaults));
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

// ── Agency Data ───────────────────────────────────────────────────────────────
const DEFAULT_AGENCIES = [
  {
    id: 1, name: "Community Health & Wellness Center",
    contact: "Dr. Sarah Johnson", title: "Director of Field Education",
    email: "s.johnson@chwc.org", phone: "(212) 555-0456",
    address: "456 Park Avenue", city: "San Francisco", county: "San Francisco County",
    contract: "Active",
  },
  {
    id: 2, name: "Bay Area Mental Health Services",
    contact: "Marcus Reid", title: "Community Outreach Manager",
    email: "m.reid@bamhs.org", phone: "(510) 555-0234",
    address: "88 Broadway Blvd, Oakland, CA 94607", city: "Oakland", county: "Alameda County",
    contract: "Active",
  },
  {
    id: 3, name: "Central Valley Youth Services",
    contact: "Lucia Flores", title: "Program Coordinator",
    email: "l.flores@cvys.org", phone: "(209) 555-0678",
    address: "321 Oak Street, Modesto, CA 95354", city: "Modesto", county: "Stanislaus County",
    contract: "Pending",
  },
  {
    id: 4, name: "Sacramento Family Support Center",
    contact: "Thomas Nguyen", title: "Field Supervisor",
    email: "t.nguyen@sfsc.org", phone: "(916) 555-0321",
    address: "750 Capitol Avenue, Sacramento, CA 95814", city: "Sacramento", county: "Sacramento County",
    contract: "Active",
  },
  {
    id: 5, name: "Fresno Community Outreach",
    contact: "Angela Torres", title: "Social Work Supervisor",
    email: "a.torres@fco.org", phone: "(559) 555-0987",
    address: "199 Fulton Street, Fresno, CA 93721", city: "Fresno", county: "Fresno County",
    contract: "Active",
  },
  {
    id: 6, name: "Oakland Social Services Agency",
    contact: "Derek Miles", title: "Agency Director",
    email: "d.miles@ossa.org", phone: "(510) 555-0112",
    address: "500 Lake Merritt Blvd, Oakland, CA 94610", city: "Oakland", county: "Alameda County",
    contract: "Expired",
  },
  {
    id: 7, name: "Stockton Behavioral Health Clinic",
    contact: "Patricia Lim", title: "Clinical Director",
    email: "p.lim@sbhc.org", phone: "(209) 555-0445",
    address: "1040 W. Fremont Street, Stockton, CA 95203", city: "Stockton", county: "San Joaquin County",
    contract: "Active",
  },
  {
    id: 8, name: "San Jose Healthcare Partners",
    contact: "James Okafor", title: "Placement Liaison",
    email: "j.okafor@sjhp.org", phone: "(408) 555-0773",
    address: "2200 Alum Rock Avenue, San Jose, CA 95116", city: "San Jose", county: "Santa Clara County",
    contract: "Pending",
  },
];

let agencies = loadOrSeed(AGENCIES_KEY, DEFAULT_AGENCIES);
function persistAgencies() { localStorage.setItem(AGENCIES_KEY, JSON.stringify(agencies)); }

const CONTRACT_STYLES = {
  Active:  { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400 animate-pulse" },
  Pending: { pill: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-400" },
  Expired: { pill: "bg-red-50 text-red-600 border border-red-200",             dot: "bg-red-400" },
};

// ── Roster Data ───────────────────────────────────────────────────────────────
const DEFAULT_ROSTER = [
  {
    id: 1, name: "Jane Smith", phone: "(415) 555-0123", cohort: "Fall 2024",
    format: "Hybrid", enrollment: "Full-Time",
    address: "842 Valencia St", city: "San Francisco", county: "San Francisco County",
    concentration: "Behavioral Health", setting: "Community Mental Health Center",
    fieldStart: "Feb 3, 2026", fieldEnd: "Aug 28, 2026",
    fieldInstructor: "Dr. Sarah Johnson",
    fieldAgency: "Community Health & Wellness Center",
    liaison: "Annette", status: "Active",
    notes: "Strong rapport with site supervisor. On track for 500-hour requirement by August.",
  },
  {
    id: 2, name: "Marcus Lee", phone: "(209) 555-0456", cohort: "Spring 2024",
    format: "Online", enrollment: "Part-Time",
    address: "1220 N. Wilson Way", city: "Stockton", county: "San Joaquin County",
    concentration: "Health Care", setting: "Outpatient Clinic",
    fieldStart: "Jan 20, 2026", fieldEnd: "Jul 31, 2026",
    fieldInstructor: "Marcus Reid",
    fieldAgency: "Stockton Behavioral Health Clinic",
    liaison: "Vanessa", status: "Active",
    notes: "",
  },
  {
    id: 3, name: "Priya Patel", phone: "(916) 555-0789", cohort: "Fall 2025",
    format: "Hybrid", enrollment: "Full-Time",
    address: "3305 Freeport Blvd", city: "Sacramento", county: "Sacramento County",
    concentration: "Behavioral Health", setting: "School",
    fieldStart: "Sep 8, 2026", fieldEnd: "Apr 30, 2027",
    fieldInstructor: "—",
    fieldAgency: "—",
    liaison: "Halide", status: "Pending",
    notes: "Awaiting signed affiliation agreement from agency before start date can be confirmed.",
  },
  {
    id: 4, name: "Diego Ramirez", phone: "(209) 555-0234", cohort: "Spring 2024",
    format: "Online", enrollment: "Full-Time",
    address: "715 Sycamore Ave", city: "Modesto", county: "Stanislaus County",
    concentration: "Health Care", setting: "Hospital",
    fieldStart: "Jan 20, 2026", fieldEnd: "Aug 14, 2026",
    fieldInstructor: "Thomas Nguyen",
    fieldAgency: "Central Valley Youth Services",
    liaison: "Annette", status: "Active",
    notes: "",
  },
  {
    id: 5, name: "Olivia Chen", phone: "(510) 555-0345", cohort: "Spring 2023",
    format: "Hybrid", enrollment: "Part-Time",
    address: "509 Lake Merritt Blvd", city: "Oakland", county: "Alameda County",
    concentration: "Behavioral Health", setting: "Non-profit Organization",
    fieldStart: "Jan 16, 2025", fieldEnd: "May 30, 2025",
    fieldInstructor: "Derek Miles",
    fieldAgency: "Oakland Social Services Agency",
    liaison: "Vanessa", status: "Completed",
    notes: "Completed all required hours on 5/30. Final evaluation submitted by site supervisor.",
  },
  {
    id: 6, name: "Tyler Brooks", phone: "(559) 555-0567", cohort: "Fall 2024",
    format: "Online", enrollment: "Full-Time",
    address: "2148 N. Fresno St", city: "Fresno", county: "Fresno County",
    concentration: "Health Care", setting: "Residential Facility",
    fieldStart: "Feb 3, 2026", fieldEnd: "Aug 28, 2026",
    fieldInstructor: "Angela Torres",
    fieldAgency: "Fresno Community Outreach",
    liaison: "Halide", status: "Active",
    notes: "Flagged low hours logged for two consecutive weeks — following up with agency supervisor.",
  },
  {
    id: 7, name: "Amara Johnson", phone: "(408) 555-0678", cohort: "Fall 2025",
    format: "Hybrid", enrollment: "Full-Time",
    address: "1640 Alum Rock Ave", city: "San Jose", county: "Santa Clara County",
    concentration: "Behavioral Health", setting: "Government Agency",
    fieldStart: "Sep 8, 2026", fieldEnd: "Apr 30, 2027",
    fieldInstructor: "—",
    fieldAgency: "—",
    liaison: "Annette", status: "Pending",
    notes: "",
  },
  {
    id: 8, name: "Kevin Nguyen", phone: "(209) 555-0890", cohort: "Spring 2024",
    format: "Online", enrollment: "Part-Time",
    address: "880 E. Hammer Ln", city: "Stockton", county: "San Joaquin County",
    concentration: "Health Care", setting: "Outpatient Clinic",
    fieldStart: "Jan 20, 2026", fieldEnd: "Jul 31, 2026",
    fieldInstructor: "Patricia Lim",
    fieldAgency: "Stockton Behavioral Health Clinic",
    liaison: "Vanessa", status: "Active",
    notes: "",
  },
  {
    id: 9, name: "Sofia Garcia", phone: "(916) 555-0912", cohort: "Fall 2024",
    format: "Hybrid", enrollment: "Full-Time",
    address: "4210 Freeport Blvd", city: "Sacramento", county: "Sacramento County",
    concentration: "Behavioral Health", setting: "Community Mental Health Center",
    fieldStart: "Feb 3, 2026", fieldEnd: "Aug 28, 2026",
    fieldInstructor: "Dr. Sarah Johnson",
    fieldAgency: "Sacramento Family Support Center",
    liaison: "Halide", status: "Active",
    notes: "Mid-placement evaluation scheduled for next site visit.",
  },
  {
    id: 10, name: "Ben Carter", phone: "(209) 555-0111", cohort: "Fall 2025",
    format: "Online", enrollment: "Full-Time",
    address: "305 N. El Dorado St", city: "Stockton", county: "San Joaquin County",
    concentration: "Health Care", setting: "Hospital",
    fieldStart: "Sep 8, 2026", fieldEnd: "Apr 30, 2027",
    fieldInstructor: "—",
    fieldAgency: "—",
    liaison: "Annette", status: "Pending",
    notes: "",
  },
  {
    id: 11, name: "Emily Turner", phone: "(415) 555-0234", cohort: "Spring 2023",
    format: "Hybrid", enrollment: "Full-Time",
    address: "718 Valencia St", city: "San Francisco", county: "San Francisco County",
    concentration: "Behavioral Health", setting: "Community Mental Health Center",
    fieldStart: "Jan 16, 2025", fieldEnd: "May 30, 2025",
    fieldInstructor: "Dr. Sarah Johnson",
    fieldAgency: "Community Health & Wellness Center",
    liaison: "Vanessa", status: "Completed",
    notes: "Completed all required hours. Final evaluation submitted by site supervisor.",
  },
  {
    id: 12, name: "Marcus Chen", phone: "(510) 555-0456", cohort: "Spring 2024",
    format: "Online", enrollment: "Part-Time",
    address: "1500 Broadway", city: "Oakland", county: "Alameda County",
    concentration: "Health Care", setting: "Outpatient Clinic",
    fieldStart: "Jan 20, 2026", fieldEnd: "Jul 31, 2026",
    fieldInstructor: "Marcus Reid",
    fieldAgency: "Bay Area Mental Health Services",
    liaison: "Annette", status: "Active",
    notes: "",
  },
  {
    id: 13, name: "Grace Kim", phone: "(916) 555-0567", cohort: "Fall 2024",
    format: "Hybrid", enrollment: "Full-Time",
    address: "2100 J Street", city: "Sacramento", county: "Sacramento County",
    concentration: "Behavioral Health", setting: "Community Mental Health Center",
    fieldStart: "Feb 3, 2026", fieldEnd: "Aug 28, 2026",
    fieldInstructor: "Thomas Nguyen",
    fieldAgency: "Sacramento Family Support Center",
    liaison: "Halide", status: "Active",
    notes: "",
  },
  {
    id: 14, name: "Isaiah Brooks", phone: "(408) 555-0678", cohort: "Fall 2025",
    format: "Hybrid", enrollment: "Full-Time",
    address: "980 Alum Rock Ave", city: "San Jose", county: "Santa Clara County",
    concentration: "Behavioral Health", setting: "Government Agency",
    fieldStart: "Sep 8, 2026", fieldEnd: "Apr 30, 2027",
    fieldInstructor: "—",
    fieldAgency: "—",
    liaison: "Annette", status: "Pending",
    notes: "",
  },
  {
    id: 15, name: "Natalie Reyes", phone: "(209) 555-0789", cohort: "Spring 2024",
    format: "Online", enrollment: "Part-Time",
    address: "640 E. Weber Ave", city: "Stockton", county: "San Joaquin County",
    concentration: "Health Care", setting: "Outpatient Clinic",
    fieldStart: "Jan 20, 2026", fieldEnd: "Jul 31, 2026",
    fieldInstructor: "Patricia Lim",
    fieldAgency: "Stockton Behavioral Health Clinic",
    liaison: "Vanessa", status: "Active",
    notes: "",
  },
  {
    id: 16, name: "Owen Fisher", phone: "(559) 555-0890", cohort: "Fall 2024",
    format: "Online", enrollment: "Full-Time",
    address: "3300 N. Blackstone Ave", city: "Fresno", county: "Fresno County",
    concentration: "Health Care", setting: "Residential Facility",
    fieldStart: "Feb 3, 2026", fieldEnd: "Aug 28, 2026",
    fieldInstructor: "Angela Torres",
    fieldAgency: "Fresno Community Outreach",
    liaison: "Halide", status: "Active",
    notes: "Doing well, on pace for hour requirement.",
  },
  {
    id: 17, name: "Sophia Delgado", phone: "(408) 555-0912", cohort: "Fall 2025",
    format: "Hybrid", enrollment: "Full-Time",
    address: "1450 Tully Rd", city: "San Jose", county: "Santa Clara County",
    concentration: "Behavioral Health", setting: "Government Agency",
    fieldStart: "Sep 8, 2026", fieldEnd: "Apr 30, 2027",
    fieldInstructor: "—",
    fieldAgency: "—",
    liaison: "Vanessa", status: "Pending",
    notes: "",
  },
  {
    id: 18, name: "Ethan Walsh", phone: "(510) 555-0111", cohort: "Spring 2023",
    format: "Hybrid", enrollment: "Part-Time",
    address: "2200 Broadway", city: "Oakland", county: "Alameda County",
    concentration: "Behavioral Health", setting: "Non-profit Organization",
    fieldStart: "Jan 16, 2025", fieldEnd: "May 30, 2025",
    fieldInstructor: "Derek Miles",
    fieldAgency: "Oakland Social Services Agency",
    liaison: "Annette", status: "Completed",
    notes: "Completed all required hours on schedule.",
  },
  {
    id: 19, name: "Ava Patterson", phone: "(415) 555-0345", cohort: "Fall 2024",
    format: "Hybrid", enrollment: "Full-Time",
    address: "455 Fillmore St", city: "San Francisco", county: "San Francisco County",
    concentration: "Behavioral Health", setting: "Community Mental Health Center",
    fieldStart: "Feb 3, 2026", fieldEnd: "Aug 28, 2026",
    fieldInstructor: "Dr. Sarah Johnson",
    fieldAgency: "Community Health & Wellness Center",
    liaison: "Halide", status: "Active",
    notes: "",
  },
  {
    id: 20, name: "Lucas Ferreira", phone: "(209) 555-0456", cohort: "Spring 2024",
    format: "Online", enrollment: "Full-Time",
    address: "1600 Carver Rd", city: "Modesto", county: "Stanislaus County",
    concentration: "Health Care", setting: "Hospital",
    fieldStart: "Jan 20, 2026", fieldEnd: "Jul 31, 2026",
    fieldInstructor: "Lucia Flores",
    fieldAgency: "Central Valley Youth Services",
    liaison: "Vanessa", status: "Active",
    notes: "",
  },
];

// Staff notes are threaded: each student has a list of top-level notes, and any
// staff member can add a follow-up reply to an existing note.
let noteIdCounter = 1;

function migrateNotes(students) {
  students.forEach(s => {
    const text = s.notes;
    s.notes = text
      ? [{ id: noteIdCounter++, author: s.liaison, date: s.fieldStart !== "—" ? s.fieldStart : "Intake", text, replies: [] }]
      : [];
  });
}
// Seed data keeps notes as a plain string for readability above; convert to the
// threaded shape once, before the seed ever reaches localStorage.
migrateNotes(DEFAULT_ROSTER);

let roster = loadOrSeed(ROSTER_KEY, DEFAULT_ROSTER);
function persistRoster() { localStorage.setItem(ROSTER_KEY, JSON.stringify(roster)); }

// Re-derive the counter from whatever actually loaded (seed or prior session)
// so new note/reply ids never collide with ones already saved.
noteIdCounter = roster.reduce((max, s) => {
  (s.notes || []).forEach(n => {
    max = Math.max(max, n.id);
    (n.replies || []).forEach(r => { max = Math.max(max, r.id); });
  });
  return max;
}, 0) + 1;

// Notes live on each student record now, so saving/loading notes is just
// saving/loading the whole roster — kept as separate names since callers
// throughout the file already say "persist/load notes".
function persistNotes() { persistRoster(); }
function loadSavedNotes() { /* no-op: roster already loaded with its notes above */ }

// ── Badge helpers ────────────────────────────────────────────────────────────
function badge(text, cls) {
  return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}">${text}</span>`;
}

const COHORT_STYLES       = "bg-cyan-50 text-cyan-700 border border-cyan-200";
const FORMAT_STYLES       = { Online: "bg-sky-50 text-sky-700 border border-sky-200", Hybrid: "bg-violet-50 text-violet-700 border border-violet-200" };
const ENROLLMENT_STYLES   = { "Full-Time": "bg-indigo-50 text-indigo-700 border border-indigo-200", "Part-Time": "bg-slate-100 text-slate-600 border border-slate-200" };
const CONCENTRATION_STYLES = { "Behavioral Health": "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200", "Health Care": "bg-emerald-50 text-emerald-700 border border-emerald-200" };
const LIAISON_STYLES      = { Annette: "bg-blue-50 text-blue-700 border border-blue-200", Vanessa: "bg-pink-50 text-pink-700 border border-pink-200", Halide: "bg-amber-50 text-amber-700 border border-amber-200" };
const DEFAULT_LIAISON_STYLE = "bg-slate-50 text-slate-600 border border-slate-200";
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
  { key: "liaison",       label: "Field Liaison" },
  { key: "notes",         label: "Notes" },
];

let sortKey = null;
let sortDir = "asc"; // "asc" | "desc"

function renderTableHeader() {
  const cols = IS_ADMIN ? [...COLUMNS, { key: "actions", label: "Actions" }] : COLUMNS;
  document.getElementById("roster-head-row").innerHTML = cols.map(col => {
    if (col.key === "actions") return `<th class="th-cell">${col.label}</th>`;
    return `
    <th class="th-cell sortable" data-sort="${col.key}">
      ${col.label}<svg class="sort-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
    </th>`;
  }).join("");

  document.querySelectorAll(".th-cell.sortable").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (sortKey === key && sortDir === "desc") {
        sortKey = null; // 3rd click — reset to original order
        sortDir = "asc";
      } else if (sortKey === key) {
        sortDir = "desc"; // 2nd click — descending
      } else {
        sortKey = key;   // 1st click — ascending
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

const SEASON_ORDER = { Spring: 0, Summer: 1, Fall: 2 };

function cohortToNum(cohort) {
  const [season, year] = String(cohort).split(" ");
  return (SEASON_ORDER[season] ?? 99) * 10000 + parseInt(year);
}

function applySort(list) {
  if (!sortKey) {
    // Default view (no column explicitly sorted): most recently added students first.
    return [...list].sort((a, b) => b.id - a.id);
  }
  return [...list].sort((a, b) => {
    let diff;
    if (sortKey === "cohort") {
      diff = cohortToNum(a.cohort) - cohortToNum(b.cohort);
    } else {
      const av = String(a[sortKey] ?? "").toLowerCase();
      const bv = String(b[sortKey] ?? "").toLowerCase();
      diff = av < bv ? -1 : av > bv ? 1 : 0;
    }
    return sortDir === "asc" ? diff : -diff;
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

  const statEl = document.getElementById("stat-cards");
  if (!statEl) return;
  statEl.innerHTML = stats.map(s => `
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

// ── Placement Breakdown ──────────────────────────────────────────────────────
const PLACEMENT_BUCKETS = ["Pending", "Not Started", "Started", "Completed"];
const PLACEMENT_BUCKET_STYLES = {
  Pending:      { bar: "bg-amber-400",   text: "text-amber-700" },
  "Not Started":{ bar: "bg-slate-400",   text: "text-slate-600" },
  Started:      { bar: "bg-emerald-400", text: "text-emerald-700" },
  Completed:    { bar: "bg-indigo-400",  text: "text-indigo-700" },
};

// "Active" students are split into Started/Not Started based on whether their
// fieldwork start date has already passed.
function placementBucket(s) {
  if (s.status === "Pending") return "Pending";
  if (s.status === "Completed") return "Completed";
  const start = new Date(s.fieldStart);
  return (!isNaN(start) && start <= today) ? "Started" : "Not Started";
}

function renderPlacementBreakdown() {
  const el = document.getElementById("placement-breakdown");
  if (!el) return;

  // Admins see the whole roster; coordinators only see the students under the
  // field liaisons they themselves cover (staffProfile.liaisons), not everyone.
  const scopedRoster = IS_ADMIN ? roster : roster.filter(s => (staffProfile.liaisons || []).includes(s.liaison));
  const total = scopedRoster.length;

  const counts = {};
  PLACEMENT_BUCKETS.forEach(b => counts[b] = 0);
  scopedRoster.forEach(s => counts[placementBucket(s)]++);

  const placedCount = scopedRoster.filter(s => s.fieldAgency && s.fieldAgency !== "—").length;
  const placedPct = total ? Math.round((placedCount / total) * 100) : 0;

  el.innerHTML = `
    <div class="space-y-3">
      ${PLACEMENT_BUCKETS.map(b => {
        const count = counts[b];
        const pct = total ? Math.round((count / total) * 100) : 0;
        const style = PLACEMENT_BUCKET_STYLES[b];
        return `
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-slate-600">${b}</span>
              <span class="text-xs font-semibold ${style.text}">${count} · ${pct}%</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full ${style.bar}" style="width:${pct}%"></div>
            </div>
          </div>`;
      }).join("")}
    </div>
    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
      <span class="text-xs font-medium text-slate-600">Placed with an Agency</span>
      <span class="text-sm font-bold text-teal-700">${placedCount} · ${placedPct}%</span>
    </div>
  `;
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
          <button class="student-name-btn flex items-center gap-3 group" data-id="${s.id}">
            <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-colors">${initials(s.name)}</div>
            <div class="text-left">
              <p class="font-medium text-teal-700 group-hover:text-teal-900 group-hover:underline">${s.name}</p>
              <p class="text-xs text-slate-400">${s.phone}</p>
            </div>
          </button>
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
        <td class="td-cell">${badge(s.liaison, LIAISON_STYLES[s.liaison] || DEFAULT_LIAISON_STYLE)}</td>
        <td class="td-cell">
          <button data-id="${s.id}" class="notes-btn flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border ${s.notes.length ? "border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100" : "border-slate-200 text-slate-400 hover:bg-slate-50"} transition-colors">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            ${s.notes.length ? `${s.notes.length} Note${s.notes.length > 1 ? "s" : ""}` : "Add Note"}
          </button>
        </td>
        ${IS_ADMIN ? `
        <td class="td-cell">
          <div class="flex items-center gap-1.5">
            <button data-id="${s.id}" class="student-edit-btn px-2.5 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">Edit</button>
            <button data-id="${s.id}" class="student-delete-btn px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
          </div>
        </td>` : ""}
      </tr>
    `).join("");
  }

  resultCount.textContent = `Showing ${filtered.length} of ${roster.length} students`;

  document.querySelectorAll(".student-name-btn").forEach(btn => {
    btn.addEventListener("click", () => openStudentPanel(Number(btn.dataset.id)));
  });

  document.querySelectorAll(".notes-btn").forEach(btn => {
    btn.addEventListener("click", () => openStudentPanel(Number(btn.dataset.id)));
  });

  if (IS_ADMIN) {
    document.querySelectorAll(".student-edit-btn").forEach(btn => {
      btn.addEventListener("click", () => window.openStudentEditModal && window.openStudentEditModal(Number(btn.dataset.id)));
    });
    document.querySelectorAll(".student-delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const s = roster.find(r => r.id === Number(btn.dataset.id));
        if (!s) return;
        if (!confirm(`Delete ${s.name} from the roster? This cannot be undone.`)) return;
        deleteStudent(s.id);
        renderRoster();
        renderStats();
        renderPlacementBreakdown();
        if (window.renderLiaisonBreakdown) window.renderLiaisonBreakdown();
      });
    });
  }
}

// ── California Cities & Counties ─────────────────────────────────────────────
const CA_LOCATIONS = [
  "Alameda, Alameda County","Albany, Alameda County","Berkeley, Alameda County","Fremont, Alameda County","Hayward, Alameda County","Livermore, Alameda County","Oakland, Alameda County","Pleasanton, Alameda County","San Leandro, Alameda County","Union City, Alameda County",
  "Markleeville, Alpine County",
  "Amador City, Amador County","Jackson, Amador County","Sutter Creek, Amador County",
  "Chico, Butte County","Oroville, Butte County","Paradise, Butte County",
  "Angels Camp, Calaveras County","San Andreas, Calaveras County",
  "Colusa, Colusa County","Williams, Colusa County",
  "Antioch, Contra Costa County","Concord, Contra Costa County","Martinez, Contra Costa County","Richmond, Contra Costa County","Walnut Creek, Contra Costa County",
  "Crescent City, Del Norte County",
  "Placerville, El Dorado County","South Lake Tahoe, El Dorado County",
  "Clovis, Fresno County","Fresno, Fresno County","Hanford, Kings County","Lemoore, Kings County","Selma, Fresno County",
  "Willows, Glenn County",
  "Arcata, Humboldt County","Eureka, Humboldt County","Fortuna, Humboldt County",
  "Calexico, Imperial County","El Centro, Imperial County",
  "Bishop, Inyo County",
  "Bakersfield, Kern County","Delano, Kern County","Ridgecrest, Kern County",
  "Lakeport, Lake County",
  "Susanville, Lassen County",
  "Burbank, Los Angeles County","Carson, Los Angeles County","Compton, Los Angeles County","El Monte, Los Angeles County","Glendale, Los Angeles County","Inglewood, Los Angeles County","Long Beach, Los Angeles County","Los Angeles, Los Angeles County","Pasadena, Los Angeles County","Pomona, Los Angeles County","Santa Clarita, Los Angeles County","Santa Monica, Los Angeles County","Torrance, Los Angeles County",
  "Madera, Madera County",
  "Novato, Marin County","San Rafael, Marin County",
  "Mariposa, Mariposa County",
  "Ukiah, Mendocino County",
  "Los Banos, Merced County","Merced, Merced County",
  "Alturas, Modoc County",
  "Mammoth Lakes, Mono County",
  "Carmel, Monterey County","Monterey, Monterey County","Salinas, Monterey County","Seaside, Monterey County",
  "Napa, Napa County","St. Helena, Napa County",
  "Grass Valley, Nevada County","Nevada City, Nevada County",
  "Anaheim, Orange County","Costa Mesa, Orange County","Fullerton, Orange County","Garden Grove, Orange County","Huntington Beach, Orange County","Irvine, Orange County","Orange, Orange County","Santa Ana, Orange County",
  "Auburn, Placer County","Rocklin, Placer County","Roseville, Placer County",
  "Quincy, Plumas County",
  "Hemet, Riverside County","Moreno Valley, Riverside County","Palm Springs, Riverside County","Riverside, Riverside County","Temecula, Riverside County",
  "Citrus Heights, Sacramento County","Elk Grove, Sacramento County","Folsom, Sacramento County","Rancho Cordova, Sacramento County","Sacramento, Sacramento County",
  "Hollister, San Benito County",
  "Fontana, San Bernardino County","Ontario, San Bernardino County","Rancho Cucamonga, San Bernardino County","San Bernardino, San Bernardino County","Victorville, San Bernardino County",
  "Chula Vista, San Diego County","El Cajon, San Diego County","Escondido, San Diego County","Oceanside, San Diego County","San Diego, San Diego County","Vista, San Diego County",
  "San Francisco, San Francisco County",
  "Lodi, San Joaquin County","Manteca, San Joaquin County","Stockton, San Joaquin County","Tracy, San Joaquin County",
  "Atascadero, San Luis Obispo County","Paso Robles, San Luis Obispo County","San Luis Obispo, San Luis Obispo County",
  "Daly City, San Mateo County","Redwood City, San Mateo County","San Mateo, San Mateo County","South San Francisco, San Mateo County",
  "Lompoc, Santa Barbara County","Santa Barbara, Santa Barbara County","Santa Maria, Santa Barbara County",
  "Campbell, Santa Clara County","Milpitas, Santa Clara County","Mountain View, Santa Clara County","Palo Alto, Santa Clara County","San Jose, Santa Clara County","Santa Clara, Santa Clara County","Sunnyvale, Santa Clara County",
  "Santa Cruz, Santa Cruz County","Scotts Valley, Santa Cruz County","Watsonville, Santa Cruz County",
  "Redding, Shasta County",
  "Downieville, Sierra County",
  "Mt. Shasta, Siskiyou County","Yreka, Siskiyou County",
  "Fairfield, Solano County","Vacaville, Solano County","Vallejo, Solano County",
  "Petaluma, Sonoma County","Rohnert Park, Sonoma County","Santa Rosa, Sonoma County",
  "Ceres, Stanislaus County","Modesto, Stanislaus County","Turlock, Stanislaus County",
  "Yuba City, Sutter County",
  "Red Bluff, Tehama County",
  "Weaverville, Trinity County",
  "Porterville, Tulare County","Tulare, Tulare County","Visalia, Tulare County",
  "Sonora, Tuolumne County",
  "Oxnard, Ventura County","Thousand Oaks, Ventura County","Ventura, Ventura County",
  "Davis, Yolo County","Woodland, Yolo County",
  "Marysville, Yuba County",
].sort();

// ── Student Profile Panel ────────────────────────────────────────────────────
let activeStudentId = null;

function panelInfoRow(label, value) {
  return `<div>
    <p class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">${label}</p>
    <p class="text-lg text-slate-700 leading-snug">${value}</p>
  </div>`;
}

function toDateInput(str) {
  if (!str || str === "—") return "";
  const d = new Date(str);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
}

// Inverse of toDateInput — turns an <input type="date"> value back into the
// "MMM D, YYYY" display strings the roster stores (or "—" if left blank).
function dateInputToDisplay(value) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fieldworkDate(label, currentValue, id = "") {
  const idAttr = id ? ` id="${id}"` : "";
  return `<div>
    <p class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">${label}</p>
    <input type="date"${idAttr} value="${toDateInput(currentValue)}"
      class="w-full text-lg text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22] focus:border-transparent cursor-pointer" />
  </div>`;
}

function fieldworkSelect(label, currentValue, options, id = "") {
  const idAttr = id ? ` id="${id}"` : "";
  // If the stored value isn't one of the real options (e.g. never set), show
  // a blank placeholder instead of silently defaulting to the first option —
  // otherwise the dropdown would visually claim a value that was never chosen.
  const hasMatch = options.includes(currentValue);
  const blankOpt = hasMatch ? "" : `<option value="" selected>—</option>`;
  const opts = options.map(o =>
    `<option value="${o}" ${o === currentValue ? "selected" : ""}>${o}</option>`
  ).join("");
  return `<div>
    <p class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">${label}</p>
    <select${idAttr} class="w-full text-lg text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22] focus:border-transparent cursor-pointer">
      ${blankOpt}${opts}
    </select>
  </div>`;
}

function toggleInstructorOther(value) {
  const wrap = document.getElementById("panel-instructor-other-wrap");
  const input = document.getElementById("panel-instructor-other-input");
  if (!wrap) return;
  if (value === "Other") {
    wrap.classList.remove("hidden");
    input.focus();
  } else {
    wrap.classList.add("hidden");
    input.value = "";
  }
}

function instructorForAgency(agencyName, currentInstructor) {
  const agency = agencies.find(a => a.name === agencyName);
  const options = ["—"];
  if (agency) options.push(agency.contact);
  if (currentInstructor && currentInstructor !== "—" && currentInstructor !== "Other" && !options.includes(currentInstructor)) {
    options.push(currentInstructor);
  }
  options.push("Other");
  return options;
}

function agenciesForCounty(county, currentAgency) {
  const matched = agencies
    .filter(a => a.county === county)
    .map(a => a.name)
    .sort();
  const options = ["—", ...matched];
  // If the current agency isn't in the filtered list, add it so the select still shows it
  if (currentAgency && currentAgency !== "—" && !options.includes(currentAgency)) {
    options.push(currentAgency);
  }
  return options;
}

function openStudentPanel(id) {
  const s = roster.find(s => s.id === id);
  if (!s) return;
  activeStudentId = id;

  const cs = STATUS_STYLES[s.status] || STATUS_STYLES.Pending;

  document.getElementById("panel-body").innerHTML = `
    <!-- Avatar + name -->
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-[#F05A22] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">${initials(s.name)}</div>
      <div>
        <h2 class="text-2xl font-bold text-slate-800 leading-tight">${s.name}</h2>
        <div class="mt-2" id="panel-status-badge-wrap">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${cs.pill}">
            <span class="w-1.5 h-1.5 rounded-full ${cs.dot}"></span>${s.status}
          </span>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="bg-slate-50 rounded-2xl p-4 space-y-3">
      <p class="text-base font-bold text-slate-900 uppercase tracking-wider">Personal Information</p>
      <div class="grid grid-cols-2 gap-4">
        ${panelInfoRow("Phone", s.phone)}
        ${panelInfoRow("Address", s.address || "—")}
        ${panelInfoRow("City", s.city)}
      </div>
    </div>

    <!-- Academic Information -->
    <div class="bg-slate-50 rounded-2xl p-4 space-y-3">
      <p class="text-base font-bold text-slate-900 uppercase tracking-wider">Academic Information</p>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Cohort</p>
          <input type="text" id="panel-cohort" list="panel-cohort-list" value="${s.cohort && s.cohort !== "—" ? s.cohort : ""}"
            placeholder="e.g. Fall 2026"
            class="w-full text-lg text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22] focus:border-transparent" />
          <datalist id="panel-cohort-list">
            ${[...new Set(roster.map(r => r.cohort).filter(c => c && c !== "—"))].sort().map(c => `<option value="${c}"></option>`).join("")}
          </datalist>
        </div>
        ${fieldworkSelect("Concentration", s.concentration, ["Behavioral Health", "Health Care"], "panel-concentration")}
        ${fieldworkSelect("Program Format", s.format, ["Hybrid", "Online"], "panel-format")}
        ${fieldworkSelect("Enrollment", s.enrollment, ["Full-Time", "Part-Time"], "panel-enrollment")}
      </div>
    </div>

    <!-- Fieldwork Information -->
    <div class="bg-slate-50 rounded-2xl p-4 space-y-3">
      <p class="text-base font-bold text-slate-900 uppercase tracking-wider">Fieldwork Information</p>
      <div class="grid grid-cols-2 gap-4">
        ${fieldworkSelect("City and County", `${s.city}, ${s.county}`,
            [...new Set(agencies.map(a => `${a.city}, ${a.county}`))].sort(),
            "panel-city-county")}
        ${fieldworkSelect("Field Work Location", s.fieldAgency || "—",
            agenciesForCounty(s.county, s.fieldAgency),
            "panel-field-location")}
        ${fieldworkDate("Start Date", s.fieldStart, "panel-field-start")}
        ${fieldworkDate("End Date", s.fieldEnd, "panel-field-end")}
        ${fieldworkSelect("Field Instructor", s.fieldInstructor || "—",
            instructorForAgency(s.fieldAgency, s.fieldInstructor),
            "panel-field-instructor")}
        ${fieldworkSelect("Field Liaison", s.liaison,
            ["Annette","Halide","Vanessa"], "panel-liaison")}
        ${fieldworkSelect("Placement Status", s.status,
            ["Active","Pending","Completed"], "panel-status")}
        <div id="panel-instructor-other-wrap" class="col-span-2 hidden">
          <p class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Field Instructor Name</p>
          <input type="text" id="panel-instructor-other-input" placeholder="Enter field instructor name"
            class="w-full text-lg text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22] focus:border-transparent" />
        </div>
      </div>
    </div>
  `;

  // Persists one or more fieldwork fields for the currently-open student and
  // refreshes every view that shows that data, so edits made here actually
  // stick instead of only changing what's on screen in this panel.
  function saveStudentField(changes) {
    if (activeStudentId === null) return;
    updateStudent(activeStudentId, changes);
    renderRoster();
    renderStats();
    renderPlacementBreakdown();
    if (window.renderLiaisonBreakdown) window.renderLiaisonBreakdown();
    const statusEl = document.getElementById("panel-save-status");
    if (statusEl) {
      statusEl.textContent = "Saved ✓";
      setTimeout(() => { if (document.getElementById("panel-save-status")) document.getElementById("panel-save-status").textContent = ""; }, 2000);
    }
  }

  // Wire city/county → reset + filter field work location and field instructor
  document.getElementById("panel-city-county").addEventListener("change", function () {
    const parts = this.value.split(", ");
    const county = parts.length > 1 ? parts[parts.length - 1] : "";
    const city = parts.length > 1 ? parts.slice(0, -1).join(", ") : this.value;

    const locationSel = document.getElementById("panel-field-location");
    const newLocationOptions = agenciesForCounty(county, null);
    locationSel.innerHTML = newLocationOptions.map(o =>
      `<option value="${o}" ${o === "—" ? "selected" : ""}>${o}</option>`
    ).join("");
    locationSel.value = "—";

    const instrSel = document.getElementById("panel-field-instructor");
    instrSel.innerHTML = `<option value="—" selected>—</option><option value="Other">Other</option>`;
    instrSel.value = "—";
    toggleInstructorOther("—");

    saveStudentField({ city, county, fieldAgency: "—", fieldInstructor: "—" });
  });

  // Wire field work location → reset + filter field instructor
  document.getElementById("panel-field-location").addEventListener("change", function () {
    const instrSel = document.getElementById("panel-field-instructor");
    const newOptions = instructorForAgency(this.value, null);
    instrSel.innerHTML = newOptions.map(o =>
      `<option value="${o}" ${o === "—" ? "selected" : ""}>${o}</option>`
    ).join("");
    instrSel.value = "—";
    toggleInstructorOther("—");

    saveStudentField({ fieldAgency: this.value, fieldInstructor: "—" });
  });

  // Wire field instructor "Other" → show/hide text input; save immediately
  // unless "Other" is picked, in which case we wait for a typed name instead.
  document.getElementById("panel-field-instructor").addEventListener("change", function () {
    toggleInstructorOther(this.value);
    if (this.value !== "Other") saveStudentField({ fieldInstructor: this.value });
  });

  document.getElementById("panel-instructor-other-input").addEventListener("change", function () {
    saveStudentField({ fieldInstructor: this.value.trim() || "—" });
  });

  document.getElementById("panel-field-start").addEventListener("change", function () {
    saveStudentField({ fieldStart: dateInputToDisplay(this.value) });
  });

  document.getElementById("panel-field-end").addEventListener("change", function () {
    saveStudentField({ fieldEnd: dateInputToDisplay(this.value) });
  });

  document.getElementById("panel-cohort").addEventListener("change", function () {
    saveStudentField({ cohort: this.value.trim() || "—" });
  });

  document.getElementById("panel-concentration").addEventListener("change", function () {
    saveStudentField({ concentration: this.value });
  });

  document.getElementById("panel-format").addEventListener("change", function () {
    saveStudentField({ format: this.value });
  });

  document.getElementById("panel-enrollment").addEventListener("change", function () {
    saveStudentField({ enrollment: this.value });
  });

  document.getElementById("panel-liaison").addEventListener("change", function () {
    saveStudentField({ liaison: this.value });
  });

  document.getElementById("panel-status").addEventListener("change", function () {
    saveStudentField({ status: this.value });
    const ncs = STATUS_STYLES[this.value] || STATUS_STYLES.Pending;
    document.getElementById("panel-status-badge-wrap").innerHTML = `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${ncs.pill}">
        <span class="w-1.5 h-1.5 rounded-full ${ncs.dot}"></span>${this.value}
      </span>`;
  });

  // Show "Other" input if student already has a custom instructor name
  if (document.getElementById("panel-field-instructor").value === "Other") {
    toggleInstructorOther("Other");
  }

  document.getElementById("panel-new-note").value = "";
  document.getElementById("panel-save-status").textContent = "";
  renderNotesThread(id);

  // Show panel
  document.getElementById("panel-backdrop").classList.remove("hidden");
  document.getElementById("student-panel").classList.remove("hidden");
}

function closeStudentPanel() {
  document.getElementById("panel-backdrop").classList.add("hidden");
  document.getElementById("student-panel").classList.add("hidden");
  activeStudentId = null;
}

// ── Staff Notes (threaded) ───────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function currentNoteAuthor() {
  return staffProfile.name;
}

function renderNoteEntry(note) {
  const pinned = !!note.pinned;
  const replies = note.replies.map(r => `
    <div class="space-y-0.5">
      <div class="flex items-center justify-between gap-2">
        <p class="text-xs font-semibold text-slate-600">${escapeHtml(r.author)}</p>
        <p class="text-[10px] text-slate-400 whitespace-nowrap">${escapeHtml(r.date)}</p>
      </div>
      <p class="text-xs text-slate-500 leading-snug whitespace-pre-wrap">${escapeHtml(r.text)}</p>
    </div>
  `).join("");

  return `
    <div class="${pinned ? "bg-amber-50 border-amber-200" : "bg-white border-slate-100"} rounded-xl border p-3 space-y-2" data-note-id="${note.id}">
      <div class="flex items-center justify-between gap-2">
        <p class="text-xs font-semibold text-slate-700">${escapeHtml(note.author)}</p>
        <div class="flex items-center gap-2 flex-shrink-0">
          <p class="text-[10px] text-slate-400 whitespace-nowrap">${escapeHtml(note.date)}</p>
          <button class="pin-toggle-btn text-sm leading-none transition-opacity ${pinned ? "opacity-100" : "opacity-30 hover:opacity-70"}" data-note-id="${note.id}" title="${pinned ? "Unpin note" : "Pin note"}" aria-label="${pinned ? "Unpin note" : "Pin note"}">📌</button>
        </div>
      </div>
      <p class="text-sm text-slate-600 leading-snug whitespace-pre-wrap">${escapeHtml(note.text)}</p>
      ${note.replies.length ? `<div class="pl-4 border-l-2 border-teal-100 space-y-2">${replies}</div>` : ""}
      <div>
        <button class="reply-toggle-btn text-xs font-medium text-teal-600 hover:text-teal-700" data-note-id="${note.id}">+ Add follow-up</button>
        <div class="reply-form hidden mt-2 space-y-2" data-note-id="${note.id}">
          <textarea rows="2" class="reply-input w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" placeholder="Add a follow-up note…"></textarea>
          <button class="reply-submit-btn text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg px-3 py-1.5 transition-colors" data-note-id="${note.id}">Post Follow-up</button>
        </div>
      </div>
    </div>`;
}

function renderNotesThread(studentId) {
  const s = roster.find(x => x.id === studentId);
  const container = document.getElementById("panel-notes-thread");
  if (!s || !s.notes.length) {
    container.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">No notes yet — add the first one below.</p>`;
    return;
  }
  const ordered = [...s.notes].reverse();
  const pinned = ordered.filter(n => n.pinned);
  const rest = ordered.filter(n => !n.pinned);
  const pinnedSection = pinned.length ? `
    <div class="space-y-3 pb-4 mb-4 border-b border-slate-200">
      <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest">📌 Pinned</p>
      ${pinned.map(renderNoteEntry).join("")}
    </div>` : "";
  container.innerHTML = pinnedSection + rest.map(renderNoteEntry).join("");
}

function addStudentNote(studentId, text) {
  const s = roster.find(x => x.id === studentId);
  if (!s || !text.trim()) return;
  s.notes.push({
    id: noteIdCounter++,
    author: currentNoteAuthor(),
    date: todayLabel(),
    text: text.trim(),
    pinned: false,
    replies: [],
  });
  persistNotes();
  renderNotesThread(studentId);
  renderRoster();
}

function addNoteReply(studentId, noteId, text) {
  const s = roster.find(x => x.id === studentId);
  const note = s && s.notes.find(n => n.id === noteId);
  if (!note || !text.trim()) return;
  note.replies.push({
    id: noteIdCounter++,
    author: currentNoteAuthor(),
    date: todayLabel(),
    text: text.trim(),
  });
  persistNotes();
  renderNotesThread(studentId);
}

function togglePinNote(studentId, noteId) {
  const s = roster.find(x => x.id === studentId);
  const note = s && s.notes.find(n => n.id === noteId);
  if (!note) return;
  note.pinned = !note.pinned;
  persistNotes();
  renderNotesThread(studentId);
}

// ── Checklist ────────────────────────────────────────────────────────────────
const CHECKLIST_KEY = "fepms-checklist";
// Computed lazily (not at module load) since staffProfile is declared later in this file.
function checklistAssignees() {
  return [staffProfile.name, ...staffProfile.liaisons];
}
const CHECKLIST_DESCRIPTION_OPTIONS = ["Placement Status", "Agency Contract", "Enrollment Change", "Concentration Change", "Other"];
const CHECKLIST_REMARKS = ["No Remarks", "On Track", "Needs Follow-Up", "At Risk", "Waiting on Response", "Resolved"];
const CHECKLIST_REMARKS_STYLES = {
  "No Remarks":          "bg-slate-100 text-slate-500",
  "On Track":            "bg-emerald-50 text-emerald-700",
  "Needs Follow-Up":     "bg-amber-50 text-amber-700",
  "At Risk":             "bg-red-50 text-red-700",
  "Waiting on Response": "bg-indigo-50 text-indigo-700",
  "Resolved":            "bg-teal-50 text-teal-700",
};

function loadChecklist() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHECKLIST_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

let checklist = loadChecklist();
let checklistIdCounter = checklist.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;

function saveChecklist() {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
}

function addChecklistItem(data = {}) {
  checklist.push({
    id: checklistIdCounter++,
    item: data.item || "",
    description: data.description || "",
    descriptionOther: data.descriptionOther || "",
    assignedTo: data.assignedTo || "",
    deadline: data.deadline || "",
    remarks: data.remarks || "No Remarks",
    done: !!data.done,
  });
  saveChecklist();
  renderChecklist();
}

function updateChecklistItem(id, changes) {
  const row = checklist.find(c => c.id === id);
  if (!row) return;
  Object.assign(row, changes);
  saveChecklist();
}

const CHECKLIST_TRASH_KEY = "fepms-checklist-trash";

function loadChecklistTrash() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHECKLIST_TRASH_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

let checklistTrash = loadChecklistTrash();

function saveChecklistTrash() {
  localStorage.setItem(CHECKLIST_TRASH_KEY, JSON.stringify(checklistTrash));
}

function deleteChecklistItem(id) {
  const item = checklist.find(c => c.id === id);
  if (item) checklistTrash.unshift({ ...item, deletedAt: todayLabel() });
  checklist = checklist.filter(c => c.id !== id);
  saveChecklist();
  saveChecklistTrash();
  renderChecklist();
}

function restoreChecklistItem(id) {
  const item = checklistTrash.find(c => c.id === id);
  if (!item) return;
  const { deletedAt, ...restored } = item;
  checklist.push(restored);
  checklistTrash = checklistTrash.filter(c => c.id !== id);
  saveChecklist();
  saveChecklistTrash();
  renderChecklist();
  renderChecklistTrash();
}

function renderChecklist() {
  const tbody = document.getElementById("checklist-body");
  const emptyEl = document.getElementById("checklist-empty");
  if (!tbody) return;

  if (!checklist.length) {
    tbody.innerHTML = "";
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }
  if (emptyEl) emptyEl.classList.add("hidden");

  tbody.innerHTML = checklist.map(c => {
    const remarksStyle = CHECKLIST_REMARKS_STYLES[c.remarks] || CHECKLIST_REMARKS_STYLES["No Remarks"];
    return `
    <tr class="border-b border-slate-50 last:border-0" data-id="${c.id}">
      <td class="td-cell">
        <input type="text" data-field="item" value="${escapeHtml(c.item)}" placeholder="Task name"
          class="checklist-input w-full min-w-[140px] text-sm text-slate-700 bg-transparent border border-transparent hover:border-slate-200 focus:border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none" />
      </td>
      <td class="td-cell">
        <select data-field="description" class="checklist-input w-full min-w-[160px] text-sm text-slate-700 bg-transparent border border-transparent hover:border-slate-200 focus:border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer">
          <option value="" ${!c.description ? "selected" : ""}>—</option>
          ${CHECKLIST_DESCRIPTION_OPTIONS.map(o => `<option value="${o}" ${o === c.description ? "selected" : ""}>${o}</option>`).join("")}
        </select>
        <input type="text" data-field="descriptionOther" value="${escapeHtml(c.descriptionOther || "")}" placeholder="Describe…"
          class="checklist-input checklist-description-other w-full min-w-[160px] mt-1 text-sm text-slate-600 bg-transparent border border-transparent hover:border-slate-200 focus:border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none ${c.description === "Other" ? "" : "hidden"}" />
      </td>
      <td class="td-cell">
        <select data-field="assignedTo" class="checklist-input text-sm text-slate-700 bg-transparent border border-transparent hover:border-slate-200 focus:border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer">
          <option value="" ${!c.assignedTo ? "selected" : ""}>—</option>
          ${checklistAssignees().map(name => `<option value="${name}" ${name === c.assignedTo ? "selected" : ""}>${name}</option>`).join("")}
        </select>
      </td>
      <td class="td-cell">
        <input type="date" data-field="deadline" value="${c.deadline || ""}"
          class="checklist-input text-sm text-slate-700 bg-transparent border border-transparent hover:border-slate-200 focus:border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer" />
      </td>
      <td class="td-cell">
        <select data-field="remarks" class="checklist-input text-xs font-medium rounded-full px-2.5 py-1.5 border-0 cursor-pointer ${remarksStyle}">
          ${CHECKLIST_REMARKS.map(r => `<option value="${r}" ${r === c.remarks ? "selected" : ""}>${r}</option>`).join("")}
        </select>
      </td>
      <td class="td-cell text-center">
        <button class="checklist-status-btn text-xl leading-none" data-id="${c.id}" title="${c.done ? "Mark incomplete" : "Mark complete"}">
          ${c.done ? '<span class="text-emerald-500">✓</span>' : '<span class="text-red-500">✗</span>'}
        </button>
      </td>
      <td class="td-cell text-right">
        <button class="checklist-delete-btn text-slate-300 hover:text-red-500 transition-colors" data-id="${c.id}" title="Remove item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </td>
    </tr>`;
  }).join("");
}

function wireChecklistEvents() {
  // Deliberately avoid a full renderChecklist() here — rebuilding the whole
  // table on every field edit would tear down and recreate every other row's
  // inputs mid-edit, breaking tab-key navigation and losing focus. Only the
  // one thing that visually depends on the new value (the remarks pill color)
  // gets updated directly; every other field already shows what the user typed.
  document.getElementById("checklist-body").addEventListener("change", e => {
    const row = e.target.closest("tr");
    const field = e.target.dataset.field;
    if (!row || !field) return;
    updateChecklistItem(Number(row.dataset.id), { [field]: e.target.value });
    if (field === "remarks") {
      const style = CHECKLIST_REMARKS_STYLES[e.target.value] || CHECKLIST_REMARKS_STYLES["No Remarks"];
      e.target.className = `checklist-input text-xs font-medium rounded-full px-2.5 py-1.5 border-0 cursor-pointer ${style}`;
    }
    if (field === "description") {
      const otherInput = row.querySelector(".checklist-description-other");
      if (otherInput) otherInput.classList.toggle("hidden", e.target.value !== "Other");
    }
  });

  document.getElementById("checklist-body").addEventListener("click", e => {
    const statusBtn = e.target.closest(".checklist-status-btn");
    if (statusBtn) {
      const row = checklist.find(c => c.id === Number(statusBtn.dataset.id));
      if (row) {
        row.done = !row.done;
        saveChecklist();
        statusBtn.innerHTML = row.done ? '<span class="text-emerald-500">✓</span>' : '<span class="text-red-500">✗</span>';
        statusBtn.title = row.done ? "Mark incomplete" : "Mark complete";
      }
      return;
    }
    const delBtn = e.target.closest(".checklist-delete-btn");
    if (delBtn) deleteChecklistItem(Number(delBtn.dataset.id));
  });
}

function renderChecklistTrash() {
  const tbody = document.getElementById("checklist-trash-body");
  const emptyEl = document.getElementById("checklist-trash-empty");
  if (!tbody) return;

  if (!checklistTrash.length) {
    tbody.innerHTML = "";
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }
  if (emptyEl) emptyEl.classList.add("hidden");

  tbody.innerHTML = checklistTrash.map(c => {
    const remarksStyle = CHECKLIST_REMARKS_STYLES[c.remarks] || CHECKLIST_REMARKS_STYLES["No Remarks"];
    const descLabel = c.description === "Other" ? (c.descriptionOther || "Other") : (c.description || "—");
    return `
    <tr class="border-b border-slate-50 last:border-0" data-id="${c.id}">
      <td class="td-cell text-slate-700">${escapeHtml(c.item) || "—"}</td>
      <td class="td-cell text-slate-600">${escapeHtml(descLabel)}</td>
      <td class="td-cell text-slate-600">${escapeHtml(c.assignedTo) || "—"}</td>
      <td class="td-cell text-slate-600">${c.deadline || "—"}</td>
      <td class="td-cell"><span class="text-sm font-medium rounded-full px-3 py-1.5 ${remarksStyle}">${escapeHtml(c.remarks)}</span></td>
      <td class="td-cell text-center">${c.done ? '<span class="text-emerald-500 text-2xl">✓</span>' : '<span class="text-red-500 text-2xl">✗</span>'}</td>
      <td class="td-cell text-slate-400 text-sm">${escapeHtml(c.deletedAt || "—")}</td>
      <td class="td-cell text-right">
        <button class="checklist-restore-btn text-sm font-semibold text-teal-600 hover:text-teal-700" data-id="${c.id}">Restore</button>
      </td>
    </tr>`;
  }).join("");
}

function openChecklistTrash() {
  renderChecklistTrash();
  document.getElementById("checklist-trash-modal").classList.remove("hidden");
}

function closeChecklistTrash() {
  document.getElementById("checklist-trash-modal").classList.add("hidden");
}

function wireChecklistTrashEvents() {
  document.getElementById("checklist-trash-btn").addEventListener("click", openChecklistTrash);
  document.getElementById("checklist-trash-body").addEventListener("click", e => {
    const btn = e.target.closest(".checklist-restore-btn");
    if (btn) restoreChecklistItem(Number(btn.dataset.id));
  });
}

// "Add Item" opens a dedicated form instead of dropping a blank inline row —
// the new task only appears in the table once the form is submitted.
function openChecklistTaskModal() {
  document.getElementById("checklist-task-form").reset();
  document.getElementById("ct-description-other").classList.add("hidden");

  const assignedSelect = document.getElementById("ct-assigned");
  assignedSelect.innerHTML = `<option value="">—</option>` +
    checklistAssignees().map(name => `<option value="${name}">${name}</option>`).join("");

  const remarksSelect = document.getElementById("ct-remarks");
  remarksSelect.innerHTML = CHECKLIST_REMARKS.map(r =>
    `<option value="${r}" ${r === "No Remarks" ? "selected" : ""}>${r}</option>`
  ).join("");

  document.getElementById("checklist-task-modal").classList.remove("hidden");
}

function closeChecklistTaskModal() {
  document.getElementById("checklist-task-modal").classList.add("hidden");
}

function wireChecklistTaskModalEvents() {
  document.getElementById("checklist-add-btn").addEventListener("click", openChecklistTaskModal);

  document.getElementById("ct-description").addEventListener("change", e => {
    document.getElementById("ct-description-other").classList.toggle("hidden", e.target.value !== "Other");
  });

  document.getElementById("checklist-task-form").addEventListener("submit", e => {
    e.preventDefault();
    addChecklistItem({
      item: document.getElementById("ct-item").value.trim(),
      description: document.getElementById("ct-description").value,
      descriptionOther: document.getElementById("ct-description-other").value.trim(),
      assignedTo: document.getElementById("ct-assigned").value,
      deadline: document.getElementById("ct-deadline").value,
      remarks: document.getElementById("ct-remarks").value,
      done: document.getElementById("ct-done").checked,
    });
    closeChecklistTaskModal();
  });
}

// ── Field Applications (Forms tab) ───────────────────────────────────────────
// Shared with field-application-form.js via the same localStorage key — that
// page is the student-facing intake form; this renders what admins/staff see.
const APPLICATIONS_KEY = "fepms-field-applications";

const FORMS_COMPETENCIES = {
  activeLearner: "ACTIVE LEARNER", timeManagement: "TIME MANAGEMENT", boundaries: "BOUNDARIES",
  receivesFeedback: "RECEIVES FEEDBACK", managesConflict: "MANAGES CONFLICT", selfAwareness: "SELF-AWARENESS",
};

const FORMS_ACKNOWLEDGMENT_TITLES = {
  generalConditions: "General Conditions for Placement Referral", previousExperience: "Previous Experience",
  fieldManual: "MSW Field Manual", ferpaConsent: "FERPA Consent", professionalConduct: "Professional Conduct",
  applicationProcess: "Conditions for Field Application Process", noContactingAgencies: "No Contacting Agencies Without Permission",
  agencyRequirements: "Agency Requirements", justiceInvolvement: "Justice-Involvement",
  disclosureJustice: "Disclosure of Justice-Involvement to Field Office and Agency",
  eligibilityFactors: "Factors That May Affect Field Eligibility", readinessDetermination: "Field Approval and Readiness Determination",
  improvementPlans: "Performance Improvement Plans", changesOrTermination: "Changes or Termination of Field Placements",
  prematureEnding: "Premature Ending of a Field Placement", professionalReview: "Professional Field Review Process",
};

const FORMS_TRANSPORTATION_LABELS = {
  reliableTransportation: "I have reliable transportation", validLicense: "I have a valid Driver's License",
  validCaLicense: "I have a valid California Driver's License",
  publicTransportation: "I will use public transportation and I understand that this may limit my internship options",
  deniedLicense: "I have been denied a Driver's License",
  movingViolations: "I have three or more “moving violations” on my driving record right now",
};

// Sample submissions so the Forms tab has something to look at before real
// students start applying. Only seeded once — deleting them (or any real
// submission arriving) leaves storage alone from then on.
const SEED_APPLICATIONS = [
  {
    id: "app-seed-1", submittedAt: "2026-06-28T15:12:00.000Z",
    fullName: "Alvarez, Camila, Rose", studentId: "MSW-2027-0142", preferredName: "Cami", pronouns: "she/her",
    email: "c_alvarez@u.pacific.edu", phone: "(510) 555-0198",
    address: "88 Broadway Blvd", cityCountyZip: "Oakland, Alameda County, 94607",
    fieldCityCounty: "Oakland, Alameda County", languages: "Spanish (fluent)",
    programTrack: "Hybrid", concentration: "Behavioral Health", wantsAccommodation: "No",
    ugMajor: "Psychology", ugInstitution: "San Francisco State University", ugDegreeType: "Bachelor of Arts (BA)",
    ugMinor: "Sociology", additionalDegrees: "",
    swExperience: [{ agency: "Bay Area Mental Health Services / Oakland, CA", position: "Case Management Intern", timeType: "Part Time", paidOrVolunteer: "Volunteer", dates: "08/2024 - 05/2025" }],
    otherExperience: [{ agency: "Trader Joe's / Oakland, CA", position: "Team Member", timeType: "Part Time", paidOrVolunteer: "Paid", dates: "01/2022 - Present" }],
    resumeFileName: "camila_alvarez_resume.pdf",
    employmentBasedInterest: "No",
    serviceAreaRanks: { "Behavioral Health/Mental Health": 1, "Crisis Intervention": 2, "Community Health": 3, "Substance Use Treatment": 4, "School-Based Services": 5, "Child Welfare/Child Protective Services": 6, "Aging/Gerontology": 7, "Housing/Homeless Services": 8, "Children's Services": 9, "Medical Social Work/Healthcare": 10, "Justice-Involved": 11 },
    otherServiceArea: "", preferredPopulations: "Interested in working with young adults navigating first-episode psychosis.",
    specificOrg: "Bay Area Mental Health Services, 88 Broadway Blvd, Oakland, CA — contact Marcus Reid",
    transportation: { reliableTransportation: true, validLicense: true, validCaLicense: true, publicTransportation: false, deniedLicense: false, movingViolations: false },
    movingViolations: "",
    pride: "I co-led a peer support group for first-generation college students for two years, growing attendance from 5 to over 40 students per semester.",
    afterGraduation: "A licensed clinical social worker in a community mental health setting, eventually opening a private practice focused on underserved young adults.",
    competencies: { timeManagement: "I plan to use a weekly planner and block out fixed study/field hours in advance.", managesConflict: "I want to practice naming disagreements directly instead of letting them go unaddressed." },
    difficultPopulations: "Clients experiencing active psychosis without insight into their condition — I want more training before working independently with this population.",
    acknowledgments: { generalConditions: true, previousExperience: true, fieldManual: true, ferpaConsent: true, professionalConduct: true, applicationProcess: true, noContactingAgencies: true, agencyRequirements: true, justiceInvolvement: true, disclosureJustice: true, eligibilityFactors: true, readinessDetermination: true, improvementPlans: true, changesOrTermination: true, prematureEnding: true, professionalReview: true },
    signatureName: "Camila R. Alvarez", signatureDate: "Jun 28, 2026",
  },
  {
    id: "app-seed-2", submittedAt: "2026-07-01T18:40:00.000Z",
    fullName: "Nguyen, Daniel, Khoi", studentId: "MSW-2027-0158", preferredName: "", pronouns: "he/him",
    email: "d_nguyen@u.pacific.edu", phone: "(209) 555-0176",
    address: "715 Sycamore Ave", cityCountyZip: "Modesto, Stanislaus County, 95354",
    fieldCityCounty: "Modesto, Stanislaus County", languages: "Vietnamese (conversational)",
    programTrack: "Online", concentration: "Healthcare", wantsAccommodation: "No",
    ugMajor: "Public Health", ugInstitution: "California State University, Stanislaus", ugDegreeType: "Bachelor of Science (BS)",
    ugMinor: "", additionalDegrees: "CHW (Community Health Worker) Certificate, 2023",
    swExperience: [{ agency: "Central Valley Youth Services / Modesto, CA", position: "Outreach Volunteer", timeType: "Part Time", paidOrVolunteer: "Volunteer", dates: "03/2023 - 12/2023" }],
    otherExperience: [],
    resumeFileName: "daniel_nguyen_resume.pdf",
    employmentBasedInterest: "Maybe",
    serviceAreaRanks: { "Medical Social Work/Healthcare": 1, "Community Health": 2, "Substance Use Treatment": 3, "Crisis Intervention": 4, "Aging/Gerontology": 5, "Child Welfare/Child Protective Services": 6, "Behavioral Health/Mental Health": 7, "Housing/Homeless Services": 8, "School-Based Services": 9, "Children's Services": 10, "Justice-Involved": 11 },
    otherServiceArea: "", preferredPopulations: "Chronic illness management, especially diabetes and hypertension in Southeast Asian communities.",
    specificOrg: "",
    transportation: { reliableTransportation: true, validLicense: true, validCaLicense: true, publicTransportation: false, deniedLicense: false, movingViolations: false },
    movingViolations: "",
    pride: "I built a bilingual health-literacy workshop series that I still help run at my church on weekends.",
    afterGraduation: "Medical social worker at a hospital or FQHC serving the Central Valley.",
    competencies: { activeLearner: "I tend to stay quiet in group settings and want to push myself to ask clarifying questions in the moment instead of after class.", selfAwareness: "I want to get better at noticing when my own assumptions about a client's background are shaping how I interpret their situation." },
    difficultPopulations: "End-of-life and hospice situations — I have limited personal experience with grief counseling.",
    acknowledgments: { generalConditions: true, previousExperience: true, fieldManual: true, ferpaConsent: true, professionalConduct: true, applicationProcess: true, noContactingAgencies: true, agencyRequirements: true, justiceInvolvement: true, disclosureJustice: true, eligibilityFactors: true, readinessDetermination: true, improvementPlans: true, changesOrTermination: true, prematureEnding: true, professionalReview: true },
    signatureName: "Daniel K. Nguyen", signatureDate: "Jul 1, 2026",
  },
  {
    id: "app-seed-3", submittedAt: "2026-07-05T21:05:00.000Z",
    fullName: "Washington, Brianna, Elise", studentId: "", preferredName: "Bri", pronouns: "she/her",
    email: "b_washington@u.pacific.edu", phone: "(916) 555-0143",
    address: "3305 Freeport Blvd", cityCountyZip: "Sacramento, Sacramento County, 95818",
    fieldCityCounty: "Sacramento, Sacramento County", languages: "",
    programTrack: "Hybrid", concentration: "Behavioral Health", wantsAccommodation: "Yes",
    ugMajor: "Sociology", ugInstitution: "Sacramento State University", ugDegreeType: "Bachelor of Arts (BA)",
    ugMinor: "Criminal Justice", additionalDegrees: "",
    swExperience: [
      { agency: "Sacramento Family Support Center / Sacramento, CA", position: "Intake Volunteer", timeType: "Part Time", paidOrVolunteer: "Volunteer", dates: "09/2024 - 06/2025" },
      { agency: "Juvenile Court Volunteer Program / Sacramento, CA", position: "Court Appointed Advocate", timeType: "Part Time", paidOrVolunteer: "Volunteer", dates: "01/2023 - 08/2024" },
    ],
    otherExperience: [{ agency: "Target / Sacramento, CA", position: "Guest Advocate", timeType: "Full Time", paidOrVolunteer: "Paid", dates: "06/2021 - Present" }],
    resumeFileName: "",
    employmentBasedInterest: "No",
    serviceAreaRanks: { "Child Welfare/Child Protective Services": 1, "Justice-Involved": 2, "Crisis Intervention": 3, "Behavioral Health/Mental Health": 4, "Children's Services": 5, "School-Based Services": 6, "Housing/Homeless Services": 7, "Community Health": 8, "Substance Use Treatment": 9, "Aging/Gerontology": 10, "Medical Social Work/Healthcare": 11 },
    otherServiceArea: "", preferredPopulations: "Youth involved in the juvenile justice system and their families.",
    specificOrg: "Sacramento County Child Protective Services — no specific contact yet",
    transportation: { reliableTransportation: true, validLicense: true, validCaLicense: true, publicTransportation: false, deniedLicense: false, movingViolations: false },
    movingViolations: "",
    pride: "I mentored a teenager through the court advocate program for over a year and watched her graduate high school and enroll in community college.",
    afterGraduation: "A child welfare social worker, eventually pursuing a supervisory role in a county CPS office.",
    competencies: { boundaries: "I have a habit of giving out my personal phone number to clients I've built rapport with and want to build healthier boundaries.", receivesFeedback: "I get defensive when a supervisor corrects my documentation and want to work on receiving that feedback more openly." },
    difficultPopulations: "Cases involving parents with active substance use — I grew up in a household affected by this and know it's a sensitive area for me.",
    acknowledgments: { generalConditions: true, previousExperience: true, fieldManual: true, ferpaConsent: true, professionalConduct: true, applicationProcess: true, noContactingAgencies: true, agencyRequirements: true, justiceInvolvement: true, disclosureJustice: true, eligibilityFactors: true, readinessDetermination: true, improvementPlans: true, changesOrTermination: true, prematureEnding: true, professionalReview: true },
    signatureName: "Brianna E. Washington", signatureDate: "Jul 5, 2026",
  },
];

function loadFieldApplications() {
  try {
    const parsed = JSON.parse(localStorage.getItem(APPLICATIONS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function seedFieldApplicationsIfEmpty() {
  if (loadFieldApplications().length === 0) saveFieldApplications(SEED_APPLICATIONS);
}

function saveFieldApplications(apps) {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
}

function renderFormsList() {
  const listEl = document.getElementById("forms-list");
  const emptyEl = document.getElementById("forms-empty");
  const countEl = document.getElementById("forms-count");
  if (!listEl) return;

  const apps = loadFieldApplications().slice().reverse();
  countEl.textContent = apps.length ? `${apps.length} submission${apps.length > 1 ? "s" : ""}` : "";

  if (!apps.length) {
    listEl.innerHTML = "";
    emptyEl.classList.remove("hidden");
    return;
  }
  emptyEl.classList.add("hidden");

  listEl.innerHTML = apps.map(app => `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-app-id="${app.id}">
      <div class="p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p class="font-semibold text-slate-800">${escapeHtml(app.fullName || "Unnamed applicant")}</p>
          <p class="text-xs text-slate-400 mt-0.5">
            Submitted ${new Date(app.submittedAt).toLocaleString()}
            ${app.programTrack ? ` · ${escapeHtml(app.programTrack)}` : ""}
            ${app.concentration ? ` · ${escapeHtml(app.concentration)}` : ""}
          </p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          ${IS_ADMIN ? `<button class="forms-add-roster-btn px-3 py-1.5 text-xs font-medium text-white bg-[#F05A22] hover:bg-[#C44A1C] rounded-lg transition-colors" data-app-id="${app.id}">Add Student</button>` : ""}
          <button class="forms-view-btn px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors" data-app-id="${app.id}">View</button>
          <button class="forms-delete-btn px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors" data-app-id="${app.id}">Delete</button>
        </div>
      </div>
      <div class="forms-detail hidden px-5 sm:px-6 pb-6 bg-slate-50/60 border-t border-slate-100" data-app-id="${app.id}"></div>
    </div>
  `).join("");
}

function detailField(label, value) {
  const display = (value === undefined || value === null || value === "") ? "—" : value;
  return `<div>
    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">${label}</p>
    <p class="text-base text-slate-700 leading-snug whitespace-pre-wrap">${display}</p>
  </div>`;
}

function detailSection(title, innerHtml) {
  return `
    <div class="pt-5">
      <p class="text-sm font-bold text-teal-700 uppercase tracking-wide mb-3">${title}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">${innerHtml}</div>
    </div>`;
}

function detailExperienceCard(exp) {
  return `
    <div class="bg-white rounded-xl border border-slate-100 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Agency</p><p class="text-sm text-slate-700">${escapeHtml(exp.agency) || "—"}</p></div>
      <div><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Position</p><p class="text-sm text-slate-700">${escapeHtml(exp.position) || "—"}</p></div>
      <div><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">FT / PT</p><p class="text-sm text-slate-700">${escapeHtml(exp.timeType) || "—"}</p></div>
      <div><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Paid / Volunteer</p><p class="text-sm text-slate-700">${escapeHtml(exp.paidOrVolunteer) || "—"}</p></div>
      <div class="col-span-2 sm:col-span-4"><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dates</p><p class="text-sm text-slate-700">${escapeHtml(exp.dates) || "—"}</p></div>
    </div>`;
}

function detailCheckRow(label, isTrue) {
  return `
    <div class="flex items-center gap-2.5 py-1">
      <span class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isTrue ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-300"}">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
          ${isTrue ? '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>' : '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>'}
        </svg>
      </span>
      <span class="text-sm ${isTrue ? "text-slate-700" : "text-slate-400"}">${label}</span>
    </div>`;
}

function renderApplicationDetailHtml(app) {
  const parts = [];

  parts.push(detailSection("Part I: Student Demographics", [
    detailField("Full Name (Last, First, Middle)", escapeHtml(app.fullName)),
    detailField("Pacific Student ID", escapeHtml(app.studentId)),
    detailField("Preferred Name", escapeHtml(app.preferredName)),
    detailField("Pronouns", escapeHtml(app.pronouns)),
    detailField("Student Email", app.email ? `<a href="mailto:${escapeHtml(app.email)}" class="text-teal-600 hover:underline">${escapeHtml(app.email)}</a>` : ""),
    detailField("Phone", escapeHtml(app.phone)),
    detailField("Current Address", escapeHtml(app.address)),
    detailField("City, County & Zip of Residence", escapeHtml(app.cityCountyZip)),
    detailField("City & County during Field Internship", escapeHtml(app.fieldCityCounty)),
    detailField("Languages Spoken", escapeHtml(app.languages)),
    detailField("Program Track", escapeHtml(app.programTrack)),
    detailField("Concentration", escapeHtml(app.concentration)),
  ].join("")));

  parts.push(detailSection("Part II: Accommodation", [
    detailField("Requesting accommodation", escapeHtml(app.wantsAccommodation)),
  ].join("")));

  parts.push(detailSection("Part III: Undergraduate Education", [
    detailField("Major", escapeHtml(app.ugMajor)),
    detailField("Institution", escapeHtml(app.ugInstitution)),
    detailField("Degree Type", escapeHtml(app.ugDegreeType)),
    detailField("Minor(s)", escapeHtml(app.ugMinor)),
    detailField("Additional Degrees/Certifications", escapeHtml(app.additionalDegrees)),
  ].join("")));

  const swExp = (app.swExperience || []).map(detailExperienceCard).join("") || `<p class="text-sm text-slate-400 sm:col-span-2">—</p>`;
  const otherExp = (app.otherExperience || []).map(detailExperienceCard).join("") || `<p class="text-sm text-slate-400 sm:col-span-2">—</p>`;
  parts.push(`
    <div class="pt-5">
      <p class="text-sm font-bold text-teal-700 uppercase tracking-wide mb-3">Part IV: Paid or Unpaid Experiences</p>
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Social Work / Human Services Experience</p>
      <div class="space-y-3 mb-4">${swExp}</div>
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Other Experience</p>
      <div class="space-y-3 mb-4">${otherExp}</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${detailField("Resume File", escapeHtml(app.resumeFileName))}</div>
    </div>`);

  parts.push(detailSection("Part V: Employment-Related Internship", [
    detailField("Interested in employment-based placement", escapeHtml(app.employmentBasedInterest)),
  ].join("")));

  const ranked = Object.entries(app.serviceAreaRanks || {}).sort((a, b) => a[1] - b[1]);
  const rankedHtml = ranked.length
    ? `<ol class="list-decimal list-inside space-y-1 text-sm text-slate-700">${ranked.map(([area]) => `<li>${escapeHtml(area)}</li>`).join("")}</ol>`
    : `<p class="text-sm text-slate-400">—</p>`;
  parts.push(`
    <div class="pt-5">
      <p class="text-sm font-bold text-teal-700 uppercase tracking-wide mb-3">Part VI: Field Placement Interests</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Service Area Ranking</p>${rankedHtml}</div>
        ${detailField("Other Service Area", escapeHtml(app.otherServiceArea))}
        ${detailField("Preferred Populations / Other Interests", escapeHtml(app.preferredPopulations))}
        ${detailField("Specific Organization of Interest", escapeHtml(app.specificOrg))}
      </div>
    </div>`);

  const transportRows = Object.entries(FORMS_TRANSPORTATION_LABELS)
    .map(([id, label]) => detailCheckRow(label, !!(app.transportation || {})[id])).join("");
  parts.push(`
    <div class="pt-5">
      <p class="text-sm font-bold text-teal-700 uppercase tracking-wide mb-3">Part VII: Transportation</p>
      <div class="space-y-0.5 mb-3">${transportRows}</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${detailField("Moving Violations Explanation", escapeHtml(app.movingViolations))}</div>
    </div>`);

  const compEntries = Object.entries(app.competencies || {});
  const compHtml = compEntries.length
    ? compEntries.map(([id, plan]) => `
        <div class="bg-white rounded-xl border border-slate-100 p-4">
          <p class="text-sm font-semibold text-slate-700 mb-1">${FORMS_COMPETENCIES[id] || id}</p>
          <p class="text-sm text-slate-600 leading-snug">${escapeHtml(plan) || "—"}</p>
        </div>`).join("")
    : `<p class="text-sm text-slate-400">—</p>`;
  parts.push(`
    <div class="pt-5">
      <p class="text-sm font-bold text-teal-700 uppercase tracking-wide mb-3">Part VIII: Student Self-Assessment</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
        ${detailField("Pride", escapeHtml(app.pride))}
        ${detailField("After Graduation", escapeHtml(app.afterGraduation))}
      </div>
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Competencies to Improve</p>
      <div class="space-y-3 mb-4">${compHtml}</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${detailField("Difficult Populations/Situations", escapeHtml(app.difficultPopulations))}</div>
    </div>`);

  const ackRows = Object.entries(FORMS_ACKNOWLEDGMENT_TITLES)
    .map(([id, title]) => detailCheckRow(title, !!(app.acknowledgments || {})[id])).join("");
  parts.push(`
    <div class="pt-5">
      <p class="text-sm font-bold text-teal-700 uppercase tracking-wide mb-3">Part IX: Acknowledgment of Field Guidelines</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">${ackRows}</div>
    </div>`);

  parts.push(detailSection("Part X: Final Acknowledgement", [
    detailField("Signature", escapeHtml(app.signatureName)),
    detailField("Date", escapeHtml(app.signatureDate)),
  ].join("")));

  return `<div class="divide-y divide-slate-100">${parts.join("")}</div>`;
}

function wireFormsEvents() {
  const formLink = new URL("field-application-form.html", window.location.href).href;

  const linkInput = document.getElementById("form-link-input");
  if (linkInput) linkInput.value = formLink;

  const openLink = document.getElementById("open-form-link");
  if (openLink) openLink.href = formLink;

  const copyLinkBtn = document.getElementById("copy-form-link-btn");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(formLink).then(() => {
        const orig = copyLinkBtn.innerHTML;
        copyLinkBtn.textContent = "Copied ✓";
        setTimeout(() => { copyLinkBtn.innerHTML = orig; }, 2000);
      });
    });
  }

  const listEl = document.getElementById("forms-list");
  if (!listEl) return;

  listEl.addEventListener("click", e => {
    const apps = loadFieldApplications();

    const addRosterBtn = e.target.closest(".forms-add-roster-btn");
    if (addRosterBtn) {
      const app = apps.find(a => a.id === addRosterBtn.dataset.appId);
      if (app && window.openAddToRosterModal) window.openAddToRosterModal(app);
      return;
    }

    const viewBtn = e.target.closest(".forms-view-btn");
    if (viewBtn) {
      const detail = document.querySelector(`.forms-detail[data-app-id="${viewBtn.dataset.appId}"]`);
      const app = apps.find(a => a.id === viewBtn.dataset.appId);
      if (detail && app) {
        if (detail.classList.contains("hidden") && !detail.dataset.rendered) {
          detail.innerHTML = renderApplicationDetailHtml(app);
          detail.dataset.rendered = "true";
        }
        detail.classList.toggle("hidden");
        viewBtn.textContent = detail.classList.contains("hidden") ? "View" : "Hide";
      }
      return;
    }

    const deleteBtn = e.target.closest(".forms-delete-btn");
    if (deleteBtn) {
      if (!confirm("Delete this submission? Make sure you've transferred its data first.")) return;
      saveFieldApplications(apps.filter(a => a.id !== deleteBtn.dataset.appId));
      renderFormsList();
    }
  });
}

// ── Notes Modal (reused for email template preview) ──────────────────────────

function closeNotesModal() {
  document.getElementById("notes-modal").classList.add("hidden");
  document.body.style.overflow = "";
  activeStudentId = null;
}

// ── Agency Renderer ───────────────────────────────────────────────────────────
let activeCityFilter = "";

function buildCityTabs() {
  const cities = [...new Set(agencies.map(a => a.city))].sort();
  const container = document.getElementById("agency-city-tabs");
  container.innerHTML = "";

  // "All" entry
  const allBtn = document.createElement("button");
  allBtn.className = "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors agency-city-tab agency-city-active";
  allBtn.dataset.city = "";
  allBtn.innerHTML = `
    <div class="w-8 h-8 rounded-lg bg-[#F05A22] flex items-center justify-center flex-shrink-0">
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-4.724A1 1 0 013 14.382V5a1 1 0 011-1h4m0 0V2m0 2h4m0 0V2m0 2h4a1 1 0 011 1v9.382a1 1 0 01-.553.894L12 20m0 0l-3-1.5"/>
      </svg>
    </div>
    <span class="text-sm font-semibold text-[#F05A22]">All Cities</span>`;
  allBtn.addEventListener("click", () => setActiveCity(""));
  container.appendChild(allBtn);

  cities.forEach(city => {
    const btn = document.createElement("button");
    btn.className = "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors agency-city-tab";
    btn.dataset.city = city;
    btn.innerHTML = `
      <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 city-icon-wrap">
        <svg class="w-4 h-4 text-slate-500 city-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      <span class="text-sm font-medium text-slate-600 city-label">${city}</span>`;
    btn.addEventListener("click", () => setActiveCity(city));
    container.appendChild(btn);
  });
}

function setActiveCity(city) {
  activeCityFilter = city;
  document.querySelectorAll(".agency-city-tab").forEach(btn => {
    const isActive = btn.dataset.city === city;
    btn.classList.toggle("agency-city-active", isActive);
    const iconWrap = btn.querySelector(".city-icon-wrap");
    const icon = btn.querySelector(".city-icon");
    const label = btn.querySelector(".city-label");
    if (iconWrap) {
      iconWrap.className = `w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 city-icon-wrap ${isActive ? "bg-[#F05A22]" : "bg-slate-100"}`;
    }
    if (icon) icon.className = `w-4 h-4 city-icon ${isActive ? "text-white" : "text-slate-500"}`;
    if (label) label.className = `text-sm font-medium city-label ${isActive ? "text-[#F05A22] font-semibold" : "text-slate-600"}`;
  });
  renderAgencies();
}

function getAgencyFilters() {
  return {
    search: document.getElementById("agency-search").value.trim().toLowerCase(),
    contract: document.getElementById("filter-contract").value,
  };
}

function renderAgencies() {
  const { search, contract } = getAgencyFilters();
  const filtered = agencies.filter(a => {
    if (activeCityFilter && a.city !== activeCityFilter) return false;
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
              <p class="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2">Contact Person</p>
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
              <p class="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2">Location</p>
              <p class="flex items-start gap-1.5 text-xs text-slate-600">
                <svg class="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>${a.address}<br/><span class="text-slate-400">${a.county}</span></span>
              </p>
            </div>
          </div>
          ${IS_ADMIN ? `
          <div class="border-t border-slate-50 pt-3 flex items-center gap-2">
            <button data-id="${a.id}" class="agency-edit-btn flex-1 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">Edit</button>
            <button data-id="${a.id}" class="agency-delete-btn flex-1 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">Delete</button>
          </div>` : ""}
        </div>`;
    }).join("");
  }
  count.textContent = `Showing ${filtered.length} of ${agencies.length} agencies`;

  if (IS_ADMIN) {
    document.querySelectorAll(".agency-edit-btn").forEach(btn => {
      btn.addEventListener("click", () => window.openAgencyEditModal && window.openAgencyEditModal(Number(btn.dataset.id)));
    });
    document.querySelectorAll(".agency-delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const a = agencies.find(x => x.id === Number(btn.dataset.id));
        if (!a) return;
        if (!confirm(`Delete ${a.name}? This cannot be undone.`)) return;
        deleteAgency(a.id);
        renderAgencies();
      });
    });
  }
}

// ── Staff Profile ─────────────────────────────────────────────────────────────
const staffProfile = {
  name: "Dr. Frances Cooper",
  initials: "FC",
  title: "Field Education Coordinator",
  department: "School of Social Work",
  university: "University of the Pacific",
  email: "f.cooper@pacific.edu",
  phone: "(209) 555-0100",
  office: "Bannister Hall, Room 205",
  liaisons: ["Annette", "Vanessa", "Halide"],
};

function renderProfile() {
  const active    = roster.filter(s => s.status === "Active").length;
  const pending   = roster.filter(s => s.status === "Pending").length;
  const completed = roster.filter(s => s.status === "Completed").length;

  const profileInfoRow = (label, value) => `
    <div class="py-3 border-b border-slate-50 last:border-0">
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">${label}</p>
      <p class="text-sm text-slate-700">${value}</p>
    </div>`;

  document.getElementById("profile-content").innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Left: Avatar + name card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center gap-4">
        <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          ${staffProfile.initials}
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800">${staffProfile.name}</h2>
          <p class="text-sm text-teal-600 font-medium mt-1">${staffProfile.title}</p>
          <p class="text-xs text-slate-400 mt-0.5">${staffProfile.department}</p>
        </div>
      </div>

      <!-- Right: Details -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Contact & institutional info -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="px-6 pt-5 pb-3 border-b border-slate-50 flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3 class="font-bold text-slate-900 text-base">Contact Information</h3>
          </div>
          <div class="px-6 divide-y divide-slate-50">
            ${profileInfoRow("Full Name", staffProfile.name)}
            ${profileInfoRow("Email", `<a href="mailto:${staffProfile.email}" class="text-indigo-500 hover:underline">${staffProfile.email}</a>`)}
            ${profileInfoRow("Phone", staffProfile.phone)}
            ${profileInfoRow("Office", staffProfile.office)}
            ${profileInfoRow("University", staffProfile.university)}
            ${profileInfoRow("Department", staffProfile.department)}
          </div>
        </div>

        <!-- Caseload summary -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="px-6 pt-5 pb-3 border-b border-slate-50 flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="font-bold text-slate-900 text-base">Current Caseload</h3>
          </div>
          <div class="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            ${[
              { label: "Total Students", value: roster.length, cls: "bg-slate-50 text-slate-700" },
              { label: "Active",         value: active,        cls: "bg-emerald-50 text-emerald-700" },
              { label: "Pending",        value: pending,       cls: "bg-amber-50 text-amber-700" },
              { label: "Completed",      value: completed,     cls: "bg-indigo-50 text-indigo-700" },
            ].map(s => `
              <div class="${s.cls} rounded-xl p-4 text-center">
                <p class="text-2xl font-bold ${s.cls.includes("slate") ? "text-slate-800" : ""}">${s.value}</p>
                <p class="text-xs font-medium mt-1 opacity-80">${s.label}</p>
              </div>`).join("")}
          </div>
        </div>

      </div>
    </div>
  `;
}

// ── Email Templates ───────────────────────────────────────────────────────────
const DEFAULT_TEMPLATES = [
  {
    id: 1, category: "Accepted",
    title: "Placement Accepted",
    subject: "Congratulations — Your Field Placement Has Been Confirmed",
    body: `Dear [Student Name],

We are pleased to inform you that your field placement at [Agency Name] has been officially confirmed for [Start Date] through [End Date].

Please report to [Agency Address] on your first day. Your field supervisor will be [Supervisor Name], who will walk you through orientation and your learning plan for the semester.

A few important reminders:
• Log your hours weekly in the student portal.
• Your field liaison, [Liaison Name], will schedule a check-in within the first two weeks.
• Please review the Field Education Handbook before your start date.

We are excited for you to begin this experience. Do not hesitate to reach out with any questions.

Warm regards,
[Coordinator Name]
Field Education Program
University of the Pacific`,
  },
  {
    id: 2, category: "On Hold",
    title: "Placement On Hold",
    subject: "Update on Your Field Placement Application — Action Required",
    body: `Dear [Student Name],

Thank you for your continued interest in the Field Education Program. We are writing to let you know that your placement at [Agency Name] has been placed on hold pending the following:

• [Reason — e.g., missing documentation / affiliation agreement not yet signed / background check in progress]

To move forward, please take the following steps as soon as possible:
1. [Action item 1]
2. [Action item 2]

Once these items are resolved, we will be able to confirm your start date. Please reach out to your liaison, [Liaison Name], if you have any questions or need assistance.

We appreciate your patience and look forward to getting you placed.

Sincerely,
[Coordinator Name]
Field Education Program
University of the Pacific`,
  },
  {
    id: 3, category: "Denied",
    title: "Placement Not Approved",
    subject: "Field Placement Application — Decision Notice",
    body: `Dear [Student Name],

Thank you for your application to the Field Education Program and for your interest in [Agency Name].

After careful review, we regret to inform you that we are unable to approve your placement at this time. This decision was based on [brief, professional reason — e.g., capacity limitations at the agency / a mismatch with the current learning objectives / eligibility requirements not yet met].

This does not reflect on your potential as a social work professional. We encourage you to:
• Schedule a meeting with your academic advisor to discuss next steps.
• Review alternative placement opportunities for the upcoming term.
• Contact our office to explore other agencies that may be a strong fit.

We remain committed to supporting your academic and professional development. Please do not hesitate to reach out.

Sincerely,
[Coordinator Name]
Field Education Program
University of the Pacific`,
  },
  {
    id: 4, category: "General",
    title: "Welcome to Field Education",
    subject: "Welcome to the Field Education Program — Important Next Steps",
    body: `Dear [Student Name],

Welcome to the Field Education Program at the University of the Pacific! We are thrilled to have you join us for this important milestone in your social work education.

Here is what to expect over the coming weeks:

1. Placement Matching — Our team will work with you to identify an agency that aligns with your concentration ([Concentration]) and learning goals.
2. Orientation — You will receive an invitation to the Field Education Orientation shortly. Attendance is required.
3. Liaison Introduction — You have been assigned [Liaison Name] as your field liaison. They will be your primary point of contact throughout your placement.

Please log into the student portal to complete your placement preference form by [Deadline Date].

We look forward to supporting you through this journey. Welcome aboard!

Best,
[Coordinator Name]
Field Education Program
University of the Pacific`,
  },
  {
    id: 5, category: "General",
    title: "Hours Log Reminder",
    subject: "Reminder: Please Update Your Field Hours Log",
    body: `Dear [Student Name],

This is a friendly reminder that your field hours log is due to be updated. Our records show your last entry was on [Last Log Date].

Keeping accurate, up-to-date hours is a program requirement and ensures you remain on track toward your [Required Hours]-hour goal.

To log your hours:
1. Log in to the student portal.
2. Navigate to "Field Hours" and enter your hours for each session.
3. Submit for supervisor approval.

If you are experiencing any difficulties logging your hours or have questions about your progress, please reach out to your liaison, [Liaison Name].

Thank you for staying on top of this important requirement.

Best regards,
[Coordinator Name]
Field Education Program
University of the Pacific`,
  },
  {
    id: 6, category: "General",
    title: "Mid-Placement Check-In",
    subject: "Mid-Placement Check-In — How Is Your Placement Going?",
    body: `Dear [Student Name],

As you reach the midpoint of your field placement at [Agency Name], we want to take a moment to check in on your progress and experience.

Please take a few minutes to reflect on the following:
• Are you on track with your hours? (Current goal: [Hours Completed] of [Required Hours] hours)
• Is your learning agreement being addressed?
• Are there any challenges with your supervisor or agency you would like to discuss?

Your field liaison, [Liaison Name], will be reaching out shortly to schedule a mid-placement meeting. If you have any immediate concerns, please do not wait — contact us at any time.

We hope your placement is proving to be a meaningful and growth-filled experience.

Warm regards,
[Coordinator Name]
Field Education Program
University of the Pacific`,
  },
  {
    id: 7, category: "General",
    title: "Site Visit Notification",
    subject: "Upcoming Site Visit — [Agency Name]",
    body: `Dear [Student Name] and [Supervisor Name],

I hope this message finds you both well. I am writing to schedule a site visit as part of our standard field education oversight process.

Proposed visit details:
• Date: [Proposed Date]
• Time: [Proposed Time]
• Location: [Agency Address]

During the visit, I will meet briefly with both of you — together and individually — to discuss the student's progress, learning goals, and overall placement experience.

Please let me know if the proposed date works, or suggest an alternative that fits your schedule. I look forward to connecting with you both.

Best regards,
[Liaison Name]
Field Education Program
University of the Pacific`,
  },
  {
    id: 8, category: "General",
    title: "Missing Documentation",
    subject: "Action Required — Outstanding Field Placement Documentation",
    body: `Dear [Student Name],

We hope your placement is going well. Our records indicate that the following required documentation has not yet been submitted:

• [ ] Signed Learning Agreement
• [ ] Background Check Clearance
• [ ] Liability Insurance Confirmation
• [ ] Other: [Specify]

These documents are required for you to remain in good standing with the Field Education Program. Please submit the outstanding items through the student portal or email them directly to our office no later than [Deadline Date].

If you have already submitted these items and believe this message was sent in error, please contact us so we can update your records.

Thank you for your prompt attention to this matter.

Sincerely,
[Coordinator Name]
Field Education Program
University of the Pacific`,
  },
];

let TEMPLATES = loadOrSeed(TEMPLATES_KEY, DEFAULT_TEMPLATES);
function persistTemplates() { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(TEMPLATES)); }

const TEMPLATE_CATEGORY_STYLES = {
  "Accepted": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "On Hold":  "bg-amber-50 text-amber-700 border border-amber-200",
  "Denied":   "bg-red-50 text-red-600 border border-red-200",
  "General":  "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

function renderTemplates() {
  const search   = document.getElementById("template-search").value.trim().toLowerCase();
  const category = document.getElementById("filter-template-category").value;

  const filtered = TEMPLATES.filter(t => {
    if (search && !t.title.toLowerCase().includes(search) && !t.subject.toLowerCase().includes(search)) return false;
    if (category && t.category !== category) return false;
    return true;
  });

  const grid  = document.getElementById("template-cards");
  const empty = document.getElementById("template-empty");

  if (filtered.length === 0) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  grid.innerHTML = filtered.map(t => {
    const catCls = TEMPLATE_CATEGORY_STYLES[t.category] || TEMPLATE_CATEGORY_STYLES["General"];
    const preview = t.body.split("\n").slice(2, 5).join(" ").replace(/\s+/g, " ").slice(0, 120) + "…";
    return `
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <!-- Card header -->
        <div class="px-5 pt-5 pb-4 border-b border-slate-50">
          <div class="flex items-start justify-between gap-3 mb-2">
            <h3 class="font-bold text-slate-800 text-base leading-snug">${t.title}</h3>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${catCls}">${t.category}</span>
          </div>
          <p class="text-xs text-slate-500"><span class="font-medium text-slate-400 uppercase tracking-wide text-[10px]">Subject: </span>${t.subject}</p>
        </div>

        <!-- Body preview -->
        <div class="px-5 py-4 flex-1">
          <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">Preview</p>
          <p class="text-sm text-slate-500 leading-relaxed">${preview}</p>
        </div>

        <!-- Actions -->
        <div class="px-5 pb-5 flex items-center gap-2">
          <button onclick="expandTemplate(${t.id})"
            class="flex-1 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors">
            View Full Template
          </button>
          <button onclick="copyTemplate(${t.id}, this)"
            class="py-2 px-4 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors">
            Copy
          </button>
          ${IS_ADMIN ? `
          <button class="template-edit-btn py-2 px-4 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors" data-id="${t.id}">Edit</button>
          <button class="template-delete-btn py-2 px-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors" data-id="${t.id}">Delete</button>` : ""}
        </div>
      </div>`;
  }).join("");

  if (IS_ADMIN) {
    document.querySelectorAll(".template-edit-btn").forEach(btn => {
      btn.addEventListener("click", () => window.openTemplateEditModal && window.openTemplateEditModal(Number(btn.dataset.id)));
    });
    document.querySelectorAll(".template-delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = TEMPLATES.find(x => x.id === Number(btn.dataset.id));
        if (!t) return;
        if (!confirm(`Delete the "${t.title}" template? This cannot be undone.`)) return;
        deleteTemplate(t.id);
        renderTemplates();
      });
    });
  }
}

function copyTemplate(id, btn) {
  const t = TEMPLATES.find(t => t.id === id);
  if (!t) return;
  const text = `Subject: ${t.subject}\n\n${t.body}`;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = "Copied ✓";
    btn.classList.add("bg-emerald-600");
    btn.classList.remove("bg-teal-600");
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove("bg-emerald-600");
      btn.classList.add("bg-teal-600");
    }, 2000);
  });
}

function expandTemplate(id) {
  const t = TEMPLATES.find(t => t.id === id);
  if (!t) return;
  const catCls = TEMPLATE_CATEGORY_STYLES[t.category] || TEMPLATE_CATEGORY_STYLES["General"];
  document.getElementById("modal-student-name").textContent = t.title;
  document.getElementById("modal-student-meta").innerHTML = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${catCls}">${t.category}</span>`;
  document.getElementById("modal-detail-grid").innerHTML = `
    <div class="col-span-2">
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Subject</p>
      <p class="text-sm font-medium text-slate-700">${t.subject}</p>
    </div>`;
  document.getElementById("modal-notes-textarea").value = t.body;
  document.querySelector("label[for='modal-notes-textarea']").textContent = "Email Body";
  document.getElementById("modal-save").textContent = "Copy to Clipboard";
  document.getElementById("modal-save").onclick = () => copyTemplate(t.id, document.getElementById("modal-save"));
  document.getElementById("notes-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// ── Tab Switching ─────────────────────────────────────────────────────────────
const TAB_META = {
  home:           { heading: "Welcome, " + staffProfile.name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.)\s*/i, "") },
  students:       { heading: "Student Roster" },
  checklist:      { heading: "Checklist" },
  agencies:       { heading: "Agency Directory" },
  communications: { heading: "Email Templates" },
  forms:          { heading: "Student Forms" },
  "agency-forms": { heading: "Agency Forms" },
  profile:        { heading: "Profile" },
};

let activeTab = "home";

function switchTab(tab) {
  activeTab = tab;
  ["home", "students", "checklist", "agencies", "communications", "forms", "agency-forms", "profile"].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle("hidden", t !== tab);
  });
  if (tab === "forms") renderFormsList();
  if (tab === "checklist") renderChecklist();
  document.querySelectorAll(".sidebar-tab").forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("sidebar-active", isActive);
    const iconWrap = btn.querySelector(".sidebar-icon-wrap");
    const icon     = btn.querySelector("svg");
    if (isActive) {
      iconWrap.classList.remove("bg-slate-200");
      iconWrap.classList.add("bg-orange-600");
      icon.classList.remove("text-slate-300");
      icon.classList.add("text-white");
    } else {
      iconWrap.classList.remove("bg-orange-600");
      iconWrap.classList.add("bg-slate-200");
      icon.classList.remove("text-white");
      icon.classList.add("text-slate-300");
    }
  });
  document.getElementById("page-heading").textContent = TAB_META[tab].heading;
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
  setActiveCity("");
}

function wireEvents() {
  ["search-input", "filter-cohort", "filter-concentration", "filter-liaison", "filter-status", "filter-format"]
    .forEach(id => document.getElementById(id).addEventListener("input", renderRoster));

  document.getElementById("clear-filters").addEventListener("click", resetFilters);
  document.getElementById("header-reset").addEventListener("click", () => {
    activeTab === "students" ? resetFilters() : resetAgencyFilters();
  });

  document.getElementById("agency-search").addEventListener("input", renderAgencies);
  document.getElementById("filter-contract").addEventListener("change", renderAgencies);
  document.getElementById("clear-agency-filters").addEventListener("click", resetAgencyFilters);

  wireChecklistEvents();
  wireChecklistTrashEvents();
  wireChecklistTaskModalEvents();
  wireFormsEvents();

  buildCityTabs();

  document.getElementById("template-search").addEventListener("input", renderTemplates);
  document.getElementById("filter-template-category").addEventListener("input", renderTemplates);
  document.getElementById("clear-template-filters").addEventListener("click", () => {
    document.getElementById("template-search").value = "";
    document.getElementById("filter-template-category").value = "";
    renderTemplates();
  });

  document.querySelectorAll(".sidebar-tab").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("panel-add-note").addEventListener("click", () => {
    if (activeStudentId === null) return;
    const ta = document.getElementById("panel-new-note");
    addStudentNote(activeStudentId, ta.value);
    ta.value = "";
    const status = document.getElementById("panel-save-status");
    status.textContent = "Saved ✓";
    setTimeout(() => { if (document.getElementById("panel-save-status")) status.textContent = ""; }, 2000);
  });

  document.getElementById("panel-notes-thread").addEventListener("click", e => {
    const pinBtn = e.target.closest(".pin-toggle-btn");
    if (pinBtn) {
      togglePinNote(activeStudentId, Number(pinBtn.dataset.noteId));
      return;
    }
    const toggleBtn = e.target.closest(".reply-toggle-btn");
    if (toggleBtn) {
      const form = document.querySelector(`.reply-form[data-note-id="${toggleBtn.dataset.noteId}"]`);
      form.classList.toggle("hidden");
      if (!form.classList.contains("hidden")) form.querySelector("textarea").focus();
      return;
    }
    const submitBtn = e.target.closest(".reply-submit-btn");
    if (submitBtn) {
      const noteId = Number(submitBtn.dataset.noteId);
      const textarea = submitBtn.closest(".reply-form").querySelector("textarea");
      addNoteReply(activeStudentId, noteId, textarea.value);
    }
  });

  document.getElementById("modal-close").addEventListener("click", closeNotesModal);
  document.getElementById("modal-cancel").addEventListener("click", closeNotesModal);
  document.getElementById("notes-backdrop").addEventListener("click", closeNotesModal);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.getElementById("avatar-dropdown").classList.add("hidden");
      closeSettings();
      if (activeStudentId !== null) closeStudentPanel();
      closeNotesModal();
    }
  });

  document.addEventListener("click", e => {
    const avatarWrap = document.getElementById("avatar-menu-wrap");
    const avatarDd   = document.getElementById("avatar-dropdown");
    if (avatarWrap && !avatarWrap.contains(e.target)) avatarDd.classList.add("hidden");

    const notifWrap = document.getElementById("notif-wrap");
    const notifDd   = document.getElementById("notif-dropdown");
    if (notifWrap && !notifWrap.contains(e.target)) notifDd.classList.add("hidden");
  });
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

// ── Notifications ─────────────────────────────────────────────────────────────
function buildNotifications() {
  const needsPlacement = roster.filter(s => s.status === "Pending");
  const newlyAdded     = roster.filter(s => s.cohort === "Fall 2025");
  const contractAlerts = agencies.filter(a => a.contract === "Pending" || a.contract === "Expired");

  function notifSection(title, dotCls, items, itemHtml) {
    if (!items.length) return "";
    return `
      <div class="px-4 pt-3 pb-1">
        <p class="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2">${title}</p>
        <div class="space-y-1">
          ${items.map(itemHtml).join("")}
        </div>
      </div>`;
  }

  function notifRow(label, sub, dotCls) {
    return `<div class="flex items-start gap-2.5 py-2">
      <span class="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dotCls}"></span>
      <div>
        <p class="text-sm font-medium text-slate-700 leading-snug">${label}</p>
        ${sub ? `<p class="text-xs text-slate-400 mt-0.5">${sub}</p>` : ""}
      </div>
    </div>`;
  }

  const html =
    notifSection("Needs Placement", "bg-amber-400", needsPlacement,
      s => notifRow(s.name, `${s.cohort} · ${s.concentration}`, "bg-amber-400")) +
    notifSection("Newly Added", "bg-sky-400", newlyAdded,
      s => notifRow(s.name, `Added · ${s.cohort}`, "bg-sky-400")) +
    notifSection("Contract Updates", "bg-red-400", contractAlerts,
      a => notifRow(a.name, `Contract ${a.contract}`, a.contract === "Expired" ? "bg-red-400" : "bg-amber-400"));

  const panel = document.getElementById("notif-dropdown");
  panel.innerHTML = `
    <div class="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
      <p class="font-semibold text-sm text-slate-800">Notifications</p>
      <span class="text-xs text-white bg-[#F05A22] rounded-full px-2 py-0.5 font-semibold">
        ${needsPlacement.length + newlyAdded.length + contractAlerts.length}
      </span>
    </div>
    <div class="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
      ${html}
    </div>`;
}

function toggleNotifications() {
  const dd = document.getElementById("notif-dropdown");
  const isHidden = dd.classList.toggle("hidden");
  if (!isHidden) buildNotifications();
  document.getElementById("avatar-dropdown").classList.add("hidden");
}

// ── Admin CRUD ────────────────────────────────────────────────────────────────
// Set by admin-dashboard.html (before this file loads) to reveal Add/Edit/Delete
// affordances in the shared render functions above. Plain staff-dashboard.html
// never sets this, so it stays read-only there.
const IS_ADMIN = typeof window !== "undefined" && !!window.IS_ADMIN;

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function addStudent(data) {
  const student = Object.assign({
    id: nextId(roster), notes: [], fieldInstructor: "—", fieldAgency: "—",
    fieldStart: "—", fieldEnd: "—", setting: "", county: "",
  }, data);
  roster.push(student);
  persistRoster();
  return student;
}

function updateStudent(id, changes) {
  const student = roster.find(s => s.id === id);
  if (!student) return null;
  Object.assign(student, changes);
  persistRoster();
  return student;
}

function deleteStudent(id) {
  roster = roster.filter(s => s.id !== id);
  persistRoster();
}

function addAgency(data) {
  const agency = Object.assign({ id: nextId(agencies) }, data);
  agencies.push(agency);
  persistAgencies();
  return agency;
}

function updateAgency(id, changes) {
  const agency = agencies.find(a => a.id === id);
  if (!agency) return null;
  Object.assign(agency, changes);
  persistAgencies();
  return agency;
}

function deleteAgency(id) {
  agencies = agencies.filter(a => a.id !== id);
  persistAgencies();
}

function addTemplate(data) {
  const template = Object.assign({ id: nextId(TEMPLATES) }, data);
  TEMPLATES.push(template);
  persistTemplates();
  return template;
}

function updateTemplate(id, changes) {
  const template = TEMPLATES.find(t => t.id === id);
  if (!template) return null;
  Object.assign(template, changes);
  persistTemplates();
  return template;
}

function deleteTemplate(id) {
  TEMPLATES = TEMPLATES.filter(t => t.id !== id);
  persistTemplates();
}

// ── Init ──────────────────────────────────────────────────────────────────────
const today = new Date();
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = today.getFullYear();

const staffNameEl = document.getElementById("avatar-staff-name");
if (staffNameEl) staffNameEl.textContent = staffProfile.name;
const staffTitleEl = document.getElementById("avatar-staff-title");
if (staffTitleEl) staffTitleEl.textContent = staffProfile.title;
document.getElementById("page-heading").textContent = TAB_META.home.heading;

wireEvents();
initTheme();
initTextSize();
loadSavedNotes();
renderStats();
renderPlacementBreakdown();
renderChecklist();
seedFieldApplicationsIfEmpty();
renderFormsList();
renderTableHeader();
renderRoster();
renderAgencies();
renderTemplates();
renderProfile();
