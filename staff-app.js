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
// Some agencies run multiple branches, each in its own city/county — those live
// in the "locations" array so the agency is still one record (one card, one
// profile, one contract) with several places attached to it, instead of the
// directory needing a duplicate entry per branch.
const DEFAULT_AGENCIES = [
  {
    id: 1, name: "Community Health & Wellness Center",
    contact: "Dr. Sarah Johnson", title: "Director of Field Education",
    email: "s.johnson@chwc.org", phone: "(212) 555-0456",
    contract: "Active",
    locations: [
      { address: "456 Park Avenue", city: "San Francisco", county: "San Francisco County", zip: "94108",
        placements: [{ semester: "Fall 2025", count: 2 }, { semester: "Spring 2026", count: 3 }] },
    ],
  },
  {
    id: 2, name: "Bay Area Mental Health Services",
    contact: "Marcus Reid", title: "Community Outreach Manager",
    email: "m.reid@bamhs.org", phone: "(510) 555-0234",
    contract: "Active",
    locations: [
      { address: "88 Broadway Blvd", city: "Oakland", county: "Alameda County", zip: "94607",
        placements: [{ semester: "Fall 2025", count: 3 }, { semester: "Spring 2026", count: 2 }] },
      { address: "1220 N. Wilson Way", city: "Stockton", county: "San Joaquin County", zip: "95205",
        placements: [{ semester: "Spring 2026", count: 1 }] },
    ],
  },
  {
    id: 3, name: "Central Valley Youth Services",
    contact: "Lucia Flores", title: "Program Coordinator",
    email: "l.flores@cvys.org", phone: "(209) 555-0678",
    contract: "Pending",
    locations: [
      { address: "321 Oak Street", city: "Modesto", county: "Stanislaus County", zip: "95354",
        placements: [{ semester: "Fall 2025", count: 2 }] },
    ],
  },
  {
    id: 4, name: "Sacramento Family Support Center",
    contact: "Thomas Nguyen", title: "Field Supervisor",
    email: "t.nguyen@sfsc.org", phone: "(916) 555-0321",
    contract: "Active",
    locations: [
      { address: "750 Capitol Avenue", city: "Sacramento", county: "Sacramento County", zip: "95814",
        placements: [{ semester: "Fall 2025", count: 4 }, { semester: "Spring 2026", count: 4 }, { semester: "Fall 2026", count: 3 }] },
    ],
  },
  {
    id: 5, name: "Fresno Community Outreach",
    contact: "Angela Torres", title: "Social Work Supervisor",
    email: "a.torres@fco.org", phone: "(559) 555-0987",
    contract: "Active",
    locations: [
      { address: "199 Fulton Street", city: "Fresno", county: "Fresno County", zip: "93721",
        placements: [{ semester: "Spring 2026", count: 2 }] },
    ],
  },
  {
    id: 6, name: "Oakland Social Services Agency",
    contact: "Derek Miles", title: "Agency Director",
    email: "d.miles@ossa.org", phone: "(510) 555-0112",
    contract: "Expired",
    locations: [
      { address: "500 Lake Merritt Blvd", city: "Oakland", county: "Alameda County", zip: "94610", placements: [] },
    ],
  },
  {
    id: 7, name: "Stockton Behavioral Health Clinic",
    contact: "Patricia Lim", title: "Clinical Director",
    email: "p.lim@sbhc.org", phone: "(209) 555-0445",
    contract: "Active",
    locations: [
      { address: "1040 W. Fremont Street", city: "Stockton", county: "San Joaquin County", zip: "95203",
        placements: [{ semester: "Fall 2025", count: 3 }] },
    ],
  },
  {
    id: 8, name: "San Jose Healthcare Partners",
    contact: "James Okafor", title: "Placement Liaison",
    email: "j.okafor@sjhp.org", phone: "(408) 555-0773",
    contract: "Pending",
    locations: [
      { address: "2200 Alum Rock Avenue", city: "San Jose", county: "Santa Clara County", zip: "95116",
        placements: [{ semester: "Spring 2026", count: 2 }] },
      { address: "199 Fulton Street", city: "Fresno", county: "Fresno County", zip: "93721",
        placements: [{ semester: "Fall 2026", count: 1 }] },
    ],
  },
];

// Older sessions stored a single flat address/city/county per agency — fold
// those into a one-item "locations" array so every agency record, old or new,
// has the same shape going forward. Also backfills "placements" (the by-
// semester availability record) onto any location that predates it — the
// short-lived single-number "placementsAvailable" field carried no semester,
// so it's dropped rather than guessed at.
function migrateAgencyLocations(list) {
  let changed = false;
  list.forEach(a => {
    if (!Array.isArray(a.locations)) {
      a.locations = [{ address: a.address || "", city: a.city || "", county: a.county || "" }];
      delete a.address; delete a.city; delete a.county;
      changed = true;
    }
    if (a.notes !== undefined) { delete a.notes; changed = true; }
    a.locations.forEach(l => {
      if (!Array.isArray(l.placements)) {
        l.placements = [];
        delete l.placementsAvailable;
        changed = true;
      }
      if (typeof l.zip !== "string") { l.zip = ""; changed = true; }
    });
  });
  return changed;
}

let agencies = loadOrSeed(AGENCIES_KEY, DEFAULT_AGENCIES);
function persistAgencies() { localStorage.setItem(AGENCIES_KEY, JSON.stringify(agencies)); }
if (migrateAgencyLocations(agencies)) persistAgencies();

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

// ── Cohort Options ───────────────────────────────────────────────────────────
// Backs the "Cohort" filter dropdown on the Students tab — one flat list,
// always sorted chronologically (see compareCohorts below), so a newly added
// cohort just lands in its correct place instead of needing its own section.
// Only the admin dashboard (IS_ADMIN) gets an "Other…" entry to add/rename/
// delete cohorts — staff-dashboard.html just reads this same list.
const COHORTS_KEY = "fepms-cohorts";
const DEFAULT_COHORTS = ["Spring 2023", "Spring 2024", "Fall 2024", "Fall 2025", "Spring 2026", "Fall 2026"];

function loadOrSeedCohorts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(COHORTS_KEY));
    // Older sessions stored {name, current} objects — unwrap those to plain
    // names so this always ends up a flat string array either way.
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map(c => (typeof c === "string" ? c : c.name)).filter(Boolean);
    }
  } catch (e) { /* fall through to reseed */ }
  const seeded = [...DEFAULT_COHORTS];
  localStorage.setItem(COHORTS_KEY, JSON.stringify(seeded));
  return seeded;
}

let cohortOptions = loadOrSeedCohorts();
function persistCohorts() { localStorage.setItem(COHORTS_KEY, JSON.stringify(cohortOptions)); }

// Chronological ordering for cohort names shaped "<Term> <Year>" — newest year
// first, and within a year always Spring → Summer → Fall. Anything that
// doesn't match the pattern sorts after the recognized ones, alphabetically.
const COHORT_TERM_ORDER = { spring: 0, summer: 1, fall: 2 };

function parseCohortName(name) {
  const match = /^(spring|summer|fall)\s+(\d{4})$/i.exec(String(name).trim());
  if (!match) return null;
  return { term: match[1].toLowerCase(), year: Number(match[2]) };
}

function compareCohorts(a, b) {
  const pa = parseCohortName(a);
  const pb = parseCohortName(b);
  if (pa && pb) {
    return pb.year - pa.year || COHORT_TERM_ORDER[pa.term] - COHORT_TERM_ORDER[pb.term];
  }
  if (pa && !pb) return -1;
  if (!pa && pb) return 1;
  return a.localeCompare(b);
}

// Shared by the filter dropdown and every student-record cohort <select> below.
function cohortOptionsHtml(selected) {
  return [...cohortOptions].sort(compareCohorts)
    .map(name => `<option value="${escapeHtml(name)}" ${name === selected ? "selected" : ""}>${escapeHtml(name)}</option>`)
    .join("");
}

function renderCohortFilterOptions() {
  const sel = document.getElementById("filter-cohort");
  if (sel) {
    const prevValue = sel.value;
    let html = `<option value="">All Cohorts</option>`;
    html += cohortOptionsHtml("");
    if (IS_ADMIN) html += `<option value="__other__">Other…</option>`;
    sel.innerHTML = html;
    sel.value = [...sel.options].some(o => o.value === prevValue) ? prevValue : "";
  }

  // Home page Placement Breakdown widget has its own cohort filter — plain,
  // no "Other…" management option since it's just narrowing a chart.
  const pbSel = document.getElementById("placement-breakdown-cohort");
  if (pbSel) {
    const prevValue = pbSel.value;
    pbSel.innerHTML = `<option value="">All Cohorts</option>` + cohortOptionsHtml("");
    pbSel.value = [...pbSel.options].some(o => o.value === prevValue) ? prevValue : "";
  }
}

// Used for a student record's own cohort assignment (the Add/Edit Student form's
// sf-cohort and the roster panel's panel-cohort) — a real dropdown of existing
// cohorts, never free text. Only admins get "+ Add New Cohort…"; picking it
// prompts for a name right there and appends it to cohortOptions — no separate
// field opens elsewhere on the page.
function cohortFieldOptionsHtml(selected) {
  const val = selected && selected !== "—" ? selected : "";
  const hasMatch = cohortOptions.includes(val);
  let html = `<option value="" ${val ? "" : "selected"}>—</option>`;
  html += cohortOptionsHtml(val);
  if (val && !hasMatch) html += `<option value="${escapeHtml(val)}" selected>${escapeHtml(val)}</option>`;
  if (IS_ADMIN) html += `<option value="__add__">+ Add New Cohort…</option>`;
  return html;
}

