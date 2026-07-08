// ── Shared storage key (also read by staff-app.js Forms tab) ────────────────
const APPLICATIONS_KEY = "fepms-field-applications";

function loadApplications() {
  try {
    const parsed = JSON.parse(localStorage.getItem(APPLICATIONS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveApplication(app) {
  const apps = loadApplications();
  apps.push(app);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
}

// ── Reference data ────────────────────────────────────────────────────────────
const SERVICE_AREAS = [
  "Behavioral Health/Mental Health",
  "Medical Social Work/Healthcare",
  "Substance Use Treatment",
  "Community Health",
  "Child Welfare/Child Protective Services",
  "School-Based Services",
  "Aging/Gerontology",
  "Crisis Intervention",
  "Housing/Homeless Services",
  "Children's Services",
  "Justice-Involved",
];

const TRANSPORTATION_OPTIONS = [
  { id: "reliableTransportation", label: "I have reliable transportation" },
  { id: "validLicense", label: "I have a valid Driver's License" },
  { id: "validCaLicense", label: "I have a valid California Driver's License" },
  { id: "publicTransportation", label: "I will use public transportation and I understand that this may limit my internship options" },
  { id: "deniedLicense", label: "I have been denied a Driver's License" },
  { id: "movingViolations", label: "I have three or more “moving violations” on my driving record right now" },
];

const COMPETENCIES = [
  { id: "activeLearner", label: "ACTIVE LEARNER", desc: "Participates in class discussion and asks questions when doesn’t understand material." },
  { id: "timeManagement", label: "TIME MANAGEMENT", desc: "Has realistic sense of time. Does not overschedule to point of distraction. Attends class regularly/promptly." },
  { id: "boundaries", label: "BOUNDARIES", desc: "Maintaining professional and consistent boundaries." },
  { id: "receivesFeedback", label: "RECEIVES FEEDBACK", desc: "Ability to receive and use constructive feedback." },
  { id: "managesConflict", label: "MANAGES CONFLICT", desc: "Understands that addressing conflict is an essential skill. Is not afraid of conflict." },
  { id: "selfAwareness", label: "SELF-AWARENESS", desc: "Recognizes when own biases and values get in the way of learning and communicating effectively." },
];

const ACKNOWLEDGMENTS = [
  { id: "generalConditions", title: "General Conditions for Placement Referral", text: "I understand that Field Education is a required component of the MSW Program. The Field Education Office will work with students to identify educationally appropriate placements. Students will have up to two opportunities to successfully interview for a placement. Field placements are assigned by the Field Education Office and are not chosen by the student. Students who, for any student-related reason, are unable to secure a placement after two interviews will be ineligible for field for that year and will not be permitted to enroll in the field course. Future eligibility for field will be determined by the MSW faculty." },
  { id: "previousExperience", title: "Previous Experience", text: "I understand that the University of the Pacific MSW Program does not grant social work course credit for life experience or previous work experience." },
  { id: "fieldManual", title: "MSW Field Manual", text: "I understand that I am responsible for knowing how to access the MSW Field Manual and for reviewing the field education policies prior to placement. The Field Manual outlines expectations, procedures, professional standards, and requirements that guide the field experience. Students are expected to familiarize themselves with these policies and refer to the manual to ensure they are meeting program and agency expectations." },
  { id: "ferpaConsent", title: "FERPA Consent", text: "The Family Educational Rights and Privacy Act (FERPA) protects your privacy and gives you the right to access your educational records. Schools cannot share your information without your written permission, except in limited situations allowed by law. By submitting this application, I give the University of the Pacific MSW Program permission to verify the information I have provided. This may include contacting field agencies, field instructors, or reviewing school records to confirm my readiness for field placement. I authorize the University of the Pacific to share relevant educational records for this purpose. I also authorize field agencies, field instructors, and any schools I have attended to release information needed to complete this review." },
  { id: "professionalConduct", title: "Professional Conduct", text: "I understand that MSW student interns are expected to act professionally and follow all federal, state, and local laws; social work values and ethics; University of the Pacific academic standards; the MSW Program Student Standards; and the NASW Code of Ethics. I understand that a serious violation of any of these expectations may result in immediate removal from the field placement and may also affect my standing in the MSW Program." },
  { id: "applicationProcess", title: "Conditions for Field Application Process", text: "I understand that, in order to be considered for a field placement, I will be required to submit a résumé to an agency and, when requested by an agency, an agency-specific application. I agree to provide accurate and complete information to all field agencies regarding my background and qualifications. I authorize approved field agencies and field instructors to verify the information I submit as part of any field placement application." },
  { id: "noContactingAgencies", title: "No Contacting Agencies Without Permission", text: "I understand that I may not contact any field placement agency on my own to arrange or inquire about a placement. All communication with agencies must be coordinated through, or approved by, a Field Education faculty member." },
  { id: "agencyRequirements", title: "Agency Requirements", text: "I understand that many field agencies require some or all of the following as part of their interview or placement process: background checks, fingerprinting, random drug screening, physical examinations, TB tests, immunization verification, and proof of a valid California driver’s license. Agencies may also require additional or repeated screenings at any time during the placement year. I agree to participate in any required screenings or evaluations and give permission for results to be shared with the Field Education Office when requested. I understand that failing any required screening may result in the agency declining to accept me, which could make me ineligible for field placement, and may be grounds for dismissal from the MSW Program." },
  { id: "justiceInvolvement", title: "Justice-Involvement", text: "I understand that having a prior adult misdemeanor or felony conviction may make it difficult to secure a field placement, and may also affect future employment or licensure in the social work profession. Most field agencies require fingerprinting and may conduct extensive background checks. I understand that while the Field Education Office will provide up to two placement referrals, it cannot guarantee that an agency will accept me." },
  { id: "disclosureJustice", title: "Disclosure of Justice-Involvement to Field Office and Agency", text: "I understand that I must schedule an appointment with the Field Director to disclose any past misdemeanor or felony convictions. I also understand that even if a record has been expunged, I am still required to report the conviction, as expungement does not erase, seal, or destroy the record. I understand that I must also disclose my criminal background to any potential field agency." },
  { id: "eligibilityFactors", title: "Factors That May Affect Field Eligibility", text: "I understand that limited availability for required placement hours (typically Monday through Friday, 8:00 a.m. to 5:00 p.m.), failure to follow established procedures or timelines, or serious academic or professional concerns (including inappropriate or unprofessional behavior, inadequate baseline competence, emotional instability, or unethical conduct) may prevent a student from being approved to enter field or from successfully securing a placement." },
  { id: "readinessDetermination", title: "Field Approval and Readiness Determination", text: "I understand that the Field Education Office makes the final decision about whether a student is approved to enter field. Students who are assessed as not ready for a field placement will receive written notification from the Field Director and may appeal in writing within two weeks. Depending on the seriousness of the concerns, the MSW Program may determine that a student is not eligible to re-apply for field in subsequent years." },
  { id: "improvementPlans", title: "Performance Improvement Plans", text: "I understand that if a student is assessed as not fulfilling the competencies set by the Learning Agreement, a Performance Improvement Plan may be implemented to identify specific problem areas, outline needed changes, and set an improvement timeframe." },
  { id: "changesOrTermination", title: "Changes or Termination of Field Placements", text: "I understand that any changes to a field placement—including termination—can only occur after a problem-solving process involving the Field Education Office. Students may not end a placement on their own. If I terminate a placement prematurely, I may not be eligible for another placement." },
  { id: "prematureEnding", title: "Premature Ending of a Field Placement", text: "I understand that a field placement may end earlier than expected for reasons such as an agency no longer being able to support a student, a field instructor leaving the agency, or inadequate supervision. If a placement ends prematurely, the Field Education Office will work to re-refer the student, which may require extending my field hours beyond the normal academic tri-semester." },
  { id: "professionalReview", title: "Professional Field Review Process", text: "I understand that if Field Education faculty have concerns about a student’s ability or readiness to function as a competent MSW internship student, the Field Director may initiate a Professional Field Review Process, a formal review outlined in the Field Manual." },
];

// ── Dynamic section builders ─────────────────────────────────────────────────
function experienceRowHtml(prefix, index) {
  return `
    <div class="border border-slate-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3" data-row="${prefix}-${index}">
      <input type="text" class="field-input" placeholder="Agency / City / State" data-field="agency" />
      <input type="text" class="field-input" placeholder="Position Title" data-field="position" />
      <input type="text" class="field-input" placeholder="Full Time or Part Time" data-field="timeType" />
      <input type="text" class="field-input" placeholder="Start to End Date (M/Y)" data-field="dates" />
      <div class="sm:col-span-2 flex items-center gap-4">
        <label class="radio-row"><input type="radio" name="${prefix}-paidOrVolunteer-${index}" value="Paid" class="accent-[#F05A22]" data-field="paidOrVolunteer"> Paid</label>
        <label class="radio-row"><input type="radio" name="${prefix}-paidOrVolunteer-${index}" value="Volunteer" class="accent-[#F05A22]" data-field="paidOrVolunteer"> Volunteer</label>
      </div>
    </div>`;
}

function addExperienceRow(containerId, prefix) {
  const container = document.getElementById(containerId);
  const index = container.children.length;
  container.insertAdjacentHTML("beforeend", experienceRowHtml(prefix, index));
}

function readExperienceRows(containerId) {
  const rows = document.querySelectorAll(`#${containerId} [data-row]`);
  const entries = [];
  rows.forEach(row => {
    const agency = row.querySelector('[data-field="agency"]').value.trim();
    const position = row.querySelector('[data-field="position"]').value.trim();
    const timeType = row.querySelector('[data-field="timeType"]').value.trim();
    const dates = row.querySelector('[data-field="dates"]').value.trim();
    const paidRadio = row.querySelector('[data-field="paidOrVolunteer"]:checked');
    if (agency || position || timeType || dates || paidRadio) {
      entries.push({ agency, position, timeType, paidOrVolunteer: paidRadio ? paidRadio.value : "", dates });
    }
  });
  return entries;
}

function renderServiceAreaRanks() {
  const container = document.getElementById("service-area-ranks");
  container.innerHTML = SERVICE_AREAS.map((area, i) => `
    <div class="flex items-center gap-3">
      <select class="w-20 text-sm border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22]" data-service-area="${area}">
        <option value="">—</option>
        ${SERVICE_AREAS.map((_, n) => `<option value="${n + 1}">${n + 1}</option>`).join("")}
      </select>
      <span class="text-sm text-slate-700">${area}</span>
    </div>
  `).join("");
}

function renderTransportationChecks() {
  const container = document.getElementById("transportation-checks");
  container.innerHTML = TRANSPORTATION_OPTIONS.map(opt => `
    <label class="radio-row">
      <input type="checkbox" data-transport="${opt.id}" class="w-4 h-4 rounded accent-[#F05A22]">
      ${opt.label}
    </label>
  `).join("");
}

function renderCompetencyList() {
  const container = document.getElementById("competency-list");
  container.innerHTML = COMPETENCIES.map(c => `
    <div class="border border-slate-100 rounded-xl p-3">
      <label class="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" data-competency="${c.id}" class="competency-check w-4 h-4 rounded accent-[#F05A22] mt-0.5 flex-shrink-0">
        <span class="text-sm text-slate-700"><span class="font-semibold">${c.label}:</span> ${c.desc}</span>
      </label>
      <div class="competency-plan-wrap hidden mt-2 pl-6" data-competency-wrap="${c.id}">
        <textarea rows="2" class="field-input resize-none" placeholder="What will you do to strengthen this skill?" data-competency-plan="${c.id}"></textarea>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".competency-check").forEach(cb => {
    cb.addEventListener("change", () => {
      const wrap = container.querySelector(`[data-competency-wrap="${cb.dataset.competency}"]`);
      wrap.classList.toggle("hidden", !cb.checked);
    });
  });
}

function renderAcknowledgmentList() {
  const container = document.getElementById("acknowledgment-list");
  container.innerHTML = ACKNOWLEDGMENTS.map(a => `
    <div class="policy-block">
      <p class="policy-title">${a.title}</p>
      <p class="policy-text">${a.text}</p>
      <label class="radio-row">
        <input required type="checkbox" data-acknowledgment="${a.id}" class="w-4 h-4 rounded accent-[#F05A22]">
        I understand and accept the above statement.
      </label>
    </div>
  `).join("");
}

// ── Form submission ───────────────────────────────────────────────────────────
function val(id) { return document.getElementById(id).value.trim(); }
function checkedRadio(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}

function collectApplication() {
  const serviceAreaRanks = {};
  document.querySelectorAll("#service-area-ranks [data-service-area]").forEach(sel => {
    if (sel.value) serviceAreaRanks[sel.dataset.serviceArea] = Number(sel.value);
  });

  const transportation = {};
  document.querySelectorAll("#transportation-checks [data-transport]").forEach(cb => {
    transportation[cb.dataset.transport] = cb.checked;
  });

  const competencies = {};
  document.querySelectorAll("[data-competency]").forEach(cb => {
    if (cb.checked) {
      const plan = document.querySelector(`[data-competency-plan="${cb.dataset.competency}"]`);
      competencies[cb.dataset.competency] = plan ? plan.value.trim() : "";
    }
  });

  const acknowledgments = {};
  document.querySelectorAll("[data-acknowledgment]").forEach(cb => {
    acknowledgments[cb.dataset.acknowledgment] = cb.checked;
  });

  return {
    id: `app-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    fullName: val("q-fullName"),
    studentId: val("q-studentId"),
    preferredName: val("q-preferredName"),
    pronouns: val("q-pronouns"),
    email: val("q-email"),
    phone: val("q-phone"),
    address: val("q-address"),
    cityCountyZip: val("q-cityCountyZip"),
    fieldCityCounty: val("q-fieldCityCounty"),
    languages: val("q-languages"),
    programTrack: checkedRadio("programTrack"),
    concentration: checkedRadio("concentration"),
    wantsAccommodation: checkedRadio("wantsAccommodation"),
    ugMajor: val("q-ugMajor"),
    ugInstitution: val("q-ugInstitution"),
    ugDegreeType: checkedRadio("ugDegreeType"),
    ugMinor: val("q-ugMinor"),
    additionalDegrees: val("q-additionalDegrees"),
    swExperience: readExperienceRows("sw-experience-rows"),
    otherExperience: readExperienceRows("other-experience-rows"),
    resumeFileName: document.getElementById("q-resume").files[0] ? document.getElementById("q-resume").files[0].name : "",
    employmentBasedInterest: checkedRadio("employmentBasedInterest"),
    serviceAreaRanks,
    otherServiceArea: val("q-otherServiceArea"),
    preferredPopulations: val("q-preferredPopulations"),
    specificOrg: val("q-specificOrg"),
    transportation,
    movingViolations: val("q-movingViolations"),
    pride: val("q-pride"),
    afterGraduation: val("q-afterGraduation"),
    competencies,
    difficultPopulations: val("q-difficultPopulations"),
    acknowledgments,
    signatureName: val("q-signatureName"),
    signatureDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}

function formatApplicationAsText(app) {
  const lines = [];
  const add = (label, value) => lines.push(`${label}: ${value || "—"}`);
  const heading = (title) => { lines.push(""); lines.push(`— ${title} —`); };

  lines.push(`MSW FIELD APPLICATION — submitted ${new Date(app.submittedAt).toLocaleString()}`);

  heading("Part I: Student Demographics");
  add("Full Name (Last, First, Middle)", app.fullName);
  add("Pacific Student ID", app.studentId);
  add("Preferred Name", app.preferredName);
  add("Pronouns", app.pronouns);
  add("Student Email", app.email);
  add("Phone", app.phone);
  add("Current Address", app.address);
  add("City, County & Zip of Residence", app.cityCountyZip);
  add("City & County during Field Internship", app.fieldCityCounty);
  add("Languages Spoken", app.languages);
  add("Program Track", app.programTrack);
  add("Concentration", app.concentration);

  heading("Part II: Accommodation");
  add("Requesting accommodation", app.wantsAccommodation);

  heading("Part III: Undergraduate Education");
  add("Major", app.ugMajor);
  add("Institution", app.ugInstitution);
  add("Degree Type", app.ugDegreeType);
  add("Minor(s)", app.ugMinor);
  add("Additional Degrees/Certifications", app.additionalDegrees);

  heading("Part IV: Experience");
  if (app.swExperience.length) {
    lines.push("Social Work / Human Services Experience:");
    app.swExperience.forEach(e => lines.push(`  - ${e.agency} | ${e.position} | ${e.timeType} | ${e.paidOrVolunteer} | ${e.dates}`));
  } else {
    lines.push("Social Work / Human Services Experience: —");
  }
  if (app.otherExperience.length) {
    lines.push("Other Experience:");
    app.otherExperience.forEach(e => lines.push(`  - ${e.agency} | ${e.position} | ${e.timeType} | ${e.paidOrVolunteer} | ${e.dates}`));
  } else {
    lines.push("Other Experience: —");
  }
  add("Resume File", app.resumeFileName);

  heading("Part V: Employment-Related Internship");
  add("Interested in employment-based placement", app.employmentBasedInterest);

  heading("Part VI: Field Placement Interests");
  const ranked = Object.entries(app.serviceAreaRanks).sort((a, b) => a[1] - b[1]);
  if (ranked.length) {
    lines.push("Service Area Ranking:");
    ranked.forEach(([area, rank]) => lines.push(`  ${rank}. ${area}`));
  } else {
    lines.push("Service Area Ranking: —");
  }
  add("Other Service Area", app.otherServiceArea);
  add("Preferred Populations / Other Interests", app.preferredPopulations);
  add("Specific Organization of Interest", app.specificOrg);

  heading("Part VII: Transportation");
  TRANSPORTATION_OPTIONS.forEach(opt => add(opt.label, app.transportation[opt.id] ? "Yes" : "No"));
  add("Moving Violations Explanation", app.movingViolations);

  heading("Part VIII: Student Self-Assessment");
  add("Pride", app.pride);
  add("After Graduation", app.afterGraduation);
  const compEntries = Object.entries(app.competencies);
  if (compEntries.length) {
    lines.push("Competencies to Improve:");
    compEntries.forEach(([id, plan]) => {
      const label = (COMPETENCIES.find(c => c.id === id) || {}).label || id;
      lines.push(`  - ${label}: ${plan || "—"}`);
    });
  } else {
    lines.push("Competencies to Improve: —");
  }
  add("Difficult Populations/Situations", app.difficultPopulations);

  heading("Part IX: Acknowledgment of Field Guidelines");
  ACKNOWLEDGMENTS.forEach(a => add(a.title, app.acknowledgments[a.id] ? "Acknowledged" : "Not acknowledged"));

  heading("Part X: Final Acknowledgement");
  add("Signature", app.signatureName);
  add("Date", app.signatureDate);

  return lines.join("\n");
}

// ── Wiring ────────────────────────────────────────────────────────────────────
function showSuccessView(app) {
  document.getElementById("form-view").classList.add("hidden");
  document.getElementById("success-view").classList.remove("hidden");
  document.getElementById("submission-preview").textContent = formatApplicationAsText(app);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderServiceAreaRanks();
  renderTransportationChecks();
  renderCompetencyList();
  renderAcknowledgmentList();
  addExperienceRow("sw-experience-rows", "sw");
  addExperienceRow("other-experience-rows", "other");

  document.getElementById("add-sw-row").addEventListener("click", () => addExperienceRow("sw-experience-rows", "sw"));
  document.getElementById("add-other-row").addEventListener("click", () => addExperienceRow("other-experience-rows", "other"));

  document.getElementById("application-form").addEventListener("submit", e => {
    e.preventDefault();
    const app = collectApplication();
    saveApplication(app);
    showSuccessView(app);
  });

  document.getElementById("copy-submission-btn").addEventListener("click", () => {
    const text = document.getElementById("submission-preview").textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("copy-submission-btn");
      const orig = btn.textContent;
      btn.textContent = "Copied ✓";
      setTimeout(() => { btn.textContent = orig; }, 2000);
    });
  });

  document.getElementById("new-application-btn").addEventListener("click", () => {
    document.getElementById("application-form").reset();
    document.querySelectorAll(".competency-plan-wrap").forEach(w => w.classList.add("hidden"));
    document.getElementById("sw-experience-rows").innerHTML = "";
    document.getElementById("other-experience-rows").innerHTML = "";
    addExperienceRow("sw-experience-rows", "sw");
    addExperienceRow("other-experience-rows", "other");
    document.getElementById("success-view").classList.add("hidden");
    document.getElementById("form-view").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
