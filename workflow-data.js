// ── Workflow Checklists (per-student + per-agency) ───────────────────────────
// Shared by staff-app.js (editable, coordinator/admin view) and app.js
// (read-only, student view) so the phase/item text and progress-store
// helpers can never drift between the two. Mirrors the printed "Field
// Placement Coordinator Workflow Checklist" and "Agency Development &
// Recruitment Workflow" documents phase-for-phase. Each student and each
// agency tracks its own progress through the same fixed set of phases/items,
// independent of every other student or agency.
const STUDENT_WORKFLOW_PHASES = [
  { id: "intake", title: "Initial Student Meeting", items: [
    "Review student's Field Application and profile",
    "Review resume",
    "Discuss previous internship/employment experience",
    "Identify concentration (Behavioral Health/Healthcare)",
    "Discuss career goals and learning interests",
    "Discuss preferred populations and practice settings",
    "Review geographical preferences (within policy)",
    "Discuss transportation/travel limitations",
    "Identify schedule availability (24 hours/week)",
    "Discuss any accommodation or accessibility needs",
    "Explain placement process and expectations",
    "Review professionalism and interview expectations",
    "Answer student questions",
    "Document meeting notes in dashboard",
    "Status: Intake Complete",
  ]},
  { id: "planning", title: "Placement Planning", items: [
    "Review current agency availability",
    "Identify potential placement sites",
    "Verify site aligns with learning goals",
    "Confirm site has appropriate supervision",
    "Verify affiliation agreement (or contract status)",
    "Determine primary and backup placement options",
    "Discuss options with Field Director if needed",
    "Update placement strategy notes",
    "Status: Placement Search Started",
  ]},
  { id: "outreach", title: "Agency Outreach", items: [
    "Contact Agency #1",
    "Send student materials (resume/application if applicable)",
    "Follow up with agency",
    "Record agency response",
    "If declined: document reason and contact next agency",
    "Repeat until interview secured",
  ]},
  { id: "interview-prep", title: "Interview Preparation", items: [
    "Notify student of interview",
    "Review agency information with student",
    "Review interview expectations",
    "Remind student of professional attire",
    "Review follow-up etiquette",
    "Confirm interview date",
  ]},
  { id: "interview-followup", title: "Interview Follow-Up", items: [
    "Student completed interview",
    "Student submitted interview feedback",
    "Agency provided feedback",
    "Document interview outcome",
    "If not selected: review feedback, provide coaching, continue placement search",
    "If selected: proceed to placement confirmation",
  ]},
  { id: "confirmation", title: "Placement Confirmation", items: [
    "Confirm agency acceptance",
    "Confirm Field Instructor",
    "Confirm Task Supervisor (if applicable)",
    "Confirm supervision requirements met",
    "Confirm internship schedule",
    "Confirm start date",
    "Confirm student acceptance",
  ]},
  { id: "exxat-setup", title: "Exxat Setup", items: [
    "Create placement in Exxat",
    "Assign student",
    "Verify Field Instructor information",
    "Verify Task Supervisor information",
    "Publish placement",
    "Notify student placement is active",
  ]},
  { id: "onboarding", title: "Student Onboarding", items: [
    "Review agency onboarding requirements",
    "Background check completed (if required)",
    "Drug screen completed (if required)",
    "Fingerprinting completed (if required)",
    "Health/compliance requirements completed",
    "Agency orientation scheduled",
    "Student ready to begin placement",
  ]},
  { id: "start", title: "Start of Internship", items: [
    "Student started placement",
    "Learning Agreement initiated",
    "Risk Management Assignment initiated",
    "Student enrolled in appropriate Exxat placement",
    "Coordinator notes completed",
    "Status: Placement Complete",
  ]},
].map(phase => ({ ...phase, items: phase.items.map((label, i) => ({ id: `${phase.id}-${i}`, label })) }));

