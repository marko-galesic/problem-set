class HouseRobber {
  rob(nums) {
    let prev2 = 0;
    let prev1 = 0;
    for (const n of nums) {
      const cur = Math.max(prev1, prev2 + n);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  }
}