// ── Coordinators (Field Liaisons) ────────────────────────────────────────────
// Backs every "Field Liaison" dropdown/filter across both dashboards — one
// flat list of { id, name, email, title, phone } records. Only the admin
// dashboard (IS_ADMIN) gets the "Add Coordinator" form (see admin-app.js);
// staff-dashboard.html just reads this same list, same pattern as
// cohortOptions above.
const COORDINATORS_KEY = "fepms-coordinators";
const DEFAULT_COORDINATORS = [
  { id: 1, name: "Annette", email: "annette@pacific.edu", title: "Field Liaison", phone: "" },
  { id: 2, name: "Halide",  email: "halide@pacific.edu",  title: "Field Liaison", phone: "" },
  { id: 3, name: "Vanessa", email: "vanessa@pacific.edu", title: "Field Liaison", phone: "" },
];

function loadOrSeedCoordinators() {
  try {
    const parsed = JSON.parse(localStorage.getItem(COORDINATORS_KEY));
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) { /* fall through to reseed */ }
  const seeded = [...DEFAULT_COORDINATORS];
  localStorage.setItem(COORDINATORS_KEY, JSON.stringify(seeded));
  return seeded;
}

let coordinators = loadOrSeedCoordinators();
let coordinatorIdCounter = coordinators.reduce((max, c) => Math.max(max, c.id), 0) + 1;
function persistCoordinators() { localStorage.setItem(COORDINATORS_KEY, JSON.stringify(coordinators)); }

function coordinatorNames() {
  return coordinators.map(c => c.name).sort();
}

function addCoordinator(data) {
  const coordinator = {
    id: coordinatorIdCounter++,
    name: data.name.trim(),
    email: data.email.trim(),
    title: (data.title || "").trim() || "Field Liaison",
    phone: (data.phone || "").trim(),
  };
  coordinators.push(coordinator);
  persistCoordinators();
  return coordinator;
}

