class RemoveKDigits {
  removeKdigits(num, k) {
    const stack = [];
    let remaining = k;
    for (const ch of num) {
      while (remaining > 0 && stack.length && stack[stack.length - 1] > ch) {
        stack.pop();
        remaining--;
      }
      stack.push(ch);
    }
    while (remaining > 0 && stack.length) {
      stack.pop();
      remaining--;
    }
    let result = stack.join('').replace(/^0+/, '');
    return result.length ? result : '0';
  }
}
