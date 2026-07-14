// admin-app.js runs after staff-app.js on the same page — it reuses all of
// staff-app.js's shared state (roster/agencies/TEMPLATES, persist*, render*)
// and layers Add/Edit/Delete modals on top of it. See the "Admin CRUD"
// section of staff-app.js for the render-time IS_ADMIN hooks this wires into.
// openModal/closeModal and the generic [data-close-modal] wiring now live in
// staff-app.js since the Location Detail modal needs them on both dashboards.

function dateInputToDisplay(value) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── California cities → county lookup ────────────────────────────────────────
// Backs the Location City dropdown on the Add/Edit Agency form — picking a
// city auto-fills its county so nobody has to know California county lines
// by heart. Covers every county with its major/incorporated cities rather
// than all ~480 incorporated CA cities.
const CA_CITY_COUNTY = {
  "Alameda": "Alameda County", "Albany": "Alameda County", "Berkeley": "Alameda County",
  "Dublin": "Alameda County", "Emeryville": "Alameda County", "Fremont": "Alameda County",
  "Hayward": "Alameda County", "Livermore": "Alameda County", "Newark": "Alameda County",
  "Oakland": "Alameda County", "Piedmont": "Alameda County", "Pleasanton": "Alameda County",
  "San Leandro": "Alameda County", "Union City": "Alameda County",
  "Jackson": "Amador County", "Sutter Creek": "Amador County", "Ione": "Amador County",
  "Plymouth": "Amador County", "Amador City": "Amador County",
  "Chico": "Butte County", "Oroville": "Butte County", "Paradise": "Butte County",
  "Gridley": "Butte County", "Biggs": "Butte County",
  "Angels Camp": "Calaveras County",
  "Colusa": "Colusa County", "Williams": "Colusa County",
  "Antioch": "Contra Costa County", "Brentwood": "Contra Costa County", "Clayton": "Contra Costa County",
  "Concord": "Contra Costa County", "Danville": "Contra Costa County", "El Cerrito": "Contra Costa County",
  "Hercules": "Contra Costa County", "Lafayette": "Contra Costa County", "Martinez": "Contra Costa County",
  "Moraga": "Contra Costa County", "Oakley": "Contra Costa County", "Orinda": "Contra Costa County",
  "Pinole": "Contra Costa County", "Pittsburg": "Contra Costa County", "Pleasant Hill": "Contra Costa County",
  "Richmond": "Contra Costa County", "San Pablo": "Contra Costa County", "San Ramon": "Contra Costa County",
  "Walnut Creek": "Contra Costa County",
  "Crescent City": "Del Norte County",
  "Placerville": "El Dorado County", "South Lake Tahoe": "El Dorado County",
  "Clovis": "Fresno County", "Coalinga": "Fresno County", "Firebaugh": "Fresno County",
  "Fowler": "Fresno County", "Fresno": "Fresno County", "Huron": "Fresno County",
  "Kerman": "Fresno County", "Kingsburg": "Fresno County", "Mendota": "Fresno County",
  "Orange Cove": "Fresno County", "Parlier": "Fresno County", "Reedley": "Fresno County",
  "San Joaquin": "Fresno County", "Sanger": "Fresno County", "Selma": "Fresno County",
  "Orland": "Glenn County", "Willows": "Glenn County",
  "Arcata": "Humboldt County", "Blue Lake": "Humboldt County", "Eureka": "Humboldt County",
  "Ferndale": "Humboldt County", "Fortuna": "Humboldt County", "Rio Dell": "Humboldt County",
  "Trinidad": "Humboldt County",
  "Brawley": "Imperial County", "Calexico": "Imperial County", "Calipatria": "Imperial County",
  "El Centro": "Imperial County", "Holtville": "Imperial County", "Imperial": "Imperial County",
  "Westmorland": "Imperial County",
  "Bishop": "Inyo County",
  "Arvin": "Kern County", "Bakersfield": "Kern County", "California City": "Kern County",
  "Delano": "Kern County", "Maricopa": "Kern County", "McFarland": "Kern County",
  "Ridgecrest": "Kern County", "Shafter": "Kern County", "Taft": "Kern County",
  "Tehachapi": "Kern County", "Wasco": "Kern County",
  "Avenal": "Kings County", "Corcoran": "Kings County", "Hanford": "Kings County",
  "Lemoore": "Kings County",
  "Clearlake": "Lake County", "Lakeport": "Lake County",
  "Susanville": "Lassen County",
  "Agoura Hills": "Los Angeles County", "Alhambra": "Los Angeles County", "Arcadia": "Los Angeles County",
  "Artesia": "Los Angeles County", "Avalon": "Los Angeles County", "Azusa": "Los Angeles County",
  "Baldwin Park": "Los Angeles County", "Bell": "Los Angeles County", "Bell Gardens": "Los Angeles County",
  "Bellflower": "Los Angeles County", "Beverly Hills": "Los Angeles County", "Bradbury": "Los Angeles County",
  "Burbank": "Los Angeles County", "Calabasas": "Los Angeles County", "Carson": "Los Angeles County",
  "Cerritos": "Los Angeles County", "Claremont": "Los Angeles County", "Commerce": "Los Angeles County",
  "Compton": "Los Angeles County", "Covina": "Los Angeles County", "Culver City": "Los Angeles County",
  "Diamond Bar": "Los Angeles County", "Downey": "Los Angeles County", "Duarte": "Los Angeles County",
  "El Monte": "Los Angeles County", "El Segundo": "Los Angeles County", "Gardena": "Los Angeles County",
  "Glendale": "Los Angeles County", "Glendora": "Los Angeles County", "Hawaiian Gardens": "Los Angeles County",
  "Hawthorne": "Los Angeles County", "Hermosa Beach": "Los Angeles County", "Hidden Hills": "Los Angeles County",
  "Huntington Park": "Los Angeles County", "Industry": "Los Angeles County", "Inglewood": "Los Angeles County",
  "Irwindale": "Los Angeles County", "La Canada Flintridge": "Los Angeles County", "La Habra Heights": "Los Angeles County",
  "La Mirada": "Los Angeles County", "La Puente": "Los Angeles County", "La Verne": "Los Angeles County",
  "Lakewood": "Los Angeles County", "Lancaster": "Los Angeles County", "Lawndale": "Los Angeles County",
  "Lomita": "Los Angeles County", "Long Beach": "Los Angeles County", "Los Angeles": "Los Angeles County",
  "Lynwood": "Los Angeles County", "Malibu": "Los Angeles County", "Manhattan Beach": "Los Angeles County",
  "Maywood": "Los Angeles County", "Monrovia": "Los Angeles County", "Montebello": "Los Angeles County",
  "Monterey Park": "Los Angeles County", "Norwalk": "Los Angeles County", "Palmdale": "Los Angeles County",
  "Palos Verdes Estates": "Los Angeles County", "Paramount": "Los Angeles County", "Pasadena": "Los Angeles County",
  "Pico Rivera": "Los Angeles County", "Pomona": "Los Angeles County", "Rancho Palos Verdes": "Los Angeles County",
  "Redondo Beach": "Los Angeles County", "Rolling Hills": "Los Angeles County", "Rolling Hills Estates": "Los Angeles County",
  "Rosemead": "Los Angeles County", "San Dimas": "Los Angeles County", "San Fernando": "Los Angeles County",
  "San Gabriel": "Los Angeles County", "San Marino": "Los Angeles County", "Santa Clarita": "Los Angeles County",
  "Santa Fe Springs": "Los Angeles County", "Santa Monica": "Los Angeles County", "Sierra Madre": "Los Angeles County",
  "Signal Hill": "Los Angeles County", "South El Monte": "Los Angeles County", "South Gate": "Los Angeles County",
  "South Pasadena": "Los Angeles County", "Temple City": "Los Angeles County", "Torrance": "Los Angeles County",
  "Vernon": "Los Angeles County", "Walnut": "Los Angeles County", "West Covina": "Los Angeles County",
  "West Hollywood": "Los Angeles County", "Westlake Village": "Los Angeles County", "Whittier": "Los Angeles County",
  "Chowchilla": "Madera County", "Madera": "Madera County",
  "Belvedere": "Marin County", "Corte Madera": "Marin County", "Fairfax": "Marin County",
  "Larkspur": "Marin County", "Mill Valley": "Marin County", "Novato": "Marin County",
  "Ross": "Marin County", "San Anselmo": "Marin County", "San Rafael": "Marin County",
  "Sausalito": "Marin County", "Tiburon": "Marin County",
  "Mariposa": "Mariposa County",
  "Fort Bragg": "Mendocino County", "Point Arena": "Mendocino County", "Ukiah": "Mendocino County",
  "Willits": "Mendocino County",
  "Atwater": "Merced County", "Dos Palos": "Merced County", "Gustine": "Merced County",
  "Livingston": "Merced County", "Los Banos": "Merced County", "Merced": "Merced County",
  "Alturas": "Modoc County",
  "Mammoth Lakes": "Mono County",
  "Carmel-by-the-Sea": "Monterey County", "Del Rey Oaks": "Monterey County", "Gonzales": "Monterey County",
  "Greenfield": "Monterey County", "King City": "Monterey County", "Marina": "Monterey County",
  "Monterey": "Monterey County", "Pacific Grove": "Monterey County", "Salinas": "Monterey County",
  "Sand City": "Monterey County", "Seaside": "Monterey County", "Soledad": "Monterey County",
  "American Canyon": "Napa County", "Calistoga": "Napa County", "Napa": "Napa County",
  "St. Helena": "Napa County", "Yountville": "Napa County",
  "Grass Valley": "Nevada County", "Nevada City": "Nevada County", "Truckee": "Nevada County",
  "Aliso Viejo": "Orange County", "Anaheim": "Orange County", "Brea": "Orange County",
  "Buena Park": "Orange County", "Costa Mesa": "Orange County", "Cypress": "Orange County",
  "Dana Point": "Orange County", "Fountain Valley": "Orange County", "Fullerton": "Orange County",
  "Garden Grove": "Orange County", "Huntington Beach": "Orange County", "Irvine": "Orange County",
  "La Habra": "Orange County", "La Palma": "Orange County", "Laguna Beach": "Orange County",
  "Laguna Hills": "Orange County", "Laguna Niguel": "Orange County", "Laguna Woods": "Orange County",
  "Lake Forest": "Orange County", "Los Alamitos": "Orange County", "Mission Viejo": "Orange County",
  "Newport Beach": "Orange County", "Orange": "Orange County", "Placentia": "Orange County",
  "Rancho Santa Margarita": "Orange County", "San Clemente": "Orange County", "San Juan Capistrano": "Orange County",
  "Santa Ana": "Orange County", "Seal Beach": "Orange County", "Stanton": "Orange County",
  "Tustin": "Orange County", "Villa Park": "Orange County", "Westminster": "Orange County",
  "Yorba Linda": "Orange County",
  "Auburn": "Placer County", "Colfax": "Placer County", "Lincoln": "Placer County",
  "Rocklin": "Placer County", "Roseville": "Placer County",
  "Portola": "Plumas County",
  "Banning": "Riverside County", "Beaumont": "Riverside County", "Blythe": "Riverside County",
  "Calimesa": "Riverside County", "Canyon Lake": "Riverside County", "Cathedral City": "Riverside County",
  "Coachella": "Riverside County", "Corona": "Riverside County", "Desert Hot Springs": "Riverside County",
  "Eastvale": "Riverside County", "Hemet": "Riverside County", "Indian Wells": "Riverside County",
  "Indio": "Riverside County", "Jurupa Valley": "Riverside County", "La Quinta": "Riverside County",
  "Lake Elsinore": "Riverside County", "Menifee": "Riverside County", "Moreno Valley": "Riverside County",
  "Murrieta": "Riverside County", "Norco": "Riverside County", "Palm Desert": "Riverside County",
  "Palm Springs": "Riverside County", "Perris": "Riverside County", "Rancho Mirage": "Riverside County",
  "Riverside": "Riverside County", "San Jacinto": "Riverside County", "Temecula": "Riverside County",
  "Wildomar": "Riverside County",
  "Citrus Heights": "Sacramento County", "Elk Grove": "Sacramento County", "Folsom": "Sacramento County",
  "Galt": "Sacramento County", "Isleton": "Sacramento County", "Rancho Cordova": "Sacramento County",
  "Sacramento": "Sacramento County",
  "Hollister": "San Benito County", "San Juan Bautista": "San Benito County",
  "Adelanto": "San Bernardino County", "Apple Valley": "San Bernardino County", "Barstow": "San Bernardino County",
  "Big Bear Lake": "San Bernardino County", "Chino": "San Bernardino County", "Chino Hills": "San Bernardino County",
  "Colton": "San Bernardino County", "Fontana": "San Bernardino County", "Grand Terrace": "San Bernardino County",
  "Hesperia": "San Bernardino County", "Highland": "San Bernardino County", "Loma Linda": "San Bernardino County",
  "Montclair": "San Bernardino County", "Needles": "San Bernardino County", "Ontario": "San Bernardino County",
  "Rancho Cucamonga": "San Bernardino County", "Redlands": "San Bernardino County", "Rialto": "San Bernardino County",
  "San Bernardino": "San Bernardino County", "Twentynine Palms": "San Bernardino County", "Upland": "San Bernardino County",
  "Victorville": "San Bernardino County", "Yucaipa": "San Bernardino County", "Yucca Valley": "San Bernardino County",
  "Carlsbad": "San Diego County", "Chula Vista": "San Diego County", "Coronado": "San Diego County",
  "Del Mar": "San Diego County", "El Cajon": "San Diego County", "Encinitas": "San Diego County",
  "Escondido": "San Diego County", "Imperial Beach": "San Diego County", "La Mesa": "San Diego County",
  "Lemon Grove": "San Diego County", "National City": "San Diego County", "Oceanside": "San Diego County",
  "Poway": "San Diego County", "San Diego": "San Diego County", "San Marcos": "San Diego County",
  "Santee": "San Diego County", "Solana Beach": "San Diego County", "Vista": "San Diego County",
  "San Francisco": "San Francisco County",
  "Escalon": "San Joaquin County", "Lathrop": "San Joaquin County", "Lodi": "San Joaquin County",
  "Manteca": "San Joaquin County", "Ripon": "San Joaquin County", "Stockton": "San Joaquin County",
  "Tracy": "San Joaquin County",
  "Arroyo Grande": "San Luis Obispo County", "Atascadero": "San Luis Obispo County", "Grover Beach": "San Luis Obispo County",
  "Morro Bay": "San Luis Obispo County", "Paso Robles": "San Luis Obispo County", "Pismo Beach": "San Luis Obispo County",
  "San Luis Obispo": "San Luis Obispo County",
  "Atherton": "San Mateo County", "Belmont": "San Mateo County", "Brisbane": "San Mateo County",
  "Burlingame": "San Mateo County", "Colma": "San Mateo County", "Daly City": "San Mateo County",
  "East Palo Alto": "San Mateo County", "Foster City": "San Mateo County", "Half Moon Bay": "San Mateo County",
  "Hillsborough": "San Mateo County", "Menlo Park": "San Mateo County", "Millbrae": "San Mateo County",
  "Pacifica": "San Mateo County", "Portola Valley": "San Mateo County", "Redwood City": "San Mateo County",
  "San Bruno": "San Mateo County", "San Carlos": "San Mateo County", "San Mateo": "San Mateo County",
  "South San Francisco": "San Mateo County", "Woodside": "San Mateo County",
  "Buellton": "Santa Barbara County", "Carpinteria": "Santa Barbara County", "Goleta": "Santa Barbara County",
  "Guadalupe": "Santa Barbara County", "Lompoc": "Santa Barbara County", "Santa Barbara": "Santa Barbara County",
  "Santa Maria": "Santa Barbara County", "Solvang": "Santa Barbara County",
  "Campbell": "Santa Clara County", "Cupertino": "Santa Clara County", "Gilroy": "Santa Clara County",
  "Los Altos": "Santa Clara County", "Los Altos Hills": "Santa Clara County", "Los Gatos": "Santa Clara County",
  "Milpitas": "Santa Clara County", "Monte Sereno": "Santa Clara County", "Morgan Hill": "Santa Clara County",
  "Mountain View": "Santa Clara County", "Palo Alto": "Santa Clara County", "San Jose": "Santa Clara County",
  "Santa Clara": "Santa Clara County", "Saratoga": "Santa Clara County", "Sunnyvale": "Santa Clara County",
  "Capitola": "Santa Cruz County", "Santa Cruz": "Santa Cruz County", "Scotts Valley": "Santa Cruz County",
  "Watsonville": "Santa Cruz County",
  "Anderson": "Shasta County", "Redding": "Shasta County", "Shasta Lake": "Shasta County",
  "Loyalton": "Sierra County",
  "Mount Shasta": "Siskiyou County", "Weed": "Siskiyou County", "Yreka": "Siskiyou County",
  "Benicia": "Solano County", "Dixon": "Solano County", "Fairfield": "Solano County",
  "Rio Vista": "Solano County", "Suisun City": "Solano County", "Vacaville": "Solano County",
  "Vallejo": "Solano County",
  "Cloverdale": "Sonoma County", "Cotati": "Sonoma County", "Healdsburg": "Sonoma County",
  "Petaluma": "Sonoma County", "Rohnert Park": "Sonoma County", "Santa Rosa": "Sonoma County",
  "Sebastopol": "Sonoma County", "Sonoma": "Sonoma County", "Windsor": "Sonoma County",
  "Ceres": "Stanislaus County", "Hughson": "Stanislaus County", "Modesto": "Stanislaus County",
  "Newman": "Stanislaus County", "Oakdale": "Stanislaus County", "Patterson": "Stanislaus County",
  "Riverbank": "Stanislaus County", "Turlock": "Stanislaus County", "Waterford": "Stanislaus County",
  "Live Oak": "Sutter County", "Yuba City": "Sutter County",
  "Corning": "Tehama County", "Red Bluff": "Tehama County", "Tehama": "Tehama County",
  "Weaverville": "Trinity County",
  "Dinuba": "Tulare County", "Exeter": "Tulare County", "Farmersville": "Tulare County",
  "Lindsay": "Tulare County", "Porterville": "Tulare County", "Tulare": "Tulare County",
  "Visalia": "Tulare County", "Woodlake": "Tulare County",
  "Sonora": "Tuolumne County",
  "Camarillo": "Ventura County", "Fillmore": "Ventura County", "Moorpark": "Ventura County",
  "Ojai": "Ventura County", "Oxnard": "Ventura County", "Port Hueneme": "Ventura County",
  "Santa Paula": "Ventura County", "Simi Valley": "Ventura County", "Thousand Oaks": "Ventura County",
  "Ventura": "Ventura County",
  "Davis": "Yolo County", "West Sacramento": "Yolo County", "Winters": "Yolo County",
  "Woodland": "Yolo County",
  "Marysville": "Yuba County", "Wheatland": "Yuba County",
};
const CA_CITIES = Object.keys(CA_CITY_COUNTY).sort();

