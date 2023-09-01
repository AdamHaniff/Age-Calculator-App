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
  // Turn every label red
  formLabels.forEach((label) => {
    label.style.color = colorError;
  });
}

function turnInputBordersRed() {
  // Turn every input border red
  formInputs.forEach((input) => {
    input.style.borderColor = colorError;
  });
}

function displayFormError(element, error) {
  element.classList.remove("hidden");
  element.textContent = error;
}

function handleInvalidInput(element, error) {
  turnLabelsRed();
  turnInputBordersRed();
  displayFormError(element, error);
}

function isInputEmpty(inputValue) {
  return inputValue === "";
}

function isValidDate(birthDay) {
  // Check if a date is greater than the number of days in a month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const birthMonth = parseInt(monthInput.value);
  const daysInBirthMonth = new Date(currentYear, birthMonth, 0).getDate();

  if (birthDay > daysInBirthMonth) {
    handleInvalidInput(formErrorDay, "Must be a valid date");
    return false;
  }

  return true;
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
  const isDayValid = isValidDay(dayInput.value);
  const isMonthValid = isValidMonth(monthInput.value);
  const isYearValid = isValidYear(yearInput.value);

  if (!isDayValid || !isMonthValid || !isYearValid) return;

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
function isValidDay(birthDayValue) {
  const birthDay = parseInt(birthDayValue);

  if (isInputEmpty(birthDayValue)) {
    handleInvalidInput(formErrorDay, "This field is required");
    return false;
  }

  if (!(birthDay > 0) || birthDay > 31 || isNaN(birthDayValue)) {
    handleInvalidInput(formErrorDay, "Must be a valid day");
    return false;
  }

  if (!isValidDate(birthDay)) return false;

  return true;
}

function isValidMonth(birthMonthValue) {
  const birthMonth = parseInt(birthMonthValue);

  if (isInputEmpty(birthMonthValue)) {
    handleInvalidInput(formErrorMonth, "This field is required");
    return false;
  }

  if (!(birthMonth > 0) || birthMonth > 12 || isNaN(birthMonthValue)) {
    handleInvalidInput(formErrorMonth, "Must be a valid month");
    return false;
  }

  return true;
}

function isValidYear(birthYearValue) {
  const birthYear = parseInt(birthYearValue);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  if (isInputEmpty(birthYearValue)) {
    handleInvalidInput(formErrorYear, "This field is required");
    return false;
  }

  if (birthYear < 0 || isNaN(birthYearValue)) {
    handleInvalidInput(formErrorYear, "Must be a valid year");
    return false;
  }

  // Check if birth year is in the future
  if (birthYear > currentYear) {
    handleInvalidInput(formErrorYear, "Must be in the past");
    return false;
  }

  return true;
}
