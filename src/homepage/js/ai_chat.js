import { marked } from "../../public/libs/marked.esm.js";

const promptInput = document.getElementById("promptInput");
const chatContainer = document.querySelector(".chat");
const sendPrompt = document.querySelector("#sendPrompt");

async function aiResponseAndDisplay() {
  try {
    const prompt = promptInput.value.trim();
    promptInput.value = "";

    if (prompt.length === 0) return;

    chatContainer.innerHTML +=
      '<div class="loading">Thinking<div class="loadingDot"></div><div class="loadingDot"></div><div class="loadingDot"></div></div>';

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
    <div class="prompt">${prompt}</div>
    <div class="response">${htmlResponse}</div>
    `;

    chatContainer.scrollTop = chatContainer.scrollHeight;

    hljs.highlightAll();
  } catch (error) {
    console.log(error);
  }
}

promptInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") await aiResponseAndDisplay();
});

sendPrompt.addEventListener("click", async (e) => {
  await aiResponseAndDisplay();
});
