class CountEvenNumbers {
  countEvenNumbers(nums) {
    let count = 0;
    for (const value of nums) {
      if (value % 2 === 0) count++;
    }
    return count;
  }
}
