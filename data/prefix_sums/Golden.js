class PrefixSums {
  prefixSums(nums) {
    const result = [];
    let sum = 0;
    for (const value of nums) {
      sum += value;
      result.push(sum);
    }
    return result;
  }
}
