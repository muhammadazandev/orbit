const quickAccess = [
  {
    title: "YouTube",
    url: "https://youtube.com/",
  },
  {
    title: "GitHub",
    url: "https://github.com/",
  },
  {
    title: "ChatGPT",
    url: "https://chatgpt.com/",
  },
  {
    title: "Gmail",
    url: "https://gmail.com/",
  },
  {
    title: "Perplexity",
    url: "https://perplexity.com/",
  },
  {
    title: "Spotify",
    url: "https://spotify.com/",
  },
];

const quickAccessContainer = document.querySelector(
  "main .left .quickAccessContainer",
);

quickAccess.forEach((ac) => {
  quickAccessContainer.innerHTML += `
    <a href="${ac.url}" class="hoverAnimation">
      <img src="../public/logo/${ac.title.toLowerCase()}.svg" onerror="this.  onerror=null; this.src='../public/logo/global.svg'" />
    </a>
      `;
});
