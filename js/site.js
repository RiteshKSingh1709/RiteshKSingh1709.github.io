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
const terminalMode = document.querySelector(".terminal-mode");
const terminalTrigger = document.querySelector(".terminal-trigger");
const terminalClose = document.querySelector(".terminal-close");
const terminalForm = document.querySelector(".terminal-form");
const terminalInput = document.querySelector("#terminal-input");
const terminalOutput = document.querySelector(".terminal-output");
const terminalBody = document.querySelector(".terminal-body");
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

const terminalCommands = {
  help: `<span class="term-key">about</span> professional summary
<span class="term-key">experience</span> career history and impact
<span class="term-key">skills</span> engineering stack
<span class="term-key">projects</span> projects and granted patent
<span class="term-key">education</span> academic background
<span class="term-key">contact</span> communication channels
<span class="term-key">goto [section]</span> navigate to a page section
<span class="term-key">theme</span> toggle light/dark interface
<span class="term-key">resume</span> print or save ATS resume
<span class="term-key">whoami</span> current system identity
<span class="term-key">status</span> live system status
<span class="term-key">clear</span> clear terminal output
<span class="term-key">exit</span> return to visual interface`,
  about: `<div class="terminal-table"><span>name</span><strong>Ritesh Kumar Singh</strong><span>role</span><strong>Software Engineer II @ Microsoft</strong><span>mission</span><strong>Build reliable systems that scale</strong><span>experience</span><strong>10+ years</strong><span>focus</span><strong>Azure Compute · distributed systems · backend platforms · applied AI</strong></div>`,
  experience: `<div class="terminal-table"><span>2024—now</span><strong>Microsoft · Software Engineer II</strong><span>2023—2024</span><strong>Agoda · Backend Engineer</strong><span>2021—2023</span><strong>Microsoft · Software Engineer</strong><span>2021</span><strong>Postman · Software Engineer Intern</strong><span>2021</span><strong>Microsoft · Software Engineer Intern</strong><span>2016—2019</span><strong>TCS · Software Developer</strong><span>2015—2016</span><strong>Keysight · Product Developer</strong></div>
Type <code>goto experience</code> for the complete commit history.`,
  skills: `<div class="terminal-table"><span>cloud</span><strong>Azure · Kubernetes · Docker · Microservices</strong><span>backend</span><strong>C# · .NET · Scala · Python · Reactive systems</strong><span>data</span><strong>Kafka · Redis · dynamic caching</strong><span>frontend</span><strong>React · JavaScript</strong><span>quality</span><strong>Functional testing · Cucumber · Mockito · CI/CD</strong><span>intelligence</span><strong>Machine Learning · NLP · Deep Learning · TensorFlow</strong></div>`,
  projects: `<span class="term-key">Logifier</span> AWS Elastic Beanstalk log aggregation and search
<span class="term-key">CoWin Hawk</span> vaccination-slot monitoring and SMS notification platform
<span class="term-key">US 11,386,897</span> key-term and synonym extraction patent
Type <code>goto projects</code> to inspect project modules.`,
  education: `<div class="terminal-table"><span>M.Tech CS</span><strong>BITS Pilani, Hyderabad · CGPA 8.52</strong><span>B.Tech CS</span><strong>Netaji Subhash Engineering College · CGPA 8.75</strong></div>`,
  contact: `<span class="term-key">email</span> <a href="mailto:ritesh.kumar465@gmail.com">ritesh.kumar465@gmail.com</a>
<span class="term-key">github</span> <a href="https://github.com/RiteshKSingh1709" target="_blank" rel="noreferrer">github.com/RiteshKSingh1709</a>
<span class="term-key">linkedin</span> <a href="https://www.linkedin.com/in/ritesh-kumar-singh-38a24ab8" target="_blank" rel="noreferrer">linkedin.com/in/ritesh-kumar-singh-38a24ab8</a>`,
  whoami: `ritesh — engineer, system thinker, mentor, and lifelong debugger.`,
  status: `<span class="term-key">azure_compute</span> ● operational
<span class="term-key">reliability_engine</span> ● operational
<span class="term-key">learning_mode</span> ● always on
<span class="term-key">coffee_buffer</span> ● adequately provisioned`,
};

let terminalHistory = [];
let historyIndex = 0;
const escapeHTML = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
})[character]);

const openTerminal = () => {
  terminalMode.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => terminalInput.focus());
};

const closeTerminal = () => {
  terminalMode.hidden = true;
  document.body.style.overflow = "";
};

const appendTerminalLine = (command, response, isError = false) => {
  const line = document.createElement("div");
  line.className = "terminal-line";
  const entered = document.createElement("div");
  entered.className = "entered-command";
  entered.textContent = command;
  const result = document.createElement("div");
  result.className = `terminal-response${isError ? " error" : ""}`;
  result.innerHTML = response;
  line.append(entered, result);
  terminalOutput.append(line);
  terminalBody.scrollTop = terminalBody.scrollHeight;
};

const runTerminalCommand = (rawCommand) => {
  const command = rawCommand.trim();
  const [name, ...args] = command.toLowerCase().split(/\s+/);
  if (!command) return;
  terminalHistory.push(command);
  historyIndex = terminalHistory.length;

  if (name === "clear") {
    terminalOutput.innerHTML = "";
    return;
  }
  if (name === "exit" || name === "quit") {
    appendTerminalLine(command, "Closing terminal session…");
    setTimeout(closeTerminal, 280);
    return;
  }
  if (name === "theme") {
    themeToggle.click();
    appendTerminalLine(command, `Interface theme changed to <code>${root.dataset.theme}</code>.`);
    return;
  }
  if (name === "resume") {
    appendTerminalLine(command, "Opening ATS-compatible print pipeline…");
    setTimeout(() => window.print(), 250);
    return;
  }
  if (name === "goto") {
    const target = args[0] === "skills" ? "expertise" : args[0];
    const section = document.querySelector(`#${target}`);
    if (!section) {
      appendTerminalLine(command, `Unknown route: <code>${escapeHTML(args[0] || "(missing)")}</code>. Try <code>goto experience</code>.`, true);
      return;
    }
    appendTerminalLine(command, `Routing to <code>/${target}</code>…`);
    setTimeout(() => {
      closeTerminal();
      section.scrollIntoView({ behavior: "smooth" });
    }, 320);
    return;
  }

  const response = terminalCommands[name];
  appendTerminalLine(
    command,
    response || `Command not found: <code>${escapeHTML(name)}</code>. Type <code>help</code> for available commands.`,
    !response
  );
};

terminalTrigger.addEventListener("click", openTerminal);
terminalClose.addEventListener("click", closeTerminal);
terminalMode.addEventListener("click", (event) => {
  if (event.target === terminalMode) closeTerminal();
});
terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runTerminalCommand(terminalInput.value);
  terminalInput.value = "";
});
terminalInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    terminalInput.value = terminalHistory[historyIndex] || "";
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    historyIndex = Math.min(terminalHistory.length, historyIndex + 1);
    terminalInput.value = terminalHistory[historyIndex] || "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "`" && terminalMode.hidden && commandPalette.hidden && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    openTerminal();
  }
  if (event.key === "Escape" && !terminalMode.hidden) closeTerminal();
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
