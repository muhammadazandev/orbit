const timeElement = document.getElementById("time");
const dateElements = Array.from(
  document.querySelectorAll("header .dateContainer div p span"),
);

function updateTime() {
  const now = new Date();
  const time = String(now.getMinutes()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");

  timeElement.innerText = `${hour}:${time}`;
}

updateTime();

const now = new Date();
const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

setTimeout(() => {
  updateTime();
  setInterval(updateTime, 60 * 1000);
}, delay);

dateElements.forEach((el) => {
  switch (el.id) {
    case "day":
      el.innerText = now.toLocaleDateString("en-US", {
        weekday: "long",
      });
      break;

    case "month":
      el.innerText = now.toLocaleDateString("en-US", {
        month: "long",
      });
      break;

    case "date":
      el.innerText = now.getDate();
      break;
  }
});
