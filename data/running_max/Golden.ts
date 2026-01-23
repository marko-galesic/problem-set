class RunningMax {
  runningMax(nums) {
    if (nums.length === 0) return [];
    const result = [];
    let current = nums[0];
    for (const value of nums) {
      if (value > current) current = value;
      result.push(current);
    }
    return result;
  }
}
