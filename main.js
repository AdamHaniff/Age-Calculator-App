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

// EVENT LISTENER
formBtn.addEventListener("click", function (e) {
  const btn = e.target.closest(".form__btn");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const birthDay = dayInput.value;
  const birthMonth = monthInput.value;
  const birthYear = yearInput.value;
});
