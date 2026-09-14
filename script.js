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


// You can test the functions in the console:
//
// add(2, 3)
// subtract(10, 5)
// multiply(4, 3)
// divide(10, 2)


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

// Stores what is currently shown
// on the calculator screen

let displayValue = "0";


// Stores the first number

let firstNumber = null;


// Stores the selected operator

let currentOperator = null;


// Tells the calculator that the next
// number should replace the display

let waitingForSecondNumber = false;


// Tells the calculator that a result
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

  display.textContent = displayValue;


  // Disable the decimal button if
  // the current number already
  // contains a decimal point

  if (
    displayValue.includes(".") &&
    !waitingForSecondNumber &&
    !resultShown
  ) {

    decimalButton.disabled = true;

  } else {

    decimalButton.disabled = false;
  }
}


// ------------------------------------
// D. INPUT NUMBERS
// ------------------------------------

function inputNumber(number) {

  // If an operator was just pressed,
  // the next number should replace
  // the old display

  if (
    waitingForSecondNumber ||
    resultShown ||
    displayValue === "Nice try! Can't divide by 0."
  ) {

    displayValue = number;

    waitingForSecondNumber = false;

    resultShown = false;

  } else if (displayValue === "0") {

    displayValue = number;

  } else {

    displayValue += number;
  }

  updateDisplay();
}


// ------------------------------------
// G. DECIMAL BUTTON
// ------------------------------------

function inputDecimal() {

  // Start a new decimal number
  // after an operator or result

  if (
    waitingForSecondNumber ||
    resultShown ||
    displayValue === "Nice try! Can't divide by 0."
  ) {

    displayValue = "0.";

    waitingForSecondNumber = false;

    resultShown = false;

  }

  // Only add a decimal if there
  // isn't one already

  else if (!displayValue.includes(".")) {

    displayValue += ".";
  }

  updateDisplay();
}


// ------------------------------------
// ROUND LONG DECIMALS
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

  // Don't use an error message
  // as a number

  if (displayValue === "Nice try! Can't divide by 0.") {
    return;
  }


  const inputValue = Number(displayValue);


  // If the user presses operators
  // one after another:
  //
  // 5 + -
  //
  // simply replace + with -

  if (
    currentOperator !== null &&
    waitingForSecondNumber
  ) {

    currentOperator = operator;

    return;
  }


  // Store the first number

  if (firstNumber === null) {

    firstNumber = inputValue;

  }


  // If we already have:
  //
  // firstNumber
  // operator
  // second number
  //
  // calculate before starting
  // the next operation

  else if (currentOperator !== null) {

    let result = operate(
      currentOperator,
      firstNumber,
      inputValue
    );


    // Divide by zero error

    if (typeof result === "string") {

      displayValue = result;

      firstNumber = null;

      currentOperator = null;

      waitingForSecondNumber = false;

      resultShown = true;

      updateDisplay();

      return;
    }


    result = roundResult(result);


    displayValue = String(result);


    // The result becomes the first
    // number of the new operation

    firstNumber = result;


    updateDisplay();
  }


  currentOperator = operator;


  // The next number entered should
  // replace the display

  waitingForSecondNumber = true;

  resultShown = false;

  updateDisplay();
}


// ------------------------------------
// E. EQUALS BUTTON
// ------------------------------------

function calculate() {

  // Don't calculate if the user
  // hasn't entered everything yet

  if (
    currentOperator === null ||
    firstNumber === null ||
    waitingForSecondNumber
  ) {

    return;
  }


  const secondNumber = Number(displayValue);


  let result = operate(
    currentOperator,
    firstNumber,
    secondNumber
  );


  // Divide by zero

  if (typeof result === "string") {

    displayValue = result;

  } else {

    result = roundResult(result);

    displayValue = String(result);
  }


  // Reset stored operation

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

  displayValue = "0";

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

  // Don't remove digits while waiting
  // for the second number

  if (waitingForSecondNumber) {
    return;
  }


  // If a result was just shown,
  // reset the display

  if (
    resultShown ||
    displayValue === "Nice try! Can't divide by 0."
  ) {

    displayValue = "0";

    resultShown = false;

    updateDisplay();

    return;
  }


  // Remove the last character

  displayValue = displayValue.slice(0, -1);


  // If everything was deleted,
  // return to 0

  if (
    displayValue === "" ||
    displayValue === "-"
  ) {

    displayValue = "0";
  }


  updateDisplay();
}


// ------------------------------------
// BUTTON EVENT LISTENERS
// ------------------------------------

numberButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    inputNumber(button.dataset.number);

  });

});


operatorButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    chooseOperator(button.dataset.operator);

  });

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

window.addEventListener("keydown", function (event) {

  const key = event.key;


  // Numbers

  if (key >= "0" && key <= "9") {

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


// Show initial value

updateDisplay();
