const result = document.querySelector(".result");

const btn = document.querySelectorAll(".btn");
const userInput = document.querySelector(".userInput");

let inputArray = [];
let lastResult = 0;
let hasDot = false;
let hasRootOrPi = false;

btn.forEach((button) => {
  button.addEventListener("click", (e) => {
    let value = e.currentTarget.dataset.value;
    let lastElement = inputArray[inputArray.length - 1];

    switch (value) {
      case "=":
        try {
          calculate(inputArray);
          displayResult(lastResult);
        } catch (error) {
          result.textContent = "Something went wrong";
        }
        break;
      case "clear":
        inputArray = [];
        lastResult = 0;
        displayInput(inputArray);
        displayResult("");
        hasDot = false;
        hasRootOrPi = false;
        break;
      case "backSpace":
        inputArray.pop();
        displayInput(inputArray);
        break;
      case ".":
        if (!hasDot) {
          inputArray.push(value);
          hasDot = true;
        }
        break;
      case "^":
      case "!":
      case "%":
        if (inputArray.length === 0 || isNaN(lastElement)) {
          break;
        } else {
          inputArray.push(value);
          hasDot = false;
          hasRootOrPi = false;
        }
        break;
      case "√":
      case "π":
        if (!hasRootOrPi) {
          if (
            inputArray.length === 0 ||
            isNaN(lastElement) ||
            lastElement === ")"
          ) {
            inputArray.push(value);
            hasDot = false;
            hasRootOrPi = true;
          } else {
            inputArray.push("×");
            inputArray.push(value);
            hasDot = false;
            hasRootOrPi = true;
          }
        }
        break;
      case "( )":
        if (inputArray.length === 0 || isNaN(lastElement)) {
          inputArray.push("( ");
        } else if (lastElement === ")") {
          inputArray.push("×");
          inputArray.push("( ");
        } else {
          inputArray.push(")");
        }
        hasRootOrPi = false;
        break;
      case "-":
        if (inputArray.length === 0 || lastElement === "(") {
          inputArray.push(value);
          hasDot = false;
          hasRootOrPi = false;
        } else if (
          !isNaN(lastElement) ||
          lastElement === "π" ||
          lastElement === "!"
        ) {
          inputArray.push("- ");
          hasDot = false;
          hasRootOrPi = false;
        }
        break;
      case "+":
      case "×":
      // case "-":
      case "÷":
        if (lastElement === "π" || lastElement === "!" || lastElement === ")") {
          inputArray.push(value);
          hasDot = false;
          hasRootOrPi = false;
        } else if (!isNaN(lastElement)) {
          inputArray.push(value);
          hasDot = false;
          hasRootOrPi = false;
        }
        break;

      default:
        inputArray.push(value);
    }

    displayInput(inputArray);
  });
});

function displayInput(input) {
  userInput.textContent = `${input.join("")}`;
}

function displayResult(lastResult) {
  result.textContent = `${lastResult}`;
}

const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
  "√": (a) => Math.sqrt(a),
  "^": (a, b) => Math.pow(a, b),
  "!": (a) => factorial(a),
  "%": (a) => a / 100,
  π: () => Math.PI,
};

function calculate(input) {
  let regex = /(-?\d+(\.\d+)?)|([+\-×÷^!%√π()])/g;
  let expression = input.join("");
  expression = expression.match(regex);
  console.log(expression);

  let postfix = [];
  let stack = [];

  let precedence = {
    "+": 1,
    "-": 1,
    "×": 2,
    "÷": 2,
    "^": 3,
    "!": 4,
    "%": 4,
    "√": 4,
    "(": 0,
    ")": 0,
  };

  for (let i = 0; i < expression.length; i++) {
    let char = expression[i];
    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        postfix.push(stack.pop());
      }
      stack.pop();
    } else if (char in precedence) {
      while (
        stack.length > 0 &&
        precedence[char] <= precedence[stack[stack.length - 1]]
      ) {
        postfix.push(stack.pop());
      }
      stack.push(char);
    } else if (char === "√") {
      stack.push(char);
    } else if (char === "π") {
      let lastPostfixElement = postfix[postfix.length - 1];
      if (!isNaN(lastPostfixElement) || lastPostfixElement === ")") {
        postfix.push("×");
        postfix.push(Math.PI);
      } else {
        postfix.push(Math.PI);
      }
    } else {
      char = parseFloat(char);
      postfix.push(char);
    }
  }
  while (stack.length > 0) {
    postfix.push(stack.pop());
  }

  let resultStack = [];
  for (let i = 0; i < postfix.length; i++) {
    let char = postfix[i];
    if (char in operators) {
      if (char === "√" || char === "!") {
        let a = parseFloat(resultStack.pop());
        let result = operators[char](a);
        resultStack.push(result);
      } else if (char === "%") {
        let a = parseFloat(resultStack.pop());
        let b = parseFloat(resultStack.pop());
        let result = b + (b * a) / 100;
        resultStack.push(result);
      } else {
        let b = parseFloat(resultStack.pop());
        let a = parseFloat(resultStack.pop());
        let result = operators[char](a, b);
        result = (result * 100) / 100;
        resultStack.push(result);
      }
    } else {
      resultStack.push(char);
    }
  }
  lastResult = resultStack.pop();
  return lastResult;
}

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result = result * i;
    }
    return result;
  }
}