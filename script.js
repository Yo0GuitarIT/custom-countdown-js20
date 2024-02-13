const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateElement = document.getElementById("date-picker");

const countdownElement = document.getElementById("countdown");
const countdownTitleElement = document.getElementById("countdown-title");
const countdownButton = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeElement = document.getElementById("complete");
const completeElementInfo = document.getElementById("complete-info");
const completeButton = document.getElementById("complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let saveCountdown;

const second = 1000; // 10000 milesecond = 1 second
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input min with Today'Date
const today = new Date().toISOString().split("T")[0];
dateElement.setAttribute("min", today);

// Populate Countdown / Complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // Hide input
    inputContainer.hidden = true;

    // if the countdown has ended, show complete
    if (distance < 0) {
      countdownElement.hidden = true;
      clearInterval(countdownActive);
      completeElementInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeElement.hidden = false;
    } else {
      //Else, show the countdown in progress

      // Populate Countdown
      countdownTitleElement.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;

      completeElement.hidden = true;

      // Show countdown
      countdownElement.hidden = false;
    }
  }, second);
}

// Take Values from Form Input
function updateCountdown(event) {
  event.preventDefault();
  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;
  saveCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem("countdown", JSON.stringify(saveCountdown));

  // Check the valid date
  if (countdownDate === "") {
    alert("Please select a date for the countdown.");
  } else {
    // Get nember version of current Date, UpdateDOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Reset All Values
function reset() {
  // Hide Countdowns, Show Input
  countdownElement.hidden = true;
  completeElement.hidden = true;
  inputContainer.hidden = false;
  // Stop the countdown
  clearInterval(countdownActive);
  // Reset Values;
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

function restorePreviousCountdown() {
  //Get coundown form localStorage if available
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    saveCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = saveCountdown.title;
    countdownDate = saveCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownButton.addEventListener("click", reset);
completeButton.addEventListener("click", reset);

// Onload Check localStorage
restorePreviousCountdown();
