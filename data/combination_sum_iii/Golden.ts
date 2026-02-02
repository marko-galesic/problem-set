class CombinationSumIII {
  combinationSum3(k, n) {
    const results = [];
    const backtrack = (start, remain, path) => {
      if (path.length === k) {
        if (remain === 0) {
          results.push(path.slice());
        }
        return;
      }
      for (let num = start; num <= 9; num++) {
        if (num > remain) {
          break;
        }
        path.push(num);
        backtrack(num + 1, remain - num, path);
        path.pop();
      }
    };
    backtrack(1, n, []);
    return results;
  }
}
