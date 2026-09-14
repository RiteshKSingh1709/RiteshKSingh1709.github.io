const root = document.documentElement;
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".progress-bar");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const commandTrigger = document.querySelector(".command-trigger");
const commandPalette = document.querySelector(".command-palette");
const commandInput = document.querySelector(".command-input input");
const bootScreen = document.querySelector(".boot-screen");
const cursorGlow = document.querySelector(".cursor-glow");
const storedTheme = localStorage.getItem("portfolio-theme");

root.dataset.theme = storedTheme || "dark";

setTimeout(() => bootScreen.classList.add("complete"), 900);

addEventListener("pointermove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
}, { passive: true });

themeToggle.addEventListener("click", () => {
  const theme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
});

navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector(".print-resume").addEventListener("click", () => window.print());
document.querySelector("#year").textContent = new Date().getFullYear();

const closeCommands = () => {
  commandPalette.hidden = true;
  commandInput.value = "";
  document.body.style.overflow = "";
};

const openCommands = () => {
  commandPalette.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => commandInput.focus());
};

commandTrigger.addEventListener("click", openCommands);
commandPalette.addEventListener("click", (event) => {
  if (event.target === commandPalette) closeCommands();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && commandPalette.hidden && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    openCommands();
  }
  if (event.key === "Escape" && !commandPalette.hidden) closeCommands();
});

const commandButtons = [...document.querySelectorAll(".command-results button")];
commandInput.addEventListener("input", () => {
  const query = commandInput.value.toLowerCase();
  commandButtons.forEach((button) => {
    button.hidden = !button.textContent.toLowerCase().includes(query);
  });
});

commandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const command = button.dataset.command;
    closeCommands();
    if (command === "print") return window.print();
    if (command === "theme") return themeToggle.click();
    document.querySelector(`#${command}`)?.scrollIntoView({ behavior: "smooth" });
  });
});

const inspector = document.querySelector(".system-inspector");
document.querySelectorAll(".arch-node").forEach((node) => {
  node.addEventListener("click", () => {
    document.querySelector(".arch-node.active")?.classList.remove("active");
    node.classList.add("active");
    inspector.querySelector("strong").textContent = node.dataset.title;
    inspector.querySelector("p").textContent = node.dataset.detail;
  });
});

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-menu a")];

const updatePageState = () => {
  header.classList.toggle("scrolled", scrollY > 10);
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;

  const current = sections.reduce((active, section) => {
    return scrollY >= section.offsetTop - 180 ? section.id : active;
  }, "home");

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

addEventListener("scroll", updatePageState, { passive: true });
updatePageState();
