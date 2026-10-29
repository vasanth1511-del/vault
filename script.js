/*
  StudyVault stores everything in this browser's localStorage.
  There is no server, so this is a safe and simple project for beginners.
*/

const STORAGE_KEYS = {
  resources: "studyvault_resources",
  bookmarks: "studyvault_bookmarks",
  upvoted: "studyvault_upvoted",
  theme: "studyvault_theme"
};

const sampleResources = [
  { id: "resource-1", title: "Data Structures unit-wise notes", description: "Concise notes covering arrays, linked lists, stacks, queues, trees, and graphs with diagrams and exam-focused examples.", department: "Computer Science", semester: "Semester 3", subject: "Data Structures", type: "Notes", link: "https://www.geeksforgeeks.org/data-structures/", upvotes: 38, createdAt: "2026-08-12T09:00:00.000Z" },
  { id: "resource-2", title: "DBMS previous-year question paper", description: "A solved collection of database management questions covering SQL, normalization, transactions, and indexing.", department: "Information Technology", semester: "Semester 4", subject: "Database Management Systems", type: "Question Paper", link: "https://www.javatpoint.com/dbms-tutorial", upvotes: 51, createdAt: "2026-08-08T11:30:00.000Z" },
  { id: "resource-3", title: "Operating Systems quick revision", description: "Last-minute revision material for processes, scheduling, deadlocks, memory management, and file systems.", department: "Computer Science", semester: "Semester 4", subject: "Operating Systems", type: "Notes", link: "https://www.geeksforgeeks.org/operating-systems/", upvotes: 44, createdAt: "2026-08-19T15:20:00.000Z" },
  { id: "resource-4", title: "Computer Networks exam checklist", description: "A practical checklist for revising OSI layers, TCP/IP, routing, error control, and common networking numericals.", department: "Computer Science", semester: "Semester 5", subject: "Computer Networks", type: "Tips", link: "https://www.cloudflare.com/learning/network-layer/what-is-a-computer-network/", upvotes: 27, createdAt: "2026-08-23T08:10:00.000Z" },
  { id: "resource-5", title: "Engineering Mathematics II practice set", description: "Practice problems on differential equations, Fourier series, multiple integrals, and vector calculus for semester exams.", department: "Mechanical Engineering", semester: "Semester 2", subject: "Engineering Mathematics II", type: "Question Paper", link: "https://mathworld.wolfram.com/", upvotes: 33, createdAt: "2026-08-03T13:45:00.000Z" },
  { id: "resource-6", title: "Digital Electronics chapter notes", description: "Easy-to-revise notes for Boolean algebra, logic gates, combinational circuits, sequential circuits, and flip-flops.", department: "Electronics & Communication", semester: "Semester 3", subject: "Digital Electronics", type: "Notes", link: "https://www.electronics-tutorials.ws/logic/logic_1.html", upvotes: 31, createdAt: "2026-08-16T10:05:00.000Z" },
  { id: "resource-7", title: "Signals and Systems solved paper", description: "Solved university-style paper with convolution, Fourier transform, Laplace transform, and system analysis problems.", department: "Electronics & Communication", semester: "Semester 4", subject: "Signals and Systems", type: "Question Paper", link: "https://lpsa.swarthmore.edu/", upvotes: 22, createdAt: "2026-08-06T16:00:00.000Z" },
  { id: "resource-8", title: "Thermodynamics formula sheet", description: "A compact formula sheet for the first and second laws, entropy, cycles, properties of steam, and gas mixtures.", department: "Mechanical Engineering", semester: "Semester 4", subject: "Thermodynamics", type: "Notes", link: "https://www.engineeringtoolbox.com/thermodynamics-d_162.html", upvotes: 29, createdAt: "2026-08-26T07:25:00.000Z" },
  { id: "resource-9", title: "Surveying field-work tips", description: "Simple field-work and viva tips for chain surveying, compass surveying, leveling, and common calculation mistakes.", department: "Civil Engineering", semester: "Semester 3", subject: "Surveying", type: "Tips", link: "https://www.civilengineeringterms.com/surveying/", upvotes: 18, createdAt: "2026-08-14T12:40:00.000Z" },
  { id: "resource-10", title: "Structural Analysis practice questions", description: "Practice questions for beams, trusses, influence lines, and support reactions with a useful revision sequence.", department: "Civil Engineering", semester: "Semester 5", subject: "Structural Analysis", type: "Question Paper", link: "https://www.engineeringcivil.com/structural-analysis.html", upvotes: 24, createdAt: "2026-08-21T14:15:00.000Z" },
  { id: "resource-11", title: "Web Technology HTML and CSS guide", description: "Beginner-friendly notes and examples for semantic HTML, forms, responsive CSS, Flexbox, and Grid layouts.", department: "Information Technology", semester: "Semester 5", subject: "Web Technology", type: "Notes", link: "https://developer.mozilla.org/en-US/docs/Learn", upvotes: 47, createdAt: "2026-08-28T09:50:00.000Z" },
  { id: "resource-12", title: "How to make a 7-day exam plan", description: "A realistic planning method that combines active recall, past papers, short breaks, and daily review sessions.", department: "Computer Science", semester: "Semester 6", subject: "Study Skills", type: "Tips", link: "https://learningcenter.unc.edu/tips-and-tools/studying-101/", upvotes: 36, createdAt: "2026-08-30T17:05:00.000Z" }
];

