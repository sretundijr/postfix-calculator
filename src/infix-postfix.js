// todo check constructor syntax
export default class InfixToPostfix {
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
    // unloads the remaining operators when there is no numbers remaining in the list
    while (operatorList.length > 0) {
      this.state.postfixList.push(operatorList.pop());
    }
    return this.state.postfixList.filter(item => item != '(');
  }
}