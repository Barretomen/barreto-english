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
const flashbang = document.getElementById("flashbang");
const welcomeDev = document.getElementById("welcomeDev");

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

  if (activatingDev) {
    welcomeDev.classList.add("active");
    welcomeDev.setAttribute("aria-hidden", "false");
    if (!reducedMotion) {
      flashbang.classList.remove("burst");
      void flashbang.offsetWidth;
      flashbang.classList.add("burst");
    }
  }

  body.classList.toggle("dev-mode", activatingDev);
  updateModeText(activatingDev);
  sessionStorage.setItem("barretoMode", activatingDev ? "dev" : "general");
  body.classList.remove("site-transforming");
  overlay.classList.remove("active", "glitching", "returning", "awaiting-fix");
  overlay.setAttribute("aria-hidden", "true");

  if (activatingDev) {
    await wait(reducedMotion ? 700 : 2800);
    welcomeDev.classList.remove("active");
    welcomeDev.setAttribute("aria-hidden", "true");
    flashbang.classList.remove("burst");
  } else {
    await wait(380);
  }
  body.classList.remove("transition-busy");
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

// Interactive Developer Lab
const taskKeys = ["debugger", "standup", "pullrequest", "commit", "bugreport", "docs", "interview"];
const taskFiles = {
  debugger: "english-debugger.js",
  standup: "standup-builder.ts",
  pullrequest: "pull-request.diff",
  commit: "commit-message.git",
  bugreport: "bug-report.md",
  docs: "read-the-docs.md",
  interview: "interview.json"
};

let devLabState = {};
try {
  devLabState = JSON.parse(localStorage.getItem("barreto_dev_lab") || "{}");
} catch {
  devLabState = {};
}

const devProgressBar = document.getElementById("devProgressBar");
const devProgressText = document.getElementById("devProgressText");
const completedCount = document.getElementById("completedCount");
const deployButton = document.getElementById("deployEnglish");
const deployCard = document.querySelector(".deploy-card");
const deployTitle = document.getElementById("deployTitle");
const deployDescription = document.getElementById("deployDescription");

function completedTasks() {
  return taskKeys.filter((key) => devLabState[key]).length;
}

function updateLabProgress() {
  const count = completedTasks();
  const progress = Math.round((count / taskKeys.length) * 100);
  devProgressBar.style.width = `${progress}%`;
  devProgressText.textContent = `${progress}%`;
  completedCount.textContent = count;
  document.querySelectorAll("[data-task-status]").forEach((indicator) => {
    indicator.classList.toggle("done", Boolean(devLabState[indicator.dataset.taskStatus]));
  });
  const ready = count === taskKeys.length;
  deployButton.disabled = !ready;
  deployButton.classList.toggle("ready", ready);
  if (devLabState.deployed && ready) {
    deployCard.classList.add("deployed");
    deployTitle.textContent = "English build successful.";
    deployDescription.textContent = "All tests passed. Your communication is ready for the next release.";
    deployButton.textContent = "deployed ✓";
  } else if (ready) {
    deployTitle.textContent = "All tests passed. Ready to deploy.";
    deployDescription.textContent = "Você concluiu todas as missões do English Dev Lab.";
  }
}

function completeTask(task) {
  if (!devLabState[task]) {
    devLabState[task] = true;
    localStorage.setItem("barreto_dev_lab", JSON.stringify(devLabState));
    updateLabProgress();
  }
}

