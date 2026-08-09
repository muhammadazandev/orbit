const { quickAccess = [] } = await chrome.storage.local.get("quickAccess")

const quickAccessContainer = document.querySelector(
  "main .left .quickAccessContainer",
);

document.addEventListener("error", (e) => {
  if (e.target.tagName === "IMG" && e.target.classList.contains("quickAccessLogo")) {    
    const img = e.target;
    const fallback = img.getAttribute('data-fallback');

    if (fallback) {
      img.src = fallback;
      img.removeAttribute('data-fallback'); 
    }
  }
}, true); 

quickAccess.forEach((ac) => {
  const logoName = ac.title ? ac.title.toLowerCase() : "default";
  
  const template = `
    <a href="${ac.url}" class="hoverAnimation">
    <img src="../public/logo/${logoName}.svg" data-fallback="${ac.favIconUrl}" class="quickAccessLogo" />
      <p>
        <span id="quickAccessTitle">${ac.name} - ${ac.title}</span>
        <span id="quickAccessURL">${ac.url}</span>
      </p>
    </a>
  `;
  
  quickAccessContainer.insertAdjacentHTML('beforeend', template);
});
