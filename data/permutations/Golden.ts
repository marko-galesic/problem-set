class Permutations {
  permute(nums) {
    if (!Array.isArray(nums) || nums.length === 0) {
      return [];
    }

    const values = [...nums].sort((a, b) => a - b);
    const results = [];
    const used = new Array(values.length).fill(false);
    const path = new Array(values.length);

    const backtrack = (depth) => {
      if (depth === values.length) {
        results.push(path.slice());
        return;
      }

      for (let i = 0; i < values.length; i++) {
        if (used[i]) {
          continue;
        }
        used[i] = true;
        path[depth] = values[i];
        backtrack(depth + 1);
        used[i] = false;
      }
    };

    backtrack(0);
    return results;
  }
}
