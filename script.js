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


// VARIABLES

let firstNumber = "";
let secondNumber = "";
let operator = "";
let result = "";


// GET HTML ELEMENTS

const display = document.getElementById("display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const decimalButton = document.getElementById("decimal");
const backspaceButton = document.getElementById("backspace");


// UPDATE THE CALCULATOR DISPLAY

function updateDisplay() {

  // Before choosing an operator
  if (operator === "") {
    display.textContent = firstNumber || "0";
  }

  // Operator was chosen
  else if (secondNumber === "") {
    display.textContent = firstNumber + " " + operator;
  }

  // Second number is being entered
  else {
    display.textContent =
      firstNumber + " " + operator + " " + secondNumber;
  }
}


// NUMBER BUTTONS

numberButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    let number = button.dataset.number;

    // If there is no operator,
    // add the number to firstNumber

    if (operator === "") {

      // If a result was shown,
      // start a new calculation

      if (result !== "") {
        firstNumber = "";
        result = "";
      }

      firstNumber += number;
    }

    // If there is already an operator,
    // add the number to secondNumber

    else {
      secondNumber += number;
    }

    updateDisplay();
  });

});


// OPERATOR BUTTONS

operatorButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    // Only choose an operator
    // if there is already a first number

    if (firstNumber === "") {
      return;
    }

    operator = button.dataset.operator;

    updateDisplay();
  });

});


// DECIMAL BUTTON

decimalButton.addEventListener("click", function () {

  // Decimal for first number

  if (operator === "") {

    if (!firstNumber.includes(".")) {

      if (firstNumber === "") {
        firstNumber = "0";
      }

      firstNumber += ".";
    }
  }

  // Decimal for second number

  else {

    if (!secondNumber.includes(".")) {

      if (secondNumber === "") {
        secondNumber = "0";
      }

      secondNumber += ".";
    }
  }

  updateDisplay();
});


// EQUALS BUTTON

equalsButton.addEventListener("click", function () {

  // Make sure the calculator has
  // two numbers and an operator

  if (
    firstNumber === "" ||
    secondNumber === "" ||
    operator === ""
  ) {
    return;
  }


  let number1 = Number(firstNumber);
  let number2 = Number(secondNumber);


  result = operate(operator, number1, number2);


  // Round long decimal results

  if (typeof result === "number") {
    result = Math.round(result * 100000) / 100000;
  }


  display.textContent = result;


  // The result can be used
  // for another calculation

  firstNumber = String(result);

  secondNumber = "";
  operator = "";
});


// CLEAR BUTTON

clearButton.addEventListener("click", function () {

  firstNumber = "";
  secondNumber = "";
  operator = "";
  result = "";

  updateDisplay();
});


// BACKSPACE BUTTON

backspaceButton.addEventListener("click", function () {

  // Delete from second number first

  if (secondNumber !== "") {

    secondNumber = secondNumber.slice(0, -1);
  }

  // If there is an operator,
  // remove the operator

  else if (operator !== "") {

    operator = "";
  }

  // Otherwise delete from first number

  else if (firstNumber !== "") {

    firstNumber = firstNumber.slice(0, -1);
  }

  updateDisplay();
});


// KEYBOARD SUPPORT

window.addEventListener("keydown", function (event) {

  let key = event.key;


  // Numbers

  if (key >= "0" && key <= "9") {

    if (operator === "") {

      if (result !== "") {
        firstNumber = "";
        result = "";
      }

      firstNumber += key;

    } else {

      secondNumber += key;
    }

    updateDisplay();
  }


  // Operators

  else if (
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/"
  ) {

    if (firstNumber !== "") {

      operator = key;

      updateDisplay();
    }
  }


  // Decimal

  else if (key === ".") {

    if (operator === "") {

      if (!firstNumber.includes(".")) {

        if (firstNumber === "") {
          firstNumber = "0";
        }

        firstNumber += ".";
      }

    } else {

      if (!secondNumber.includes(".")) {

        if (secondNumber === "") {
          secondNumber = "0";
        }

        secondNumber += ".";
      }
    }

    updateDisplay();
  }


  // Equals

  else if (
    key === "Enter" ||
    key === "="
  ) {

    equalsButton.click();
  }


  // Backspace

  else if (key === "Backspace") {

    backspaceButton.click();
  }


  // Clear

  else if (
    key === "Escape" ||
    key === "Delete"
  ) {

    clearButton.click();
  }

});


// START CALCULATOR

updateDisplay();
