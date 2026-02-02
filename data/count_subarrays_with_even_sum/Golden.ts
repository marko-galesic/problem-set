class CountSubarraysWithEvenSum {
  countSubarraysWithEvenSum(nums) {
    if (!nums) {
      return 0;
    }
    let even = 1;
    let odd = 0;
    let total = 0;
    let running = 0;
    for (const n of nums) {
      running += n;
      if (running % 2 === 0) {
        total += even;
        even++;
      } else {
        total += odd;
        odd++;
      }
    }
    return total;
  }
}
