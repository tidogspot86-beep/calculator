// GET HTML ELEMENTS

const display = document.getElementById("display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const decimalButton = document.getElementById("decimal");
const backspaceButton = document.getElementById("backspace");


// VARIABLES

let firstNumber = "";
let secondNumber = "";
let operator = "";
let result = "";


// BASIC MATH FUNCTIONS

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {

  if (b === 0) {
    return "Can't divide by 0";
  }

  return a / b;
}


// OPERATE FUNCTION

function operate(operator, a, b) {

  if (operator === "+") {
    return add(a, b);
  }

  if (operator === "-") {
    return subtract(a, b);
  }

  if (operator === "*") {
    return multiply(a, b);
  }

  if (operator === "/") {
    return divide(a, b);
  }
}


// UPDATE DISPLAY

function updateDisplay() {

  if (operator === "") {

    if (firstNumber === "") {
      display.textContent = "0";
    } else {
      display.textContent = firstNumber;
    }

  } else {

    display.textContent =
      firstNumber + " " + operator + " " + secondNumber;
  }
}


// INPUT NUMBER

function inputNumber(number) {

  // If there is no operator yet,
  // add numbers to the first number

  if (operator === "") {

    // Start a new calculation
    // if a result was already shown

    if (result !== "") {
      firstNumber = "";
      result = "";
    }

    firstNumber = firstNumber + number;
  }

  // If there is an operator,
  // add numbers to the second number

  else {

    secondNumber = secondNumber + number;
  }

  updateDisplay();
}


// CHOOSE OPERATOR

function chooseOperator(newOperator) {

  // Do nothing if the user
  // has not entered a number

  if (firstNumber === "") {
    return;
  }


  operator = newOperator;

  updateDisplay();
}


// DECIMAL

function inputDecimal() {

  // First number

  if (operator === "") {

    if (firstNumber.includes(".") === false) {

      if (firstNumber === "") {
        firstNumber = "0";
      }

      firstNumber = firstNumber + ".";
    }
  }

  // Second number

  else {

    if (secondNumber.includes(".") === false) {

      if (secondNumber === "") {
        secondNumber = "0";
      }

      secondNumber = secondNumber + ".";
    }
  }

  updateDisplay();
}


// CALCULATE

function calculate() {

  // We need two numbers
  // and an operator

  if (
    firstNumber === "" ||
    secondNumber === "" ||
    operator === ""
  ) {
    return;
  }


  let number1 = Number(firstNumber);
  let number2 = Number(secondNumber);


  result = operate(
    operator,
    number1,
    number2
  );


  // If the result is a number,
  // round long decimals

  if (typeof result === "number") {

    result =
      Math.round(result * 100000) / 100000;
  }


  display.textContent = result;


  // If the user divided by zero,
  // reset the calculator

  if (result === "Can't divide by 0") {

    firstNumber = "";
    secondNumber = "";
    operator = "";

    return;
  }


  // Save the result so it can
  // be used in another operation

  firstNumber = String(result);

  secondNumber = "";

  operator = "";
}


// CLEAR

function clearCalculator() {

  firstNumber = "";

  secondNumber = "";

  operator = "";

  result = "";

  updateDisplay();
}


// BACKSPACE

function backspace() {

  // If there is a second number,
  // delete from the second number

  if (secondNumber !== "") {

    secondNumber =
      secondNumber.slice(0, -1);
  }

  // If there is an operator,
  // remove it

  else if (operator !== "") {

    operator = "";
  }

  // Otherwise delete from
  // the first number

  else {

    firstNumber =
      firstNumber.slice(0, -1);

    result = "";
  }

  updateDisplay();
}


// NUMBER BUTTONS

numberButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    inputNumber(button.dataset.number);

  });

});


// OPERATOR BUTTONS

operatorButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    chooseOperator(button.dataset.operator);

  });

});


// DECIMAL BUTTON

decimalButton.addEventListener("click", function () {

  inputDecimal();

});


// EQUALS BUTTON

equalsButton.addEventListener("click", function () {

  calculate();

});


// CLEAR BUTTON

clearButton.addEventListener("click", function () {

  clearCalculator();

});


// BACKSPACE BUTTON

backspaceButton.addEventListener("click", function () {

  backspace();

});


// KEYBOARD

window.addEventListener("keydown", function (event) {

  let key = event.key;


  // Numbers

  if (key >= "0" && key <= "9") {

    inputNumber(key);
  }


  // Operators

  else if (
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/"
  ) {

    chooseOperator(key);
  }


  // Decimal

  else if (key === ".") {

    inputDecimal();
  }


  // Equals

  else if (
    key === "Enter" ||
    key === "="
  ) {

    calculate();
  }


  // Backspace

  else if (key === "Backspace") {

    backspace();
  }


  // Clear

  else if (
    key === "Escape" ||
    key === "Delete"
  ) {

    clearCalculator();
  }

});


// SHOW 0 WHEN THE PAGE STARTS

updateDisplay();
