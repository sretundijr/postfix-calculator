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

// todo fix decimal button press when entering a new calculation in
const renderScreen = (html = '') => {
  const inputContainer = document.getElementById('input-container');
  inputContainer.innerHTML = html;
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

document.addEventListener('DOMContentLoaded', () => {
  const Calc = new CalculatorState();
  renderKeyPad();
  buildScreenUi(Calc.buildListForUiScreens());
  keypadEvent(Calc);
});

