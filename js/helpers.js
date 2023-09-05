// HELPER FUNCTIONS
export function updateUnitText(element, value, singularText, pluralText) {
  element.textContent = value === 1 ? singularText : pluralText;
}

export function addLeadingZero(inputElement) {
  inputElement.value = inputElement.value.padStart(2, "0");
}

export function changeElementsColor(color, elements) {
  elements.forEach((el) => {
    el.style.color = color;
  });
}

export function changeElementsBorderColor(color, elements) {
  elements.forEach((el) => {
    el.style.borderColor = color;
  });
}

export function displayFormError(element, error) {
  element.classList.remove("hidden");
  element.textContent = error;
}

export function isInputEmpty(inputValue) {
  return inputValue === "";
}

export function hideElements(elements) {
  if (Array.isArray(elements)) {
    elements.forEach((el) => {
      el.classList.add("hidden");
    });
  } else {
    elements.classList.add("hidden");
  }
}

export function getCurrentDate() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  return { currentDate, currentYear, currentMonth, currentDay };
}

export function calculateAge(birthYear, birthMonth, birthDay) {
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

// Export all functions as a 'helpers' object
export * from "./helpers.js";
