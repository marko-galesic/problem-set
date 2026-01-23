class ValidParentheses {
  isValid(s) {
    const stack = [];
    const map = { ')': '(', ']': '[', '}': '{' };
    for (const ch of s) {
      if (ch === '(' || ch === '[' || ch === '{') {
        stack.push(ch);
      } else if (map[ch]) {
        if (stack.pop() !== map[ch]) {
          return false;
        }
      }
    }
    return stack.length === 0;
  }
}
