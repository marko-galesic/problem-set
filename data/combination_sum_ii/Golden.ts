class CombinationSumII {
  combinationSum2(candidates, target) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return [];
    }

    candidates.sort((a, b) => a - b);
    const results = [];
    const path = [];

    const backtrack = (start, remaining) => {
      if (remaining === 0) {
        results.push([...path]);
        return;
      }
      for (let i = start; i < candidates.length; i += 1) {
        if (i > start && candidates[i] === candidates[i - 1]) {
          continue;
        }
        const value = candidates[i];
        if (value > remaining) {
          break;
        }
        path.push(value);
        backtrack(i + 1, remaining - value);
        path.pop();
      }
    };

    backtrack(0, target);
    return results;
  }
}
