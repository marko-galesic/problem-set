/**
 * Adapter for Top K Frequent Elements challenge
 * Handles topKFrequent(int[] nums, int k) method that returns int[]
 */

import { createAdapter } from './baseAdapter.js';
import {
  buildExpectedIntArrayCode,
  buildIntArrayInputHelper,
  buildIntScalarInputHelper
} from './helpers/java.js';

export default createAdapter({
  extractInput: (testCase) => {
    return {
      nums: testCase.nums !== undefined ? testCase.nums : [],
      k: testCase.k !== undefined ? testCase.k : 0
    };
  },
  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedIntArrayCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `    // Serialize an int[] to a canonical frequency-desc string
    private static Map<Integer, Integer> currentFreqMap = null;

    private static void setCurrentFreqMap(int[] nums) {
        currentFreqMap = new HashMap<>();
        if (nums == null) return;
        for (int n : nums) {
            currentFreqMap.put(n, currentFreqMap.getOrDefault(n, 0) + 1);
        }
    }

    private static String serializeIntArray(int[] arr) {
        if (arr == null) return "null";
        if (arr.length == 0) return "[]";

        Integer[] boxed = new Integer[arr.length];
        for (int i = 0; i < arr.length; i++) {
            boxed[i] = arr[i];
        }

        Arrays.sort(boxed, (a, b) -> {
            int fa = currentFreqMap != null ? currentFreqMap.getOrDefault(a, 0) : 0;
            int fb = currentFreqMap != null ? currentFreqMap.getOrDefault(b, 0) : 0;
            if (fa != fb) return Integer.compare(fb, fa);
            return Integer.compare(a, b);
        });

        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < boxed.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append(boxed[i]);
        }
        sb.append("]");
        return sb.toString();
    }`;
  },
  generateInvocation: (parserVar) => {
    return `                    int[] nums = getTestNums(i);
                    int k = getTestK(i);
                    setCurrentFreqMap(nums);
                    actual = ${parserVar}.topKFrequent(nums, k);`;
  },
  generateInputHelpers: (testCases) => {
    return [
      buildIntArrayInputHelper(testCases, 'nums', 'getTestNums'),
      buildIntScalarInputHelper(testCases, 'k', 'getTestK')
    ].join('\n\n');
  },
  getReturnType: () => 'int[]',
  getSerializerMethod: () => 'serializeIntArray',
  getDefaultClassName: () => 'TopKFrequentElements'
});
