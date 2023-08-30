import "core-js/stable";
import "regenerator-runtime/runtime";

// VARIABLES
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const formBtn = document.querySelector(".form__btn");
const yearsCalculation = document.getElementById("calculation-years");
const monthsCalculation = document.getElementById("calculation-months");
const daysCalculation = document.getElementById("calculation-days");

// EVENT LISTENER CALLBACK FUNCTION
function handleFormBtnClick(e) {
  const btn = e.target.closest(".form__btn");
  if (!btn) return;

  // Get user input
  const birthDay = parseInt(dayInput.value);
  const birthMonth = parseInt(monthInput.value) - 1;
  const birthYear = parseInt(yearInput.value);

  // Get current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Calculate age
  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;
  let days = currentDay - birthDay;

  // Adjust for negative months or days
  if (days < 0) {
    months--;
    const daysInPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Display result
  yearsCalculation.textContent = years;
  monthsCalculation.textContent = months;
  daysCalculation.textContent = days;
}

// EVENT LISTENER
formBtn.addEventListener("click", handleFormBtnClick);
