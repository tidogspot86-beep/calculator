// ------------------------------------
// A. BASIC MATH FUNCTIONS
// ------------------------------------

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
    return "Nice try! Can't divide by 0.";
  }

  return a / b;
}


// ------------------------------------
// B. OPERATE FUNCTION
// ------------------------------------

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


// ------------------------------------
// CALCULATOR VARIABLES
// ------------------------------------

// Number the user is currently typing

let currentNumber = "";


// Full operation shown on the screen

let expression = "";


// Stores the first number

let firstNumber = null;


// Stores the selected operator

let currentOperator = null;


// Tells us if we are waiting
// for another number

let waitingForSecondNumber = false;


// Tells us if a result
// was just displayed

let resultShown = false;


// ------------------------------------
// DOM ELEMENTS
// ------------------------------------

const display = document.getElementById("display");

const numberButtons =
  document.querySelectorAll("[data-number]");

const operatorButtons =
  document.querySelectorAll("[data-operator]");

const equalsButton =
  document.getElementById("equals");

const clearButton =
  document.getElementById("clear");

const backspaceButton =
  document.getElementById("backspace");

const decimalButton =
  document.getElementById("decimal");


// ------------------------------------
// UPDATE DISPLAY
// ------------------------------------

function updateDisplay() {

  if (expression === "") {
    display.textContent = "0";
  } else {
    display.textContent = expression;
  }


  // Disable decimal if the current
  // number already has one

  if (currentNumber.includes(".")) {
    decimalButton.disabled = true;
  } else {
    decimalButton.disabled = false;
  }
}


// ------------------------------------
// D. INPUT NUMBERS
// ------------------------------------

function inputNumber(number) {

  // If a result is showing and the
  // user enters a new number,
  // start a new calculation

  if (resultShown) {

    expression = "";
    currentNumber = "";

    firstNumber = null;
    currentOperator = null;

    resultShown = false;
  }


  // Avoid numbers like 00005

  if (currentNumber === "0") {

    currentNumber = number;

    expression =
      expression.slice(0, -1) + number;

  } else {

    currentNumber += number;

    expression += number;
  }


  waitingForSecondNumber = false;

  updateDisplay();
}


// ------------------------------------
// G. DECIMAL
// ------------------------------------

function inputDecimal() {

  // New calculation after a result

  if (resultShown) {

    expression = "";
    currentNumber = "";

    firstNumber = null;
    currentOperator = null;

    resultShown = false;
  }


  // Do not allow more than one decimal

  if (currentNumber.includes(".")) {
    return;
  }


  // If decimal is pressed first

  if (currentNumber === "") {

    currentNumber = "0.";

    expression += "0.";

  } else {

    currentNumber += ".";

    expression += ".";
  }


  updateDisplay();
}


// ------------------------------------
// ROUND RESULT
// ------------------------------------

function roundResult(number) {

  return Math.round(
    (number + Number.EPSILON) * 100000
  ) / 100000;
}


// ------------------------------------
// E & F. OPERATORS
// ------------------------------------

function chooseOperator(operator) {

  // User must enter a number first

  if (
    currentNumber === "" &&
    firstNumber === null
  ) {
    return;
  }


  // If the result was just shown,
  // use that result in a new operation

  if (resultShown) {

    firstNumber = Number(expression);

    currentNumber = "";

    resultShown = false;
  }


  // If user presses two operators
  // in a row, replace the old one

  if (
    currentOperator !== null &&
    waitingForSecondNumber
  ) {

    expression =
      expression.slice(0, -3);

    expression +=
      " " + getOperatorSymbol(operator) + " ";

    currentOperator = operator;

    updateDisplay();

    return;
  }


  const inputValue =
    Number(currentNumber);


  // First operation

  if (firstNumber === null) {

    firstNumber = inputValue;

  }


  // There is already a previous
  // operation, so solve it first

  else if (currentOperator !== null) {

    let result = operate(
      currentOperator,
      firstNumber,
      inputValue
    );


    // Division by zero

    if (typeof result === "string") {

      expression = result;

      currentNumber = "";

      firstNumber = null;
      currentOperator = null;

      waitingForSecondNumber = false;

      resultShown = true;

      updateDisplay();

      return;
    }


    result = roundResult(result);


    // IMPORTANT:
    // We store the result internally,
    // but DON'T replace the expression
    // on the display.

    firstNumber = result;
  }


  currentOperator = operator;


  expression +=
    " " + getOperatorSymbol(operator) + " ";


  currentNumber = "";

  waitingForSecondNumber = true;


  updateDisplay();
}


// ------------------------------------
// OPERATOR SYMBOLS
// ------------------------------------

function getOperatorSymbol(operator) {

  if (operator === "*") {
    return "×";
  }

  if (operator === "/") {
    return "÷";
  }

  return operator;
}


// ------------------------------------
// E. EQUALS
// ------------------------------------

function calculate() {

  // Don't calculate incomplete
  // operations

  if (
    currentOperator === null ||
    firstNumber === null ||
    currentNumber === "" ||
    waitingForSecondNumber
  ) {

    return;
  }


  const secondNumber =
    Number(currentNumber);


  let result = operate(
    currentOperator,
    firstNumber,
    secondNumber
  );


  // Division by zero

  if (typeof result === "string") {

    expression = result;

  } else {

    result = roundResult(result);

    expression = String(result);
  }


  currentNumber = "";

  firstNumber = null;

  currentOperator = null;

  waitingForSecondNumber = false;

  resultShown = true;


  updateDisplay();
}


// ------------------------------------
// F.e CLEAR
// ------------------------------------

function clearCalculator() {

  currentNumber = "";

  expression = "";

  firstNumber = null;

  currentOperator = null;

  waitingForSecondNumber = false;

  resultShown = false;


  updateDisplay();
}


// ------------------------------------
// H. BACKSPACE
// ------------------------------------

function backspace() {

  // If result is showing,
  // clear everything

  if (resultShown) {

    clearCalculator();

    return;
  }


  // Don't delete an operator

  if (waitingForSecondNumber) {
    return;
  }


  // Remove last digit

  if (currentNumber.length > 0) {

    currentNumber =
      currentNumber.slice(0, -1);

    expression =
      expression.slice(0, -1);
  }


  updateDisplay();
}


// ------------------------------------
// BUTTON EVENTS
// ------------------------------------

numberButtons.forEach(function (button) {

  button.addEventListener(
    "click",
    function () {

      inputNumber(
        button.dataset.number
      );

    }
  );

});


operatorButtons.forEach(function (button) {

  button.addEventListener(
    "click",
    function () {

      chooseOperator(
        button.dataset.operator
      );

    }
  );

});


decimalButton.addEventListener(
  "click",
  inputDecimal
);


equalsButton.addEventListener(
  "click",
  calculate
);


clearButton.addEventListener(
  "click",
  clearCalculator
);


backspaceButton.addEventListener(
  "click",
  backspace
);


// ------------------------------------
// I. KEYBOARD SUPPORT
// ------------------------------------

window.addEventListener(
  "keydown",
  function (event) {

    const key = event.key;


    // Numbers

    if (
      key >= "0" &&
      key <= "9"
    ) {

      inputNumber(key);

    }


    // Decimal

    else if (key === ".") {

      inputDecimal();

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


    // Equals

    else if (
      key === "=" ||
      key === "Enter"
    ) {

      calculate();

    }


    // Backspace

    else if (
      key === "Backspace"
    ) {

      backspace();

    }


    // Clear

    else if (
      key === "Escape" ||
      key === "Delete"
    ) {

      clearCalculator();

    }

  }
);


// Initial display

updateDisplay();
