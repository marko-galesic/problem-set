class ValidParenthesesWithStar {
  validParenthesesWithStar(s) {
    let minOpen = 0;
    let maxOpen = 0;
    for (const ch of s) {
      if (ch === '(') {
        minOpen++;
        maxOpen++;
      } else if (ch === ')') {
        minOpen--;
        maxOpen--;
      } else {
        minOpen--;
        maxOpen++;
      }
      if (maxOpen < 0) return false;
      if (minOpen < 0) minOpen = 0;
    }
    return minOpen === 0;
  }
}
