// ── Authentication (demo) ────────────────────────────────────────────────────
// No backend — this is a local-only demo login. Each account's password is
// just its own username. The session lives in localStorage so login.html and
// every dashboard share it: log in once, and each page's requireAuth() call
// confirms the session before rendering, or bounces back to login.html.
const AUTH_KEY = "fepms-auth";

const AUTH_USERS = [
  { username: "admin",       password: "admin",       role: "admin",   redirect: "admin-dashboard.html",  label: "System Administrator" },
  { username: "coordinator", password: "coordinator", role: "staff",   redirect: "staff-dashboard.html",   label: "Dr. Frances Cooper" },
  { username: "student",     password: "student",     role: "student", redirect: "student-dashboard.html", label: "Jane Smith" },
];

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch (e) {
    return null;
  }
}

// Checks credentials against AUTH_USERS and, if they match, stores the
// session and returns the matched user. Returns null on a bad login.
function login(username, password) {
  const user = AUTH_USERS.find(u =>
    u.username === username.trim().toLowerCase() && u.password === password
  );
  if (!user) return null;
  localStorage.setItem(AUTH_KEY, JSON.stringify({ username: user.username, role: user.role }));
  return user;
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "login.html";
}

// Call at the very top of a dashboard page (before it renders anything) to
// gate it: no session, or a session for a different role, bounces to login.
function requireAuth(role) {
  const session = getSession();
  if (!session || session.role !== role) {
    window.location.href = "login.html";
  }
}
