import { marked } from "../../public/libs/marked.esm.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const promptInput = document.getElementById("promptInput");
const chatContainer = document.querySelector(".chat");
const sendPrompt = document.querySelector("#sendPrompt");
let isSending = false;

if (chatContainer.childNodes.length < 1) {
  const suggestions = [
    "Project idea",
    "Explain",
    "Summarize",
    "Translate",
    "Generate code",
  ];
  const suggestionElements = [];

  suggestions.forEach((sug) => {
    const el = document.createElement("button");
    el.textContent = sug;

    suggestionElements.push(el);
  });

  chatContainer.innerHTML = `
    <div class="empty_state">
      <h1>
        What can I help you with today ?
      </h1>
      <div class="suggestions"></div>
    </div>
  `;

  chatContainer.querySelector(".suggestions").append(...suggestionElements);
}

async function aiResponseAndDisplay() {
  isSending = true;

  try {
    const empty_state = document.querySelector(".empty_state");

    if (empty_state) {
      chatContainer.style.opacity = 0;

      await wait(500);
      empty_state.remove();

      chatContainer.style.opacity = 1;
      await wait(500);
    }

    const prompt = promptInput.value.trim();
    promptInput.value = "";

    if (prompt.length === 0) return;

    chatContainer.innerHTML += `<div class="prompt">${prompt}</div><div class="loading">Thinking<div class="loadingDot"></div><div class="loadingDot"></div><div class="loadingDot"></div></div>`;

    chatContainer.querySelector(".loading").scrollIntoView();

    const response = await fetch(
      "https://devtoolbox-api.devtoolbox-api.workers.dev/ai/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      },
    );

    if (!response.ok) {
      alert("Something went wrong, please try again later");
    }

    const data = await response.json();

    const aiResponse = data.response;

    const loadingElement = chatContainer.querySelector(".loading");

    if (loadingElement) loadingElement.remove();

    const htmlResponse = marked.parse(aiResponse);

    chatContainer.innerHTML += `
    <div class="response">${htmlResponse}</div>
    `;

    chatContainer
      .querySelector(".response:last-child")
      .querySelectorAll("pre")
      .forEach((pre) => {
        const copyButton = document.createElement("button");
        copyButton.className = "copy-btn";
        copyButton.innerHTML = "<img src='../public/icons/copy.svg' />";

        pre.appendChild(copyButton);
      });

    chatContainer.querySelectorAll("a").forEach((link) => {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;

    hljs.highlightAll();
  } catch (error) {
    console.log(error);
  } finally {
    isSending = false;
  }
}

promptInput.addEventListener("keydown", async (e) => {
  if (isSending) return;

  if (e.key === "Enter") await aiResponseAndDisplay();
});

sendPrompt.addEventListener("click", async (e) => {
  if (isSending) return;

  await aiResponseAndDisplay();
});

chatContainer.addEventListener("click", async (e) => {
  const button = e.target.closest(".copy-btn");
  if (!button) return;

  const pre = button.closest("pre");
  const code = pre.querySelector("code").innerText;

  await navigator.clipboard.writeText(code);

  let copiedText = "Copied!";
  let currentChar = 0;
  button.innerHTML = "";

  const charAddInterval = setInterval(() => {
    if (currentChar === copiedText.length - 1) clearInterval(charAddInterval);
    button.innerHTML += copiedText[currentChar];
    currentChar++;
  }, 50);

  setTimeout(
    () => {
      button.innerHTML = "<img src='../public/icons/copy.svg' />";
    },
    50 * copiedText.length + 500,
  );
});

document.querySelectorAll(".suggestions button").forEach((chip) => {
  chip.addEventListener("click", () => {
    promptInput.value = chip.textContent + " ";
    promptInput.focus();
  });
});
