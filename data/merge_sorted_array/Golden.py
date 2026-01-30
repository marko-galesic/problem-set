class MergeSortedArray:
    def mergeSortedArray(self, nums1, m, nums2, n):
        result = [0] * (m + n)
        i = j = k = 0
        while i < m and j < n:
            if nums1[i] <= nums2[j]:
                result[k] = nums1[i]
                i += 1
            else:
                result[k] = nums2[j]
                j += 1
            k += 1
        while i < m:
            result[k] = nums1[i]
            i += 1
            k += 1
        while j < n:
            result[k] = nums2[j]
            j += 1
            k += 1
        return result
