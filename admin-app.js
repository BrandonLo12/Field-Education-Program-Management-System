// admin-app.js runs after staff-app.js on the same page — it reuses all of
// staff-app.js's shared state (roster/agencies/TEMPLATES, persist*, render*)
// and layers Add/Edit/Delete modals on top of it. See the "Admin CRUD"
// section of staff-app.js for the render-time IS_ADMIN hooks this wires into.

// ── Generic modal helpers ────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.remove("hidden"); }
function closeModal(id) { document.getElementById(id).classList.add("hidden"); }

document.querySelectorAll("[data-close-modal]").forEach(el => {
  el.addEventListener("click", () => closeModal(el.dataset.closeModal));
});

function dateInputToDisplay(value) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Student Add/Edit Modal ───────────────────────────────────────────────────
function populateFieldAgencySelect(selected) {
  const sel = document.getElementById("sf-field-agency");
  const options = ["—", ...agencies.map(a => a.name)];
  sel.innerHTML = options.map(name => `<option value="${name}" ${name === selected ? "selected" : ""}>${name}</option>`).join("");
}

function populateCohortList() {
  const list = document.getElementById("sf-cohort-list");
  const cohorts = [...new Set(roster.map(s => s.cohort))];
  list.innerHTML = cohorts.map(c => `<option value="${c}"></option>`).join("");
}

function resetStudentForm() {
  document.getElementById("student-form").reset();
  document.getElementById("sf-id").value = "";
  document.getElementById("student-form-source").textContent = "";
  populateFieldAgencySelect("—");
  populateCohortList();
}

window.openStudentEditModal = function (id) {
  const s = roster.find(x => x.id === id);
  if (!s) return;
  resetStudentForm();
  document.getElementById("student-form-title").textContent = "Edit Student";
  document.getElementById("student-form-submit-btn").textContent = "Save Changes";
  document.getElementById("sf-id").value = s.id;
  document.getElementById("sf-name").value = s.name || "";
  document.getElementById("sf-phone").value = s.phone || "";
  document.getElementById("sf-cohort").value = s.cohort || "";
  document.getElementById("sf-format").value = s.format || "Hybrid";
  document.getElementById("sf-enrollment").value = s.enrollment || "Full-Time";
  document.getElementById("sf-concentration").value = s.concentration || "Behavioral Health";
  document.getElementById("sf-status").value = s.status || "Pending";
  document.getElementById("sf-address").value = s.address || "";
  document.getElementById("sf-city").value = s.city || "";
  document.getElementById("sf-county").value = s.county || "";
  document.getElementById("sf-setting").value = s.setting || "";
  document.getElementById("sf-field-start").value = toDateInput(s.fieldStart);
  document.getElementById("sf-field-end").value = toDateInput(s.fieldEnd);
  populateFieldAgencySelect(s.fieldAgency || "—");
  document.getElementById("sf-field-instructor").value = s.fieldInstructor === "—" ? "" : (s.fieldInstructor || "");
  document.getElementById("sf-liaison").value = s.liaison || "";
  openModal("student-form-modal");
};

// Set by openAddToRosterModal() below; consumed (and cleared) on submit.
let pendingRosterSource = null;

window.openAddToRosterModal = function (app) {
  resetStudentForm();
  document.getElementById("student-form-title").textContent = "Add Student (from Field Application)";
  document.getElementById("student-form-submit-btn").textContent = "Add Student";
  document.getElementById("student-form-source").textContent = `Imported from ${app.fullName || "an"} application submitted ${new Date(app.submittedAt).toLocaleDateString()}.`;

  const [last, first] = (app.fullName || "").split(",").map(p => (p || "").trim());
  document.getElementById("sf-name").value = first ? `${first} ${last}` : (app.fullName || "");
  document.getElementById("sf-phone").value = app.phone || "";
  document.getElementById("sf-format").value = app.programTrack || "Hybrid";
  document.getElementById("sf-concentration").value = app.concentration === "Healthcare" ? "Health Care" : (app.concentration || "Behavioral Health");
  document.getElementById("sf-status").value = "Pending";
  document.getElementById("sf-address").value = app.address || "";

  const cityCounty = app.fieldCityCounty || app.cityCountyZip || "";
  const parts = cityCounty.split(",").map(p => p.trim()).filter(Boolean);
  document.getElementById("sf-city").value = parts[0] || "";
  document.getElementById("sf-county").value = parts[1] || "";

  pendingRosterSource = app;
  openModal("student-form-modal");
};