// CA_CITY_COUNTY above covers ~476 incorporated California cities but isn't
// exhaustive — "+ Add New City…" in the dropdown lets someone add whatever's
// missing (unincorporated community, a city outside CA, a typo'd name, etc.)
// the same way cohorts are extended, and it's remembered from then on.
const CUSTOM_CITIES_KEY = "fepms-custom-cities";
function loadCustomCities() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_CITIES_KEY));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch (e) { /* fall through */ }
  return {};
}
let customCityCounty = loadCustomCities();
function persistCustomCities() { localStorage.setItem(CUSTOM_CITIES_KEY, JSON.stringify(customCityCounty)); }

function allCityCounty() { return Object.assign({}, CA_CITY_COUNTY, customCityCounty); }
function allCities() { return Object.keys(allCityCounty()).sort(); }

// ── Student Add/Edit Modal ───────────────────────────────────────────────────
function populateFieldAgencySelect(selected) {
  const sel = document.getElementById("sf-field-agency");
  const options = ["—", ...agencies.map(a => a.name)];
  sel.innerHTML = options.map(name => `<option value="${name}" ${name === selected ? "selected" : ""}>${name}</option>`).join("");
}

function populateCohortList(selected) {
  document.getElementById("sf-cohort").innerHTML = cohortFieldOptionsHtml(selected || "");
}

