class EvaluateReversePolishNotation {
  evalRPN(tokens) {
    const stack = [];
    for (const token of tokens) {
      if (token === '+' || token === '-' || token === '*' || token === '/') {
        const b = stack.pop();
        const a = stack.pop();
        let result;
        switch (token) {
          case '+':
            result = a + b;
            break;
          case '-':
            result = a - b;
            break;
          case '*':
            result = a * b;
            break;
          default:
            result = Math.trunc(a / b);
            break;
        }
        stack.push(result);
      } else {
        stack.push(parseInt(token, 10));
      }
    }
    return stack.pop();
  }
}
