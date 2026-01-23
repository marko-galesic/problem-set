class SubsetsII {
  subsetsWithDup(nums) {
    const sorted = Array.isArray(nums) ? nums.slice().sort((a, b) => a - b) : [];
    const result = [];
    const path = [];

    const backtrack = (start) => {
      result.push(path.slice());
      for (let i = start; i < sorted.length; i++) {
        if (i > start && sorted[i] === sorted[i - 1]) {
          continue;
        }
        path.push(sorted[i]);
        backtrack(i + 1);
        path.pop();
      }
    };

    backtrack(0);
    return result;
  }
}
