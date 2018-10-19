
export default class ValidateUserInput {
  constructor() {
    this.inputTypeList = [];
    this.constants = {
      LEFT_PARANTHESIS: 'LEFT_PARANTHESIS',
      RIGHT_PARANTHESIS: 'RIGHT_PARANTHESIS',
      NUMBER: 'NUMBER',
      OPERATOR: 'OPERATOR',
      DECIMAL: 'DECIMAL'
    }
  }

  // mainly for keyboard inputs
  // rename symbol to input                                                                                         
  getInputType(input) {
    if (input === '(') {
      return {
        type: this.constants.LEFT_PARANTHESIS,
        status: 'valid',
        symbol: input
      };
    } else if (input === ')') {
      return {
        type: this.constants.RIGHT_PARANTHESIS,
        status: 'valid',
        symbol: input
      }
    } else if (!isNaN(parseFloat(input))) {
      return {
        type: this.constants.NUMBER,
        status: 'valid',
        symbol: input
      }
    } else if (input === '.') {
      return {
        type: this.constants.DECIMAL,
        status: 'valid',
        symbol: input
      }
    } else {
      const symbolList = ['+', '-', '/', '*', '^'];
      // is contains a js or immutable lib method replace with contains
      const isOperator = symbolList.find(symbol => symbol === input);
      if (isOperator) {
        return {
          type: this.constants.OPERATOR,
          status: 'valid',
          symbol: input
        }
      }
      return {
        type: undefined,
        status: 'invalid'
      }
    }
  }

  // todo probably could use a refactor
  isValidInput(currentInput) {
    const previousInput = this.inputTypeList[this.inputTypeList.length - 1];
    if (previousInput) {
      const isParanthesis = (previousInput.type === this.constants.RIGHT_PARANTHESIS ||
        previousInput.type === this.constants.LEFT_PARANTHESIS) ? true : false;

      if (previousInput.type === this.constants.OPERATOR) {
        if (currentInput.type === this.constants.NUMBER ||
          currentInput.type === this.constants.LEFT_PARANTHESIS ||
          this.isNegativeNumber(currentInput)) {
          return true;
        }
        return false;
      } else if ((isParanthesis && currentInput.type === this.constants.NUMBER) || this.isNegativeNumber(currentInput)) {
        return true;
      } else if (previousInput.type === this.constants.DECIMAL && currentInput.type === this.constants.NUMBER) {
        return true;
      } else if (previousInput.type === this.constants.NUMBER && currentInput.type !== this.constants.LEFT_PARANTHESIS) {
        return true;
      }
      return false;
    }

    // always return true if first input
    return true;
  }

  isNegativeNumber(currentInput) {
    const previousInput = this.inputTypeList[this.inputTypeList.length - 1];
    const noDoubleMinus = previousInput.symbol !== '-' ? true : false;

    if (currentInput.type === this.constants.OPERATOR || previousInput.type === this.constants.LEFT_PARANTHESIS) {
      if (currentInput.symbol === '-' && noDoubleMinus) {
        return true;
      }
      return false;
    }
  }

  validateInput(input) {

    const userSelectionType = this.getInputType(input);

    if (userSelectionType.status === 'valid') {
      if (this.isValidInput(userSelectionType)) {
        this.inputTypeList.push(userSelectionType);
        return true;
      }
      return false;
    }

    return false;
  }
}