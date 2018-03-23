import './styles.css';

import InfixToPostfix from './infix-postfix';
import EvalPostfix from './eval-postfix';

const keyPadMarkup = (value) => {
  return (
    `<button class="number-btn" value="${value}">${value}</button>`
  );
};

const screenMarkup = (value = '') => {
  return (
    `<h4 class="input-screen">${value}</h4>`
  );
};

const renderScreen = (html = '') => {
  const inputContainer = document.getElementById('input-container');
  console.log(html);
  inputContainer.innerHTML = html;
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
        renderScreen(screenMarkup(Calculator.getInput()));
      } else if (keypadInput === '=') {
        Calculator.setPostfixConversion();
        const uiScreenHtml = Calculator.buildListForUiScreens().map((item) => {
          return screenMarkup(item);
        })
        renderScreen(uiScreenHtml.join(''));
      } else {
        Calculator.setInput(keypadInput);
        renderScreen(screenMarkup(Calculator.getInput()));
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
      input: '',
      postfixConversion: [],
      result: '',
    }
  }

  setInput(input) {
    this.state.input += input;
  }

  getInput() {
    return this.state.input;
  }

  clearInput() {
    this.state.input = [];
  }

  setPostfixConversion() {
    const ConvertToPostfix = new InfixToPostfix(this.state.input);
    this.state.postfixConversion = ConvertToPostfix.returnPostfixList();
    console.log(this.state.postfixConversion);
    this.performPostfixCalculation();
  }

  getPostfixConversion() {
    return this.state.postfixConversion;
  }

  performPostfixCalculation() {
    const Eval = new EvalPostfix();
    const mathIsGood = Eval.returnResults(this.state.postfixConversion);
    console.log(mathIsGood);
    this.state.result = mathIsGood;
  }

  buildListForUiScreens() {
    return [this.state.input, this.state.postfixConversion.join(''), this.state.result];
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
  renderScreen(screenMarkup());
  keypadEvent(Calc);

})

