
// Smooth scroll to contact section
 document.getElementById("contactBtn").addEventListener("click", () => {
document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

// Form submission alert
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you! Your message has been sent.");
  e.target.reset();
});

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

// Dark mode toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

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