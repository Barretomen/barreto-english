const body = document.body;
const modeToggle = document.getElementById("modeToggle");
const overlay = document.getElementById("transitionOverlay");
const typedCommand = document.getElementById("typedCommand");
const bootLogs = document.getElementById("bootLogs");
const bootProgress = document.getElementById("bootProgress");
const syntaxChallenge = document.getElementById("syntaxChallenge");
const syntaxInput = document.getElementById("syntaxInput");
const compileButton = document.getElementById("compileButton");
const syntaxFeedback = document.getElementById("syntaxFeedback");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let resolveSyntaxChallenge;
let failedAttempts = 0;

function updateModeText(isDev) {
  document.querySelectorAll("[data-general][data-dev]").forEach((element) => {
    element.textContent = isDev ? element.dataset.dev : element.dataset.general;
  });
  modeToggle.setAttribute("aria-pressed", String(isDev));
  document.title = isDev
    ? "Barreto English // English for Developers"
    : "Barreto English — inglês para a vida real";
}

async function typeText(text, target, speed = 30) {
  target.textContent = "";
  for (const character of text) {
    target.textContent += character;
    await wait(speed);
  }
}

function appendLog(message, type = "ok") {
  const line = document.createElement("p");
  line.className = type;
  line.textContent = message;
  bootLogs.appendChild(line);
}

function prepareSyntaxChallenge() {
  failedAttempts = 0;
  syntaxInput.value = "";
  syntaxInput.classList.remove("valid", "invalid");
  syntaxFeedback.className = "syntax-feedback";
  syntaxFeedback.textContent = "Resposta: ; (ponto e vírgula). Coloque esse símbolo no campo da linha 3.";
  syntaxChallenge.hidden = false;
  overlay.classList.add("awaiting-fix");
  window.setTimeout(() => syntaxInput.focus(), 80);
  return new Promise((resolve) => {
    resolveSyntaxChallenge = resolve;
  });
}

function validateSyntax() {
  if (syntaxInput.value.trim() === ";") {
    syntaxInput.classList.remove("invalid");
    syntaxInput.classList.add("valid");
    syntaxFeedback.className = "syntax-feedback success";
    syntaxFeedback.textContent = "✓ Código corrigido. Agora vai compilar!";
    compileButton.disabled = true;
    window.setTimeout(() => resolveSyntaxChallenge?.(), 650);
    return;
  }

  failedAttempts += 1;
  syntaxInput.classList.remove("invalid");
  void syntaxInput.offsetWidth;
  syntaxInput.classList.add("invalid");
  syntaxFeedback.className = "syntax-feedback error";
  syntaxFeedback.textContent = failedAttempts >= 2
    ? "Copie somente este símbolo para o campo: ;"
    : "Ainda não compilou. Digite ; — o ponto e vírgula que a mensagem dizia estar 'expected'.";
  syntaxInput.focus();
  syntaxInput.select();
}

compileButton?.addEventListener("click", validateSyntax);
syntaxInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") validateSyntax();
});

