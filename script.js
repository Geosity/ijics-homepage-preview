const structure = {
  Authors: [
    {
      title: "Instructions for Authors",
      note: "Keep the complete author workflow in one page with stable anchors for preparation, review, ethics, and acceptance.",
      tertiary: [
        "Article Types",
        "Submission Checklist",
        "Manuscript Template",
        "Peer Review Process",
        "Publication Ethics",
        "After Acceptance: proof",
        "online first",
        "DOI",
        "indexing",
      ],
    },
    {
      title: "Copyright & License",
      note: "Explain author rights, reuse, archiving, license wording, and version date before authors submit.",
      tertiary: ["copyright holder", "license type", "reuse", "self-archiving", "last updated"],
    },
    {
      title: "Article Processing Charge",
      note: "Show when APC applies, whether waivers exist, and which official payment path is valid.",
      tertiary: ["fee trigger", "amount", "waiver", "payment notice", "official channel"],
    },
    {
      title: "Submit Manuscript",
      note: "Open the official submission path only after the author sees the system name, correct domain, and return path.",
      tertiary: ["official system", "correct domain", "required files", "return path", "system help"],
    },
  ],
  Reviewers: [
    {
      title: "Verify invitation",
      note: "Confirm whether a review request is official before opening external links.",
      tertiary: ["sender check", "journal email", "manuscript ID", "deadline", "support"],
    },
    {
      title: "Reviewer guide",
      note: "Review criteria, confidentiality, conflict rules, and deadline expectations stay together.",
      tertiary: ["criteria", "confidentiality", "conflict of interest", "deadline", "ethics"],
    },
    {
      title: "Review portal",
      note: "The work entry is separate from public reviewer guidance.",
      tertiary: ["portal entry", "access help", "file access", "submit review", "return path"],
    },
    {
      title: "Reviewer support",
      note: "Reviewer questions route away from author submission support.",
      tertiary: ["invitation help", "deadline question", "portal access", "COI disclosure", "contact"],
    },
  ],
  Editors: [
    {
      title: "Editorial policies",
      note: "Editor duties and policy pages are separated from public board display.",
      tertiary: ["editor duties", "publication ethics", "COI", "misconduct contact", "last updated"],
    },
    {
      title: "Workspace and journal management",
      note: "Internal work entry and maintenance tasks stay together.",
      tertiary: ["editor login", "assigned papers", "decision tasks", "announcements", "metadata updates", "system help"],
    },
    {
      title: "Editorial Office",
      note: "Editors and staff route operational questions separately from author support.",
      tertiary: ["editorial inquiry", "policy question", "system issue", "handover", "response expectations"],
    },
  ],
};

const tabs = document.querySelectorAll(".map-tab");
const sectionLinks = document.querySelectorAll("[data-section-link]");
const levelTwo = document.querySelector("#levelTwo");
const levelThree = document.querySelector("#levelThree");
const toast = document.querySelector("#toast");
const issueSelect = document.querySelector("#issueSelect");
const announcementSearch = document.querySelector("#announcementsSearch");
const announcementQuery = document.querySelector("#announcementQuery");
const announcementGrid = document.querySelector(".updates-grid");
const announcementCards = Array.from(document.querySelectorAll(".update-card"));
const announcementFilterButtons = document.querySelectorAll("[data-announcement-filter]");
const announcementEmpty = document.querySelector("#announcementEmpty");
let activeSection = "Authors";
let activeSecond = null;
let activeAnnouncementFilter = "all";
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function renderMap() {
  if (!activeSection) {
    levelTwo.hidden = true;
    levelThree.hidden = true;
    levelTwo.innerHTML = "";
    levelThree.innerHTML = "";
    return;
  }

  const items = structure[activeSection];
  levelTwo.hidden = false;
  levelTwo.innerHTML = items
    .map(
      (item, index) =>
        `<button type="button" class="${index === activeSecond ? "is-active" : ""}" data-index="${index}">${item.title}</button>`
    )
    .join("");

  if (activeSecond === null) {
    levelThree.hidden = true;
    levelThree.innerHTML = "";
  } else {
    const selected = items[activeSecond];
    levelThree.hidden = false;
    levelThree.innerHTML = `
      <h3>${selected.title}</h3>
      <p>${selected.note}</p>
      <ul class="tertiary-list">
        ${selected.tertiary.map((entry) => `<li>${entry}</li>`).join("")}
      </ul>
    `;
  }

  levelTwo.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeSecond = Number(button.dataset.index);
      renderMap();
    });
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeSection = tab.dataset.section;
    activeSecond = null;
    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    renderMap();
  });
});

renderMap();

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetSection = link.dataset.sectionLink;
    const targetTab = Array.from(tabs).find((tab) => tab.dataset.section === targetSection);
    if (!targetTab) return;
    activeSection = targetSection;
    activeSecond = null;
    tabs.forEach((item) => {
      const isActive = item === targetTab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    renderMap();
  });
});

document.querySelector("#article-search").addEventListener("submit", (event) => {
  event.preventDefault();
});

document.querySelector("#articleQuery").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".article-card");
  let visible = 0;
  cards.forEach((card) => {
    const match = !query || card.dataset.search.includes(query);
    card.classList.toggle("is-hidden", !match);
    if (match) visible += 1;
  });
  if (!visible) showToast("No article matches this issue");
});

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