// Rebuilds the Students tab's "Field Liaison" filter from the current
// coordinator list — mirrors renderCohortFilterOptions above.
function renderLiaisonFilterOptions() {
  const sel = document.getElementById("filter-liaison");
  if (!sel) return;
  const prevValue = sel.value;
  sel.innerHTML = `<option value="">All Liaisons</option>` +
    coordinatorNames().map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
  sel.value = [...sel.options].some(o => o.value === prevValue) ? prevValue : "";
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
  const cohortSel = document.getElementById("placement-breakdown-cohort");
  const cohortFilter = cohortSel ? cohortSel.value : "";
  const filteredRoster = cohortFilter ? scopedRoster.filter(s => s.cohort === cohortFilter) : scopedRoster;
  const total = filteredRoster.length;

  const counts = {};
  PLACEMENT_BUCKETS.forEach(b => counts[b] = 0);
  filteredRoster.forEach(s => counts[placementBucket(s)]++);

  const placedCount = filteredRoster.filter(s => s.fieldAgency && s.fieldAgency !== "—").length;
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

// ── Agency Contract Status ───────────────────────────────────────────────────
const CONTRACT_BUCKETS = ["Active", "Pending", "Expired"];
const CONTRACT_BUCKET_STYLES = {
  Active:  { bar: "bg-emerald-400", text: "text-emerald-700" },
  Pending: { bar: "bg-amber-400",   text: "text-amber-700" },
  Expired: { bar: "bg-red-400",     text: "text-red-600" },
};

function renderAgencyContractStatus() {
  const el = document.getElementById("agency-contract-status");
  if (!el) return;

  const total = agencies.length;
  const counts = {};
  CONTRACT_BUCKETS.forEach(b => counts[b] = 0);
  agencies.forEach(a => { counts[a.contract] = (counts[a.contract] || 0) + 1; });

  el.innerHTML = `
    <div class="space-y-3">
      ${CONTRACT_BUCKETS.map(b => {
        const count = counts[b];
        const pct = total ? Math.round((count / total) * 100) : 0;
        const style = CONTRACT_BUCKET_STYLES[b];
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
      <span class="text-xs font-medium text-slate-600">Total Agencies</span>
      <span class="text-sm font-bold text-teal-700">${total}</span>
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
              <p class="font-medium text-base text-teal-700 group-hover:text-teal-900 group-hover:underline">${s.name}</p>
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
      btn.addEventListener("click", async () => {
        const s = roster.find(r => r.id === Number(btn.dataset.id));
        if (!s) return;
        const ok = await confirmDialog(`Delete ${s.name} from the roster? This cannot be undone.`, { title: "Delete student", confirmLabel: "Delete", danger: true });
        if (!ok) return;
        deleteStudent(s.id);
        renderRoster();
        renderStats();
        renderPlacementBreakdown();
        if (window.renderLiaisonBreakdown) window.renderLiaisonBreakdown();
        if (window.renderCoordinatorsTab) window.renderCoordinatorsTab();
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

// ── Workflow Checklists (per-student + per-agency) ───────────────────────────
// STUDENT_WORKFLOW_PHASES, AGENCY_WORKFLOW_PHASES, the *_WORKFLOW_KEY names,
// loadWorkflowStore, workflowStats, firstIncompletePhaseId, workflowNoteKey,
// and workflowItemNotes all live in workflow-data.js (loaded before this
// file) — shared with app.js's read-only student Checklist tab so the phase
// text and progress-store format can never drift between the two.
let studentWorkflowStore = loadWorkflowStore(STUDENT_WORKFLOW_KEY);
let agencyWorkflowStore  = loadWorkflowStore(AGENCY_WORKFLOW_KEY);

function saveStudentWorkflowStore() { localStorage.setItem(STUDENT_WORKFLOW_KEY, JSON.stringify(studentWorkflowStore)); }
function saveAgencyWorkflowStore()  { localStorage.setItem(AGENCY_WORKFLOW_KEY, JSON.stringify(agencyWorkflowStore)); }

// Appends a note to an item's running log in place (converting a legacy
// single-string note to the array format if that's what's there) and
// returns the new entry plus its index so the caller can append it to the
// DOM directly instead of re-rendering the whole list.
function addWorkflowItemNote(store, activeId, itemId, text) {
  if (!store[activeId]) store[activeId] = {};
  const key = workflowNoteKey(itemId);
  const notes = workflowItemNotes(store[activeId], itemId);
  const entry = { text, date: todayLabel() };
  notes.push(entry);
  store[activeId][key] = notes;
  return { entry, index: notes.length - 1 };
}

// Removes one note by its position in the running log and drops the key
// entirely once the log is empty again, so an item with no notes doesn't
// leave a stray empty array behind in the store.
function deleteWorkflowItemNote(store, activeId, itemId, index) {
  if (!store[activeId]) return;
  const key = workflowNoteKey(itemId);
  const notes = workflowItemNotes(store[activeId], itemId);
  notes.splice(index, 1);
  if (notes.length) store[activeId][key] = notes;
  else delete store[activeId][key];
}

function workflowNoteEntryHtml(note, index) {
  return `<div class="workflow-item-note-entry flex items-start justify-between gap-2 text-xs text-slate-600 bg-slate-50 rounded-md px-2 py-1" data-note-index="${index}">
    <span>${note.date ? `<span class="text-slate-400">${escapeHtml(note.date)} — </span>` : ""}${escapeHtml(note.text)}</span>
    <button type="button" class="workflow-item-note-delete flex-shrink-0 leading-none text-sm font-bold text-slate-500 hover:text-red-500" title="Delete note" aria-label="Delete note">×</button>
  </div>`;
}

function workflowPhaseHtml(phase, progress, openPhaseId) {
  const done = phase.items.filter(i => progress[i.id]).length;
  const total = phase.items.length;
  const isComplete = done === total;
  return `
    <details class="workflow-phase group border border-slate-200 bg-white rounded-xl overflow-hidden" data-phase-id="${phase.id}" ${phase.id === openPhaseId ? "open" : ""}>
      <summary class="flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer select-none hover:bg-slate-50 marker:hidden [&::-webkit-details-marker]:hidden">
        <span class="flex items-center gap-2 min-w-0">
          <svg class="workflow-chevron-icon w-4 h-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="workflow-phase-title text-sm font-semibold truncate ${isComplete ? "text-emerald-700" : "text-slate-700"}">${escapeHtml(phase.title)}</span>
        </span>
        <span class="workflow-phase-badge text-xs font-semibold flex-shrink-0 rounded-full px-2.5 py-0.5 ${isComplete ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}">${done}/${total}</span>
      </summary>
      <div class="px-4 pb-3 pt-1 space-y-1.5 border-t border-slate-100">
        ${phase.items.map(item => `
          <div class="py-1">
            <label class="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" data-item-id="${item.id}" class="workflow-item-checkbox mt-0.5 w-4 h-4 rounded accent-[#F05A22] cursor-pointer flex-shrink-0" ${progress[item.id] ? "checked" : ""} />
              <span class="text-sm ${progress[item.id] ? "text-slate-400 line-through" : "text-slate-700"}">${escapeHtml(item.label)}</span>
            </label>
            <div class="workflow-item-note-wrap ml-6 mt-1 space-y-1">
              <div class="workflow-item-notes space-y-1" data-item-id="${item.id}">${workflowItemNotes(progress, item.id).map(workflowNoteEntryHtml).join("")}</div>
              <input type="text" data-item-id="${item.id}" placeholder="Add a note and press Enter…"
                class="workflow-item-note-input w-full text-xs text-slate-600 placeholder:text-slate-300 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#F05A22] focus:border-transparent" />
            </div>
          </div>`).join("")}
      </div>
    </details>`;
}

// Circular per-phase progress dial — an SVG donut built on the classic
// "circumference = 100" trick (radius 15.9155 gives a 100-unit perimeter, so
// stroke-dasharray can just use the percentage directly). Clicking a dial
// jumps to and opens that phase's row in the checklist below (see
// wireWorkflowDials), so the dials double as phase navigation.
function workflowPhaseDialHtml(phase, progress) {
  const done = phase.items.filter(i => progress[i.id]).length;
  const total = phase.items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const isComplete = done === total;
  return `
    <button type="button" class="workflow-phase-dial flex flex-col items-center gap-1.5 w-20 flex-shrink-0" data-phase-id="${phase.id}" title="${escapeHtml(phase.title)}">
      <span class="relative w-14 h-14">
        <svg viewBox="0 0 36 36" class="w-14 h-14 origin-center -rotate-90">
          <path class="text-slate-200" stroke="currentColor" stroke-width="3" fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="workflow-dial-arc ${isComplete ? "text-emerald-500" : "text-[#F05A22]"}" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"
            stroke-dasharray="${pct}, 100"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <span class="workflow-dial-pct absolute inset-0 flex items-center justify-center text-xs font-bold ${isComplete ? "text-emerald-600" : "text-slate-700"}">${pct}%</span>
      </span>
      <span class="workflow-dial-name text-[11px] font-medium text-slate-500 text-center leading-tight">${escapeHtml(phase.title)}</span>
    </button>`;
}

function workflowSectionHtml(phases, progress) {
  const { done, total } = workflowStats(phases, progress);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const openId = firstIncompletePhaseId(phases, progress);
  return `
    <div class="flex items-center justify-between gap-3 mb-2">
      <p class="workflow-summary-text text-sm text-slate-500">${done} of ${total} steps complete</p>
      <p class="workflow-summary-pct text-sm font-bold text-[#F05A22]">${pct}%</p>
    </div>
    <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
      <div class="workflow-progress-bar h-full bg-[#F05A22] rounded-full" style="width:${pct}%"></div>
    </div>
    <div class="flex flex-wrap gap-x-2 gap-y-3 mb-4">
      ${phases.map(p => workflowPhaseDialHtml(p, progress)).join("")}
    </div>
    <div class="space-y-2">
      ${phases.map(p => workflowPhaseHtml(p, progress, openId)).join("")}
    </div>`;
}

// Opens (and scrolls to) the phase row a dial represents — wired fresh each
// time a student/agency panel renders, same as the tab buttons.
function wireWorkflowDials(sectionEl) {
  if (!sectionEl) return;
  sectionEl.querySelectorAll(".workflow-phase-dial").forEach(dial => {
    dial.addEventListener("click", () => {
      const details = sectionEl.querySelector(`.workflow-phase[data-phase-id="${dial.dataset.phaseId}"]`);
      if (!details) return;
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

// Updates only what a single checkbox toggle visually affects — the item's
// own label, its phase's badge, and the section's overall progress —
// instead of re-rendering the whole accordion, which would collapse
// whichever phases the coordinator currently has open.
function handleWorkflowCheckboxChange(cb, phases, progress, sectionEl) {
  if (!sectionEl) return;
  const label = cb.closest("label").querySelector("span");
  if (label) {
    label.classList.toggle("text-slate-400", cb.checked);
    label.classList.toggle("line-through", cb.checked);
    label.classList.toggle("text-slate-700", !cb.checked);
  }
  const detailsEl = cb.closest(".workflow-phase");
  if (detailsEl) {
    const boxes = detailsEl.querySelectorAll(".workflow-item-checkbox");
    const phaseDone = [...boxes].filter(b => b.checked).length;
    const phaseTotal = boxes.length;
    const phasePct = phaseTotal ? Math.round((phaseDone / phaseTotal) * 100) : 0;
    const isComplete = phaseDone === phaseTotal;
    const badge = detailsEl.querySelector(".workflow-phase-badge");
    if (badge) {
      badge.textContent = `${phaseDone}/${phaseTotal}`;
      badge.className = `workflow-phase-badge text-xs font-semibold flex-shrink-0 rounded-full px-2.5 py-0.5 ${isComplete ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`;
    }
    const title = detailsEl.querySelector(".workflow-phase-title");
    if (title) {
      title.classList.toggle("text-emerald-700", isComplete);
      title.classList.toggle("text-slate-700", !isComplete);
    }
    const dial = sectionEl.querySelector(`.workflow-phase-dial[data-phase-id="${detailsEl.dataset.phaseId}"]`);
    if (dial) {
      const arc = dial.querySelector(".workflow-dial-arc");
      const pctLabel = dial.querySelector(".workflow-dial-pct");
      if (arc) {
        arc.setAttribute("stroke-dasharray", `${phasePct}, 100`);
        arc.classList.toggle("text-emerald-500", isComplete);
        arc.classList.toggle("text-[#F05A22]", !isComplete);
      }
      if (pctLabel) {
        pctLabel.textContent = `${phasePct}%`;
        pctLabel.classList.toggle("text-emerald-600", isComplete);
        pctLabel.classList.toggle("text-slate-700", !isComplete);
      }
    }
  }
  const { done, total } = workflowStats(phases, progress);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const summary = sectionEl.querySelector(".workflow-summary-text");
  const pctEl = sectionEl.querySelector(".workflow-summary-pct");
  const bar = sectionEl.querySelector(".workflow-progress-bar");
  if (summary) summary.textContent = `${done} of ${total} steps complete`;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (bar) bar.style.width = `${pct}%`;
}

// ── Student Profile Panel ────────────────────────────────────────────────────
let activeStudentId = null;

// Switches between the "Information", "Checklist", and "Staff Notes" tabs in
// the student panel — mirrors switchAgencyTab's active/inactive styling so
// both panels' tab bars look and behave the same way.
const STUDENT_PANEL_TABS = ["info", "workflow", "notes"];

function switchStudentPanelTab(tab) {
  STUDENT_PANEL_TABS.forEach(t => {
    const el = document.getElementById(`panel-tab-${t}`);
    if (el) el.classList.toggle("hidden", t !== tab);
  });
  document.querySelectorAll(".student-panel-tab-btn").forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("border-[#F05A22]", isActive);
    btn.classList.toggle("text-[#F05A22]", isActive);
    btn.classList.toggle("border-transparent", !isActive);
    btn.classList.toggle("text-slate-500", !isActive);
  });
}

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
    .filter(a => a.locations.some(l => l.county === county))
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
  const studentWorkflowSummary = workflowStats(STUDENT_WORKFLOW_PHASES, studentWorkflowStore[s.id] || {});
  const studentWorkflowPct = studentWorkflowSummary.total ? Math.round(studentWorkflowSummary.done / studentWorkflowSummary.total * 100) : 0;

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

    <!-- Tab bar -->
    <div class="flex items-center gap-4 border-b border-slate-200">
      <button class="student-panel-tab-btn px-0.5 pb-2 text-sm font-semibold border-b-2 transition-colors" data-tab="info">Information</button>
      <button class="student-panel-tab-btn px-0.5 pb-2 text-sm font-semibold border-b-2 transition-colors" data-tab="workflow">Checklist (${studentWorkflowPct}%)</button>
      <button class="student-panel-tab-btn px-0.5 pb-2 text-sm font-semibold border-b-2 transition-colors" data-tab="notes">Staff Notes</button>
    </div>

    <!-- Information tab -->
    <div id="panel-tab-info" class="student-panel-tab-panel space-y-4">

      <!-- Personal -->
      <div class="bg-slate-50 rounded-2xl p-4 space-y-3">
        <p class="text-base font-bold text-slate-900 uppercase tracking-wider">Personal</p>
        <div class="grid grid-cols-2 gap-4">
          ${panelInfoRow("Phone", s.phone)}
          ${panelInfoRow("Address", s.address || "—")}
          ${panelInfoRow("City", s.city)}
        </div>
      </div>

      <!-- Academic -->
      <div class="bg-slate-50 rounded-2xl p-4 space-y-3">
        <p class="text-base font-bold text-slate-900 uppercase tracking-wider">Academic</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Cohort</p>
            <select id="panel-cohort" class="w-full text-lg text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22] focus:border-transparent cursor-pointer">
              ${cohortFieldOptionsHtml(s.cohort)}
            </select>
          </div>
          ${fieldworkSelect("Concentration", s.concentration, ["Behavioral Health", "Health Care"], "panel-concentration")}
          ${fieldworkSelect("Program Format", s.format, ["Hybrid", "Online"], "panel-format")}
          ${fieldworkSelect("Enrollment", s.enrollment, ["Full-Time", "Part-Time"], "panel-enrollment")}
        </div>
      </div>

      <!-- Fieldwork -->
      <div class="bg-slate-50 rounded-2xl p-4 space-y-3">
        <p class="text-base font-bold text-slate-900 uppercase tracking-wider">Fieldwork</p>
        <div class="grid grid-cols-2 gap-4">
          ${fieldworkSelect("City and County", `${s.city}, ${s.county}`,
              [...new Set(agencies.flatMap(a => a.locations.map(l => `${l.city}, ${l.county}`)))].sort(),
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
              coordinatorNames(), "panel-liaison")}
          ${fieldworkSelect("Placement Status", s.status,
              ["Active","Pending","Completed"], "panel-status")}
          <div id="panel-instructor-other-wrap" class="col-span-2 hidden">
            <p class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Field Instructor Name</p>
            <input type="text" id="panel-instructor-other-input" placeholder="Enter field instructor name"
              class="w-full text-lg text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22] focus:border-transparent" />
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow tab -->
    <div id="panel-tab-workflow" class="student-panel-tab-panel hidden">
      <div id="panel-workflow-section">
        ${workflowSectionHtml(STUDENT_WORKFLOW_PHASES, studentWorkflowStore[s.id] || {})}
      </div>
    </div>

    <!-- Staff Notes tab -->
    <div id="panel-tab-notes" class="student-panel-tab-panel hidden space-y-4">
      <div id="panel-notes-thread" class="space-y-3"></div>
      <div class="pt-4 border-t border-slate-100 space-y-2">
        <textarea id="panel-new-note" rows="2"
          class="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none bg-white"
          placeholder="Add a note about this student…"></textarea>
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400" id="panel-save-status"></p>
          <button id="panel-add-note" class="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors">
            Add Note
          </button>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll(".student-panel-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchStudentPanelTab(btn.dataset.tab));
  });
  switchStudentPanelTab("info");
  wireWorkflowDials(document.getElementById("panel-workflow-section"));

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
    if (window.renderCoordinatorsTab) window.renderCoordinatorsTab();
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

  // "+ Add New Cohort…" prompts for a name right in this same dropdown — no
  // separate field opens elsewhere in the panel — then adds it to the shared
  // cohort list and selects it.
  document.getElementById("panel-cohort").addEventListener("change", async function () {
    if (this.value !== "__add__") {
      saveStudentField({ cohort: this.value || "—" });
      return;
    }
    const name = (await cohortPrompt("Add New Cohort")) || "";
    if (!name) {
      this.innerHTML = cohortFieldOptionsHtml(s.cohort);
      return;
    }
    if (!cohortOptions.some(c => c.toLowerCase() === name.toLowerCase())) {
      addCohort(name);
      renderCohortFilterOptions();
    }
    this.innerHTML = cohortFieldOptionsHtml(name);
    saveStudentField({ cohort: name });
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

  // panel-add-note/panel-notes-thread now live inside the JS-regenerated
  // "notes" tab content, so they're re-wired fresh on every open rather than
  // once in wireEvents() — the old elements (and their listeners) get thrown
  // away each time this innerHTML is replaced.
  document.getElementById("panel-add-note").addEventListener("click", () => {
    if (activeStudentId === null) return;
    const ta = document.getElementById("panel-new-note");
    addStudentNote(activeStudentId, ta.value);
    ta.value = "";
    const status = document.getElementById("panel-save-status");
    status.textContent = "Saved ✓";
    setTimeout(() => { if (document.getElementById("panel-save-status")) status.textContent = ""; }, 2000);
  });

  document.getElementById("panel-notes-thread").addEventListener("click", async e => {
    const pinBtn = e.target.closest(".pin-toggle-btn");
    if (pinBtn) {
      togglePinNote(activeStudentId, Number(pinBtn.dataset.noteId));
      return;
    }
    const deleteBtn = e.target.closest(".note-delete-btn");
    if (deleteBtn) {
      const ok = await confirmDialog("Are you sure you want to delete this note?", { title: "Delete note", confirmLabel: "Delete", danger: true });
      if (!ok) return;
      deleteStudentNote(activeStudentId, Number(deleteBtn.dataset.noteId));
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

  // Show panel
  document.getElementById("panel-backdrop").classList.remove("hidden");
  document.getElementById("student-panel").classList.remove("hidden");
}

function closeStudentPanel() {
  document.getElementById("panel-backdrop").classList.add("hidden");
  document.getElementById("student-panel").classList.add("hidden");
  activeStudentId = null;
}

// ── Generic modal helpers ────────────────────────────────────────────────────
// Shared by every "-modal" element across both dashboards (Location Detail,
// and — on admin-dashboard.html only — the Add/Edit modals in admin-app.js).
function openModal(id) { document.getElementById(id).classList.remove("hidden"); }
function closeModal(id) { document.getElementById(id).classList.add("hidden"); }

document.querySelectorAll("[data-close-modal]").forEach(el => {
  el.addEventListener("click", () => closeModal(el.dataset.closeModal));
});

// Promise-based replacement for window.confirm() — matches the app's look
// instead of the browser's native "localhost says" dialog. Resolves true if
// the user confirms, false if they cancel (backdrop click or Cancel button).
let confirmDialogResolve = null;

function confirmDialog(message, { title = "Are you sure?", confirmLabel = "Confirm", danger = false } = {}) {
  return new Promise(resolve => {
    confirmDialogResolve = resolve;
    document.getElementById("confirm-modal-title").textContent = title;
    document.getElementById("confirm-modal-message").textContent = message;
    const btn = document.getElementById("confirm-modal-confirm-btn");
    btn.textContent = confirmLabel;
    btn.className = `px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${
      danger ? "bg-red-500 hover:bg-red-600" : IS_ADMIN ? "bg-[#F05A22] hover:bg-[#C44A1C]" : "bg-teal-600 hover:bg-teal-700"
    }`;
    openModal("confirm-modal");
  });
}

function resolveConfirmDialog(value) {
  closeModal("confirm-modal");
  if (!confirmDialogResolve) return;
  const resolve = confirmDialogResolve;
  confirmDialogResolve = null;
  resolve(value);
}

// Promise-based replacement for window.alert() — same reasoning as above.
let alertDialogResolve = null;

function alertDialog(message, { title = "Heads up" } = {}) {
  return new Promise(resolve => {
    alertDialogResolve = resolve;
    document.getElementById("alert-modal-title").textContent = title;
    document.getElementById("alert-modal-message").textContent = message;
    document.getElementById("alert-modal-ok-btn").className = `px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${IS_ADMIN ? "bg-[#F05A22] hover:bg-[#C44A1C]" : "bg-teal-600 hover:bg-teal-700"}`;
    openModal("alert-modal");
  });
}

function resolveAlertDialog() {
  closeModal("alert-modal");
  if (!alertDialogResolve) return;
  const resolve = alertDialogResolve;
  alertDialogResolve = null;
  resolve();
}

// Promise-based replacement for window.prompt() — every "+ Add New …" option
// (cohort, semester, city) used the browser's native prompt, which shows the
// page's URL and doesn't match the app's look. This renders as a normal
// modal instead; resolves to the trimmed input, or null if cancelled.
let quickPromptResolve = null;

function quickPrompt(title, label, placeholder = "") {
  return new Promise(resolve => {
    quickPromptResolve = resolve;
    document.getElementById("quick-prompt-title").textContent = title;
    document.getElementById("quick-prompt-label").textContent = label;
    const input = document.getElementById("quick-prompt-input");
    input.value = "";
    input.placeholder = placeholder;
    openModal("quick-prompt-modal");
    setTimeout(() => input.focus(), 50);
  });
}

function resolveQuickPrompt(value) {
  closeModal("quick-prompt-modal");
  if (!quickPromptResolve) return;
  const resolve = quickPromptResolve;
  quickPromptResolve = null;
  resolve(value === null ? null : String(value).trim());
}

// quick-prompt-modal only exists on admin-dashboard.html (city/county are
// admin-only) — guard the listener since staff-dashboard.html doesn't have it.
const quickPromptFormEl = document.getElementById("quick-prompt-form");
if (quickPromptFormEl) {
  quickPromptFormEl.addEventListener("submit", e => {
    e.preventDefault();
    resolveQuickPrompt(document.getElementById("quick-prompt-input").value);
  });
}

// Promise-based "Add New Cohort/Semester" prompt — Semester/Year are
// dropdowns instead of free text so cohort names always come out as a clean
// "<Term> <Year>" the chronological sort can parse. Bigger than the generic
// quick-prompt modal per request. Resolves to "<Semester> <Year>", or null
// if cancelled.
let cohortPromptResolve = null;

function cohortPrompt(title = "Add New Cohort") {
  return new Promise(resolve => {
    cohortPromptResolve = resolve;
    document.getElementById("cohort-prompt-title").textContent = title;
    const yearSel = document.getElementById("cohort-prompt-year");
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - 3; y <= currentYear + 6; y++) years.push(y);
    yearSel.innerHTML = years.map(y => `<option value="${y}" ${y === currentYear ? "selected" : ""}>${y}</option>`).join("");
    document.getElementById("cohort-prompt-semester").value = "Fall";
    openModal("cohort-prompt-modal");
  });
}

function resolveCohortPrompt(value) {
  closeModal("cohort-prompt-modal");
  if (!cohortPromptResolve) return;
  const resolve = cohortPromptResolve;
  cohortPromptResolve = null;
  resolve(value);
}

// cohort-prompt-modal only exists on admin-dashboard.html — every path that
// can add a brand-new cohort/semester (vs. just picking an existing one) is
// admin-only, so staff-dashboard.html never needs to show it.
const cohortPromptFormEl = document.getElementById("cohort-prompt-form");
if (cohortPromptFormEl) {
  cohortPromptFormEl.addEventListener("submit", e => {
    e.preventDefault();
    const semester = document.getElementById("cohort-prompt-semester").value;
    const year = document.getElementById("cohort-prompt-year").value;
    resolveCohortPrompt(`${semester} ${year}`);
  });
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
          <button class="note-delete-btn text-sm font-bold leading-none text-slate-400 hover:text-red-500" data-note-id="${note.id}" title="Delete note" aria-label="Delete note">×</button>
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

function deleteStudentNote(studentId, noteId) {
  const s = roster.find(x => x.id === studentId);
  if (!s) return;
  s.notes = s.notes.filter(n => n.id !== noteId);
  persistNotes();
  renderNotesThread(studentId);
  renderRoster();
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

  listEl.addEventListener("click", async e => {
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
      const ok = await confirmDialog("Delete this submission? Make sure you've transferred its data first.", { title: "Delete submission", confirmLabel: "Delete", danger: true });
      if (!ok) return;
      saveFieldApplications(apps.filter(a => a.id !== deleteBtn.dataset.appId));
      renderFormsList();
    }
  });
}

// ── Agency Interview Responses (Agency Forms tab) ────────────────────────────
// Shared with agency-interview-form.js via the same localStorage key — that
// page is the agency-facing response form; this renders what admins/staff see.
// Same list/detail/seed pattern as the Field Applications section above, just
// scoped to the shorter Agency Interview Response Form fields.
const AGENCY_INTERVIEWS_KEY = "fepms-agency-interviews";

const AGENCY_EVALUATION_ITEMS = [
  { id: "dressedProfessionally", label: "Student was dressed professionally" },
  { id: "onTime", label: "Student was on time for interview" },
  { id: "interpersonalSkills", label: "Student exhibited good interpersonal skills" },
  { id: "understoodMission", label: "Student demonstrated understanding of agency mission/population served" },
  { id: "communicatedInterest", label: "Student communicated interest in the position and learning objectives" },
  { id: "respondedAppropriately", label: "Student responded appropriately to interview questions" },
];

const SEED_AGENCY_INTERVIEWS = [
  {
    id: "ai-seed-1", submittedAt: "2026-06-22T17:30:00.000Z",
    agencyName: "Community Health & Wellness Center",
    interviewerName: "Dr. Sarah Johnson, Director of Field Education",
    interviewDate: "2026-06-22", interviewerContact: "s.johnson@chwc.org",
    studentName: "Camila Alvarez", studentInterviewDate: "2026-06-22",
    evaluation: { dressedProfessionally: true, onTime: true, interpersonalSkills: true, understoodMission: true, communicatedInterest: true, respondedAppropriately: true },
    comments: "Camila was well-prepared and asked thoughtful questions about our crisis intervention protocols. She has relevant volunteer experience and would be a strong fit for our team.",
    recommendation: "Recommend student for placement",
    signatureName: "Dr. Sarah Johnson", signatureDate: "Jun 22, 2026",
  },
  {
    id: "ai-seed-2", submittedAt: "2026-06-30T20:15:00.000Z",
    agencyName: "Sacramento Family Support Center",
    interviewerName: "Thomas Nguyen, Field Supervisor",
    interviewDate: "2026-06-30", interviewerContact: "t.nguyen@sfsc.org",
    studentName: "Daniel Nguyen", studentInterviewDate: "2026-06-30",
    evaluation: { dressedProfessionally: true, onTime: true, interpersonalSkills: true, understoodMission: false, communicatedInterest: true, respondedAppropriately: true },
    comments: "Daniel was personable but seemed unfamiliar with the range of services our center provides beyond intake. Would benefit from more research before placement begins.",
    recommendation: "Recommend with reservations",
    signatureName: "Thomas Nguyen", signatureDate: "Jun 30, 2026",
  },
];

function loadAgencyInterviews() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AGENCY_INTERVIEWS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveAgencyInterviews(subs) {
  localStorage.setItem(AGENCY_INTERVIEWS_KEY, JSON.stringify(subs));
}

function seedAgencyInterviewsIfEmpty() {
  if (loadAgencyInterviews().length === 0) saveAgencyInterviews(SEED_AGENCY_INTERVIEWS);
}

const AGENCY_RECOMMENDATION_STYLES = {
  "Recommend student for placement": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Recommend with reservations": "bg-amber-50 text-amber-700 border border-amber-200",
  "Do not recommend for placement": "bg-red-50 text-red-600 border border-red-200",
};

function renderAgencyFormsList() {
  const listEl = document.getElementById("agency-forms-list");
  const emptyEl = document.getElementById("agency-forms-empty");
  const countEl = document.getElementById("agency-forms-count");
  if (!listEl) return;

  const subs = loadAgencyInterviews().slice().reverse();
  if (countEl) countEl.textContent = subs.length ? `${subs.length} submission${subs.length > 1 ? "s" : ""}` : "";

  if (!subs.length) {
    listEl.innerHTML = "";
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }
  if (emptyEl) emptyEl.classList.add("hidden");

  listEl.innerHTML = subs.map(sub => {
    const recStyle = AGENCY_RECOMMENDATION_STYLES[sub.recommendation] || "bg-slate-100 text-slate-600 border border-slate-200";
    return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-sub-id="${sub.id}">
      <div class="p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p class="font-semibold text-slate-800">${escapeHtml(sub.studentName) || "Unnamed student"} <span class="text-slate-400 font-normal">at</span> ${escapeHtml(sub.agencyName) || "Unnamed agency"}</p>
          <p class="text-xs text-slate-400 mt-0.5">
            Submitted ${new Date(sub.submittedAt).toLocaleString()} · Interviewed by ${escapeHtml(sub.interviewerName) || "—"}
          </p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${recStyle}">${escapeHtml(sub.recommendation) || "No recommendation"}</span>
          <button class="agency-forms-view-btn px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors" data-sub-id="${sub.id}">View</button>
          <button class="agency-forms-delete-btn px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors" data-sub-id="${sub.id}">Delete</button>
        </div>
      </div>
      <div class="agency-forms-detail hidden px-5 sm:px-6 pb-6 bg-slate-50/60 border-t border-slate-100" data-sub-id="${sub.id}"></div>
    </div>`;
  }).join("");
}

function renderAgencyInterviewDetailHtml(sub) {
  const evalRows = AGENCY_EVALUATION_ITEMS.map(item => detailCheckRow(item.label, !!(sub.evaluation || {})[item.id])).join("");
  const parts = [];

  parts.push(detailSection("Agency Information", [
    detailField("Agency Name", escapeHtml(sub.agencyName)),
    detailField("Interviewer Name/Title", escapeHtml(sub.interviewerName)),
    detailField("Date of Interview", escapeHtml(sub.interviewDate)),
    detailField("Phone/Email", escapeHtml(sub.interviewerContact)),
  ].join("")));

  parts.push(detailSection("Student Information", [
    detailField("Student Name", escapeHtml(sub.studentName)),
    detailField("Date of Interview", escapeHtml(sub.studentInterviewDate)),
  ].join("")));

  parts.push(`
    <div class="pt-5">
      <p class="text-sm font-bold text-teal-700 uppercase tracking-wide mb-3">Interview Evaluation</p>
      <div class="space-y-0.5">${evalRows}</div>
    </div>`);

  parts.push(`
    <div class="pt-5">
      <p class="text-sm font-bold text-teal-700 uppercase tracking-wide mb-3">Comments/Feedback</p>
      <p class="text-base text-slate-700 leading-snug whitespace-pre-wrap">${escapeHtml(sub.comments) || "—"}</p>
    </div>`);

  parts.push(detailSection("Agency Recommendation", [
    detailField("Recommendation", escapeHtml(sub.recommendation)),
  ].join("")));

  parts.push(detailSection("Signature", [
    detailField("Signature of Interviewer", escapeHtml(sub.signatureName)),
    detailField("Date", escapeHtml(sub.signatureDate)),
  ].join("")));

  return `<div class="divide-y divide-slate-100">${parts.join("")}</div>`;
}

function wireAgencyFormsEvents() {
  const formLink = new URL("agency-interview-form.html", window.location.href).href;

  const openLink = document.getElementById("open-agency-form-link");
  if (openLink) openLink.href = formLink;

  const copyLinkBtn = document.getElementById("copy-agency-form-link-btn");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(formLink).then(() => {
        const orig = copyLinkBtn.innerHTML;
        copyLinkBtn.textContent = "Copied ✓";
        setTimeout(() => { copyLinkBtn.innerHTML = orig; }, 2000);
      });
    });
  }

  const listEl = document.getElementById("agency-forms-list");
  if (!listEl) return;

  listEl.addEventListener("click", async e => {
    const subs = loadAgencyInterviews();

    const viewBtn = e.target.closest(".agency-forms-view-btn");
    if (viewBtn) {
      const detail = document.querySelector(`.agency-forms-detail[data-sub-id="${viewBtn.dataset.subId}"]`);
      const sub = subs.find(s => s.id === viewBtn.dataset.subId);
      if (detail && sub) {
        if (detail.classList.contains("hidden") && !detail.dataset.rendered) {
          detail.innerHTML = renderAgencyInterviewDetailHtml(sub);
          detail.dataset.rendered = "true";
        }
        detail.classList.toggle("hidden");
        viewBtn.textContent = detail.classList.contains("hidden") ? "View" : "Hide";
      }
      return;
    }

    const deleteBtn = e.target.closest(".agency-forms-delete-btn");
    if (deleteBtn) {
      const ok = await confirmDialog("Delete this submission? Make sure you've transferred its data first.", { title: "Delete submission", confirmLabel: "Delete", danger: true });
      if (!ok) return;
      saveAgencyInterviews(subs.filter(s => s.id !== deleteBtn.dataset.subId));
      renderAgencyFormsList();
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
// City and County are plain filter dropdowns next to Contract Status, rebuilt
// from whatever locations actually exist right now — called alongside each
// other wherever agencies are added/edited so they stay in sync with the data.
function populateAgencyCityFilter() {
  const sel = document.getElementById("filter-city");
  if (!sel) return;
  const prevValue = sel.value;
  const cities = [...new Set(agencies.flatMap(a => a.locations.map(l => l.city)))].filter(Boolean).sort();
  sel.innerHTML = `<option value="">All Cities</option>` +
    cities.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  sel.value = [...sel.options].some(o => o.value === prevValue) ? prevValue : "";
}

function populateAgencyCountyFilter() {
  const sel = document.getElementById("filter-county");
  if (!sel) return;
  const prevValue = sel.value;
  const counties = [...new Set(agencies.flatMap(a => a.locations.map(l => l.county)))].filter(Boolean).sort();
  sel.innerHTML = `<option value="">All Counties</option>` +
    counties.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  sel.value = [...sel.options].some(o => o.value === prevValue) ? prevValue : "";
}

function getAgencyFilters() {
  return {
    search: document.getElementById("agency-search").value.trim().toLowerCase(),
    contract: document.getElementById("filter-contract").value,
    city: document.getElementById("filter-city").value,
    county: document.getElementById("filter-county").value,
  };
}

function renderAgencies() {
  const { search, contract, city, county } = getAgencyFilters();
  const filtered = agencies.filter(a => {
    // A single location must satisfy both the city and county filters
    // together — an agency with a Fresno branch shouldn't show up just
    // because it also happens to have an unrelated San Francisco branch.
    if ((city || county) && !a.locations.some(l =>
      (!city || l.city === city) && (!county || l.county === county)
    )) return false;
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
      const locationsHtml = a.locations.map(l => `
        <p class="flex items-start gap-2 text-sm text-slate-600">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>${l.address}${l.zip ? " " + l.zip : ""}<br/><span class="text-slate-400">${l.city}, ${l.county}</span></span>
        </p>`).join(`<div class="border-t border-dashed border-slate-100 my-2.5"></div>`);
      return `
        <div data-id="${a.id}" class="agency-card-open bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4 cursor-pointer hover:border-slate-200 hover:shadow-md transition-all">
          <!-- Header -->
          <div class="flex items-start justify-between gap-3">
            <div class="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-slate-800 text-lg leading-snug">${a.name}</h3>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium flex-shrink-0 ${cs.pill}">
              <span class="w-1.5 h-1.5 rounded-full ${cs.dot}"></span>${a.contract} Contract
            </span>
          </div>

          <!-- Contact -->
          <div class="border-t border-slate-50 pt-4 grid grid-cols-1 gap-4">
            <div>
              <p class="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Contact Person</p>
              <p class="text-base font-semibold text-slate-700">${a.contact}</p>
              <p class="text-sm text-slate-400 mb-2">${a.title}</p>
              <div class="space-y-1.5">
                <a href="mailto:${a.email}" onclick="event.stopPropagation()" class="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  ${a.email}
                </a>
                <p class="flex items-center gap-1.5 text-sm text-slate-600">
                  <svg class="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  ${a.phone}
                </p>
              </div>
            </div>
            <div class="border-t border-slate-50 pt-3">
              <p class="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">
                Location${a.locations.length !== 1 ? "s" : ""} <span class="text-slate-400 normal-case font-medium">(${a.locations.length})</span>
              </p>
              ${locationsHtml}
            </div>
          </div>
          ${IS_ADMIN ? `
          <div class="border-t border-slate-50 pt-3 flex items-center gap-2">
            <button data-id="${a.id}" class="agency-edit-btn flex-1 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">Edit</button>
            <button data-id="${a.id}" class="agency-delete-btn flex-1 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">Delete</button>
          </div>` : ""}
        </div>`;
    }).join("");
  }
  count.textContent = `Showing ${filtered.length} of ${agencies.length} agencies`;
  renderAgencyContractStatus();

  document.querySelectorAll(".agency-card-open").forEach(card => {
    card.addEventListener("click", () => openAgencyPanel(Number(card.dataset.id)));
  });

  if (IS_ADMIN) {
    document.querySelectorAll(".agency-edit-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        window.openAgencyEditModal && window.openAgencyEditModal(Number(btn.dataset.id));
      });
    });
    document.querySelectorAll(".agency-delete-btn").forEach(btn => {
      btn.addEventListener("click", async e => {
        e.stopPropagation();
        const a = agencies.find(x => x.id === Number(btn.dataset.id));
        if (!a) return;
        const ok = await confirmDialog(`Delete ${a.name}? This cannot be undone.`, { title: "Delete agency", confirmLabel: "Delete", danger: true });
        if (!ok) return;
        deleteAgency(a.id);
        renderAgencies();
      });
    });
  }
}

