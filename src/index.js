import './styles.css';

const keyPadMarkup = (value) => {
  return (
    `<button class="number-btn" value="${value}">${value}</button>`
  );
};

const screenMarkup = (value) => {
  return (
    `<h4 class="input-screen">${value}</h4>`
  );
};

const renderScreen = (value = '') => {
  const inputContainer = document.getElementById('input-container');
  inputContainer.innerHTML = screenMarkup(value);
};

const generateKeyPad = () => {
  let buttonArray = [];
  for (let i = 1; i <= 12; i++) {
    if (i <= 9) {
      buttonArray.push(keyPadMarkup(i));
    } else if (i === 10) {
      buttonArray.push(keyPadMarkup('C'));
    } else if (i === 11) {
      buttonArray.push(keyPadMarkup(0));
    } else if (i === 12) {
      buttonArray.push(keyPadMarkup('.'));
    }
  }
  return buttonArray.join('');
}

const renderKeyPad = () => {
  const keypadContainer = document.getElementById('main-keypad');
  keypadContainer.innerHTML = generateKeyPad();
}

// change key pad events for rpn
const keypadEvent = (Calculator) => {
  const keypadElement = document.getElementById('event-delegate');
  keypadElement.addEventListener('click', (e) => {
    const keypadInput = e.target.value;

    if (keypadInput) {
      if (keypadInput === 'C') {
        Calculator.clearInput();
        renderScreen(Calculator.getInput());
      } else if (keypadInput === '=') {

      } else {
        Calculator.setInput(keypadInput);
        renderScreen(Calculator.getInput());
      }
    }
  });
};

// use reverse polish notation
// collect input as infix notation
// convert to postfix/rpn notation
// perform calculations and return a value
// and scaling after first implementing the data structure
class Calculator {
  constructor() {
    this.state = {
      input: [],

    }
  }

  setInput(input) {
    this.state.input.push(input);
  }

  getInput() {
    return this.state.input;
  }

  clearInput() {
    this.state.input = '';
  }

  isInputNumber(input) {
    const parsed = parseInt(input);
    if (parsed === "NaN") {
      return false;
    };
    return true;
  }

  // determineScale() {
  //   const decimalIndex = this.state.input.indexOf('.');
  //   console.log(decimalIndex);
  // }
};


// todo check constructor syntax
class InfixToPostfix {
  constructor(infixList) {
    this.state = {
      infixList,
      postfixList: [],
      operator: {
        '+': {
          precedence: 2,
          associativity: 'left',
        },
        '-': {
          precedence: 2,
          associativity: 'left',
        },
        '*': {
          precedence: 3,
          associativity: 'left',
        },
        '/': {
          precedence: 3,
          associativity: 'left',
        },
        '^': {
          precedence: 4,
          associativity: 'right',
        }
      }
    };
  };
  prepareList() {
    const newList = this.state.infixList
      .replace(/\s+/g, "")
      .split(/([\+\-\*\/\^\(\)])/)
    return newList.filter(item => item);
  }

  // add clause for exponent refactor
  returnPostfixList() {
    const preparedList = this.prepareList(this.state.infixList);
    const operatorList = [];
    preparedList.forEach((item, index) => {
      const parsedItem = parseFloat(item);
      if (!isNaN(parsedItem)) {
        this.state.postfixList.push(parsedItem);
      } else {

        const currentIndex = operatorList.length - 1;
        const operatorObj = this.state.operator;
        let currentItemPrecedence = '';
        let previousItemPrecedence = '';
        if (operatorObj[operatorList[currentIndex]] && operatorObj[item]) {
          previousItemPrecedence = operatorObj[operatorList[currentIndex]].precedence;
          currentItemPrecedence = operatorObj[item].precedence;
        }

        // first if statement evals to true if there is not an item in operator stack
        // with precedence, this means the current popable item in operator stack is
        // either ( or none
        if (!operatorObj[operatorList[currentIndex]]) {
          operatorList.push(item);
        } else if (item === '(') {
          operatorList.push(item);
        } else if (item === ")") {
          while (operatorList.length > 0 || operatorList[currentIndex] === '(') {
            this.state.postfixList.push(operatorList.pop());
          }
        } else if (previousItemPrecedence) {
          // add associativity here for exponent
          if (currentItemPrecedence <= previousItemPrecedence) {
            this.state.postfixList.push(operatorList.pop());
            operatorList.push(item);
          } else {
            operatorList.push(item);
          }
        }
      }
    });
    // console.log(operatorList, 'remaining operator stack');
    // unloads the remaining operators
    while (operatorList.length > 0) {
      this.state.postfixList.push(operatorList.pop());
    }
    // console.log(this.state.postfixList.filter(item => item != '('));
    return this.state.postfixList.filter(item => item != '(');
  }
}

// evalulates a postfix equation required format [type Number, string Operators]
class EvalPostfix {
  constructor() {
    this.state = {
      resultsStack: [],
    };
  };
  returnResults(postfixList) {
    postfixList.forEach((item) => {
      if (!isNaN(item)) {
        this.state.resultsStack.push(item);
      } else {
        const operand1 = this.state.resultsStack.pop();
        const operand2 = this.state.resultsStack.pop();
        let results = 0;
        // temp till i get back to the internet
        if (item === '+') {
          results = operand2 + operand1;
        } else if (item === '-') {
          results = operand2 - operand1;
        } else if (item === '/') {
          results = operand2 / operand1;
        } else {
          results = operand2 * operand1;
        }
        this.state.resultsStack.push(results);
      }
    })
    return this.state.resultsStack.join('');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const Calc = new Calculator();
  renderKeyPad();
  renderScreen();
  keypadEvent(Calc);

  const mockData = '13+20';
  // const mockData2 = '2+3*4/6-6';
  // const mockData2 = '(2+3)*4/6-6';
  // const mockData2 = '2+4*5-4/2';
  const mockData2 = '2+4*(5-4)/2';
  // const mockData2 = '2^2+2-2';
  // const mockData2 = '2^2^2';


  const ConvertToPostfix = new InfixToPostfix(mockData2);
  const postfixList = ConvertToPostfix.returnPostfixList();

  // console.log(ConvertToPostfix.returnPostfixList())

  const Eval = new EvalPostfix();
  const mathIsGood = Eval.returnResults(postfixList);

  console.log(mathIsGood);

})

