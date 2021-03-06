// evalulates a postfix equation required format is an array
// of mixed types [12, '+', 2]
export default class EvalPostfix {
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
        if (item === '+') {
          results = operand2 + operand1;
        } else if (item === '-') {
          results = operand2 - operand1;
        } else if (item === '/') {
          results = operand2 / operand1;
        } else if (item === '^') {
          results = Math.pow(operand2, operand1);
        } else {
          results = operand2 * operand1;
        }
        this.state.resultsStack.push(results);
      }
    })
    return this.state.resultsStack.join('');
  }
}
