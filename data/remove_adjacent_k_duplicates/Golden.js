class RemoveAdjacentKDuplicates {
  removeAdjacentKDuplicates(s, k) {
    if (!s) {
      return '';
    }
    const stack = [];
    for (const ch of s) {
      if (stack.length && stack[stack.length - 1][0] === ch) {
        stack[stack.length - 1][1] += 1;
        if (stack[stack.length - 1][1] === k) {
          stack.pop();
        }
      } else {
        stack.push([ch, 1]);
      }
    }
    return stack.map(([ch, count]) => ch.repeat(count)).join('');
  }
}
