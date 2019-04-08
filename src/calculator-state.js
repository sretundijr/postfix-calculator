
import EvalPostfix from './eval-postfix';
import InfixToPostfix from './infix-postfix';
import ValidateUserInput from './validateUserInput';

export default class CalculatorState {
  constructor() {
    this.state = {
      input: '',
      postfixConversion: [],
      result: '',
      ValidateInput: new ValidateUserInput()
    }
  }

  setInput(input) {
    if (!this.state.result) {
      if (this.state.ValidateInput.validateInput(input)) {
        this.state.input += input;
      } else {
        console.log('invalid input');
      }
    } else {
      this.resetUiLogic(input);
    }
  }

  resetUiLogic(input) {

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
    this.state.ValidateInput = new ValidateUserInput();
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

