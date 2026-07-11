
// Set to false to hide the GitHub Activity section (e.g. if the
// contribution graph looks too sparse to show off).
const SHOW_GITHUB_ACTIVITY = true;
if (!SHOW_GITHUB_ACTIVITY) {
  const githubActivitySection = document.getElementById("github-activity");
  if (githubActivitySection) githubActivitySection.remove();

  const navGithub = document.getElementById("navGithub");
  if (navGithub) navGithub.remove();
}

// Smooth scroll to contact section
const contactBtn = document.getElementById("contactBtn");
if (contactBtn) {
  contactBtn.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
}

// Expand/collapse the About Me bio
const aboutBioText = document.getElementById("aboutBioText");
const aboutReadMoreBtn = document.getElementById("aboutReadMoreBtn");
if (aboutBioText && aboutReadMoreBtn) {
  aboutReadMoreBtn.addEventListener("click", () => {
    const expanded = aboutBioText.classList.toggle("expanded");
    aboutReadMoreBtn.textContent = expanded ? "Show less" : "Read more";
    aboutReadMoreBtn.setAttribute("aria-expanded", String(expanded));
  });
}

// Copy email to clipboard
const copyEmailBtn = document.getElementById("copyEmailBtn");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", () => {
    navigator.clipboard.writeText("joshuaseballosc@gmail.com");
    const original = copyEmailBtn.textContent;
    copyEmailBtn.textContent = "Copied!";
    copyEmailBtn.classList.add("is-copied");
    setTimeout(() => {
      copyEmailBtn.textContent = original;
      copyEmailBtn.classList.remove("is-copied");
    }, 1500);
  });
}

// Fade the edges of the horizontal project gallery to signal there's more to
// scroll, only on the side that actually has more content.
const projectsGrid = document.querySelector(".projects-grid");
if (projectsGrid) {
  const updateGalleryMask = () => {
    const atStart = projectsGrid.scrollLeft <= 4;
    const atEnd =
      projectsGrid.scrollLeft >= projectsGrid.scrollWidth - projectsGrid.clientWidth - 4;
    const left = atStart ? "black" : "transparent";
    const right = atEnd ? "black" : "transparent";
    const mask = `linear-gradient(to right, ${left}, black 40px, black calc(100% - 40px), ${right})`;
    projectsGrid.style.maskImage = mask;
    projectsGrid.style.webkitMaskImage = mask;
  };
  updateGalleryMask();
  projectsGrid.addEventListener("scroll", updateGalleryMask, { passive: true });
  window.addEventListener("resize", updateGalleryMask);
}

// Project modal
const projectModal = document.getElementById("projectModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

if (projectModal && modalBody && modalClose) {
  const openModal = (projectId) => {
    const template = document.getElementById(`template-${projectId}`);
    if (!template) return;
    modalBody.innerHTML = "";
    modalBody.appendChild(template.content.cloneNode(true));
    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.project));
  });

  modalClose.addEventListener("click", closeModal);

  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// Cycle the "full stack" accent word through different fonts
const accentEl = document.querySelector(".accent");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (accentEl && !prefersReducedMotion) {
  const accentFonts = [
    "'Poppins', sans-serif",
    "Georgia, serif",
    "'Courier New', monospace",
    "Impact, sans-serif",
    "'Brush Script MT', cursive",
  ];
  let accentFontIndex = 0;

  setInterval(() => {
    accentEl.style.opacity = "0";
    setTimeout(() => {
      accentFontIndex = (accentFontIndex + 1) % accentFonts.length;
      accentEl.style.fontFamily = accentFonts[accentFontIndex];
      accentEl.style.opacity = "1";
    }, 150);
  }, 1500);
}

// Dark mode toggle
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// Fade-in reveal using the Web Animations API. Sections are fully visible by
// default (see .fade-in in style.css); this plays a one-off entrance overlay
// on top of that resting state. If the observer never fires (headless
// renderer, paused tab, JS disabled), content is simply already visible —
// the reveal enhances, it never gates.
const faders = document.querySelectorAll(".fade-in");
if (!prefersReducedMotion && "IntersectionObserver" in window && "animate" in Element.prototype) {
  const appearOptions = {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.2,
  };

  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.animate(
        [
          { opacity: 0, transform: "translateY(40px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 1000, easing: "cubic-bezier(0.25, 1, 0.5, 1)" }
      );
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach((fader) => {
    const rect = fader.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      appearOnScroll.observe(fader);
    }
  });
}