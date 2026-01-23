export const standardAdapterDefinitions = {
  bestTimeToBuyAndSellStock: {
    method: 'maxProfit',
    className: 'BestTimeToBuyAndSellStock',
    returnType: 'int',
    inputs: [
      {
        name: 'prices',
        type: 'intArray',
        helperBase: 'Prices',
      },
    ]
  },
  binarySearch: {
    method: 'binarySearch',
    className: 'BinarySearch',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  climbingStairs: {
    method: 'climbStairs',
    className: 'ClimbingStairs',
    returnType: 'int',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
    ]
  },
  coinChange: {
    method: 'coinChange',
    className: 'CoinChange',
    returnType: 'int',
    inputs: [
      {
        name: 'coins',
        type: 'intArray',
        helperBase: 'Coins',
      },
      {
        name: 'amount',
        type: 'int',
        helperBase: 'Amount',
      },
    ]
  },
  combinationSum: {
    method: 'combinationSum',
    className: 'CombinationSum',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'candidates',
        type: 'intArray',
        helperBase: 'Candidates',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  combinationSumIi: {
    method: 'combinationSum2',
    className: 'CombinationSumII',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'candidates',
        type: 'intArray',
        helperBase: 'Candidates',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  containerWithMostWater: {
    method: 'maxArea',
    className: 'ContainerWithMostWater',
    returnType: 'int',
    inputs: [
      {
        name: 'height',
        type: 'intArray',
        helperBase: 'Height',
      },
    ]
  },
  containsDuplicate: {
    method: 'containsDuplicate',
    className: 'ContainsDuplicate',
    returnType: 'boolean',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  fibonacciNumber: {
    method: 'fib',
    className: 'FibonacciNumber',
    returnType: 'int',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
    ]
  },
  findMinimumInRotatedSortedArray: {
    method: 'findMin',
    className: 'FindMinimumInRotatedSortedArray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  firstUniqueCharacter: {
    method: 'firstUniqChar',
    className: 'FirstUniqueCharacter',
    returnType: 'int',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'basic',
      },
    ]
  },
  fourSum: {
    method: 'fourSum',
    className: 'FourSum',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  generateParentheses: {
    method: 'generateParenthesis',
    className: 'GenerateParentheses',
    returnType: 'stringArray',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
    ]
  },
  groupAnagrams: {
    method: 'groupAnagrams',
    className: 'GroupAnagrams',
    returnType: 'stringMatrix',
    inputs: [
      {
        name: 'strs',
        type: 'stringArray',
        helperBase: 'Strs',
      },
    ]
  },
  insertInterval: {
    method: 'insert',
    className: 'InsertInterval',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'intervals',
        type: 'intGrid',
        helperBase: 'Intervals',
      },
      {
        name: 'newInterval',
        type: 'intArray',
        helperBase: 'NewInterval',
      },
    ]
  },
  isSubsequence: {
    method: 'isSubsequence',
    className: 'IsSubsequence',
    returnType: 'boolean',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'full',
      },
      {
        name: 't',
        type: 'string',
        helperBase: 'T',
        stringEscape: 'full',
      },
    ]
  },
  kthLargestElementInAnArray: {
    method: 'findKthLargest',
    className: 'KthLargestElementInAnArray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      },
    ]
  },
  letterCombinationsOfAPhoneNumber: {
    method: 'letterCombinations',
    className: 'LetterCombinationsOfAPhoneNumber',
    returnType: 'stringArray',
    expectedVariant: 'stringArrayCoerceEmpty',
    serializerVariant: 'stringArrayCoerceEmpty',
    inputs: [
      {
        name: 'digits',
        type: 'string',
        helperBase: 'Digits',
        stringEscape: 'basic',
      },
    ]
  },
  longestCommonPrefix: {
    method: 'longestCommonPrefix',
    className: 'LongestCommonPrefix',
    returnType: 'string',
    inputs: [
      {
        name: 'strs',
        type: 'stringArray',
        helperBase: 'Strs',
      },
    ]
  },
  longestRepeatingCharacterReplacement: {
    method: 'characterReplacement',
    className: 'LongestRepeatingCharacterReplacement',
    returnType: 'int',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'basic',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      },
    ]
  },
  longestSubstringWithoutRepeatingCharacters: {
    method: 'lengthOfLongestSubstring',
    className: 'LongestSubstring',
    returnType: 'int',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'basic',
      },
    ]
  },
  majorityElement: {
    method: 'majorityElement',
    className: 'MajorityElement',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  maximumAverageSubarrayI: {
    method: 'findMaxAverage',
    className: 'MaximumAverageSubarrayI',
    returnType: 'double',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      },
    ]
  },
  maximumSubarray: {
    method: 'maxSubArray',
    className: 'MaximumSubarray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  meetingRooms: {
    method: 'canAttendMeetings',
    className: 'MeetingRooms',
    returnType: 'boolean',
    inputs: [
      {
        name: 'intervals',
        type: 'intGrid',
        helperBase: 'Intervals',
      },
    ]
  },
  meetingRoomsIi: {
    method: 'minMeetingRooms',
    className: 'MeetingRoomsII',
    returnType: 'int',
    inputs: [
      {
        name: 'intervals',
        type: 'intGrid',
        helperBase: 'Intervals',
      },
    ]
  },
  mergeIntervals: {
    method: 'merge',
    className: 'MergeIntervals',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'intervals',
        type: 'intGrid',
        helperBase: 'Intervals',
      },
    ]
  },
  minimumWindowSubstring: {
    method: 'minWindow',
    className: 'MinimumWindowSubstring',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'full',
      },
      {
        name: 't',
        type: 'string',
        helperBase: 'T',
        stringEscape: 'full',
      },
    ]
  },
  moveZeroes: {
    method: 'moveZeroes',
    className: 'MoveZeroes',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  nonOverlappingIntervals: {
    method: 'eraseOverlapIntervals',
    className: 'NonOverlappingIntervals',
    returnType: 'int',
    inputs: [
      {
        name: 'intervals',
        type: 'intGrid',
        helperBase: 'Intervals',
      },
    ]
  },
  numberOfIslands: {
    method: 'numIslands',
    className: 'NumberOfIslands',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'charGrid',
        helperBase: 'Grid',
      },
    ]
  },
  permutationInString: {
    method: 'checkInclusion',
    className: 'PermutationInString',
    returnType: 'boolean',
    inputs: [
      {
        name: 's1',
        type: 'string',
        helperBase: 'S1',
        stringEscape: 'full',
      },
      {
        name: 's2',
        type: 'string',
        helperBase: 'S2',
        stringEscape: 'full',
      },
    ]
  },
  permutations: {
    method: 'permute',
    className: 'Permutations',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  productOfArrayExceptSelf: {
    method: 'productExceptSelf',
    className: 'ProductOfArrayExceptSelf',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  removeDuplicatesFromSortedArray: {
    method: 'removeDuplicates',
    className: 'RemoveDuplicatesFromSortedArray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  removeElement: {
    method: 'removeElement',
    className: 'RemoveElement',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'val',
        type: 'int',
        helperBase: 'Val',
        javaArrayName: 'vals',
      },
    ]
  },
  reverseString: {
    method: 'reverseString',
    className: 'ReverseString',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'basic',
      },
    ]
  },
  rotateImage: {
    method: 'rotate',
    className: 'RotateImage',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      },
    ]
  },
  rottingOranges: {
    method: 'orangesRotting',
    className: 'RottingOranges',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      },
    ]
  },
  searchInRotatedSortedArray: {
    method: 'search',
    className: 'SearchInRotatedSortedArray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  setMatrixZeroes: {
    method: 'setZeroes',
    className: 'SetMatrixZeroes',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      },
    ]
  },
  singleNumber: {
    method: 'singleNumber',
    className: 'SingleNumber',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  slidingWindowMaximum: {
    method: 'maxSlidingWindow',
    className: 'SlidingWindowMaximum',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      },
    ]
  },
  spiralMatrix: {
    method: 'spiralOrder',
    className: 'SpiralMatrix',
    returnType: 'intArray',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      },
    ]
  },
  subsets: {
    method: 'subsets',
    className: 'Subsets',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  subsetsIi: {
    method: 'subsetsWithDup',
    className: 'SubsetsII',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  sudokuSolver: {
    method: 'solveSudoku',
    className: 'SudokuSolver',
    returnType: 'charMatrix',
    inputs: [
      {
        name: 'board',
        type: 'charGrid',
        helperBase: 'Board',
      },
    ]
  },
  threeSum: {
    method: 'threeSum',
    className: 'ThreeSum',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  toLowerCase: {
    method: 'toLowerCase',
    className: 'ToLowerCase',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'full',
      },
    ]
  },
  topKFrequentElements: {
    method: 'topKFrequent',
    className: 'TopKFrequentElements',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      },
    ]
  },
  topKFrequentWords: {
    method: 'topKFrequent',
    className: 'TopKFrequentWords',
    returnType: 'stringArray',
    inputs: [
      {
        name: 'words',
        type: 'stringArray',
        helperBase: 'Words',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      },
    ]
  },
  trappingRainWater: {
    method: 'trap',
    className: 'TrappingRainWater',
    returnType: 'int',
    inputs: [
      {
        name: 'height',
        type: 'intArray',
        helperBase: 'Height',
      },
    ]
  },
  twoSum: {
    method: 'twoSum',
    className: 'TwoSum',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  twoSumIiInputSorted: {
    method: 'twoSum',
    className: 'TwoSumIiInputSorted',
    returnType: 'intArray',
    inputs: [
      {
        name: 'numbers',
        type: 'intArray',
        helperBase: 'Numbers',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  validAnagram: {
    method: 'isAnagram',
    className: 'ValidAnagram',
    returnType: 'boolean',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'full',
      },
      {
        name: 't',
        type: 'string',
        helperBase: 'T',
        stringEscape: 'full',
      },
    ]
  },
  validMountainArray: {
    method: 'validMountainArray',
    className: 'ValidMountainArray',
    returnType: 'boolean',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      },
    ]
  },
  validPalindrome: {
    method: 'isPalindrome',
    className: 'ValidPalindrome',
    returnType: 'boolean',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'full',
      },
    ]
  },
  validPalindromeIi: {
    method: 'validPalindrome',
    className: 'ValidPalindromeII',
    returnType: 'boolean',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'full',
      },
    ]
  },
  validParentheses: {
    method: 'isValid',
    className: 'ValidParentheses',
    returnType: 'boolean',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'basic',
      },
    ]
  },
  validSudoku: {
    method: 'isValidSudoku',
    className: 'ValidSudoku',
    returnType: 'boolean',
    inputs: [
      {
        name: 'board',
        type: 'charGrid',
        helperBase: 'Board',
      },
    ]
  },
  wordSearch: {
    method: 'exist',
    className: 'WordSearch',
    returnType: 'boolean',
    pythonInputJoiner: '\n\n',
    inputs: [
      {
        name: 'board',
        type: 'charGrid',
        helperBase: 'Board',
      },
      {
        name: 'word',
        type: 'string',
        helperBase: 'Word',
        stringEscape: 'basic',
      },
    ]
  },
};