// ── Agency Profile Panel ─────────────────────────────────────────────────────
// Slide-over panel opened by clicking an agency card (see ".agency-card-open"
// wiring in renderAgencies above). Content is split into horizontal tabs —
// Contact / Locations — since an agency has exactly one contact person but can
// run several locations/counties. Clicking a location opens the (shared,
// staff+admin editable) Location Detail modal to set placement availability.
let activeAgencyId = null;
let activeAgencyTab = "contact";
const AGENCY_TABS = ["contact", "locations", "students", "workflow"];

function switchAgencyTab(tab) {
  activeAgencyTab = tab;
  AGENCY_TABS.forEach(t => {
    document.getElementById(`agency-tab-${t}`).classList.toggle("hidden", t !== tab);
  });
  document.querySelectorAll(".agency-tab-btn").forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("border-[#F05A22]", isActive);
    btn.classList.toggle("text-[#F05A22]", isActive);
    btn.classList.toggle("border-transparent", !isActive);
    btn.classList.toggle("text-slate-500", !isActive);
  });
}

// Builds just the Locations tab's inner content — factored out so the Location
// Detail modal (and the "+ Add Location" button below) can refresh this one
// tab in place after saving, without resetting whichever tab is open. Adding
// a whole new location is admin-only, same as the rest of the agency record —
// the "+ Add Location" button only renders here when IS_ADMIN.
function agencyLocationsTabHtml(a) {
  const addBtnRow = IS_ADMIN ? `
    <div class="flex items-center justify-end py-3 border-b border-slate-200">
      <button type="button" id="agency-add-location-btn" class="flex items-center gap-1.5 text-lg font-medium text-[#F05A22] hover:text-[#C44A1C]">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Location
      </button>
    </div>` : "";
  const rows = a.locations.map((l, i) => {
    const placements = [...(l.placements || [])].sort((p1, p2) => compareCohorts(p1.semester, p2.semester));
    const summary = placements.length
      ? placements.map(p => `${escapeHtml(p.semester)} (${p.count})`).join(" · ")
      : "No placements scheduled yet";
    return `
    <div class="agency-location-row flex items-start gap-3 py-4 px-2 -mx-2 rounded-lg cursor-pointer hover:bg-white transition-colors" data-index="${i}">
      <svg class="w-6 h-6 flex-shrink-0 mt-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      <div class="flex-1 min-w-0">
        <p class="text-2xl text-slate-700 leading-snug">${escapeHtml(l.address)}${l.zip ? " " + escapeHtml(l.zip) : ""}<br/><span class="text-lg text-slate-400">${escapeHtml(l.city)}, ${escapeHtml(l.county)}</span></p>
        <p class="text-base font-semibold ${placements.length ? "text-emerald-600" : "text-slate-400"} mt-1">${summary}</p>
      </div>
      <svg class="w-5 h-5 flex-shrink-0 mt-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </div>`;
  }).join(`<div class="border-t border-slate-100"></div>`);
  return addBtnRow + (rows || `<p class="text-lg text-slate-400 text-center py-6">No locations yet.</p>`);
}

