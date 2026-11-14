const form = document.querySelector(".setupModal")
const saveBtn = document.getElementById("saveInfo");
const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const setupModalContainer = document.querySelector(".setupModalContainer");

function disableBtn() {
  saveBtn.disabled =
    nameInput.value.length === 0 || roleInput.value.length === 0;
}

nameInput.addEventListener("input", disableBtn);
roleInput.addEventListener("input", disableBtn);
disableBtn(); // Initial check on page load

async function showModalSetup() {
  const info = await chrome.storage.local.get({
    username: nameInput.value,
    role: roleInput.value,
  });

  if (info.username === "" || info.role === "") {
    return;
  } else {
    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");

    userName.innerText = info.username;
    userRole.innerText = info.role;

    return (setupModalContainer.style.display = "none");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  try {
    await chrome.storage.local.set({
      username: nameInput.value,
      role: roleInput.value,
    });

    showModalSetup();
  } catch (err) {
    console.log(err);
  }
});

showModalSetup();
