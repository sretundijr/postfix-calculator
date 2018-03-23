import './styles.css';

import InfixToPostfix from './infix-postfix';
import EvalPostfix from './eval-postfix';

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
class CalculatorState {
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

document.addEventListener('DOMContentLoaded', () => {
  const Calc = new CalculatorState();
  renderKeyPad();
  renderScreen();
  keypadEvent(Calc);

  // add test framework to eliminate this 
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

