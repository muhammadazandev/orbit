const subtractIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 11V13H19V11H5Z"></path></svg>'
const dragIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L16.2426 6.24264L14.8284 7.65685L12 4.82843L9.17157 7.65685L7.75736 6.24264L12 2ZM2 12L6.24264 7.75736L7.65685 9.17157L4.82843 12L7.65685 14.8284L6.24264 16.2426L2 12ZM22 12L17.7574 16.2426L16.3431 14.8284L19.1716 12L16.3431 9.17157L17.7574 7.75736L22 12ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM12 22L7.75736 17.7574L9.17157 16.3431L12 19.1716L14.8284 16.3431L16.2426 17.7574L12 22Z"></path></svg>'

let draggedElement = null;

function getDragAfterElement(container, mouseY) {
  const cards = container.querySelectorAll(".quickAccessItem:not(.dragging)")


  for (const card of cards) {
    const box = card.getBoundingClientRect();
    const cardMiddleY = box.top + box.height / 2

    if (mouseY < cardMiddleY) return card
  }

  return null;
}

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

quickAccess.forEach((ac, index) => {
  const logoName = ac.name?.toLowerCase() || "global";
  
  const template = `
    <div data-url="${ac.url}" data-item-index="${index}" class="hoverAnimation quickAccessItem" draggable="false">
    <img src="../public/logo/${logoName}.svg" data-fallback="${ac.favIconUrl}" class="quickAccessLogo" />
    <p>
      <span class="quickAccessTitle">${ac.name} - ${ac.title}</span>
      <span class="quickAccessURL">${ac.url}</span>
    </p>

    <div class="actionButtonsContainer">
      <button class="removeItem">
        ${subtractIcon}
      </button>
      <button class="moveItem" draggable="true">
        ${dragIcon}
      </button>
    </div>
    </div>
  `;
  
  quickAccessContainer.insertAdjacentHTML('beforeend', template);
});

const quickAccessItem = document.querySelectorAll(
  ".left .quickAccessContainer .quickAccessItem",
);
const quickAccessMoveButtons = document.querySelectorAll(".actionButtonsContainer .moveItem")

quickAccessMoveButtons.forEach(btn => {
  btn.addEventListener("mousedown", (e) => {
    const parentItem = e.target.closest(".quickAccessItem");
    if (parentItem) parentItem.setAttribute("draggable", "true");
  });
});

quickAccessItem.forEach(item => {
  item.addEventListener("dragstart", (e) => {
    draggedElement = item;
    item.classList.add("dragging");
    e.dataTransfer.setData('text/plain', item.getAttribute("data-item-index"));
  })

  item.addEventListener("dragend", (e) => {
    item.classList.remove("dragging")
    item.setAttribute("draggable", "false")
    draggedElement = null;
    
    const newOrder = Array.from(quickAccessContainer.children).map((child) => {
      const index = child.getAttribute("data-item-index");
      return quickAccess[index];
    });

    chrome.storage.local.set({ quickAccess: newOrder });
  })

  item.addEventListener("click", async (e) => {
    const removeButton = e.target.closest(".removeItem");
    const moveButton = e.target.closest(".moveItem");
    const url = item.dataset.url;

    if (removeButton) {
      const quickAccessItem = removeButton.closest(".quickAccessItem");
      quickAccessItem.remove();

      const { quickAccess = [] } = await chrome.storage.local.get("quickAccess");

      const removeTab = quickAccess.filter((q) => q.url !== url);
      await chrome.storage.local.set({ quickAccess: removeTab });

      return;
    } else if (moveButton) return;

    window.location.href = url;
  })
});

quickAccessContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!draggedElement) return;
  
  const afterElement = getDragAfterElement(quickAccessContainer, e.clientY);
    
  if (afterElement == null) {
    quickAccessContainer.appendChild(draggedElement);
  } else {
    quickAccessContainer.insertBefore(draggedElement, afterElement);
  }
})

quickAccessContainer.addEventListener("drop", (e) => {
  e.preventDefault();
})