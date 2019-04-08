
// infix to postfix using shunting yard. Returns postfix notation in correct data types
// performs conversion by comparing data attributes allowing for additional operations
// to be added later by assigning each new operator precedence
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
      .split(/([\+\-\*\/\^\(\)])/)
      .filter(item => item);

    if (newList.length % 2 > 0) {
      return newList;
    } else {
      const listContainingNegativeNums = [];
      let negativeNumIndex = -1;

      newList.forEach((item, index) => {
        if (isNaN(item) && item === '-') {
          if (isNaN(listContainingNegativeNums[listContainingNegativeNums.length - 1])) {
            negativeNumIndex = index + 1;
          } else {
            listContainingNegativeNums.push(item);
          }
        } else {
          if (negativeNumIndex === index) {
            listContainingNegativeNums.push(`-${item}`);
          } else {
            listContainingNegativeNums.push(item);
          }
        }
      });
      console.log(listContainingNegativeNums, 'list with negatives');
      return listContainingNegativeNums;
    }
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
        const previousItemIsUndefined = operatorObj[operatorList[currentIndex]];
        let currentItem = '';
        let previousItem = '';
        if (operatorObj[operatorList[currentIndex]] && operatorObj[item]) {
          previousItem = operatorObj[operatorList[currentIndex]];
          currentItem = operatorObj[item];
        }
        if (!previousItemIsUndefined || item === '(') {
          operatorList.push(item);
        } else if (item === ")") {
          while (operatorList.length > 0 || operatorList[currentIndex] === '(') {
            this.state.postfixList.push(operatorList.pop());
          }
        } else if (previousItem.precedence) {
          if (currentItem.precedence <= previousItem.precedence &&
            currentItem.associativity !== 'right') {
            this.state.postfixList.push(operatorList.pop());
            operatorList.push(item);
          } else {
            operatorList.push(item);
          }
        }
      }
    });
    while (operatorList.length > 0) {
      this.state.postfixList.push(operatorList.pop());
    }
    return this.state.postfixList.filter(item => item != '(');
  }
}
