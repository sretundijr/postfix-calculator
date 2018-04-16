import './styles.css';

import CalculatorState from './calculator-state';

const keyPadMarkup = (value) => {
  return (
    `<button class="number-btn animate-btn" value="${value}">${value}</button>`
  );
};

const screenMarkup = (value) => {
  return (
    `
    <span class="input-element-container">
    <h4 class="screen-header">${Object.keys(value)}</h4>
     <h4 class="input-screen">${Object.values(value)}</h4>
    </span>
    `
  );
};

// todo fix decimal button press when entering a new calculation in
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
      } else if (keypadInput === '=') {
        Calculator.setPostfixConversion();
      } else {
        Calculator.setInput(keypadInput);
      }
      buildScreenUi(Calculator.buildListForUiScreens());
    }
  });
};

const buildScreenUi = (calcState) => {
  let uiScreenHtml = '';
  for (const key in calcState) {
    if (calcState.hasOwnProperty(key)) {
      const element = {};
      element[key] = calcState[key];
      uiScreenHtml += screenMarkup(element);
    }
  }
  renderScreen(uiScreenHtml);
}

const returnCalculaterScreenItems = (screenArray) => screenArray.map(item => item);

// // todo add decimal button handling when user enters a new calculation
// // add error handling
// // negative numbers are handled incorrectly
// class CalculatorState {
//   constructor() {
//     this.state = {
//       input: '',
//       postfixConversion: [],
//       result: '',
//     }
//   }

//   setInput(input) {
//     if (!this.state.result) {
//       if (this.validateUserInput(input)) {
//         this.state.input += input;
//       }
//     } else {
//       this.resetUiLogic(input);
//     }
//   }

//   validateUserInput(input) {
//     console.log(this.state.input.match(/[-]/g))
//     console.log(this.state.input.match(/[\d]/g))
//     if (this.state.input.length > 0) {
//       const inputLength = this.state.input.length;
//       const lastCharacter = this.state.input[inputLength - 1];
//       if (input.match(/[+\/*\(\)]/) && lastCharacter.match(/[+\/*\(\)]/)) {
//         console.log('invalid input');
//         return false;
//       }
//       // todo this needs work
//       if (input === '-' && this.state.input.match(/[-]/g) && this.state.input.match(/[\d]/g).length < this.state.input.match(/[-]/g).length) {
//         console.log('here');
//         return false;
//       }
//     }
//     return true;
//   }

//   resetUiLogic(input) {
//     // this occurs at the end of the first evaluation, if the user enters a number, clear the input and start a new equation
//     // else the user has entered an operator deciding to use the previous result as part of a new equation
//     if (!isNaN(parseFloat(input))) {
//       this.clearInput();
//       this.state.input = input;
//     } else {
//       this.state.input = this.state.result + input;
//       this.state.result = '';
//       this.state.postfixConversion = [];
//     }
//   }

//   clearInput() {
//     this.state.input = '';
//     this.state.result = '';
//     this.state.postfixConversion = [];
//   }

//   setPostfixConversion() {
//     const ConvertToPostfix = new InfixToPostfix(this.state.input);
//     this.state.postfixConversion = ConvertToPostfix.returnPostfixList();
//     this.performPostfixCalculation();
//   }

//   performPostfixCalculation() {
//     const Eval = new EvalPostfix();
//     const mathIsGood = Eval.returnResults(this.state.postfixConversion);
//     this.state.result = !isNaN(mathIsGood) ? mathIsGood : 'Invalid Expression';
//   }

//   buildListForUiScreens() {
//     const screenObj = {
//       Infix: this.state.input,
//       Postfix: this.state.postfixConversion.join(" "),
//       Results: this.state.result,
//     }
//     return screenObj;
//   }
// };

document.addEventListener('DOMContentLoaded', () => {
  const Calc = new CalculatorState();
  renderKeyPad();
  buildScreenUi(Calc.buildListForUiScreens());
  keypadEvent(Calc);
});