const AGENCY_WORKFLOW_PHASES = [
  { id: "identification", title: "Agency Identification & Initial Outreach", items: [
    "Identify a potential internship agency",
    "Research the agency's services and programs",
    "Verify services align with MSW learning opportunities",
    "Identify agency contact person",
    "Send introductory email or make initial phone call",
    "Provide overview of the University of the Pacific MSW Field Education Program",
    "Assess preliminary interest in hosting interns",
    "Confirm agency has capacity for students",
    "Document outreach in the dashboard",
    "Status: Initial Contact Complete",
  ]},
  { id: "site-assessment", title: "Agency Meeting & Site Assessment", items: [
    "Schedule introductory meeting",
    "Meet with agency representative(s)",
    "Introduce the University of the Pacific MSW Program",
    "Explain internship structure and student requirements",
    "Review Field Instructor responsibilities",
    "Review Task Supervisor role (if applicable)",
    "Discuss supervision expectations",
    "Discuss available learning opportunities",
    "Evaluate the agency's ability to meet CSWE competencies",
    "Complete the Applicant Agency Site Visit Form",
    "Determine whether the agency provides an appropriate educational experience",
    "Document recommendations",
    "Decision Point: Agency approved to move forward OR Agency not approved",
    "If not approved, notify the agency, document the reason, and close the recruitment process",
    "Status: Site Assessment Complete",
  ]},
  { id: "documentation", title: "Agency Application & Required Documentation", items: [
    "Send Agency Application",
    "Receive completed Agency Application",
    "Review Agency Application",
    "Send Field Instructor Information Form",
    "Receive completed Field Instructor Information Form",
    "Verify Field Instructor qualifications",
    "Determine whether University supervision is needed",
    "Confirm agency wishes to proceed",
    "Status: Agency Documentation Complete",
  ]},
  { id: "affiliation", title: "Affiliation Agreement", items: [
    "Introduce agency to Marjan",
    "Initiate Affiliation Agreement",
    "Confirm legal contact information",
    "Monitor Affiliation Agreement progress",
    "Follow up as needed",
    "Continue identifying additional agencies while agreement is pending",
    "Document progress",
    "Status: Affiliation Agreement Complete",
  ]},
  { id: "readiness", title: "Placement Readiness", items: [
    "Affiliation Agreement fully executed",
    "Create the agency in Exxat",
    "Verify Field Instructor",
    "Identify Task Supervisor (if applicable)",
    "Assign University supervision (if needed)",
    "Review onboarding requirements",
    "Confirm available internship openings",
    "Mark agency as Placement Ready",
    "Status: Ready for Student Placement",
  ]},
  { id: "referral", title: "Student Referral", items: [
    "Match student with agency",
    "Send student materials",
    "Schedule interview",
    "Track interview outcome",
    "Confirm placement acceptance",
    "Create student placement in Exxat",
    "Notify student",
    "Status: Placement Filled",
  ]},
].map(phase => ({ ...phase, items: phase.items.map((label, i) => ({ id: `${phase.id}-${i}`, label })) }));

const STUDENT_WORKFLOW_KEY = "fepms-student-workflow";
const AGENCY_WORKFLOW_KEY  = "fepms-agency-workflow";

function loadWorkflowStore(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (e) {
    return {};
  }
}

function workflowStats(phases, progress) {
  const total = phases.reduce((sum, p) => sum + p.items.length, 0);
  const done = phases.reduce((sum, p) => sum + p.items.filter(i => progress[i.id]).length, 0);
  return { total, done };
}

// The accordion phase opened by default: the first phase that isn't fully
// checked off, so reopening a student/agency lands wherever coordinators
// left off instead of always snapping back to Phase 1.
function firstIncompletePhaseId(phases, progress) {
  const phase = phases.find(p => !p.items.every(i => progress[i.id]));
  return phase ? phase.id : phases[phases.length - 1].id;
}

// Per-item notes live in the same flat progress object as the checked
// state, under a suffixed key — avoids a second store/localStorage key just
// for notes. Safe as long as no real item id ends in "__note".
function workflowNoteKey(itemId) {
  return `${itemId}__note`;
}

// Reads an item's notes as a running list. Tolerates the old single-string
// format (from before notes became a log) by treating it as one entry.
function workflowItemNotes(progress, itemId) {
  const raw = progress[workflowNoteKey(itemId)];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [{ text: raw, date: "" }];
}