function resetStudentForm() {
  document.getElementById("student-form").reset();
  document.getElementById("sf-id").value = "";
  document.getElementById("student-form-source").textContent = "";
  populateFieldAgencySelect("—");
  populateCohortList("");
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
  populateCohortList(s.cohort && s.cohort !== "—" ? s.cohort : "");
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

// "+ Add New Cohort…" prompts for a name right in this same dropdown — no
// separate field opens elsewhere in the form — then adds it to the shared
// cohort list and selects it.
document.getElementById("sf-cohort").addEventListener("change", async e => {
  if (e.target.value !== "__add__") return;
  const name = (await cohortPrompt("Add New Cohort")) || "";
  if (!name) {
    populateCohortList("");
    return;
  }
  if (!cohortOptions.some(c => c.toLowerCase() === name.toLowerCase())) {
    addCohort(name);
    renderCohortFilterOptions();
  }
  populateCohortList(name);
});

document.getElementById("student-form").addEventListener("submit", e => {
  e.preventDefault();
  const idVal = document.getElementById("sf-id").value;
  const data = {
    name: document.getElementById("sf-name").value.trim(),
    phone: document.getElementById("sf-phone").value.trim(),
    cohort: document.getElementById("sf-cohort").value || "—",
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
// This form manages the agency's core fields plus whatever locations it
// already has — it doesn't have its own "+ Add Location" button, since that
// now lives on the agency profile panel (staff-app.js) so there's only one
// place to add a branch. Existing rows here can still be edited (city/address)
// or removed (once there's more than one), and a brand-new agency still gets
// exactly one starter location row to fill in before its first save.
function agencyCityOptionsHtml(selected) {
  const known = allCityCounty();
  // If a stored city isn't in the known list (very old/legacy data), keep it
  // selectable instead of silently dropping it off the form.
  const extra = selected && !known[selected] ? `<option value="${escapeHtml(selected)}" selected>${escapeHtml(selected)}</option>` : "";
  const blank = `<option value="" ${selected ? "" : "selected"}>— Select city —</option>`;
  const cityOpts = allCities().map(c => `<option value="${escapeHtml(c)}" ${c === selected ? "selected" : ""}>${escapeHtml(c)}</option>`).join("");
  return blank + extra + cityOpts + `<option value="__add_city__">+ Add New City…</option>`;
}

// Shared by both "+ Add New City…" spots (the Edit Agency form's location
// rows and the standalone Add Location modal) — prompts for a name and,
// since it's not one we can look up, its county — then remembers the pair
// for next time. Returns { name, county } or null if cancelled.
async function promptNewCity() {
  const name = (await quickPrompt("Add New City", "City name")) || "";
  if (!name) return null;
  const merged = allCityCounty();
  let county = merged[name];
  if (county === undefined) {
    county = (await quickPrompt("Add New City", `County for ${name}`)) || "";
    customCityCounty[name] = county;
    persistCustomCities();
  }
  return { name, county };
}

function renderAgencyLocationRows(locations) {
  const list = document.getElementById("af-locations-list");
  list.innerHTML = locations.map((loc, i) => `
    <div class="af-location-row border border-slate-200 rounded-lg p-3 space-y-2" data-placements="${escapeHtml(JSON.stringify(loc.placements || []))}">
      <div class="flex items-center justify-between">
        <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Location ${i + 1}</p>
        <button type="button" class="af-remove-location-btn text-slate-400 hover:text-red-500 ${locations.length <= 1 ? "hidden" : ""}" title="Remove location">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <input type="text" class="af-loc-address col-span-2 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22]" placeholder="Address" value="${escapeHtml(loc.address || "")}" />
        <input type="text" class="af-loc-zip w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22]" placeholder="ZIP" inputmode="numeric" maxlength="10" value="${escapeHtml(loc.zip || "")}" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <select class="af-loc-city w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F05A22]">
          ${agencyCityOptionsHtml(loc.city || "")}
        </select>
        <input type="text" class="af-loc-county w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-500" placeholder="County (auto-filled)" value="${escapeHtml(loc.county || "")}" readonly />
      </div>
    </div>`).join("");
}

// The placement-by-semester schedule isn't edited from this form (see the
// Location Detail modal in staff-app.js) — carried through as JSON in
// data-placements so saving an agency here never clobbers a schedule
// coordinators have already built up.
function readAgencyLocationRows() {
  return [...document.querySelectorAll("#af-locations-list .af-location-row")].map(row => {
    let placements = [];
    try { placements = JSON.parse(row.dataset.placements || "[]"); } catch (e) { /* keep [] */ }
    return {
      address: row.querySelector(".af-loc-address").value.trim(),
      zip: row.querySelector(".af-loc-zip").value.trim(),
      city: row.querySelector(".af-loc-city").value.trim(),
      county: row.querySelector(".af-loc-county").value.trim(),
      placements,
    };
  });
}

// Picking a city fills in its county automatically — nobody has to know
// California county lines by heart. "+ Add New City…" prompts for a name (and,
// since it's not one we can look up, its county) right there — same pattern
// as adding a new cohort — and remembers it for next time.
document.getElementById("af-locations-list").addEventListener("change", async e => {
  const citySel = e.target.closest(".af-loc-city");
  if (!citySel) return;
  const countyInput = citySel.closest(".af-location-row").querySelector(".af-loc-county");

  if (citySel.value !== "__add_city__") {
    countyInput.value = allCityCounty()[citySel.value] || "";
    return;
  }

  const result = await promptNewCity();
  citySel.innerHTML = agencyCityOptionsHtml(result ? result.name : "");
  countyInput.value = result ? result.county : "";
});

document.getElementById("af-locations-list").addEventListener("click", e => {
  const btn = e.target.closest(".af-remove-location-btn");
  if (!btn) return;
  const rows = readAgencyLocationRows();
  const idx = [...document.querySelectorAll(".af-location-row")].indexOf(btn.closest(".af-location-row"));
  rows.splice(idx, 1);
  renderAgencyLocationRows(rows);
});

function resetAgencyForm() {
  document.getElementById("agency-form").reset();
  document.getElementById("af-id").value = "";
  renderAgencyLocationRows([{ address: "", city: "", county: "" }]);
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
  renderAgencyLocationRows(a.locations && a.locations.length ? a.locations : [{ address: "", city: "", county: "" }]);
  document.getElementById("af-contract").value = a.contract || "Active";
  openModal("agency-form-modal");
};

document.getElementById("agency-form").addEventListener("submit", e => {
  e.preventDefault();
  const idVal = document.getElementById("af-id").value;
  const locations = readAgencyLocationRows().filter(l => l.address || l.city || l.county);
  if (!locations.length) {
    alert("Add at least one location.");
    return;
  }
  const data = {
    name: document.getElementById("af-name").value.trim(),
    contact: document.getElementById("af-contact").value.trim(),
    title: document.getElementById("af-title").value.trim(),
    email: document.getElementById("af-email").value.trim(),
    phone: document.getElementById("af-phone").value.trim(),
    locations,
    contract: document.getElementById("af-contract").value,
  };

  if (idVal) updateAgency(Number(idVal), data);
  else addAgency(data);

  closeModal("agency-form-modal");
  populateAgencyCityFilter();
  populateAgencyCountyFilter();
  renderAgencies();

  // If this agency's profile panel is the one sitting open behind the form
  // (e.g. "Edit Agency" was clicked from inside it), refresh it in place —
  // otherwise a removed location kept showing until the panel was closed
  // and reopened.
  if (idVal && activeAgencyId === Number(idVal)) {
    openAgencyPanel(Number(idVal), { preserveTab: true });
  }
});

document.getElementById("add-agency-btn").addEventListener("click", openAgencyAddModal);

// ── Add Location Modal ───────────────────────────────────────────────────────
// Triggered by the "+ Add Location" button in the agency panel's Locations tab
// (staff-app.js) — appends a brand-new location straight onto that agency
// without opening the full Edit Agency form. Reuses the same city dropdown /
// auto-filled county (including "+ Add New City…") as that form's rows.
let addLocationAgencyId = null;

window.openAddLocationModal = function (agencyId) {
  addLocationAgencyId = agencyId;
  document.getElementById("add-location-form").reset();
  document.getElementById("add-location-city").innerHTML = agencyCityOptionsHtml("");
  document.getElementById("add-location-county").value = "";
  openModal("add-location-modal");
  document.getElementById("add-location-address").focus();
};

document.getElementById("add-location-city").addEventListener("change", async e => {
  const sel = e.target;
  const countyInput = document.getElementById("add-location-county");
  if (sel.value !== "__add_city__") {
    countyInput.value = allCityCounty()[sel.value] || "";
    return;
  }
  const result = await promptNewCity();
  const name = result ? result.name : "";
  const county = result ? result.county : "";
  sel.innerHTML = agencyCityOptionsHtml(name);
  countyInput.value = county;
});

document.getElementById("add-location-form").addEventListener("submit", e => {
  e.preventDefault();
  if (addLocationAgencyId === null) return;
  const a = agencies.find(x => x.id === addLocationAgencyId);
  if (!a) return;

  const address = document.getElementById("add-location-address").value.trim();
  const zip = document.getElementById("add-location-zip").value.trim();
  const city = document.getElementById("add-location-city").value;
  const county = document.getElementById("add-location-county").value.trim();
  if (!address || !city) return;

  a.locations.push({ address, zip, city, county, placements: [] });
  persistAgencies();
  closeModal("add-location-modal");

  renderAgencyLocationsTab(addLocationAgencyId);
  populateAgencyCityFilter();
  populateAgencyCountyFilter();
  renderAgencies();

  addLocationAgencyId = null;
});

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

// ── Manage Cohorts Modal ─────────────────────────────────────────────────────
// Opened from staff-app.js's filter-cohort "Other…" option (admin-only) — reuses
// cohortOptions/addCohort/deleteCohort/persistCohorts/compareCohorts from there.
// One flat list, always in chronological order — no current/previous split.
function renderManageCohortsList() {
  const el = document.getElementById("manage-cohorts-list");
  const sorted = [...cohortOptions].sort(compareCohorts);
  el.innerHTML = sorted.map(name => `
    <div class="flex items-center justify-between gap-2 px-3 py-2 border border-slate-100 rounded-lg" data-cohort="${escapeHtml(name)}">
      <span class="text-sm text-slate-700 font-medium">${escapeHtml(name)}</span>
      <button type="button" class="mc-delete-btn text-slate-400 hover:text-red-500" title="Delete cohort">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>`).join("") || `<p class="text-sm text-slate-400 text-center py-4">No cohorts yet.</p>`;
}

window.openManageCohorts = function () {
  renderManageCohortsList();
  openModal("manage-cohorts-modal");
};

document.getElementById("manage-cohorts-list").addEventListener("click", e => {
  const delBtn = e.target.closest(".mc-delete-btn");
  if (!delBtn) return;
  const name = delBtn.closest("[data-cohort]").dataset.cohort;
  if (!confirm(`Delete the "${name}" cohort option? Students already assigned to it are unaffected.`)) return;
  deleteCohort(name);
  renderManageCohortsList();
  renderCohortFilterOptions();
});

document.getElementById("add-cohort-form").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("mc-new-name");
  const name = input.value.trim();
  if (!name) return;
  if (cohortOptions.some(c => c.toLowerCase() === name.toLowerCase())) {
    alert(`"${name}" is already in the cohort list.`);
    return;
  }
  addCohort(name);
  input.value = "";
  renderManageCohortsList();
  renderCohortFilterOptions();
});

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