document.getElementById("student-form").addEventListener("submit", e => {
  e.preventDefault();
  const idVal = document.getElementById("sf-id").value;
  const data = {
    name: document.getElementById("sf-name").value.trim(),
    phone: document.getElementById("sf-phone").value.trim(),
    cohort: document.getElementById("sf-cohort").value.trim() || "—",
    format: document.getElementById("sf-format").value,
    enrollment: document.getElementById("sf-enrollment").value,
    concentration: document.getElementById("sf-concentration").value,
    status: document.getElementById("sf-status").value,
    address: document.getElementById("sf-address").value.trim(),
    city: document.getElementById("sf-city").value.trim(),
    county: document.getElementById("sf-county").value.trim(),
    setting: document.getElementById("sf-setting").value.trim(),
    fieldStart: dateInputToDisplay(document.getElementById("sf-field-start").value),
    fieldEnd: dateInputToDisplay(document.getElementById("sf-field-end").value),
    fieldAgency: document.getElementById("sf-field-agency").value,
    fieldInstructor: document.getElementById("sf-field-instructor").value.trim() || "—",
    liaison: document.getElementById("sf-liaison").value.trim(),
  };

  let student;
  if (idVal) {
    student = updateStudent(Number(idVal), data);
  } else {
    student = addStudent(Object.assign({ notes: [] }, data));
    if (pendingRosterSource) {
      student.notes.push({
        id: noteIdCounter++,
        author: staffProfile.name,
        date: todayLabel(),
        text: `Added to the roster from a field application submitted ${new Date(pendingRosterSource.submittedAt).toLocaleDateString()}.`,
        replies: [],
      });
      persistRoster();
    }
  }
  pendingRosterSource = null;

  closeModal("student-form-modal");
  renderRoster();
  renderStats();
  renderPlacementBreakdown();
  renderLiaisonBreakdown();
});

// ── Agency Add/Edit Modal ────────────────────────────────────────────────────
function resetAgencyForm() {
  document.getElementById("agency-form").reset();
  document.getElementById("af-id").value = "";
}

function openAgencyAddModal() {
  resetAgencyForm();
  document.getElementById("agency-form-title").textContent = "Add Agency";
  openModal("agency-form-modal");
  document.getElementById("af-name").focus();
}

window.openAgencyEditModal = function (id) {
  const a = agencies.find(x => x.id === id);
  if (!a) return;
  resetAgencyForm();
  document.getElementById("agency-form-title").textContent = "Edit Agency";
  document.getElementById("af-id").value = a.id;
  document.getElementById("af-name").value = a.name || "";
  document.getElementById("af-contact").value = a.contact || "";
  document.getElementById("af-title").value = a.title || "";
  document.getElementById("af-email").value = a.email || "";
  document.getElementById("af-phone").value = a.phone || "";
  document.getElementById("af-address").value = a.address || "";
  document.getElementById("af-city").value = a.city || "";
  document.getElementById("af-county").value = a.county || "";
  document.getElementById("af-contract").value = a.contract || "Active";
  openModal("agency-form-modal");
};

