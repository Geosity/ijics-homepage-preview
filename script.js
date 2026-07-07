const sectionLinks = document.querySelectorAll("[data-section-link]");
const quickAccessFloat = document.querySelector("#site-structure");
const quickAccessLinks = document.querySelectorAll(".quick-access-link");
const quickAccessSecondary = document.querySelector("#quickAccessSecondary");
const quickAccessToggle = document.querySelector("#quickAccessToggle");
const toast = document.querySelector("#toast");
const issueSelect = document.querySelector("#issueSelect");
const announcementSearch = document.querySelector("#announcementsSearch");
const announcementQuery = document.querySelector("#announcementQuery");
const announcementGrid = document.querySelector(".updates-grid");
const announcementCards = Array.from(document.querySelectorAll(".update-card"));
const announcementFilterButtons = document.querySelectorAll("[data-announcement-filter]");
const announcementEmpty = document.querySelector("#announcementEmpty");
const articleTypeButtons = document.querySelectorAll("[data-article-type]");
const articleQuery = document.querySelector("#articleQuery");
const articleCards = Array.from(document.querySelectorAll(".article-card"));
let activeArticleType = "articles";
let activeAnnouncementFilter = "all";
let toastTimer;

const quickAccessMenus = {
  Authors: [
    "Instructions for Authors",
    "Copyright & License",
    "Article Processing Charge",
    "Submit Manuscript",
  ],
  Reviewers: ["Verify invitation", "Reviewer guide", "Review portal", "Reviewer support"],
  Editors: ["Editorial policies", "Workspace and journal management", "Editorial Office"],
};

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function renderQuickAccessSecondary(targetSection) {
  if (!quickAccessSecondary) return;

  const items = quickAccessMenus[targetSection] || [];
  quickAccessSecondary.innerHTML = `
    <p>${targetSection}</p>
    <div class="quick-access-secondary-list">
      ${items
        .map((item) => `<button type="button" class="quick-access-secondary-link">${item}</button>`)
        .join("")}
    </div>
  `;
}

function setQuickAccessSection(targetSection) {
  quickAccessLinks.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.sectionLink === targetSection);
  });
  renderQuickAccessSecondary(targetSection);
}

renderQuickAccessSecondary("Authors");

function toggleQuickAccess() {
  if (!quickAccessToggle || !quickAccessFloat) return;

  const isCollapsed = quickAccessFloat.classList.toggle("is-collapsed");
  quickAccessToggle.setAttribute("aria-expanded", String(!isCollapsed));
  quickAccessToggle.setAttribute(
    "aria-label",
    isCollapsed ? "Expand Quick Access" : "Collapse Quick Access"
  );
  quickAccessToggle.textContent = isCollapsed ? "<" : ">";
}

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setQuickAccessSection(link.dataset.sectionLink);
  });
});

quickAccessLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setQuickAccessSection(link.dataset.sectionLink);
  });
});

document.querySelector("#article-search").addEventListener("submit", (event) => {
  event.preventDefault();
});

function applyArticleFilters() {
  const query = articleQuery ? articleQuery.value.trim().toLowerCase() : "";
  let visible = 0;
  articleCards.forEach((card) => {
    const typeMatch = card.dataset.articleGroup === activeArticleType;
    const queryMatch = !query || card.dataset.search.includes(query);
    const match = typeMatch && queryMatch;
    card.classList.toggle("is-hidden", !match);
    if (match) visible += 1;
  });
  if (!visible) showToast("No article matches this issue");
}

if (articleQuery) {
  articleQuery.addEventListener("input", applyArticleFilters);
}

function setArticleType(nextType) {
  activeArticleType = nextType;
  articleTypeButtons.forEach((item) => {
    const isActive = item.dataset.articleType === nextType;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  applyArticleFilters();
}

applyArticleFilters();

if (issueSelect) {
  issueSelect.addEventListener("change", () => {
    if (!issueSelect.value) return;
    showToast(`${issueSelect.options[issueSelect.selectedIndex].text} selected`);
  });
}

function filterAnnouncements() {
  const query = announcementQuery ? announcementQuery.value.trim().toLowerCase() : "";
  let visible = 0;

  announcementCards.forEach((card) => {
    const categoryMatch =
      activeAnnouncementFilter === "all" || card.dataset.category === activeAnnouncementFilter;
    const searchText = card.dataset.search || card.textContent.toLowerCase();
    const queryMatch = !query || searchText.includes(query);
    const match = categoryMatch && queryMatch;
    card.classList.toggle("is-hidden", !match);
    if (match) visible += 1;
  });

  if (announcementEmpty) {
    announcementEmpty.hidden = visible > 0;
  }
}

if (announcementSearch) {
  announcementSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    filterAnnouncements();
  });
}

if (announcementQuery) {
  announcementQuery.addEventListener("input", filterAnnouncements);
}

announcementFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeAnnouncementFilter = button.dataset.announcementFilter;
    announcementFilterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    if (announcementGrid) announcementGrid.scrollLeft = 0;
    filterAnnouncements();
  });
});