function wireAgencyLocationRows(agencyId) {
  document.querySelectorAll(".agency-location-row").forEach(row => {
    row.addEventListener("click", () => openLocationDetailModal(agencyId, Number(row.dataset.index)));
  });
  const addBtn = document.getElementById("agency-add-location-btn");
  if (addBtn) addBtn.addEventListener("click", () => window.openAddLocationModal && window.openAddLocationModal(agencyId));
}

function renderAgencyLocationsTab(agencyId) {
  const a = agencies.find(x => x.id === agencyId);
  const container = document.getElementById("agency-tab-locations");
  if (!a || !container) return;
  container.innerHTML = agencyLocationsTabHtml(a);
  wireAgencyLocationRows(agencyId);
  const tabBtn = document.querySelector('.agency-tab-btn[data-tab="locations"]');
  if (tabBtn) tabBtn.textContent = `Location${a.locations.length !== 1 ? "s" : ""} (${a.locations.length})`;
}

// Students placed at this agency — matched by name against each roster
// entry's fieldAgency, same string-match convention the fieldwork dropdowns
// already use. Concentration doubles as "role" here since that's the only
// track/specialty classification the roster tracks per student. The specific
// location is derived the same way the fieldwork dropdowns link the two —
// by matching the student's city/county against the agency's locations —
// since a student record doesn't store a direct pointer to one.
function agencyStudentsTabHtml(a) {
  const students = roster.filter(s => s.fieldAgency === a.name);
  if (!students.length) {
    return `<p class="text-lg text-slate-400 text-center py-6">No students placed at this agency yet.</p>`;
  }
  const rows = students.map(s => {
    const loc = a.locations.find(l => l.city === s.city && l.county === s.county) ||
                a.locations.find(l => l.county === s.county);
    const locationText = loc ? `${loc.address}, ${loc.city}` : "—";
    return `
    <div class="agency-student-row flex items-center gap-4 py-4 px-2 -mx-2 rounded-lg cursor-pointer hover:bg-white transition-colors" data-id="${s.id}">
      <div class="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-base font-bold flex-shrink-0">${initials(s.name)}</div>
      <div class="flex-1 min-w-0">
        <p class="text-2xl font-medium text-slate-800 leading-snug">${escapeHtml(s.name)}</p>
        <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
          ${statusBadge(s.status)}
          ${badge(s.concentration, CONCENTRATION_STYLES[s.concentration])}
          ${badge(s.cohort, COHORT_STYLES)}
        </div>
        <p class="text-lg text-slate-500 mt-2 flex items-center gap-1.5">
          <svg class="w-5 h-5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          ${escapeHtml(locationText)}
        </p>
        <p class="text-lg text-slate-400 mt-1">${escapeHtml(s.fieldStart) || "—"} – ${escapeHtml(s.fieldEnd) || "—"}</p>
      </div>
      <svg class="w-5 h-5 flex-shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </div>`;
  }).join(`<div class="border-t border-slate-100"></div>`);
  return rows;
}

