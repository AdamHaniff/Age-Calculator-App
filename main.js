import "core-js/stable";
import "regenerator-runtime/runtime";

// VARIABLES
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const formBtn = document.querySelector(".form__btn");
const calculationNumbers = document.querySelectorAll(".calculation__number");
const yearsCalculation = document.getElementById("calculation-years");
const monthsCalculation = document.getElementById("calculation-months");
const daysCalculation = document.getElementById("calculation-days");
const yearsUnit = document.getElementById("calculation-unit-years");
const monthsUnit = document.getElementById("calculation-unit-months");
const daysUnit = document.getElementById("calculation-unit-days");
const formLabels = document.querySelectorAll(".form__label");
const formInputs = document.querySelectorAll(".form__input");
const formErrors = document.querySelectorAll(".form__error");
const formErrorDay = document.getElementById("form-error-day");
const formErrorMonth = document.getElementById("form-error-month");
const formErrorYear = document.getElementById("form-error-year");
const colorError = getComputedStyle(document.documentElement).getPropertyValue(
  "--color-error"
);
const colorInputLabel = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-input-label");
const colorInputBorder = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-input-border");

// HELPER FUNCTIONS
function updateUnitText(element, value, singularText, pluralText) {
  element.textContent = value === 1 ? singularText : pluralText;
}

function addLeadingZero(inputElement) {
  inputElement.value = inputElement.value.padStart(2, "0");
}

function changeLabelColor(color) {
  // Turn every label a certain color
  formLabels.forEach((label) => {
    label.style.color = color;
  });
}

function changeInputBorderColor(color) {
  // Turn every input border a certain color
  formInputs.forEach((input) => {
    input.style.borderColor = color;
  });
}

function displayFormError(element, error) {
  element.classList.remove("hidden");
  element.textContent = error;
}

function handleInvalidInput(element, error) {
  changeLabelColor(colorError);
  changeInputBorderColor(colorError);
  displayFormError(element, error);
}

function isInputEmpty(inputValue) {
  return inputValue === "";
}

function hideFormErrors() {
  formErrors.forEach((error) => {
    error.classList.add("hidden");
  });
}

function resetValidationStyles() {
  changeLabelColor(colorInputLabel);
  changeInputBorderColor(colorInputBorder);
  hideFormErrors();
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

  resetValidationStyles();

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

// ERROR HANDLING
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

// EVENT LISTENER
formBtn.addEventListener("click", handleFormBtnClick);
// formLabels.addEventListener("input", function (e) {
//   const target = e.target;

//   if (target.tagName === "INPUT") {
//     const inputs = formLabels.querySelectorAll(".form__input");
//     const areAllEmpty = Array.from(inputs).every((input) =>
//       isInputEmpty(input.value)
//     );

//     if (areAllEmpty) {
//       forEach.calculationNumbers((el) => {
//         el.textContent = "- -";
//       });
//     }
//   }
// });