async function runModeTransition() {
  if (body.classList.contains("transition-busy")) return;

  const activatingDev = !body.classList.contains("dev-mode");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const command = activatingDev
    ? "javac DeveloperMode.java && java DeveloperMode"
    : "java BarretoEnglish --restore general-mode";

  body.classList.add("transition-busy");
  overlay.classList.toggle("returning", !activatingDev);
  overlay.querySelector(".glitch-word").textContent = activatingDev ? "DEV MODE" : "GENERAL MODE";
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  bootLogs.innerHTML = "";
  bootProgress.style.width = "0";
  syntaxChallenge.hidden = true;
  compileButton.disabled = false;

  if (reducedMotion) typedCommand.textContent = command;
  else await typeText(command, typedCommand);

  if (activatingDev) {
    await wait(reducedMotion ? 30 : 240);
    appendLog("DeveloperMode.java:3: error: ';' expected", "error");
    appendLog("1 error — compilation failed", "error");
    bootProgress.style.width = "22%";
    await prepareSyntaxChallenge();
    overlay.classList.remove("awaiting-fix");
    appendLog("[OK] Código compilado com sucesso.");
    appendLog("[OK] Carregando experiência para desenvolvedores...");
    bootProgress.style.width = "100%";
    await wait(reducedMotion ? 80 : 520);
  } else {
    const logs = ["[OK] Salvando preferências...", "[OK] Restaurando experiência principal...", "[OK] General mode ready."];
    for (let index = 0; index < logs.length; index += 1) {
      appendLog(logs[index]);
      bootProgress.style.width = `${(index + 1) * 33.34}%`;
      await wait(reducedMotion ? 30 : 220);
    }
  }

  if (!reducedMotion) {
    body.classList.add("site-transforming");
    overlay.classList.add("glitching");
    await wait(680);
  }

  body.classList.toggle("dev-mode", activatingDev);
  updateModeText(activatingDev);
  sessionStorage.setItem("barretoMode", activatingDev ? "dev" : "general");
  body.classList.add("flash");
  body.classList.remove("site-transforming");
  overlay.classList.remove("active", "glitching", "returning", "awaiting-fix");
  overlay.setAttribute("aria-hidden", "true");
  await wait(380);
  body.classList.remove("flash", "transition-busy");
}

modeToggle?.addEventListener("click", runModeTransition);

const savedMode = sessionStorage.getItem("barretoMode") === "dev";
if (savedMode) body.classList.add("dev-mode");
updateModeText(savedMode);

let englishVoices = [];

function refreshVoices() {
  if (!("speechSynthesis" in window)) return;
  englishVoices = speechSynthesis.getVoices().filter((voice) => /^en[-_]/i.test(voice.lang));
}

function voiceScore(voice) {
  const name = voice.name.toLowerCase();
  let score = /^en[-_]us/i.test(voice.lang) ? 40 : 0;
  if (/natural|neural|online/.test(name)) score += 100;
  if (/aria|jenny|guy|samantha|alex/.test(name)) score += 70;
  if (/microsoft|google|apple/.test(name)) score += 30;
  if (voice.default) score += 5;
  return score;
}

refreshVoices();
if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", refreshVoices);

function speak(text, button) {
  if (!("speechSynthesis" in window)) {
    alert("Seu navegador não oferece áudio de pronúncia.");
    return;
  }

  refreshVoices();
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = [...englishVoices].sort((a, b) => voiceScore(b) - voiceScore(a))[0];
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.lang = selectedVoice?.lang || "en-US";
  utterance.rate = 0.82;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.onstart = () => button?.classList.add("playing");
  utterance.onend = utterance.onerror = () => button?.classList.remove("playing");
  speechSynthesis.speak(utterance);
}

const speakHero = document.getElementById("speakHero");
const speakDaily = document.getElementById("speakDaily");
speakHero?.addEventListener("click", () => speak("I'll figure it out.", speakHero));
speakDaily?.addEventListener("click", () => speak("I'll figure it out.", speakDaily));

const revealButton = document.getElementById("revealAnswer");
const miniAnswer = document.getElementById("miniAnswer");
revealButton?.addEventListener("click", () => {
  miniAnswer.hidden = !miniAnswer.hidden;
  revealButton.textContent = miniAnswer.hidden
    ? (body.classList.contains("dev-mode") ? "runTest()" : "Ver resposta")
    : (body.classList.contains("dev-mode") ? "hideResult()" : "Ocultar resposta");
});

const interests = document.querySelectorAll(".interest");
interests.forEach((button) => button.addEventListener("click", () => {
  interests.forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-pressed", "false");
  });
  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");
}));

document.getElementById("newsletterForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const interest = document.querySelector(".interest.active")?.textContent.trim() || "Inglês geral";
  const subscribers = JSON.parse(localStorage.getItem("barreto_subscribers") || "[]");
  subscribers.push({ name, email, interest, createdAt: new Date().toISOString() });
  localStorage.setItem("barreto_subscribers", JSON.stringify(subscribers));
  document.getElementById("newsletterMessage").textContent = body.classList.contains("dev-mode")
    ? `> subscribed ✓ ${name || "user"} // ${interest}`
    : `Tudo certo, ${name || "você"}! Interesse: ${interest}.`;
  event.target.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
