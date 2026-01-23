class CombinationSum {
  combinationSum(candidates, target) {
    if (!Array.isArray(candidates) || candidates.length === 0 || target <= 0) {
      return [];
    }

    candidates.sort((a, b) => a - b);
    const results = [];
    const path = [];

    const backtrack = (start, remaining) => {
      if (remaining === 0) {
        results.push(path.slice());
        return;
      }

      for (let i = start; i < candidates.length; i++) {
        const value = candidates[i];
        if (value > remaining) {
          break;
        }
        if (i > start && candidates[i] === candidates[i - 1]) {
          continue;
        }
        path.push(value);
        backtrack(i, remaining - value);
        path.pop();
      }
    };

    backtrack(0, target);
    return results;
  }
}