function wireAgencyStudentRows() {
  document.querySelectorAll(".agency-student-row").forEach(row => {
    row.addEventListener("click", () => {
      const id = Number(row.dataset.id);
      closeAgencyPanel();
      openStudentPanel(id);
    });
  });
}

// preserveTab: true re-renders the same agency's panel (e.g. right after
// saving edits from the Edit Agency form) without snapping back to the
// Contact tab — otherwise removing a location while on the Locations tab
// left the panel showing stale data until it was closed and reopened.
function openAgencyPanel(id, { preserveTab = false } = {}) {
  const a = agencies.find(x => x.id === id);
  if (!a) return;
  const tabToShow = (preserveTab && activeAgencyId === id) ? activeAgencyTab : "contact";
  activeAgencyId = id;

  const cs = CONTRACT_STYLES[a.contract] || CONTRACT_STYLES.Pending;
  const agencyWorkflowProgress = agencyWorkflowStore[a.id] || {};
  const agencyWorkflowSummary = workflowStats(AGENCY_WORKFLOW_PHASES, agencyWorkflowProgress);
  const agencyWorkflowPct = agencyWorkflowSummary.total ? Math.round(agencyWorkflowSummary.done / agencyWorkflowSummary.total * 100) : 0;

  document.getElementById("agency-panel-body").innerHTML = `
    <!-- Avatar + name -->
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
        <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-slate-800 leading-tight">${escapeHtml(a.name)}</h2>
        <div class="mt-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${cs.pill}">
            <span class="w-1.5 h-1.5 rounded-full ${cs.dot}"></span>${a.contract} Contract
          </span>
        </div>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="flex items-center gap-4 border-b border-slate-200">
      <button class="agency-tab-btn px-0.5 pb-2 text-sm font-semibold border-b-2 transition-colors" data-tab="contact">Contact</button>
      <button class="agency-tab-btn px-0.5 pb-2 text-sm font-semibold border-b-2 transition-colors" data-tab="locations">Location${a.locations.length !== 1 ? "s" : ""} (${a.locations.length})</button>
      <button class="agency-tab-btn px-0.5 pb-2 text-sm font-semibold border-b-2 transition-colors" data-tab="students">Students (${roster.filter(s => s.fieldAgency === a.name).length})</button>
      <button class="agency-tab-btn px-0.5 pb-2 text-sm font-semibold border-b-2 transition-colors" data-tab="workflow">Checklist (${agencyWorkflowPct}%)</button>
    </div>

    <!-- Contact tab -->
    <div id="agency-tab-contact" class="agency-tab-panel bg-slate-50 rounded-2xl p-4">
      <div class="grid grid-cols-2 gap-4">
        ${panelInfoRow("Name", escapeHtml(a.contact) || "—")}
        ${panelInfoRow("Title", escapeHtml(a.title) || "—")}
        ${panelInfoRow("Email", `<a href="mailto:${escapeHtml(a.email)}" class="text-indigo-600 hover:underline">${escapeHtml(a.email)}</a>`)}
        ${panelInfoRow("Phone", escapeHtml(a.phone) || "—")}
      </div>
    </div>

    <!-- Locations tab -->
    <div id="agency-tab-locations" class="agency-tab-panel hidden bg-slate-50 rounded-2xl px-4">
      ${agencyLocationsTabHtml(a)}
    </div>

    <!-- Students tab -->
    <div id="agency-tab-students" class="agency-tab-panel hidden bg-slate-50 rounded-2xl px-4">
      ${agencyStudentsTabHtml(a)}
    </div>

    <!-- Workflow tab -->
    <div id="agency-tab-workflow" class="agency-tab-panel hidden bg-slate-50 rounded-2xl p-4">
      ${workflowSectionHtml(AGENCY_WORKFLOW_PHASES, agencyWorkflowProgress)}
    </div>

    ${IS_ADMIN ? `
    <div class="flex items-center gap-3">
      <button id="agency-panel-edit-btn" class="flex-1 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">Edit Agency</button>
      <button id="agency-panel-delete-btn" class="flex-1 py-2 text-sm font-medium text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">Delete Agency</button>
    </div>` : ""}
  `;

  document.querySelectorAll(".agency-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchAgencyTab(btn.dataset.tab));
  });
  switchAgencyTab(tabToShow);
  wireAgencyLocationRows(a.id);
  wireAgencyStudentRows();
  wireWorkflowDials(document.getElementById("agency-tab-workflow"));

  if (IS_ADMIN) {
    document.getElementById("agency-panel-edit-btn").addEventListener("click", () => {
      window.openAgencyEditModal && window.openAgencyEditModal(a.id);
    });
    document.getElementById("agency-panel-delete-btn").addEventListener("click", async () => {
      const ok = await confirmDialog(`Delete ${a.name}? This cannot be undone.`, { title: "Delete agency", confirmLabel: "Delete", danger: true });
      if (!ok) return;
      deleteAgency(a.id);
      closeAgencyPanel();
      renderAgencies();
    });
  }

  document.getElementById("agency-panel-backdrop").classList.remove("hidden");
  document.getElementById("agency-panel").classList.remove("hidden");
}

