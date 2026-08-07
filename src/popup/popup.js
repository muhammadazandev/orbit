const addCheckbox = document.getElementById("addCheckbox");

addCheckbox.addEventListener("change", async (e) => {
  if (e.target.checked) {
    const { quickAccess = [] } = await chrome.storage.local.get("quickAccess");
    const [tabs] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })

    console.log(tabs)

    
  }
});
