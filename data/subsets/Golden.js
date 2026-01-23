class Subsets {
  subsets(nums) {
    if (!Array.isArray(nums)) {
      return [];
    }

    const sorted = nums.slice().sort((a, b) => a - b);
    const results = [];
    const path = [];

    const dfs = (start) => {
      results.push(path.slice());
      for (let i = start; i < sorted.length; i++) {
        path.push(sorted[i]);
        dfs(i + 1);
        path.pop();
      }
    };

    dfs(0);
    return results;
  }
}