document.getElementById("agency-form").addEventListener("submit", e => {
  e.preventDefault();
  const idVal = document.getElementById("af-id").value;
  const data = {
    name: document.getElementById("af-name").value.trim(),
    contact: document.getElementById("af-contact").value.trim(),
    title: document.getElementById("af-title").value.trim(),
    email: document.getElementById("af-email").value.trim(),
    phone: document.getElementById("af-phone").value.trim(),
    address: document.getElementById("af-address").value.trim(),
    city: document.getElementById("af-city").value.trim(),
    county: document.getElementById("af-county").value.trim(),
    contract: document.getElementById("af-contract").value,
  };

  if (idVal) updateAgency(Number(idVal), data);
  else addAgency(data);

  closeModal("agency-form-modal");
  buildCityTabs();
  renderAgencies();
});

document.getElementById("add-agency-btn").addEventListener("click", openAgencyAddModal);

// ── Template Add/Edit Modal ───────────────────────────────────────────────────
function resetTemplateForm() {
  document.getElementById("template-form").reset();
  document.getElementById("tf-id").value = "";
}

function openTemplateAddModal() {
  resetTemplateForm();
  document.getElementById("template-form-title").textContent = "Add Template";
  openModal("template-form-modal");
  document.getElementById("tf-title").focus();
}

window.openTemplateEditModal = function (id) {
  const t = TEMPLATES.find(x => x.id === id);
  if (!t) return;
  resetTemplateForm();
  document.getElementById("template-form-title").textContent = "Edit Template";
  document.getElementById("tf-id").value = t.id;
  document.getElementById("tf-title").value = t.title || "";
  document.getElementById("tf-category").value = t.category || "General";
  document.getElementById("tf-subject").value = t.subject || "";
  document.getElementById("tf-body").value = t.body || "";
  openModal("template-form-modal");
};

document.getElementById("template-form").addEventListener("submit", e => {
  e.preventDefault();
  const idVal = document.getElementById("tf-id").value;
  const data = {
    title: document.getElementById("tf-title").value.trim(),
    category: document.getElementById("tf-category").value,
    subject: document.getElementById("tf-subject").value.trim(),
    body: document.getElementById("tf-body").value,
  };

  if (idVal) updateTemplate(Number(idVal), data);
  else addTemplate(data);

  closeModal("template-form-modal");
  renderTemplates();
});

document.getElementById("add-template-btn").addEventListener("click", openTemplateAddModal);

// ── Admin identity ────────────────────────────────────────────────────────────
// staffProfile is the shared identity object staff-app.js already renders in
// the header/avatar/Profile tab — override it here so the admin dashboard
// reads as its own account rather than the coordinator's.
Object.assign(staffProfile, {
  name: "System Administrator",
  initials: "AD",
  title: "Program Administrator",
  department: "Field Education Program",
  email: "admin@pacific.edu",
  phone: "(209) 555-0100",
  office: "Bannister Hall, Room 100",
});

document.getElementById("avatar-staff-name").textContent = staffProfile.name;
document.getElementById("avatar-staff-title").textContent = staffProfile.title;
document.getElementById("avatar-btn").textContent = staffProfile.initials;
TAB_META.home.heading = "Welcome, " + staffProfile.name;
if (activeTab === "home") document.getElementById("page-heading").textContent = TAB_META.home.heading;
renderProfile();

// ── Placement Breakdown by Field Liaison (admin Home tab only) ───────────────
// Reuses placementBucket()/PLACEMENT_BUCKETS/PLACEMENT_BUCKET_STYLES and
// LIAISON_STYLES/badge() from staff-app.js — same bucket logic as the
// dashboard-wide "Placement Breakdown" card, just split out per liaison.
// Which cohort each liaison card is currently filtered to ("" = all students
// under that liaison) — held outside the DOM so it survives the innerHTML
// rebuild every time the filter changes.
const liaisonCohortFilters = {};

