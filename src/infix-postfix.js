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

  returnPostfixList() {
    const preparedList = this.prepareList(this.state.infixList);
    const operatorList = [];
    preparedList.forEach((item) => {
      const parsedItem = parseFloat(item);
      if (!isNaN(parsedItem)) {
        this.state.postfixList.push(parsedItem);
      } else {

        const currentIndex = operatorList.length - 1;
        const operatorObj = this.state.operator;
        let currentItem = '';
        let previousItem = '';
        if (operatorObj[operatorList[currentIndex]] && operatorObj[item]) {
          previousItem = operatorObj[operatorList[currentIndex]];
          currentItem = operatorObj[item];
        }


        // test that calculated correctly but may not be in correct postfix notation ?
        // '1+2+3^2'

        // first if statement evals to true if there is not an item in operator stack
        // with precedence, this means the current popable item in operator stack is
        // either ( or none
        if (!operatorObj[operatorList[currentIndex]] || item === '(') {
          operatorList.push(item);
        } else if (item === ")") {
          while (operatorList.length > 0 || operatorList[currentIndex] === '(') {
            this.state.postfixList.push(operatorList.pop());
          }
        } else if (previousItem.precedence) {
          if (currentItem.precedence <= previousItem.precedence && currentItem.associativity !== 'right') {
            this.state.postfixList.push(operatorList.pop());
            operatorList.push(item);
          } else if (previousItem.associativity === 'right' && currentItem.associativity === 'right') {
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