function closeAgencyPanel() {
  document.getElementById("agency-panel-backdrop").classList.add("hidden");
  document.getElementById("agency-panel").classList.add("hidden");
  activeAgencyId = null;
}

// ── Location Detail Modal ────────────────────────────────────────────────────
// Opened by clicking a location row in the agency panel's Locations tab. Keeps
// a running record of placement availability *by semester* — not just a
// current count — so staff can look ahead and see when a site expects to have
// openings for future students, not only what's open right now. Both staff
// and admin can edit this: unlike the rest of the agency record, it isn't
// admin-only, since coordinators are the ones tracking site capacity.
let activeLocationRef = null; // { agencyId, index }

function renderLocationDetailPlacementsList(placements) {
  const container = document.getElementById("location-detail-placements-list");
  const sorted = [...placements].sort((a, b) => compareCohorts(a.semester, b.semester));
  container.innerHTML = sorted.length ? sorted.map(p => `
    <div class="flex items-center justify-between gap-2 px-4 py-3 border border-slate-100 rounded-lg" data-semester="${escapeHtml(p.semester)}">
      <span class="text-base text-slate-700"><span class="font-semibold">${escapeHtml(p.semester)}</span> — ${p.count} placement${p.count === 1 ? "" : "s"}</span>
      <button type="button" class="location-detail-delete-btn text-slate-400 hover:text-red-500" title="Remove">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>`).join("") : `<p class="text-base text-slate-400 text-center py-4">No placements scheduled yet.</p>`;
}

function openLocationDetailModal(agencyId, index) {
  const a = agencies.find(x => x.id === agencyId);
  const loc = a && a.locations[index];
  if (!loc) return;
  if (!Array.isArray(loc.placements)) loc.placements = [];
  activeLocationRef = { agencyId, index };
  document.getElementById("location-detail-address").innerHTML =
    `<p class="text-xl font-semibold text-slate-700">${escapeHtml(loc.address)}${loc.zip ? " " + escapeHtml(loc.zip) : ""}</p><p class="text-base text-slate-400 mt-0.5">${escapeHtml(loc.city)}, ${escapeHtml(loc.county)}</p>`;
  renderLocationDetailPlacementsList(loc.placements);
  document.getElementById("location-detail-semester").innerHTML = cohortFieldOptionsHtml("");
  document.getElementById("location-detail-count").value = 1;
  openModal("location-detail-modal");
}

function activeLocation() {
  if (!activeLocationRef) return null;
  const a = agencies.find(x => x.id === activeLocationRef.agencyId);
  return (a && a.locations[activeLocationRef.index]) || null;
}

// "+ Add New Cohort…" in the semester picker works the same way it does
// everywhere else in the app — prompt right in place, no separate field.
document.getElementById("location-detail-semester").addEventListener("change", async e => {
  if (e.target.value !== "__add__") return;
  const name = (await cohortPrompt("Add New Semester")) || "";
  if (!name) {
    e.target.value = "";
    return;
  }
  if (!cohortOptions.some(c => c.toLowerCase() === name.toLowerCase())) {
    addCohort(name);
    renderCohortFilterOptions();
  }
  e.target.innerHTML = cohortFieldOptionsHtml(name);
});

document.getElementById("location-detail-add-form").addEventListener("submit", e => {
  e.preventDefault();
  const loc = activeLocation();
  if (!loc) return;
  const semesterSel = document.getElementById("location-detail-semester");
  const semester = semesterSel.value;
  if (!semester || semester === "__add__") {
    semesterSel.focus();
    return;
  }
  const raw = parseInt(document.getElementById("location-detail-count").value, 10);
  const count = Number.isFinite(raw) ? Math.max(0, raw) : 0;

  const existing = loc.placements.find(p => p.semester === semester);
  if (existing) existing.count = count;
  else loc.placements.push({ semester, count });

  persistAgencies();
  renderLocationDetailPlacementsList(loc.placements);
  renderAgencyLocationsTab(activeLocationRef.agencyId);
  document.getElementById("location-detail-semester").innerHTML = cohortFieldOptionsHtml("");
  document.getElementById("location-detail-count").value = 1;
});