function renderLiaisonBreakdown() {
  const el = document.getElementById("liaison-breakdown");
  if (!el) return;

  // Real stroke colors for the same four buckets/colors the bar-chart version
  // above on the page uses (bg-amber-400/bg-slate-400/bg-emerald-400/bg-indigo-400).
  const BUCKET_HEX = { Pending: "#fbbf24", "Not Started": "#94a3b8", Started: "#34d399", Completed: "#818cf8" };

  const names = [...new Set(roster.map(s => s.liaison || "Unassigned"))].sort();
  const R = 44, C = 2 * Math.PI * R;

  el.innerHTML = names.map(name => {
    const allStudents = roster.filter(s => (s.liaison || "Unassigned") === name);

    // Cohorts present within THIS liaison's caseload only, each with a count,
    // so the filter dropdown only ever offers choices that actually narrow
    // things down — and picking one reshapes the donut/counts to just that
    // cohort's data for this liaison.
    const cohortsInGroup = [...new Set(allStudents.map(s => s.cohort).filter(c => c && c !== "—"))].sort();
    const activeFilter = liaisonCohortFilters[name] || "";
    const students = activeFilter ? allStudents.filter(s => s.cohort === activeFilter) : allStudents;
    const total = students.length;

    const counts = {};
    PLACEMENT_BUCKETS.forEach(b => counts[b] = 0);
    students.forEach(s => counts[placementBucket(s)]++);

    let cumulative = 0;
    const arcs = total ? PLACEMENT_BUCKETS.map(b => {
      if (!counts[b]) return "";
      const len = (counts[b] / total) * C;
      const arc = `<circle cx="60" cy="60" r="${R}" fill="none" stroke="${BUCKET_HEX[b]}" stroke-width="14"
        stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-cumulative).toFixed(2)}"
        transform="rotate(-90 60 60)"><title>${b}: ${counts[b]}</title></circle>`;
      cumulative += len;
      return arc;
    }).join("") : "";

    const summary = PLACEMENT_BUCKETS.map(b => `
      <span class="flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:${BUCKET_HEX[b]}"></span>
        ${b} <b class="text-slate-700">${counts[b]}</b>
      </span>`).join("");

    const badgeCls = name === "Unassigned" ? DEFAULT_LIAISON_STYLE : (LIAISON_STYLES[name] || DEFAULT_LIAISON_STYLE);

    return `
      <div class="border border-slate-100 rounded-xl p-4 flex flex-col items-center gap-3">
        <div class="flex items-center justify-between gap-2 w-full">
          ${badge(escapeHtml(name), badgeCls)}
          <span class="text-xs text-slate-400 whitespace-nowrap">${total} student${total !== 1 ? "s" : ""}</span>
        </div>
        <div class="relative inline-flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="${R}" fill="none" stroke="#e2e8f0" stroke-width="14"/>
            ${arcs}
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span class="text-xl font-bold text-slate-800 leading-none">${total}</span>
            <span class="text-[10px] text-slate-400 mt-0.5">student${total !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div class="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500">${summary}</div>
        <select class="liaison-cohort-filter w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#F05A22]" data-liaison="${escapeHtml(name)}">
          <option value="" ${activeFilter === "" ? "selected" : ""}>All Cohorts (${allStudents.length})</option>
          ${cohortsInGroup.map(c => `<option value="${escapeHtml(c)}" ${c === activeFilter ? "selected" : ""}>${escapeHtml(c)} (${allStudents.filter(s => s.cohort === c).length})</option>`).join("")}
        </select>
      </div>`;
  }).join("") || `<p class="text-sm text-slate-400 text-center py-4 sm:col-span-2 xl:col-span-3">No students yet.</p>`;
}

window.renderLiaisonBreakdown = renderLiaisonBreakdown;
renderLiaisonBreakdown();

document.getElementById("liaison-breakdown").addEventListener("change", e => {
  const filterSel = e.target.closest(".liaison-cohort-filter");
  if (!filterSel) return;
  liaisonCohortFilters[filterSel.dataset.liaison] = filterSel.value;
  renderLiaisonBreakdown();
});
