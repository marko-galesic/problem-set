class MergeSortedArray {
  mergeSortedArray(nums1, m, nums2, n) {
    const result = new Array(m + n);
    let i = 0;
    let j = 0;
    let k = 0;
    while (i < m && j < n) {
      if (nums1[i] <= nums2[j]) {
        result[k++] = nums1[i++];
      } else {
        result[k++] = nums2[j++];
      }
    }
    while (i < m) result[k++] = nums1[i++];
    while (j < n) result[k++] = nums2[j++];
    return result;
  }
}