document.getElementById("location-detail-placements-list").addEventListener("click", e => {
  const btn = e.target.closest(".location-detail-delete-btn");
  const loc = activeLocation();
  if (!btn || !loc) return;
  const semester = btn.closest("[data-semester]").dataset.semester;
  loc.placements = loc.placements.filter(p => p.semester !== semester);
  persistAgencies();
  renderLocationDetailPlacementsList(loc.placements);
  renderAgencyLocationsTab(activeLocationRef.agencyId);
});

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
            <h3 class="font-bold text-slate-800 text-lg leading-snug">${t.title}</h3>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold flex-shrink-0 ${catCls}">${t.category}</span>
          </div>
          <p class="text-sm text-slate-500"><span class="font-medium text-slate-400 uppercase tracking-wide text-xs">Subject: </span>${t.subject}</p>
        </div>

        <!-- Body preview -->
        <div class="px-5 py-4 flex-1">
          <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">Preview</p>
          <p class="text-base text-slate-500 leading-relaxed">${preview}</p>
        </div>

        <!-- Actions -->
        <div class="px-5 pb-5 flex items-center gap-2">
          <button onclick="expandTemplate(${t.id})"
            class="flex-1 py-2 text-base font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors">
            View Full Template
          </button>
          <button onclick="copyTemplate(${t.id}, this)"
            class="py-2 px-4 text-base font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors">
            Copy
          </button>
          ${IS_ADMIN ? `
          <button class="template-edit-btn py-2 px-4 text-base font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors" data-id="${t.id}">Edit</button>
          <button class="template-delete-btn py-2 px-3 text-base font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors" data-id="${t.id}">Delete</button>` : ""}
        </div>
      </div>`;
  }).join("");

  if (IS_ADMIN) {
    document.querySelectorAll(".template-edit-btn").forEach(btn => {
      btn.addEventListener("click", () => window.openTemplateEditModal && window.openTemplateEditModal(Number(btn.dataset.id)));
    });
    document.querySelectorAll(".template-delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const t = TEMPLATES.find(x => x.id === Number(btn.dataset.id));
        if (!t) return;
        const ok = await confirmDialog(`Delete the "${t.title}" template? This cannot be undone.`, { title: "Delete template", confirmLabel: "Delete", danger: true });
        if (!ok) return;
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
  agencies:       { heading: "Agency Directory" },
  coordinators:   { heading: "Coordinators" },
  communications: { heading: "Email Templates" },
  forms:          { heading: "Student Forms" },
  "agency-forms": { heading: "Agency Forms" },
  profile:        { heading: "Profile" },
};

let activeTab = "home";

function switchTab(tab) {
  activeTab = tab;
  // "coordinators" only exists on admin-dashboard.html — guard each lookup
  // since staff-app.js is shared with staff-dashboard.html, which isn't.
  ["home", "students", "agencies", "coordinators", "communications", "forms", "agency-forms", "profile"].forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    if (el) el.classList.toggle("hidden", t !== tab);
  });
  if (tab === "forms") renderFormsList();
  if (tab === "agency-forms") renderAgencyFormsList();
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
  document.getElementById("filter-city").value = "";
  document.getElementById("filter-county").value = "";
  renderAgencies();
}

function wireEvents() {
  ["search-input", "filter-concentration", "filter-liaison", "filter-status", "filter-format"]
    .forEach(id => document.getElementById(id).addEventListener("input", renderRoster));

  // "Other…" (admin-only) opens the cohort management modal instead of
  // filtering — snap the select back to "All Cohorts" either way.
  document.getElementById("filter-cohort").addEventListener("change", e => {
    if (e.target.value === "__other__") {
      e.target.value = "";
      window.openManageCohorts && window.openManageCohorts();
      return;
    }
    renderRoster();
  });

  const placementBreakdownCohortSel = document.getElementById("placement-breakdown-cohort");
  if (placementBreakdownCohortSel) placementBreakdownCohortSel.addEventListener("change", renderPlacementBreakdown);

  document.getElementById("clear-filters").addEventListener("click", resetFilters);
  document.getElementById("header-reset").addEventListener("click", () => {
    activeTab === "students" ? resetFilters() : resetAgencyFilters();
  });
  document.getElementById("sidebar-toggle").addEventListener("click", toggleSidebar);

  document.getElementById("agency-search").addEventListener("input", renderAgencies);
  document.getElementById("filter-contract").addEventListener("change", renderAgencies);
  document.getElementById("filter-city").addEventListener("change", renderAgencies);
  document.getElementById("filter-county").addEventListener("change", renderAgencies);
  document.getElementById("clear-agency-filters").addEventListener("click", resetAgencyFilters);

  document.getElementById("agency-panel-body").addEventListener("keydown", e => {
    const input = e.target.closest(".workflow-item-note-input");
    if (!input || e.key !== "Enter" || activeAgencyId === null) return;
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const { entry, index } = addWorkflowItemNote(agencyWorkflowStore, activeAgencyId, input.dataset.itemId, text);
    saveAgencyWorkflowStore();
    const list = input.closest(".workflow-item-note-wrap").querySelector(".workflow-item-notes");
    list.insertAdjacentHTML("beforeend", workflowNoteEntryHtml(entry, index));
    input.value = "";
  });

  document.getElementById("agency-panel-body").addEventListener("click", async e => {
    const delBtn = e.target.closest(".workflow-item-note-delete");
    if (!delBtn || activeAgencyId === null) return;
    const ok = await confirmDialog("Are you sure you want to delete this note?", { title: "Delete note", confirmLabel: "Delete", danger: true });
    if (!ok) return;
    const entryEl = delBtn.closest(".workflow-item-note-entry");
    const list = delBtn.closest(".workflow-item-notes");
    const itemId = list.dataset.itemId;
    deleteWorkflowItemNote(agencyWorkflowStore, activeAgencyId, itemId, Number(entryEl.dataset.noteIndex));
    saveAgencyWorkflowStore();
    list.innerHTML = workflowItemNotes(agencyWorkflowStore[activeAgencyId] || {}, itemId).map(workflowNoteEntryHtml).join("");
  });

  document.getElementById("agency-panel-body").addEventListener("change", e => {
    const cb = e.target.closest(".workflow-item-checkbox");
    if (!cb || activeAgencyId === null) return;
    if (!agencyWorkflowStore[activeAgencyId]) agencyWorkflowStore[activeAgencyId] = {};
    if (cb.checked) agencyWorkflowStore[activeAgencyId][cb.dataset.itemId] = true;
    else delete agencyWorkflowStore[activeAgencyId][cb.dataset.itemId];
    saveAgencyWorkflowStore();
    handleWorkflowCheckboxChange(cb, AGENCY_WORKFLOW_PHASES, agencyWorkflowStore[activeAgencyId], document.getElementById("agency-tab-workflow"));
    const tabBtn = document.querySelector('.agency-tab-btn[data-tab="workflow"]');
    if (tabBtn) {
      const { done, total } = workflowStats(AGENCY_WORKFLOW_PHASES, agencyWorkflowStore[activeAgencyId]);
      const pct = total ? Math.round(done / total * 100) : 0;
      tabBtn.textContent = `Checklist (${pct}%)`;
    }
  });

  wireFormsEvents();
  wireAgencyFormsEvents();

  populateAgencyCityFilter();
  populateAgencyCountyFilter();

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

  document.getElementById("panel-body").addEventListener("keydown", e => {
    const input = e.target.closest(".workflow-item-note-input");
    if (!input || e.key !== "Enter" || activeStudentId === null) return;
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const { entry, index } = addWorkflowItemNote(studentWorkflowStore, activeStudentId, input.dataset.itemId, text);
    saveStudentWorkflowStore();
    const list = input.closest(".workflow-item-note-wrap").querySelector(".workflow-item-notes");
    list.insertAdjacentHTML("beforeend", workflowNoteEntryHtml(entry, index));
    input.value = "";
  });

  document.getElementById("panel-body").addEventListener("click", async e => {
    const delBtn = e.target.closest(".workflow-item-note-delete");
    if (!delBtn || activeStudentId === null) return;
    const ok = await confirmDialog("Are you sure you want to delete this note?", { title: "Delete note", confirmLabel: "Delete", danger: true });
    if (!ok) return;
    const entryEl = delBtn.closest(".workflow-item-note-entry");
    const list = delBtn.closest(".workflow-item-notes");
    const itemId = list.dataset.itemId;
    deleteWorkflowItemNote(studentWorkflowStore, activeStudentId, itemId, Number(entryEl.dataset.noteIndex));
    saveStudentWorkflowStore();
    list.innerHTML = workflowItemNotes(studentWorkflowStore[activeStudentId] || {}, itemId).map(workflowNoteEntryHtml).join("");
  });

  document.getElementById("panel-body").addEventListener("change", e => {
    const cb = e.target.closest(".workflow-item-checkbox");
    if (!cb || activeStudentId === null) return;
    if (!studentWorkflowStore[activeStudentId]) studentWorkflowStore[activeStudentId] = {};
    if (cb.checked) studentWorkflowStore[activeStudentId][cb.dataset.itemId] = true;
    else delete studentWorkflowStore[activeStudentId][cb.dataset.itemId];
    saveStudentWorkflowStore();
    handleWorkflowCheckboxChange(cb, STUDENT_WORKFLOW_PHASES, studentWorkflowStore[activeStudentId], document.getElementById("panel-workflow-section"));
    const tabBtn = document.querySelector('.student-panel-tab-btn[data-tab="workflow"]');
    if (tabBtn) {
      const { done, total } = workflowStats(STUDENT_WORKFLOW_PHASES, studentWorkflowStore[activeStudentId]);
      const pct = total ? Math.round(done / total * 100) : 0;
      tabBtn.textContent = `Checklist (${pct}%)`;
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
      if (activeAgencyId !== null) closeAgencyPanel();
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

// ── Sidebar Collapse ──────────────────────────────────────────────────────────
const SIDEBAR_COLLAPSED_KEY = "fepms-sidebar-collapsed";

function applySidebarCollapsed(collapsed) {
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
}

function toggleSidebar() {
  applySidebarCollapsed(!document.body.classList.contains("sidebar-collapsed"));
}

function initSidebar() {
  applySidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
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

async function handleExit() {
  const ok = await confirmDialog("Sign out of the Field Education Program?", { title: "Sign out", confirmLabel: "Sign Out" });
  if (ok) logout();
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
  delete studentWorkflowStore[id];
  saveStudentWorkflowStore();
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
  delete agencyWorkflowStore[id];
  saveAgencyWorkflowStore();
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

function addCohort(name) {
  cohortOptions.push(name);
  persistCohorts();
  return name;
}

function deleteCohort(name) {
  cohortOptions = cohortOptions.filter(c => c !== name);
  persistCohorts();
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
initSidebar();
initTheme();
initTextSize();
loadSavedNotes();
renderStats();
renderPlacementBreakdown();
seedFieldApplicationsIfEmpty();
renderFormsList();
seedAgencyInterviewsIfEmpty();
renderAgencyFormsList();
renderTableHeader();
renderCohortFilterOptions();
renderLiaisonFilterOptions();
renderRoster();
renderAgencies();
renderTemplates();
renderProfile();
