const addCheckbox = document.getElementById("addCheckbox");

async function updateCheckbox() {
  const { quickAccess = [] } = await chrome.storage.local.get("quickAccess");

  const [tabs] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })

  const alreadyExist = quickAccess.some((ac) => ac.url === tabs.url)

  addCheckbox.checked = alreadyExist;
}

updateCheckbox();

addCheckbox.addEventListener("change", async (e) => {
  const { quickAccess = [] } = await chrome.storage.local.get("quickAccess");

  const [tabs] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
  })

  if (e.target.checked) {
    const url = new URL(tabs.url).hostname;

    const alreadyExist = quickAccess.some((ac) => ac.url === tabs.url)

    if (alreadyExist) return;

    const splittedWords = url?.split(".")
    let targetName = splittedWords.at(-2);

    if (!targetName) {
      targetName = splittedWords.at(-1)
    }

    quickAccess.push({ name: targetName, url: tabs.url, favIconUrl: tabs.favIconUrl, title: tabs.title })

    await chrome.storage.local.set({ quickAccess })
  } else {
    const removeTab = quickAccess.filter((q) => q.url !== tabs.url)
    await chrome.storage.local.set({ quickAccess: removeTab })
  }
});