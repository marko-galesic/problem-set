class MinimumRemoveToMakeValidParentheses {
  minimumRemoveToMakeValidParentheses(s) {
    if (!s) {
      return '';
    }
    const stack = [];
    const remove = new Set();
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '(') {
        stack.push(i);
      } else if (ch === ')') {
        if (stack.length) {
          stack.pop();
        } else {
          remove.add(i);
        }
      }
    }
    while (stack.length) {
      remove.add(stack.pop());
    }
    let out = '';
    for (let i = 0; i < s.length; i++) {
      if (!remove.has(i)) {
        out += s[i];
      }
    }
    return out;
  }
}
