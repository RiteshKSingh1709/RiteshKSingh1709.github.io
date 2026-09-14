const root = document.documentElement;
const themeSelect = document.querySelector(".theme-picker select");
const modeToggle = document.querySelector(".mode-toggle");
const modeLabel = document.querySelector(".mode-label");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const storedTheme = localStorage.getItem("rupesh-portfolio-theme");
const storedMode = localStorage.getItem("rupesh-portfolio-mode");
const validThemes = ["boardroom", "dispatch", "command", "atlas", "signal"];
const themeColors = {
  boardroom: { light: "#f5f1e8", dark: "#101723" },
  dispatch: { light: "#f4efe4", dark: "#181512" },
  command: { light: "#edf4f7", dark: "#07111d" },
  atlas: { light: "#fff6e8", dark: "#151027" },
  signal: { light: "#edf1e8", dark: "#080d0a" }
};

root.dataset.theme = validThemes.includes(storedTheme) ? storedTheme : "boardroom";
root.dataset.mode = storedMode || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
themeSelect.value = root.dataset.theme;

const updateExperience = () => {
  const dark = root.dataset.mode === "dark";
  modeLabel.textContent = dark ? "Light" : "Dark";
  modeToggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
  modeToggle.setAttribute("aria-pressed", String(dark));
  document.querySelector('meta[name="theme-color"]').content = themeColors[root.dataset.theme][root.dataset.mode];
};

themeSelect.addEventListener("change", () => {
  root.dataset.theme = themeSelect.value;
  localStorage.setItem("rupesh-portfolio-theme", themeSelect.value);
  updateExperience();
});

modeToggle.addEventListener("click", () => {
  root.dataset.mode = root.dataset.mode === "dark" ? "light" : "dark";
  localStorage.setItem("rupesh-portfolio-mode", root.dataset.mode);
  updateExperience();
});

updateExperience();

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".journey-nav button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".journey-nav button.active").classList.remove("active");
    document.querySelector(".role-panel.active").classList.remove("active");
    button.classList.add("active");
    document.querySelector(`[data-panel="${button.dataset.role}"]`).classList.add("active");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .08 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const started = performance.now();
    const animate = (now) => {
      const progressValue = Math.min((now - started) / 1100, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1 - progressValue, 3)));
      if (progressValue < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    countObserver.unobserve(element);
  });
}, { threshold: .5 });
document.querySelectorAll("[data-count]").forEach((element) => countObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav-links a")];
const updatePage = () => {
  header.classList.toggle("scrolled", scrollY > 10);
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${scrollable > 0 ? scrollY / scrollable * 100 : 0}%`;
  const current = sections.reduce((active, section) => scrollY >= section.offsetTop - 160 ? section.id : active, "home");
  links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
};
addEventListener("scroll", updatePage, { passive: true });
updatePage();
