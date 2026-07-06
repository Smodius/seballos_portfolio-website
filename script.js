
// Smooth scroll to contact section
const contactBtn = document.getElementById("contactBtn");
if (contactBtn) {
  contactBtn.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
}

// Form submission alert
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    e.target.reset();
  });
}

// Copy email to clipboard
const copyEmailBtn = document.getElementById("copyEmailBtn");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", () => {
    navigator.clipboard.writeText("natassha@email.com");
    const original = copyEmailBtn.textContent;
    copyEmailBtn.textContent = "Copied!";
    setTimeout(() => (copyEmailBtn.textContent = original), 1500);
  });
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

// Dark mode toggle
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });
}

// Fade-in animation using Intersection Observer
const faders = document.querySelectorAll(".fade-in");
const appearOptions = {
  threshold: 0.2,
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));