const state = {
  resources: [],
  bookmarks: [],
  upvoted: [],
  search: "",
  filters: { department: "", semester: "", subject: "", type: "" },
  sort: "upvotes"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// localStorage can fail in private browsing, so all storage calls are protected.
function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // The app still works for this session if storage is unavailable.
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

function typeClass(type) {
  return type.toLowerCase().replace(/\s+/g, "-");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function saveResources() { writeStorage(STORAGE_KEYS.resources, state.resources); }
function saveBookmarks() { writeStorage(STORAGE_KEYS.bookmarks, state.bookmarks); }
function saveUpvoted() { writeStorage(STORAGE_KEYS.upvoted, state.upvoted); }

function loadAppData() {
  const savedResources = readStorage(STORAGE_KEYS.resources, null);
  state.resources = Array.isArray(savedResources) ? savedResources : [...sampleResources];
  const savedBookmarks = readStorage(STORAGE_KEYS.bookmarks, []);
  const savedUpvoted = readStorage(STORAGE_KEYS.upvoted, []);
  state.bookmarks = Array.isArray(savedBookmarks) ? savedBookmarks : [];
  state.upvoted = Array.isArray(savedUpvoted) ? savedUpvoted : [];

  // Remove stale IDs if a user clears or changes stored data manually.
  const validIds = new Set(state.resources.map((resource) => resource.id));
  state.bookmarks = state.bookmarks.filter((id) => validIds.has(id));
  state.upvoted = state.upvoted.filter((id) => validIds.has(id));
}

function updateStats() {
  const subjects = new Set(state.resources.map((resource) => resource.subject.trim().toLowerCase()));
  const totalUpvotes = state.resources.reduce((sum, resource) => sum + Number(resource.upvotes || 0), 0);
  $("#totalResources").textContent = state.resources.length;
  $("#totalSubjects").textContent = subjects.size;
  $("#totalUpvotes").textContent = totalUpvotes;
}

function populateFilters() {
  const values = {
    department: [...new Set(state.resources.map((resource) => resource.department))].sort(),
    semester: [...new Set(state.resources.map((resource) => resource.semester))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    subject: [...new Set(state.resources.map((resource) => resource.subject))].sort()
  };
  const filterData = [
    ["#departmentFilter", "All departments", values.department, "department"],
    ["#semesterFilter", "All semesters", values.semester, "semester"],
    ["#subjectFilter", "All subjects", values.subject, "subject"]
  ];

  filterData.forEach(([selector, defaultText, options, filterKey]) => {
    const select = $(selector);
    const selected = state.filters[filterKey];
    select.innerHTML = `<option value="">${defaultText}</option>`;
    options.forEach((option) => {
      select.insertAdjacentHTML("beforeend", `<option value="${escapeHTML(option)}">${escapeHTML(option)}</option>`);
    });
    select.value = options.includes(selected) ? selected : "";
  });
}

function getFilteredResources() {
  const query = state.search.trim().toLowerCase();
  const result = state.resources.filter((resource) => {
    const searchableText = [resource.title, resource.description, resource.department, resource.semester, resource.subject, resource.type].join(" ").toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const matchesDepartment = !state.filters.department || resource.department === state.filters.department;
    const matchesSemester = !state.filters.semester || resource.semester === state.filters.semester;
    const matchesSubject = !state.filters.subject || resource.subject === state.filters.subject;
    const matchesType = !state.filters.type || resource.type === state.filters.type;
    return matchesSearch && matchesDepartment && matchesSemester && matchesSubject && matchesType;
  });

  return result.sort((a, b) => {
    if (state.sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return Number(b.upvotes || 0) - Number(a.upvotes || 0);
  });
}

function resourceCard(resource) {
  const isBookmarked = state.bookmarks.includes(resource.id);
  const hasUpvoted = state.upvoted.includes(resource.id);
  const bookmarkLabel = isBookmarked ? "Remove bookmark" : "Save bookmark";
  const upvoteLabel = hasUpvoted ? "Remove your upvote" : "Upvote this resource";

  return `
    <article class="resource-card" data-resource-id="${escapeHTML(resource.id)}">
      <div class="resource-card-top">
        <span class="type-badge ${typeClass(resource.type)}">${escapeHTML(resource.type)}</span>
        <button class="card-bookmark ${isBookmarked ? "is-active" : ""}" type="button" data-action="bookmark" aria-label="${bookmarkLabel}" aria-pressed="${isBookmarked}">${isBookmarked ? "♥" : "♡"}</button>
      </div>
      <h3>${escapeHTML(resource.title)}</h3>
      <p class="resource-card-description">${escapeHTML(resource.description)}</p>
      <div class="resource-card-meta">
        <span>▣ ${escapeHTML(resource.department)}</span>
        <span>◷ ${escapeHTML(resource.semester)}</span>
        <span>• ${escapeHTML(resource.subject)}</span>
      </div>
      <div class="resource-card-actions">
        <button class="upvote-button ${hasUpvoted ? "is-active" : ""}" type="button" data-action="upvote" aria-label="${upvoteLabel}" aria-pressed="${hasUpvoted}"><span class="vote-arrow">▲</span> <span>${Number(resource.upvotes || 0)}</span></button>
        <a class="open-link" href="${escapeHTML(resource.link)}" target="_blank" rel="noopener noreferrer">Open link ↗</a>
      </div>
    </article>`;
}

function renderBrowse() {
  const filteredResources = getFilteredResources();
  const grid = $("#resourcesGrid");
  const emptyState = $("#browseEmptyState");
  grid.innerHTML = filteredResources.map(resourceCard).join("");
  emptyState.classList.toggle("hidden", filteredResources.length > 0);

  const hasFilters = state.search || Object.values(state.filters).some(Boolean);
  $("#resultSummary").textContent = hasFilters
    ? `Showing ${filteredResources.length} of ${state.resources.length} resources`
    : `Showing all ${state.resources.length} resources`;
}

function renderBookmarks() {
  const bookmarkedResources = state.resources.filter((resource) => state.bookmarks.includes(resource.id));
  $("#bookmarksGrid").innerHTML = bookmarkedResources.map(resourceCard).join("");
  $("#bookmarksEmptyState").classList.toggle("hidden", bookmarkedResources.length > 0);
}

function renderAll() {
  updateStats();
  populateFilters();
  renderBrowse();
  renderBookmarks();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function showSection(sectionId, updateHash = true) {
  const validSections = ["home", "browse", "upload", "bookmarks", "about"];
  const nextSection = validSections.includes(sectionId) ? sectionId : "home";
  $$(".app-section").forEach((section) => section.classList.toggle("active", section.id === nextSection));
  $$("[data-section-link]").forEach((link) => link.classList.toggle("active", link.dataset.sectionLink === nextSection));
  if (updateHash) history.replaceState(null, "", `#${nextSection}`);
  if (nextSection === "bookmarks") renderBookmarks();
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeMobileMenu();
}

function syncSearchInputs(value) {
  $("#heroSearch").value = value;
  $("#browseSearch").value = value;
}

function clearFilters() {
  state.search = "";
  state.filters = { department: "", semester: "", subject: "", type: "" };
  state.sort = "upvotes";
  syncSearchInputs("");
  $("#typeFilter").value = "";
  $("#sortSelect").value = "upvotes";
  renderAll();
}

function toggleBookmark(resourceId) {
  const isAlreadySaved = state.bookmarks.includes(resourceId);
  state.bookmarks = isAlreadySaved
    ? state.bookmarks.filter((id) => id !== resourceId)
    : [...state.bookmarks, resourceId];
  saveBookmarks();
  renderAll();
  showToast(isAlreadySaved ? "Removed from bookmarks" : "Saved to bookmarks");
}

function toggleUpvote(resourceId) {
  const resource = state.resources.find((item) => item.id === resourceId);
  if (!resource) return;
  const alreadyUpvoted = state.upvoted.includes(resourceId);
  resource.upvotes = Math.max(0, Number(resource.upvotes || 0) + (alreadyUpvoted ? -1 : 1));
  state.upvoted = alreadyUpvoted
    ? state.upvoted.filter((id) => id !== resourceId)
    : [...state.upvoted, resourceId];
  saveResources();
  saveUpvoted();
  renderAll();
  showToast(alreadyUpvoted ? "Upvote removed" : "Thanks for supporting this resource");
}

function validateForm(formData) {
  const values = Object.fromEntries(formData.entries());
  const errors = {};
  if (values.title.trim().length < 5) errors.title = "Use at least 5 characters for the title.";
  if (values.description.trim().length < 20) errors.description = "Add at least 20 characters so students know what to expect.";
  if (!values.department) errors.department = "Choose a department.";
  if (!values.semester) errors.semester = "Choose a semester.";
  if (values.subject.trim().length < 2) errors.subject = "Enter the subject name.";
  if (!values.type) errors.type = "Choose a resource type.";
  if (!isValidHttpUrl(values.link.trim())) errors.link = "Enter a valid link beginning with http:// or https://.";
  return { values, errors };
}

function clearFormErrors() {
  $$(".form-field").forEach((field) => field.classList.remove("has-error"));
  $$(".field-error").forEach((error) => { error.textContent = ""; });
}

function displayFormErrors(errors) {
  clearFormErrors();
  Object.entries(errors).forEach(([fieldName, message]) => {
    const error = $(`[data-error-for="${fieldName}"]`);
    if (!error) return;
    error.textContent = message;
    error.closest(".form-field").classList.add("has-error");
  });
}

function closeMobileMenu() {
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
  $("#menuToggle").setAttribute("aria-label", "Open navigation");
}

function setupTheme() {
  const savedTheme = readStorage(STORAGE_KEYS.theme, "light");
  const isDark = savedTheme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  $("#themeIcon").textContent = isDark ? "☀" : "☾";
  $("#themeToggle").setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function setupEvents() {
  $$("[data-section-link]").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(link.dataset.sectionLink);
  }));
  $$("[data-go-section]").forEach((button) => button.addEventListener("click", () => showSection(button.dataset.goSection)));
  window.addEventListener("hashchange", () => showSection(window.location.hash.slice(1), false));

  $("#menuToggle").addEventListener("click", () => {
    const isOpen = $("#mainNav").classList.toggle("open");
    $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
    $("#menuToggle").setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  $("#themeToggle").addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    writeStorage(STORAGE_KEYS.theme, isDark ? "dark" : "light");
    $("#themeIcon").textContent = isDark ? "☀" : "☾";
    $("#themeToggle").setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  });

  $("#heroSearch").addEventListener("input", (event) => {
    state.search = event.target.value;
    syncSearchInputs(state.search);
  });
  $("#browseSearch").addEventListener("input", (event) => {
    state.search = event.target.value;
    syncSearchInputs(state.search);
    renderBrowse();
  });
  $("#heroSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    showSection("browse");
    renderBrowse();
  });

  const filterMap = { departmentFilter: "department", semesterFilter: "semester", subjectFilter: "subject", typeFilter: "type" };
  Object.entries(filterMap).forEach(([id, filterKey]) => $("#" + id).addEventListener("change", (event) => {
    state.filters[filterKey] = event.target.value;
    renderBrowse();
  }));
  $("#sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; renderBrowse(); });
  $("#clearFilters").addEventListener("click", clearFilters);
  $("#emptyClearFilters").addEventListener("click", clearFilters);

  // One event listener handles buttons in both resource grids.
  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const card = actionButton.closest("[data-resource-id]");
    if (!card) return;
    const resourceId = card.dataset.resourceId;
    if (actionButton.dataset.action === "bookmark") toggleBookmark(resourceId);
    if (actionButton.dataset.action === "upvote") toggleUpvote(resourceId);
  });

  $("#resourceForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const { values, errors } = validateForm(new FormData(form));
    const message = $("#formMessage");
    if (Object.keys(errors).length > 0) {
      displayFormErrors(errors);
      message.className = "form-message error";
      message.textContent = "Please fix the highlighted fields and try again.";
      const firstInvalid = Object.keys(errors)[0];
      $("#resource" + firstInvalid.charAt(0).toUpperCase() + firstInvalid.slice(1))?.focus();
      return;
    }

    const newResource = {
      id: window.crypto?.randomUUID?.() || `resource-${Date.now()}`,
      title: values.title.trim(),
      description: values.description.trim(),
      department: values.department,
      semester: values.semester,
      subject: values.subject.trim(),
      type: values.type,
      link: values.link.trim(),
      upvotes: 0,
      createdAt: new Date().toISOString()
    };
    state.resources.unshift(newResource);
    saveResources();
    form.reset();
    clearFormErrors();
    message.className = "form-message success";
    message.textContent = "Resource published! It is now available in Browse.";
    renderAll();
    showToast("Resource added successfully");
  });

  $("#resourceForm").addEventListener("reset", () => {
    setTimeout(() => { clearFormErrors(); $("#formMessage").className = "form-message"; $("#formMessage").textContent = ""; }, 0);
  });

  $$("#resourceForm input, #resourceForm textarea, #resourceForm select").forEach((field) => field.addEventListener("input", () => {
    const error = $(`[data-error-for="${field.name}"]`);
    if (error) { error.textContent = ""; error.closest(".form-field").classList.remove("has-error"); }
  }));
}

function init() {
  loadAppData();
  setupTheme();
  $("#currentYear").textContent = new Date().getFullYear();
  setupEvents();
  renderAll();
  const requestedSection = window.location.hash.slice(1);
  showSection(requestedSection || "home", false);
}

document.addEventListener("DOMContentLoaded", init);
