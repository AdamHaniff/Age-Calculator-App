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
const yearsUnit = document.getElementById("calculation-unit-years");
const monthsUnit = document.getElementById("calculation-unit-months");
const daysUnit = document.getElementById("calculation-unit-days");
const formLabels = document.querySelectorAll(".form__label");
const formInputs = document.querySelectorAll(".form__input");
const colorError = getComputedStyle(document.documentElement).getPropertyValue(
  "--color-error"
);
const formErrorDay = document.getElementById("form-error-day");
const formErrorMonth = document.getElementById("form-error-month");
const formErrorYear = document.getElementById("form-error-year");

// HELPER FUNCTIONS
function updateUnitText(element, value, singularText, pluralText) {
  element.textContent = value === 1 ? singularText : pluralText;
}

function addLeadingZero(inputElement) {
  inputElement.value = inputElement.value.padStart(2, "0");
}

function turnLabelsRed() {
  formLabels.forEach((label) => {
    label.style.color = colorError;
  });
}

function turnInputBordersRed() {
  formInputs.forEach((input) => {
    input.style.borderColor = colorError;
  });
}

// FUNCTIONS
function calculateAge(birthYear, birthMonth, birthDay) {
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

  return { years, months, days };
}

function displayAgeCalculations(years, months, days) {
  // Display calculations
  yearsCalculation.textContent = years;
  monthsCalculation.textContent = months;
  daysCalculation.textContent = days;

  // Check if units are equal to 1
  updateUnitText(yearsUnit, years, "year", "years");
  updateUnitText(monthsUnit, months, "month", "months");
  updateUnitText(daysUnit, days, "day", "days");
}

// EVENT LISTENER CALLBACK FUNCTION
function handleFormBtnClick(e) {
  const formBtn = e.target.closest(".form__btn");
  if (!formBtn) return;

  // Error handler
  isValidDay(parseInt(dayInput.value));
  isValidMonth(parseInt(monthInput.value));

  // Add a leading 0 to input elements
  addLeadingZero(dayInput);
  addLeadingZero(monthInput);

  // Get user input
  const birthDay = parseInt(dayInput.value);
  const birthMonth = parseInt(monthInput.value) - 1;
  const birthYear = parseInt(yearInput.value);

  // Calculate and display age
  const { years, months, days } = calculateAge(birthYear, birthMonth, birthDay);
  displayAgeCalculations(years, months, days);
}

// EVENT LISTENER
formBtn.addEventListener("click", handleFormBtnClick);

// ERROR HANDLING
function isValidDay(dayInputValue) {
  if (dayInputValue < 1 || dayInputValue > 31) {
    // Turn every label red
    turnLabelsRed();

    // Turn every input border red
    turnInputBordersRed();

    // Display form error
    formErrorDay.classList.remove("hidden");
    formErrorDay.textContent = "Must be a valid day";

    return false;
  }

  return true;
}

function isValidMonth(monthInputValue) {
  if (monthInputValue < 1 || monthInputValue > 12) {
    // Turn every label red
    turnLabelsRed();

    // Turn every input border red
    turnInputBordersRed();

    // Display form error
    formErrorMonth.classList.remove("hidden");
    formErrorMonth.textContent = "Must be a valid month";
  }
}
