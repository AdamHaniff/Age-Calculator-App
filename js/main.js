import * as helpers from "./helpers.js";
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
const formLabelsContainer = document.querySelector(".form__labels");
const formLabels = document.querySelectorAll(".form__label");
const formInputs = document.querySelectorAll(".form__input");
const formErrors = Array.from(document.querySelectorAll(".form__error"));
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
const colorInputFocus = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-input-focus");
let anyErrors;

// FUNCTIONS
function getUserInput() {
  const birthDay = parseInt(dayInput.value);
  const birthMonth = parseInt(monthInput.value) - 1;
  const birthYear = parseInt(yearInput.value);

  return { birthDay, birthMonth, birthYear };
}

function displayAgeCalculations(years, months, days) {
  // Display calculations
  yearsCalculation.textContent = years;
  monthsCalculation.textContent = months;
  daysCalculation.textContent = days;

  // Check if units are equal to 1
  helpers.updateUnitText(yearsUnit, years, "year", "years");
  helpers.updateUnitText(monthsUnit, months, "month", "months");
  helpers.updateUnitText(daysUnit, days, "day", "days");
}

function handleInvalidInput(element, error) {
  helpers.changeElementsColor(colorError, formLabels);
  helpers.changeElementsBorderColor(colorError, formInputs);
  helpers.displayFormError(element, error);
}

function resetValidationStyles() {
  helpers.changeElementsColor(colorInputLabel, formLabels);
  helpers.changeElementsBorderColor(colorInputBorder, formInputs);
  helpers.hideElements(formErrors);
}

function resetUnitsToDefault() {
  yearsUnit.textContent = "years";
  monthsUnit.textContent = "months";
  daysUnit.textContent = "days";
}

// VALIDATION FUNCTIONS
function isValidDate(birthDay) {
  const { currentYear } = helpers.getCurrentDate();
  const birthMonth = parseInt(monthInput.value);
  const daysInBirthMonth = new Date(currentYear, birthMonth, 0).getDate();

  // Check if a birth date like 29 or 30 is greater than the number of days in a birth month
  if (birthDay > daysInBirthMonth) {
    handleInvalidInput(formErrorDay, "Must be a valid date");
    return false;
  }

  return true;
}

function isValidDay(birthDayValue) {
  const { currentYear, currentMonth, currentDay } = helpers.getCurrentDate();
  const birthYear = parseInt(yearInput.value);
  const birthMonth = parseInt(monthInput.value);
  const birthDay = parseInt(birthDayValue);

  if (helpers.isInputEmpty(birthDayValue)) {
    handleInvalidInput(formErrorDay, "This field is required");
    return false;
  }

  // Check if birthday is negative, 0, greater than 31, or is not a number
  if (!(birthDay > 0) || birthDay > 31 || isNaN(birthDayValue)) {
    handleInvalidInput(formErrorDay, "Must be a valid day");
    return false;
  }

  if (!isValidDate(birthDay)) return false;

  // Check if birthday is in the future
  if (
    birthYear === currentYear &&
    birthMonth === currentMonth &&
    birthDay > currentDay
  ) {
    handleInvalidInput(formErrorDay, "Must be in the past");
    return false;
  }

  // Hide error message if there is one
  helpers.hideElements(formErrorDay);

  return true;
}

function isValidMonth(birthMonthValue) {
  const { currentYear, currentMonth } = helpers.getCurrentDate();
  const birthMonth = parseInt(birthMonthValue);
  const birthYear = parseInt(yearInput.value);

  if (helpers.isInputEmpty(birthMonthValue)) {
    handleInvalidInput(formErrorMonth, "This field is required");
    return false;
  }

  // Check if birth month is negative, 0, greather than 12, or is not a number
  if (!(birthMonth > 0) || birthMonth > 12 || isNaN(birthMonthValue)) {
    handleInvalidInput(formErrorMonth, "Must be a valid month");
    return false;
  }

  // Check if birth month is in the future
  if (birthYear === currentYear && birthMonth > currentMonth) {
    handleInvalidInput(formErrorMonth, "Must be in the past");
    return false;
  }

  // Hide error message if there is one
  helpers.hideElements(formErrorMonth);

  return true;
}

function isValidYear(birthYearValue) {
  const { currentYear } = helpers.getCurrentDate();
  const birthYear = parseInt(birthYearValue);

  if (helpers.isInputEmpty(birthYearValue)) {
    handleInvalidInput(formErrorYear, "This field is required");
    return false;
  }

  // Check if birth year is a negative number or is not a number at all
  if (birthYear < 0 || isNaN(birthYearValue)) {
    handleInvalidInput(formErrorYear, "Must be a valid year");
    return false;
  }

  // Check if birth year is in the future
  if (birthYear > currentYear) {
    handleInvalidInput(formErrorYear, "Must be in the past");
    return false;
  }

  // Hide error message if there is one
  helpers.hideElements(formErrorYear);

  return true;
}

function isDateNotValid() {
  const isDayValid = isValidDay(dayInput.value);
  const isMonthValid = isValidMonth(monthInput.value);
  const isYearValid = isValidYear(yearInput.value);

  // If there are any errors, then the date is not valid
  anyErrors = !isDayValid || !isMonthValid || !isYearValid;

  return anyErrors;
}

// EVENT LISTENER CALLBACK FUNCTIONS
function handleFormBtnClick(e) {
  const formBtn = e.target.closest(".form__btn");
  if (!formBtn) return;

  // Check if birthday, birth month, or birth year are not valid
  if (isDateNotValid()) return;

  // Reset labels' color and inputs' border color back to default and hide error messages if there are any
  resetValidationStyles();

  // Add a leading 0 to both day and month input values
  helpers.addLeadingZero(dayInput);
  helpers.addLeadingZero(monthInput);

  // Get user input
  const { birthDay, birthMonth, birthYear } = getUserInput();

  // Calculate and display age
  const { years, months, days } = helpers.calculateAge(
    birthYear,
    birthMonth,
    birthDay
  );
  displayAgeCalculations(years, months, days);
}

function checkIfAllInputsEmpty(e) {
  const target = e.target;

  if (target.classList.contains("form__input")) {
    const inputs = formLabelsContainer.querySelectorAll(".form__input");
    const areAllEmpty = Array.from(inputs).every((input) =>
      helpers.isInputEmpty(input.value)
    );

    if (areAllEmpty) {
      // Reset calculation numbers back to default
      calculationNumbers.forEach((el) => {
        el.textContent = "- -";
      });

      resetUnitsToDefault();
    }
  }
}

function handleInputFocusIn(e) {
  const target = e.target;
  const isFormInput = target.classList.contains("form__input");

  // If there are any errors, change input's caret color back to initial value
  if (anyErrors && isFormInput) {
    target.style.caretColor = "initial";
  }

  // If there are no errors, change input's caret and border color to colorInputFocus
  if (!anyErrors && isFormInput) {
    target.style.caretColor = colorInputFocus;
    target.style.borderColor = colorInputFocus;
  }
}

function handleInputFocusOut(e) {
  const target = e.target;
  const isFormInput = target.classList.contains("form__input");

  // If there are no errors, change the previously clicked input's border to colorInputBorder
  if (!anyErrors && isFormInput) {
    target.style.borderColor = colorInputBorder;
  }
}

// EVENT LISTENERS
formBtn.addEventListener("click", handleFormBtnClick);
formLabelsContainer.addEventListener("input", checkIfAllInputsEmpty);
formLabelsContainer.addEventListener("focusin", handleInputFocusIn);
formLabelsContainer.addEventListener("focusout", handleInputFocusOut);
