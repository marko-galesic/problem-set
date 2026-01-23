class ContainsDuplicate {
  containsDuplicate(nums) {
    if (nums === null || nums === undefined || nums.length === 0) {
      return false;
    }
    const seen = new Set();
    for (const num of nums) {
      if (seen.has(num)) {
        return true;
      }
      seen.add(num);
    }
    return false;
  }
}
