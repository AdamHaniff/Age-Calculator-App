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

// HELPER FUNCTIONS
function updateUnitText(element, value, singularText, pluralText) {
  element.textContent = value === 1 ? singularText : pluralText;
}

function addLeadingZero(inputElement) {
  inputElement.value = inputElement.value.padStart(2, "0");
}

function changeElementsColor(color, elements) {
  elements.forEach((el) => {
    el.style.color = color;
  });
}

function changeElementsBorderColor(color, elements) {
  elements.forEach((el) => {
    el.style.borderColor = color;
  });
}

function displayFormError(element, error) {
  element.classList.remove("hidden");
  element.textContent = error;
}

function handleInvalidInput(element, error) {
  changeElementsColor(colorError, formLabels);
  changeElementsBorderColor(colorError, formInputs);
  displayFormError(element, error);
}

function isInputEmpty(inputValue) {
  return inputValue === "";
}

function hideElements(elements) {
  if (Array.isArray(elements)) {
    elements.forEach((el) => {
      el.classList.add("hidden");
    });
  } else {
    elements.classList.add("hidden");
  }
}

function resetValidationStyles() {
  changeElementsColor(colorInputLabel, formLabels);
  changeElementsBorderColor(colorInputBorder, formInputs);
  hideElements(formErrors);
}

function getCurrentDate() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  return { currentDate, currentYear, currentMonth, currentDay };
}

// FUNCTIONS
function calculateAge(birthYear, birthMonth, birthDay) {
  // Get current date
  const { currentDate, currentYear, currentDay } = getCurrentDate();
  const currentMonth = currentDate.getMonth();

  // Calculate age
  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;
  let days = currentDay - birthDay;

  // Adjust for negative months or days
  if (days < 0) {
    months--;
    const daysInPreviousMonth = new Date(
      currentYear,
      currentMonth,
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

// EVENT LISTENER CALLBACK FUNCTIONS
function handleFormBtnClick(e) {
  const formBtn = e.target.closest(".form__btn");
  if (!formBtn) return;

  // Check if birthday, birth month, and birth year are all valid
  const isDayValid = isValidDay(dayInput.value);
  const isMonthValid = isValidMonth(monthInput.value);
  const isYearValid = isValidYear(yearInput.value);
  anyErrors = !isDayValid || !isMonthValid || !isYearValid;

  if (anyErrors) return;

  // Reset labels' color and inputs' border color back to default and hide error messages
  resetValidationStyles();

  // Add a leading 0 to both day and month input values
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

function checkIfAllInputsEmpty(e) {
  const target = e.target;

  if (target.classList.contains("form__input")) {
    const inputs = formLabelsContainer.querySelectorAll(".form__input");
    const areAllEmpty = Array.from(inputs).every((input) =>
      isInputEmpty(input.value)
    );

    if (areAllEmpty) {
      // Reset calculation numbers back to default
      calculationNumbers.forEach((el) => {
        el.textContent = "- -";
      });

      // Reset units back to default
      yearsUnit.textContent = "years";
      monthsUnit.textContent = "months";
      daysUnit.textContent = "days";
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

// VALIDATION FUNCTIONS
function isValidDate(birthDay) {
  const { currentYear } = getCurrentDate();
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
  const { currentYear, currentMonth, currentDay } = getCurrentDate();
  const birthYear = parseInt(yearInput.value);
  const birthMonth = parseInt(monthInput.value);
  const birthDay = parseInt(birthDayValue);

  if (isInputEmpty(birthDayValue)) {
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
  hideElements(formErrorDay);

  return true;
}

function isValidMonth(birthMonthValue) {
  const { currentYear, currentMonth } = getCurrentDate();
  const birthMonth = parseInt(birthMonthValue);
  const birthYear = parseInt(yearInput.value);

  if (isInputEmpty(birthMonthValue)) {
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
  hideElements(formErrorMonth);

  return true;
}

function isValidYear(birthYearValue) {
  const { currentYear } = getCurrentDate();
  const birthYear = parseInt(birthYearValue);

  if (isInputEmpty(birthYearValue)) {
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
  hideElements(formErrorYear);

  return true;
}

// EVENT LISTENERS
formBtn.addEventListener("click", handleFormBtnClick);
formLabelsContainer.addEventListener("input", checkIfAllInputsEmpty);
formLabelsContainer.addEventListener("focusin", handleInputFocusIn);
formLabelsContainer.addEventListener("focusout", handleInputFocusOut);
