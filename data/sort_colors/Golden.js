class SortColors {
  sortColors(nums) {
    if (!nums) {
      return [];
    }
    let count0 = 0;
    let count1 = 0;
    let count2 = 0;
    for (const num of nums) {
      if (num === 0) {
        count0++;
      } else if (num === 1) {
        count1++;
      } else {
        count2++;
      }
    }
    const result = [];
    for (let i = 0; i < count0; i++) {
      result.push(0);
    }
    for (let i = 0; i < count1; i++) {
      result.push(1);
    }
    for (let i = 0; i < count2; i++) {
      result.push(2);
    }
    return result;
  }
}