function activateLabPanel(name, shouldScroll = false) {
  if (!taskFiles[name]) return false;
  document.querySelectorAll(".lab-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.labTarget === name));
  document.querySelectorAll(".lab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.labPanel === name));
  document.getElementById("activeFileName").textContent = taskFiles[name];
  if (shouldScroll) document.querySelector(".lab-workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

document.querySelectorAll(".lab-tab").forEach((tab) => tab.addEventListener("click", () => activateLabPanel(tab.dataset.labTarget)));

document.querySelectorAll("[data-debug-choice]").forEach((choice) => choice.addEventListener("click", () => {
  document.querySelectorAll("[data-debug-choice]").forEach((button) => button.classList.remove("selected"));
  choice.classList.add("selected");
  const correct = choice.dataset.debugChoice === "correct";
  const feedback = document.getElementById("debugFeedback");
  feedback.className = `module-feedback ${correct ? "success" : "error"}`;
  feedback.textContent = correct ? "✓ Bug fixed. Essa é a forma natural de fazer uma pergunta." : "Ainda há um bug: esta frase é uma tradução literal comum do português.";
  document.getElementById("debugExplanation").hidden = !correct;
  if (correct) completeTask("debugger");
}));

function ensureSentence(text) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const sentence = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

function withSubject(text, prefix) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /^(I|We|The|It|My)\b/i.test(trimmed) ? ensureSentence(trimmed) : ensureSentence(`${prefix} ${trimmed}`);
}

const standupOutput = document.getElementById("standupOutput");
document.getElementById("buildStandup")?.addEventListener("click", () => {
  const yesterday = document.getElementById("standupYesterday").value;
  const today = document.getElementById("standupToday").value;
  const blocker = document.getElementById("standupBlocker").value;
  if (!yesterday.trim() || !today.trim()) {
    standupOutput.hidden = false;
    standupOutput.querySelector("p").textContent = "Preencha pelo menos Yesterday e Today para gerar sua atualização.";
    return;
  }
  const todayPrefix = /^(working|finishing|reviewing|building|fixing|testing)\b/i.test(today.trim()) ? "I'm" : "I'm going to";
  const parts = [
    `Yesterday, ${withSubject(yesterday, "I")}`,
    `Today, ${withSubject(today, todayPrefix)}`,
    blocker.trim() ? `I'm currently blocked by ${ensureSentence(blocker).replace(/\.$/, "")}.` : "I don't have any blockers."
  ];
  standupOutput.hidden = false;
  standupOutput.querySelector("p").textContent = parts.join(" ");
  completeTask("standup");
});

function setupChoiceTask(selector, dataKey, stateKey, feedbackId, successMessage, errorMessage) {
  document.querySelectorAll(selector).forEach((choice) => choice.addEventListener("click", () => {
    document.querySelectorAll(selector).forEach((button) => button.classList.remove("correct-choice", "wrong-choice"));
    const correct = choice.dataset[`${dataKey}Choice`] === "correct";
    choice.classList.add(correct ? "correct-choice" : "wrong-choice");
    const feedback = document.getElementById(feedbackId);
    feedback.className = `module-feedback ${correct ? "success" : "error"}`;
    feedback.textContent = correct ? successMessage : errorMessage;
    if (correct) completeTask(stateKey);
  }));
}

setupChoiceTask("[data-pr-choice]", "pr", "pullrequest", "prFeedback", "✓ Approved. “Could we...” transforma uma crítica em uma sugestão colaborativa.", "Request changes: a frase é direta demais e pode soar agressiva.");
setupChoiceTask("[data-commit-choice]", "commit", "commit", "commitFeedback", "✓ Commit accepted. Use o imperativo: Fix, Add, Remove, Update.", "Esse formato não segue a convenção mais comum de mensagens de commit.");
setupChoiceTask("[data-docs-choice]", "docs", "docs", "docsFeedback", "✓ Correto. Deprecated significa que ainda pode existir, mas não é mais recomendado.", "Leia a última frase novamente: o método será removido na próxima versão.");

document.getElementById("generateBugReport")?.addEventListener("click", () => {
  const expected = document.getElementById("expectedBehavior").value.trim();
  const actual = document.getElementById("actualBehavior").value.trim();
  const condition = document.getElementById("bugCondition").value.trim();
  const output = document.getElementById("bugReportOutput");
  output.hidden = false;
  if (!expected || !actual) {
    output.querySelector("pre").textContent = "Expected behavior e Actual behavior são obrigatórios.";
    return;
  }
  output.querySelector("pre").textContent = `## Expected behavior\n${ensureSentence(expected)}\n\n## Actual behavior\n${ensureSentence(actual)}${condition ? `\n\n## Steps / condition\n${ensureSentence(condition)}` : ""}`;
  completeTask("bugreport");
});

document.getElementById("buildInterview")?.addEventListener("click", () => {
  const fieldIds = ["interviewContext", "interviewChallenge", "interviewAction", "interviewResult"];
  const values = fieldIds.map((id) => document.getElementById(id).value.trim());
  const output = document.getElementById("interviewOutput");
  output.hidden = false;
  if (values.some((value) => !value)) {
    output.querySelector("p").textContent = "Preencha os quatro blocos para construir uma resposta completa.";
    return;
  }
  output.querySelector("p").textContent = values.map(ensureSentence).join(" ");
  completeTask("interview");
});

document.querySelectorAll("[data-copy-target]").forEach((button) => button.addEventListener("click", async () => {
  const target = document.getElementById(button.dataset.copyTarget);
  const text = target?.querySelector("p, pre")?.textContent || "";
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const previous = button.textContent;
    button.textContent = "copied ✓";
    window.setTimeout(() => { button.textContent = previous; }, 1200);
  } catch {
    button.textContent = "select & copy";
  }
}));

document.querySelectorAll("[data-speak]").forEach((button) => button.addEventListener("click", () => speak(button.dataset.speak, button)));
document.getElementById("speakStandup")?.addEventListener("click", (event) => speak(standupOutput.querySelector("p").textContent, event.currentTarget));
document.getElementById("speakInterview")?.addEventListener("click", (event) => speak(document.querySelector("#interviewOutput p").textContent, event.currentTarget));

const terminalOutput = document.getElementById("terminalOutput");
function terminalPrint(message, className = "") {
  const line = document.createElement("p");
  line.className = className;
  line.textContent = message;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

const commandTargets = { lesson: "debugger", debug: "debugger", standup: "standup", pr: "pullrequest", commit: "commit", bug: "bugreport", docs: "docs", interview: "interview" };
document.getElementById("terminalForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("terminalInput");
  const command = input.value.trim().toLowerCase();
  if (!command) return;
  terminalPrint(`barreto@english:~/dev-lab$ ${command}`);
  input.value = "";
  if (command === "help") {
    terminalPrint("Commands: debug · standup · pr · commit · bug · docs · interview · progress · deploy · clear · exit");
  } else if (commandTargets[command]) {
    activateLabPanel(commandTargets[command], true);
    terminalPrint(`Opened ${taskFiles[commandTargets[command]]}`, "terminal-success");
  } else if (command === "progress") {
    terminalPrint(`${completedTasks()}/7 tests passed — build at ${Math.round((completedTasks() / 7) * 100)}%`, "terminal-success");
  } else if (command === "deploy") {
    if (!deployButton.disabled) deployButton.click();
    else terminalPrint(`Build failed: ${7 - completedTasks()} mission(s) remaining.`, "terminal-error");
  } else if (command === "clear") {
    terminalOutput.innerHTML = "";
  } else if (command === "exit") {
    terminalPrint("Restoring general mode...", "terminal-success");
    window.setTimeout(() => modeToggle.click(), 350);
  } else {
    terminalPrint(`command not found: ${command}. Type help.`, "terminal-error");
  }
});

deployButton?.addEventListener("click", () => {
  if (deployButton.disabled) return;
  devLabState.deployed = true;
  localStorage.setItem("barreto_dev_lab", JSON.stringify(devLabState));
  deployCard.classList.add("deployed");
  deployTitle.textContent = "English build successful.";
  deployDescription.textContent = "All tests passed. Your communication is ready for the next release.";
  deployButton.textContent = "deployed ✓";
  terminalPrint("Deploy complete: your English is ready to ship.", "terminal-success");
});

updateLabProgress();

// General English placement test
const placementForm = document.getElementById("placementForm");
const quizSteps = [...document.querySelectorAll(".quiz-step")];
const quizCounter = document.getElementById("quizCounter");
const quizDifficulty = document.getElementById("quizDifficulty");
const quizProgress = document.getElementById("quizProgress");
const quizWarning = document.getElementById("quizWarning");
const quizBack = document.getElementById("quizBack");
const quizNext = document.getElementById("quizNext");
const quizResult = document.getElementById("quizResult");
const quizRestart = document.getElementById("quizRestart");
let currentQuizStep = 0;

const levelProfiles = {
  A1: { title: "Iniciante", description: "Você reconhece estruturas essenciais. O melhor próximo passo é construir uma base segura para se apresentar e formar frases simples.", material: "output/pdf/general-01-primeiras-conversas-a1.pdf" },
  A2: { title: "Básico", description: "Você já entende situações comuns. Agora vale ampliar frases sobre rotina, perguntas e experiências do dia a dia.", material: "output/pdf/general-02-rotina-presente-simples-a1-a2.pdf" },
  B1: { title: "Intermediário", description: "Você consegue lidar com muitos contextos conhecidos. Pratique para falar com mais continuidade, precisão e naturalidade.", material: "output/pdf/general-03-situacoes-reais-a2.pdf" },
  B2: { title: "Intermediário superior", description: "Você tem boa autonomia e já compreende estruturas mais complexas. Foque em nuance, fluidez e vocabulário ativo.", material: "output/pdf/general-03-situacoes-reais-a2.pdf" },
  C1: { title: "Avançado", description: "Você demonstra ótimo controle do idioma. Seu próximo salto vem de precisão, repertório e comunicação em contextos exigentes.", material: "output/pdf/general-03-situacoes-reais-a2.pdf" },
  C2: { title: "Proficiente", description: "Você acertou todos os pontos deste teste curto. Procure uma avaliação completa para confirmar domínio e trabalhar nuances finas.", material: "output/pdf/general-03-situacoes-reais-a2.pdf" }
};

function levelForScore(score) {
  if (score <= 2) return "A1";
  if (score <= 4) return "A2";
  if (score <= 6) return "B1";
  if (score === 7) return "B2";
  if (score <= 9) return "C1";
  return "C2";
}

function renderQuizStep() {
  quizSteps.forEach((step, index) => step.classList.toggle("active", index === currentQuizStep));
  quizCounter.textContent = `PERGUNTA ${currentQuizStep + 1} DE ${quizSteps.length}`;
  quizDifficulty.textContent = currentQuizStep < 2 ? "NÍVEL ESSENCIAL" : currentQuizStep < 4 ? "NÍVEL BÁSICO" : currentQuizStep < 6 ? "NÍVEL INTERMEDIÁRIO" : currentQuizStep < 8 ? "INTERMEDIÁRIO SUPERIOR" : "DESAFIO AVANÇADO";
  quizProgress.style.width = `${((currentQuizStep + 1) / quizSteps.length) * 100}%`;
  quizBack.disabled = currentQuizStep === 0;
  quizNext.textContent = currentQuizStep === quizSteps.length - 1 ? "Ver meu nível →" : "Próxima →";
  quizWarning.textContent = "";
}

function finishPlacementTest() {
  const data = new FormData(placementForm);
  const score = quizSteps.reduce((total, _, index) => total + Number(data.get(`q${index}`) || 0), 0);
  const level = levelForScore(score);
  const profile = levelProfiles[level];
  placementForm.hidden = true;
  document.querySelector("#placementQuiz .quiz-top").hidden = true;
  document.querySelector("#placementQuiz .quiz-progress").hidden = true;
  quizResult.hidden = false;
  document.getElementById("resultLevel").textContent = level;
  document.getElementById("resultTitle").textContent = profile.title;
  document.getElementById("resultDescription").textContent = profile.description;
  document.getElementById("resultScore").textContent = `${score} de ${quizSteps.length} respostas corretas · estimativa CEFR`;
  document.getElementById("resultMaterial").href = profile.material;
  document.querySelectorAll("[data-cefr]").forEach((item) => item.classList.toggle("highlight", item.dataset.cefr === level));
}

quizNext?.addEventListener("click", () => {
  const selected = placementForm.querySelector(`input[name="q${currentQuizStep}"]:checked`);
  if (!selected) {
    quizWarning.textContent = "Escolha uma resposta para continuar.";
    return;
  }
  if (currentQuizStep === quizSteps.length - 1) finishPlacementTest();
  else {
    currentQuizStep += 1;
    renderQuizStep();
  }
});

quizBack?.addEventListener("click", () => {
  if (currentQuizStep > 0) {
    currentQuizStep -= 1;
    renderQuizStep();
  }
});

quizRestart?.addEventListener("click", () => {
  placementForm.reset();
  placementForm.hidden = false;
  document.querySelector("#placementQuiz .quiz-top").hidden = false;
  document.querySelector("#placementQuiz .quiz-progress").hidden = false;
  quizResult.hidden = true;
  currentQuizStep = 0;
  document.querySelectorAll("[data-cefr]").forEach((item) => item.classList.remove("highlight"));
  renderQuizStep();
});

if (placementForm) renderQuizStep();

const kiwifyProductLink = document.getElementById("kiwifyProductLink");
kiwifyProductLink?.addEventListener("click", (event) => {
  const productUrl = kiwifyProductLink.dataset.kiwifyUrl?.trim();
  if (productUrl) {
    event.preventDefault();
    window.location.href = productUrl;
  }
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
