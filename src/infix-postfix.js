
// infix to postfix using shunting yard. Returns postfix notation in correct data types
// performs conversion by comparing data attributes allowing for additional operations
// to be added later by assigning each new operator precedence
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
  // todo fix for negative numbers
  prepareList() {
    const newList = this.state.infixList
      .split(/([\+\-\*\/\^\(\)])/)
      .filter(item => item);

    if (newList.length % 2 > 0) {
      return newList;
    } else {
      // contains negative numbers
      const listContainingNegativeNums = [];
      let negativeNumIndex = -1;

      newList.forEach((item, index) => {
        if (isNaN(item)) {
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
        // refactor previous item here
        if (operatorObj[operatorList[currentIndex]] && operatorObj[item]) {
          previousItem = operatorObj[operatorList[currentIndex]];
          currentItem = operatorObj[item];
        }

        // tested wrong 1+2*3+4*(1+2) but fixed when 
        // refactored to this !operatorObj[operatorList[currentIndex]]
        // if previous item is a paranthesis or stack length is 0 it will eval to true (!undefined)
        // this allows for the collection of the operator that follows an opening paranthesis
        // but also allows for the collection of a paranthesis if current item
        if (!previousItemIsUndefined || item === '(') {
          operatorList.push(item);
        } else if (item === ")") {
          // remove second statement in OR
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
    // unloads the remaining operators when there is no numbers remaining in the list
    while (operatorList.length > 0) {
      this.state.postfixList.push(operatorList.pop());
    }
    return this.state.postfixList.filter(item => item != '(');
  }
}