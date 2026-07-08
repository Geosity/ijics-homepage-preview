const sectionLinks = document.querySelectorAll("[data-section-link]");
const quickAccessFloat = document.querySelector("#site-structure");
const quickAccessLinks = document.querySelectorAll(".quick-access-link");
const quickAccessSecondary = document.querySelector("#quickAccessSecondary");
const quickAccessToggle = document.querySelector("#quickAccessToggle");
const toast = document.querySelector("#toast");
const issueSelect = document.querySelector("#issueSelect");
const articleTypeButtons = document.querySelectorAll("[data-article-type]");
const articleQuery = document.querySelector("#articleQuery");
const articleCards = Array.from(document.querySelectorAll(".article-card"));
let activeArticleType = "all";
let toastTimer;

const quickAccessMenus = {
  Authors: [
    { label: "Aim & Scope", target: "./aim-scope.html#aim-scope" },
    { label: "Instructions for Authors", target: "./author-center.html#author-guide" },
    { label: "Submission path", target: "./author-center.html#submission" },
    { label: "Article Publish Fee", target: "./author-center.html#apf" },
    { label: "Templates", target: "./author-center.html#templates" },
    { label: "Submission email", target: "./editorial-board.html#editorial-office" },
  ],
  Reviewers: [
    { label: "Peer review process", target: "./author-center.html#peer-review" },
    { label: "Similarity thresholds", target: "./author-center.html#peer-review" },
    { label: "Editorial Office", target: "./editorial-board.html#editorial-office" },
  ],
  Editors: [
    { label: "Editorial Board", target: "./editorial-board.html#editorial-board" },
    { label: "Editorial Office", target: "./editorial-board.html#editorial-office" },
    { label: "Current issue", target: "./index.html#current-issue" },
  ],
};

const issueTargets = {
  current: "./index.html#current-issue",
  archive: "./index.html#all-issues",
  popular: "./index.html#articles",
  cfp: "./index.html#call-for-papers",
  authors: "./author-center.html#author-guide",
};

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function scrollToTarget(target) {
  if (!target.startsWith("#")) {
    window.location.href = target;
    return;
  }
  const element = document.querySelector(target);
  if (!element) {
    window.location.href = `./index.html${target}`;
    return;
  }
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderQuickAccessSecondary(targetSection) {
  if (!quickAccessSecondary) return;

  const items = quickAccessMenus[targetSection] || [];
  quickAccessSecondary.innerHTML = `
    <p>${targetSection}</p>
    <div class="quick-access-secondary-list">
      ${items
        .map(
          (item) =>
            `<button type="button" class="quick-access-secondary-link" data-target="${item.target}">${item.label}</button>`
        )
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

const defaultQuickAccessSection =
  document.querySelector(".quick-access-link.is-active")?.dataset.sectionLink || "Authors";
renderQuickAccessSecondary(defaultQuickAccessSection);

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

if (quickAccessSecondary) {
  quickAccessSecondary.addEventListener("click", (event) => {
    const button = event.target.closest("[data-target]");
    if (!button) return;
    scrollToTarget(button.dataset.target);
    showToast(button.textContent.trim());
  });
}

const articleSearch = document.querySelector("#article-search");
if (articleSearch) {
  articleSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    applyArticleFilters();
  });
}

function applyArticleFilters() {
  const query = articleQuery ? articleQuery.value.trim().toLowerCase() : "";
  let visible = 0;
  articleCards.forEach((card) => {
    const typeMatch = activeArticleType === "all" || card.dataset.articleGroup === activeArticleType;
    const searchText = card.dataset.search || card.textContent.toLowerCase();
    const queryMatch = !query || searchText.toLowerCase().includes(query);
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
    const target = issueTargets[issueSelect.value];
    if (target) scrollToTarget(target);
    showToast(`${issueSelect.options[issueSelect.selectedIndex].text} selected`);
  });
}
