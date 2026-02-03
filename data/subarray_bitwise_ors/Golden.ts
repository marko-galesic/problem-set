class SubarrayBitwiseOrs {
  subarrayBitwiseORs(arr) {
    let result = new Set();
    let prev = new Set();
    for (const n of arr) {
      const cur = new Set();
      cur.add(n);
      for (const v of prev) {
        cur.add(v | n);
      }
      for (const v of cur) {
        result.add(v);
      }
      prev = cur;
    }
    return result.size;
  }
}
