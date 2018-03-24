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

// todo add state management change when user finish calculation 
// then presses another number before clearing old
// add error handling
class CalculatorState {
  constructor() {
    this.state = {
      input: '',
      postfixConversion: [],
      result: '',
    }
  }

  // todo refactor??
  setInput(input) {
    if (!this.state.result) {
      this.state.input += input;
    } else {
      if (!isNaN(parseFloat(input))) {
        this.clearInput();
        this.state.input = input;
      } else {
        this.state.input = this.state.result + input;
        this.state.result = '';
      }
    }
  }

  getInput() {
    return this.state.input;
  }

  clearInput() {
    this.state.input = '';
    this.state.result = '';
  }

  setPostfixConversion() {
    const ConvertToPostfix = new InfixToPostfix(this.state.input);
    this.state.postfixConversion = ConvertToPostfix.returnPostfixList();
    this.performPostfixCalculation();
  }

  getPostfixConversion() {
    return this.state.postfixConversion;
  }

  performPostfixCalculation() {
    const Eval = new EvalPostfix();
    const mathIsGood = Eval.returnResults(this.state.postfixConversion);
    this.state.result = mathIsGood;
  }

  buildListForUiScreens() {
    return [this.state.input, this.state.postfixConversion.join(' '), this.state.result];
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const Calc = new CalculatorState();
  renderKeyPad();
  renderScreen(screenMarkup());
  keypadEvent(Calc);
});

