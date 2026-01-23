class GenerateParentheses {
  generateParenthesis(n) {
    const result = [];
    const backtrack = (current, openCount, closeCount) => {
      if (current.length === n * 2) {
        result.push(current);
        return;
      }

      if (openCount < n) {
        backtrack(current + "(", openCount + 1, closeCount);
      }

      if (closeCount < openCount) {
        backtrack(current + ")", openCount, closeCount + 1);
      }
    };

    backtrack("", 0, 0);
    return result;
  }
}
