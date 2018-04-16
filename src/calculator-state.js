
import EvalPostfix from './eval-postfix';
import InfixToPostfix from './infix-postfix';

// todo add decimal button handling when user enters a new calculation
// add error handling
// negative numbers are handled incorrectly
export default class CalculatorState {
  constructor() {
    this.state = {
      input: '',
      postfixConversion: [],
      result: '',
    }
  }

  setInput(input) {
    if (!this.state.result) {
      if (this.validateUserInput(input)) {
        this.state.input += input;
      }
    } else {
      this.resetUiLogic(input);
    }
  }

  // todo work on validation in combination with validation occuring infix-postfix
  validateUserInput(input) {
    console.log(this.state.input.match(/[-]/g))
    console.log(this.state.input.match(/[\d]/g))
    if (this.state.input.length > 0) {
      const inputLength = this.state.input.length;
      const lastCharacter = this.state.input[inputLength - 1];
      if (input.match(/[+\/*\(\)]/) && lastCharacter.match(/[+\/*\(\)]/)) {
        console.log('invalid input');
        return false;
      }
      // todo this needs work
      // if (input === '-' && this.state.input.match(/[-]/g) && this.state.input.match(/[\d]/g).length < this.state.input.match(/[-]/g).length) {
      //   console.log('here');
      //   return false;
      // }
    }
    return true;
  }

  resetUiLogic(input) {
    // this occurs at the end of the first evaluation, if the user enters a number, clear the input and start a new equation
    // else the user has entered an operator deciding to use the previous result as part of a new equation
    if (!isNaN(parseFloat(input))) {
      this.clearInput();
      this.state.input = input;
    } else {
      this.state.input = this.state.result + input;
      this.state.result = '';
      this.state.postfixConversion = [];
    }
  }

  clearInput() {
    this.state.input = '';
    this.state.result = '';
    this.state.postfixConversion = [];
  }

  setPostfixConversion() {
    const ConvertToPostfix = new InfixToPostfix(this.state.input);
    this.state.postfixConversion = ConvertToPostfix.returnPostfixList();
    this.performPostfixCalculation();
  }

  performPostfixCalculation() {
    const Eval = new EvalPostfix();
    const mathIsGood = Eval.returnResults(this.state.postfixConversion);
    this.state.result = !isNaN(mathIsGood) ? mathIsGood : 'Invalid Expression';
  }

  buildObjectForScreens() {
    const screenObj = {
      Infix: this.state.input,
      Postfix: this.state.postfixConversion.join(" "),
      Results: this.state.result,
    }
    return screenObj;
  }
};

