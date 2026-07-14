// ── Shared storage key (also read by staff-app.js Agency Forms tab) ─────────
const AGENCY_INTERVIEWS_KEY = "fepms-agency-interviews";

function loadAgencyInterviews() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AGENCY_INTERVIEWS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveAgencyInterview(sub) {
  const subs = loadAgencyInterviews();
  subs.push(sub);
  localStorage.setItem(AGENCY_INTERVIEWS_KEY, JSON.stringify(subs));
}

// ── Reference data ────────────────────────────────────────────────────────────
const EVALUATION_ITEMS = [
  { id: "dressedProfessionally", label: "Student was dressed professionally" },
  { id: "onTime", label: "Student was on time for interview" },
  { id: "interpersonalSkills", label: "Student exhibited good interpersonal skills" },
  { id: "understoodMission", label: "Student demonstrated understanding of agency mission/population served" },
  { id: "communicatedInterest", label: "Student communicated interest in the position and learning objectives" },
  { id: "respondedAppropriately", label: "Student responded appropriately to interview questions" },
];

function renderEvaluationChecks() {
  const container = document.getElementById("evaluation-checks");
  container.innerHTML = EVALUATION_ITEMS.map(item => `
    <label class="radio-row">
      <input type="checkbox" data-evaluation="${item.id}" class="w-4 h-4 rounded accent-[#F05A22]">
      ${item.label}
    </label>
  `).join("");
}

// ── Form submission ───────────────────────────────────────────────────────────
function val(id) { return document.getElementById(id).value.trim(); }
function checkedRadio(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}

function collectInterview() {
  const evaluation = {};
  document.querySelectorAll("[data-evaluation]").forEach(cb => {
    evaluation[cb.dataset.evaluation] = cb.checked;
  });

  return {
    id: `ai-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    agencyName: val("q-agencyName"),
    interviewerName: val("q-interviewerName"),
    interviewDate: val("q-interviewDate"),
    interviewerContact: val("q-interviewerContact"),
    studentName: val("q-studentName"),
    studentInterviewDate: val("q-studentInterviewDate"),
    evaluation,
    comments: val("q-comments"),
    recommendation: checkedRadio("recommendation"),
    signatureName: val("q-signatureName"),
    signatureDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}

function formatInterviewAsText(sub) {
  const lines = [];
  const add = (label, value) => lines.push(`${label}: ${value || "—"}`);
  const heading = (title) => { lines.push(""); lines.push(`— ${title} —`); };

  lines.push(`AGENCY INTERVIEW RESPONSE — submitted ${new Date(sub.submittedAt).toLocaleString()}`);

  heading("Agency Information");
  add("Agency Name", sub.agencyName);
  add("Interviewer Name/Title", sub.interviewerName);
  add("Date of Interview", sub.interviewDate);
  add("Phone/Email", sub.interviewerContact);

  heading("Student Information");
  add("Student Name", sub.studentName);
  add("Date of Interview", sub.studentInterviewDate);

  heading("Interview Evaluation");
  EVALUATION_ITEMS.forEach(item => add(item.label, sub.evaluation[item.id] ? "Yes" : "No"));

  heading("Comments/Feedback");
  lines.push(sub.comments || "—");

  heading("Agency Recommendation");
  add("Recommendation", sub.recommendation);

  heading("Signature");
  add("Signature of Interviewer", sub.signatureName);
  add("Date", sub.signatureDate);

  return lines.join("\n");
}

// ── Wiring ────────────────────────────────────────────────────────────────────
function showSuccessView(sub) {
  document.getElementById("form-view").classList.add("hidden");
  document.getElementById("success-view").classList.remove("hidden");
  document.getElementById("submission-preview").textContent = formatInterviewAsText(sub);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderEvaluationChecks();

  document.getElementById("interview-form").addEventListener("submit", e => {
    e.preventDefault();
    const sub = collectInterview();
    saveAgencyInterview(sub);
    showSuccessView(sub);
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

  document.getElementById("new-submission-btn").addEventListener("click", () => {
    document.getElementById("interview-form").reset();
    document.getElementById("success-view").classList.add("hidden");
    document.getElementById("form-view").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
