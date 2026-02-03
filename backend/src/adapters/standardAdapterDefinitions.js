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
  sumOfDigitSquares: {
    method: 'sumOfDigitSquares',
    className: 'SumOfDigitSquares',
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
  rotateStringK: {
    method: 'rotateStringK',
    className: 'RotateStringK',
    returnType: 'string',
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
        javaArrayName: 'ks',
      },
    ]
  },
  firstNonRepeatingChar: {
    method: 'firstNonRepeatingChar',
    className: 'FirstNonRepeatingChar',
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
  isPowerOfThree: {
    method: 'isPowerOfThree',
    className: 'IsPowerOfThree',
    returnType: 'boolean',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
    ]
  },
  countSetBits: {
    method: 'countSetBits',
    className: 'CountSetBits',
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
  reverseWordsInString: {
    method: 'reverseWordsInString',
    className: 'ReverseWordsInString',
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
  arrayProductExceptSelf: {
    method: 'arrayProductExceptSelf',
    className: 'ArrayProductExceptSelf',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  maximumSubarraySumK: {
    method: 'maximumSubarraySumK',
    className: 'MaximumSubarraySumK',
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
        javaArrayName: 'ks',
      },
    ]
  },
  minStepsToZero: {
    method: 'minStepsToZero',
    className: 'MinStepsToZero',
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
  longestRunOfOnes: {
    method: 'longestRunOfOnes',
    className: 'LongestRunOfOnes',
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
  validParenthesesWithStar: {
    method: 'validParenthesesWithStar',
    className: 'ValidParenthesesWithStar',
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
  removeAdjacentDuplicates: {
    method: 'removeAdjacentDuplicates',
    className: 'RemoveAdjacentDuplicates',
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
  mergeKSortedLists: {
    method: 'mergeKSortedLists',
    className: 'MergeKSortedLists',
    returnType: 'intArray',
    inputs: [
      {
        name: 'lists',
        type: 'intGrid',
        helperBase: 'Lists',
      },
    ]
  },
  partitionEqualSubsetSum: {
    method: 'canPartition',
    className: 'PartitionEqualSubsetSum',
    returnType: 'boolean',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  coinChangeMinCoins: {
    method: 'coinChangeMinCoins',
    className: 'CoinChangeMinCoins',
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
  longestCommonSubsequence: {
    method: 'longestCommonSubsequence',
    className: 'LongestCommonSubsequence',
    returnType: 'int',
    inputs: [
      {
        name: 'text1',
        type: 'string',
        helperBase: 'Text1',
        stringEscape: 'basic',
      },
      {
        name: 'text2',
        type: 'string',
        helperBase: 'Text2',
        stringEscape: 'basic',
      },
    ]
  },
  editDistance: {
    method: 'editDistance',
    className: 'EditDistance',
    returnType: 'int',
    inputs: [
      {
        name: 'word1',
        type: 'string',
        helperBase: 'Word1',
        stringEscape: 'basic',
      },
      {
        name: 'word2',
        type: 'string',
        helperBase: 'Word2',
        stringEscape: 'basic',
      },
    ]
  },
  uniquePathsWithObstacles: {
    method: 'uniquePathsWithObstacles',
    className: 'UniquePathsWithObstacles',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      },
    ]
  },
  isomorphicStrings: {
    method: 'isIsomorphic',
    className: 'IsomorphicStrings',
    returnType: 'boolean',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      },
      {
        name: 't',
        type: 'string',
        helperBase: 'T',
        stringEscape: 'basic',
      },
    ]
  },
  findPeakElement: {
    method: 'findPeakElement',
    className: 'FindPeakElement',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  spiralMatrixTraversal: {
    method: 'spiralMatrixTraversal',
    className: 'SpiralMatrixTraversal',
    returnType: 'intArray',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      },
    ]
  },
  houseRobber: {
    method: 'rob',
    className: 'HouseRobber',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  jumpGame: {
    method: 'canJump',
    className: 'JumpGame',
    returnType: 'boolean',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  searchInsertPosition: {
    method: 'searchInsert',
    className: 'SearchInsertPosition',
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
  search2dMatrix: {
    method: 'searchMatrix',
    className: 'Search2dMatrix',
    returnType: 'boolean',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  mergeSortedArray: {
    method: 'mergeSortedArray',
    className: 'MergeSortedArray',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums1',
        type: 'intArray',
        helperBase: 'Nums1',
      },
      {
        name: 'm',
        type: 'int',
        helperBase: 'M',
        javaArrayName: 'ms',
      },
      {
        name: 'nums2',
        type: 'intArray',
        helperBase: 'Nums2',
      },
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
    ]
  },
  plusOne: {
    method: 'plusOne',
    className: 'PlusOne',
    returnType: 'intArray',
    inputs: [
      {
        name: 'digits',
        type: 'intArray',
        helperBase: 'Digits',
      },
    ]
  },
  addStrings: {
    method: 'addStrings',
    className: 'AddStrings',
    returnType: 'string',
    inputs: [
      {
        name: 'num1',
        type: 'string',
        helperBase: 'Num1',
        stringEscape: 'basic',
      },
      {
        name: 'num2',
        type: 'string',
        helperBase: 'Num2',
        stringEscape: 'basic',
      },
    ]
  },
  multiplyStrings: {
    method: 'multiplyStrings',
    className: 'MultiplyStrings',
    returnType: 'string',
    inputs: [
      {
        name: 'num1',
        type: 'string',
        helperBase: 'Num1',
        stringEscape: 'basic',
      },
      {
        name: 'num2',
        type: 'string',
        helperBase: 'Num2',
        stringEscape: 'basic',
      },
    ]
  },
  romanToInteger: {
    method: 'romanToInt',
    className: 'RomanToInteger',
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
  integerToRoman: {
    method: 'intToRoman',
    className: 'IntegerToRoman',
    returnType: 'string',
    inputs: [
      {
        name: 'num',
        type: 'int',
        helperBase: 'Num',
        javaArrayName: 'nums',
      },
    ]
  },
  longestPalindromicSubstring: {
    method: 'longestPalindrome',
    className: 'LongestPalindromicSubstring',
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
  palindromeNumber: {
    method: 'isPalindrome',
    className: 'PalindromeNumber',
    returnType: 'boolean',
    inputs: [
      {
        name: 'x',
        type: 'int',
        helperBase: 'X',
        javaArrayName: 'xs',
      },
    ]
  },
  reverseBits: {
    method: 'reverseBits',
    className: 'ReverseBits',
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
  hammingDistance: {
    method: 'hammingDistance',
    className: 'HammingDistance',
    returnType: 'int',
    inputs: [
      {
        name: 'x',
        type: 'int',
        helperBase: 'X',
        javaArrayName: 'xs',
      },
      {
        name: 'y',
        type: 'int',
        helperBase: 'Y',
        javaArrayName: 'ys',
      },
    ]
  },
  missingNumber: {
    method: 'missingNumber',
    className: 'MissingNumber',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  findPivotIndex: {
    method: 'pivotIndex',
    className: 'FindPivotIndex',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  rangeSumQueryImmutable: {
    method: 'rangeSum',
    className: 'RangeSumQueryImmutable',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
      {
        name: 'left',
        type: 'int',
        helperBase: 'Left',
        javaArrayName: 'lefts',
      },
      {
        name: 'right',
        type: 'int',
        helperBase: 'Right',
        javaArrayName: 'rights',
      },
    ]
  },
  floodFill: {
    method: 'floodFill',
    className: 'FloodFill',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'image',
        type: 'intGrid',
        helperBase: 'Image',
      },
      {
        name: 'sr',
        type: 'int',
        helperBase: 'Sr',
        javaArrayName: 'srs',
      },
      {
        name: 'sc',
        type: 'int',
        helperBase: 'Sc',
        javaArrayName: 'scs',
      },
      {
        name: 'color',
        type: 'int',
        helperBase: 'Color',
        javaArrayName: 'colors',
      },
    ]
  },
  islandPerimeter: {
    method: 'islandPerimeter',
    className: 'IslandPerimeter',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      },
    ]
  },
  minStack: {
    method: 'minStackOps',
    className: 'MinStack',
    returnType: 'intArray',
    inputs: [
      {
        name: 'ops',
        type: 'stringArray',
        helperBase: 'Ops',
      },
      {
        name: 'values',
        type: 'intGrid',
        helperBase: 'Values',
      },
    ]
  },
  implementTrie: {
    method: 'trieOps',
    className: 'ImplementTrie',
    returnType: 'intArray',
    inputs: [
      {
        name: 'ops',
        type: 'stringArray',
        helperBase: 'Ops',
      },
      {
        name: 'words',
        type: 'stringArray',
        helperBase: 'Words',
      },
    ]
  },
  addAndSearchWord: {
    method: 'wordDictionaryOps',
    className: 'AddAndSearchWord',
    returnType: 'intArray',
    inputs: [
      {
        name: 'ops',
        type: 'stringArray',
        helperBase: 'Ops',
      },
      {
        name: 'words',
        type: 'stringArray',
        helperBase: 'Words',
      },
    ]
  },
  replaceWords: {
    method: 'replaceWords',
    className: 'ReplaceWords',
    returnType: 'string',
    inputs: [
      {
        name: 'dictionary',
        type: 'stringArray',
        helperBase: 'Dictionary',
      },
      {
        name: 'sentence',
        type: 'string',
        helperBase: 'Sentence',
      },
    ]
  },
  wordSearchIi: {
    method: 'findWords',
    className: 'WordSearchII',
    returnType: 'stringArray',
    inputs: [
      {
        name: 'board',
        type: 'charGrid',
        helperBase: 'Board',
      },
      {
        name: 'words',
        type: 'stringArray',
        helperBase: 'Words',
      },
    ]
  },
  prefixAndSuffixSearch: {
    method: 'prefixSuffixSearch',
    className: 'PrefixAndSuffixSearch',
    returnType: 'intArray',
    inputs: [
      {
        name: 'words',
        type: 'stringArray',
        helperBase: 'Words',
      },
      {
        name: 'queries',
        type: 'stringArray',
        helperBase: 'Queries',
      },
    ]
  },
  searchSuggestionsSystem: {
    method: 'suggestedProducts',
    className: 'SearchSuggestionsSystem',
    returnType: 'stringMatrix',
    inputs: [
      {
        name: 'products',
        type: 'stringArray',
        helperBase: 'Products',
      },
      {
        name: 'searchWord',
        type: 'string',
        helperBase: 'SearchWord',
      },
    ]
  },
  mapSumPairs: {
    method: 'mapSumOps',
    className: 'MapSumPairs',
    returnType: 'intArray',
    inputs: [
      {
        name: 'ops',
        type: 'stringArray',
        helperBase: 'Ops',
      },
      {
        name: 'keys',
        type: 'stringArray',
        helperBase: 'Keys',
      },
      {
        name: 'vals',
        type: 'intArray',
        helperBase: 'Vals',
      },
    ]
  },
  longestWordInDictionary: {
    method: 'longestWord',
    className: 'LongestWordInDictionary',
    returnType: 'string',
    inputs: [
      {
        name: 'words',
        type: 'stringArray',
        helperBase: 'Words',
      },
    ]
  },
  streamOfCharacters: {
    method: 'streamQueries',
    className: 'StreamOfCharacters',
    returnType: 'intArray',
    inputs: [
      {
        name: 'words',
        type: 'stringArray',
        helperBase: 'Words',
      },
      {
        name: 'queries',
        type: 'stringArray',
        helperBase: 'Queries',
      },
    ]
  },
  maximumXorOfTwoNumbers: {
    method: 'findMaximumXOR',
    className: 'MaximumXorOfTwoNumbers',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  accountsMerge: {
    method: 'accountsMerge',
    className: 'AccountsMerge',
    returnType: 'stringMatrix',
    inputs: [
      {
        name: 'accounts',
        type: 'stringArray',
        helperBase: 'Accounts',
      },
    ]
  },
  redundantConnection: {
    method: 'findRedundantConnection',
    className: 'RedundantConnection',
    returnType: 'intArray',
    inputs: [
      {
        name: 'edges',
        type: 'intGrid',
        helperBase: 'Edges',
      },
    ]
  },
  numberOfProvinces: {
    method: 'findCircleNum',
    className: 'NumberOfProvinces',
    returnType: 'int',
    inputs: [
      {
        name: 'isConnected',
        type: 'intGrid',
        helperBase: 'IsConnected',
      },
    ]
  },
  satisfiabilityOfEqualityEquations: {
    method: 'equationsPossible',
    className: 'SatisfiabilityOfEqualityEquations',
    returnType: 'boolean',
    inputs: [
      {
        name: 'equations',
        type: 'stringArray',
        helperBase: 'Equations',
      },
    ]
  },
  lexicographicallySmallestEquivalentString: {
    method: 'smallestEquivalentString',
    className: 'LexicographicallySmallestEquivalentString',
    returnType: 'string',
    inputs: [
      {
        name: 's1',
        type: 'string',
        helperBase: 'S1',
      },
      {
        name: 's2',
        type: 'string',
        helperBase: 'S2',
      },
      {
        name: 'baseStr',
        type: 'string',
        helperBase: 'BaseStr',
      },
    ]
  },
  smallestStringWithSwaps: {
    method: 'smallestStringWithSwaps',
    className: 'SmallestStringWithSwaps',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
      },
      {
        name: 'pairs',
        type: 'intGrid',
        helperBase: 'Pairs',
      },
    ]
  },
  mostStonesRemoved: {
    method: 'removeStones',
    className: 'MostStonesRemoved',
    returnType: 'int',
    inputs: [
      {
        name: 'stones',
        type: 'intGrid',
        helperBase: 'Stones',
      },
    ]
  },
  regionsCutBySlashes: {
    method: 'regionsBySlashes',
    className: 'RegionsCutBySlashes',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'stringArray',
        helperBase: 'Grid',
      },
    ]
  },
  dailyTemperatures: {
    method: 'dailyTemperatures',
    className: 'DailyTemperatures',
    returnType: 'intArray',
    inputs: [
      {
        name: 'temperatures',
        type: 'intArray',
        helperBase: 'Temperatures',
      },
    ]
  },
  nextGreaterElementI: {
    method: 'nextGreaterElement',
    className: 'NextGreaterElementI',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums1',
        type: 'intArray',
        helperBase: 'Nums1',
      },
      {
        name: 'nums2',
        type: 'intArray',
        helperBase: 'Nums2',
      },
    ]
  },
  nextGreaterElementIi: {
    method: 'nextGreaterElements',
    className: 'NextGreaterElementII',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  largestRectangleInHistogram: {
    method: 'largestRectangleArea',
    className: 'LargestRectangleInHistogram',
    returnType: 'int',
    inputs: [
      {
        name: 'heights',
        type: 'intArray',
        helperBase: 'Heights',
      },
    ]
  },
  sumOfSubarrayMinimums: {
    method: 'sumSubarrayMins',
    className: 'SumOfSubarrayMinimums',
    returnType: 'int',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      },
    ]
  },
  shortestUnsortedContinuousSubarray: {
    method: 'findUnsortedSubarray',
    className: 'ShortestUnsortedContinuousSubarray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  maximumWidthRamp: {
    method: 'maxWidthRamp',
    className: 'MaximumWidthRamp',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  subarraySumEqualsK: {
    method: 'subarraySum',
    className: 'SubarraySumEqualsK',
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
        javaArrayName: 'ks',
      },
    ]
  },
  contiguousArray: {
    method: 'findMaxLength',
    className: 'ContiguousArray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  minimumPathSum: {
    method: 'minPathSum',
    className: 'MinimumPathSum',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      },
    ]
  },
  uniquePaths: {
    method: 'uniquePaths',
    className: 'UniquePaths',
    returnType: 'int',
    inputs: [
      {
        name: 'm',
        type: 'int',
        helperBase: 'M',
        javaArrayName: 'ms',
      },
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
    ]
  },
  decodeWays: {
    method: 'numDecodings',
    className: 'DecodeWays',
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
  wordBreak: {
    method: 'wordBreak',
    className: 'WordBreak',
    returnType: 'boolean',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'basic',
      },
      {
        name: 'wordDict',
        type: 'stringArray',
        helperBase: 'WordDict',
      },
    ]
  },
  longestIncreasingSubsequence: {
    method: 'lengthOfLIS',
    className: 'LongestIncreasingSubsequence',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  spiralMatrixIi: {
    method: 'generateMatrix',
    className: 'SpiralMatrixII',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
    ]
  },
  search2dMatrixIi: {
    method: 'searchMatrix',
    className: 'Search2dMatrixII',
    returnType: 'boolean',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
    ]
  },
  findDuplicateNumber: {
    method: 'findDuplicate',
    className: 'FindDuplicateNumber',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  minimumSizeSubarraySum: {
    method: 'minSubArrayLen',
    className: 'MinimumSizeSubarraySum',
    returnType: 'int',
    inputs: [
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      },
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  partitionLabels: {
    method: 'partitionLabels',
    className: 'PartitionLabels',
    returnType: 'intArray',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'basic',
      },
    ]
  },
  nextPermutation: {
    method: 'nextPermutation',
    className: 'NextPermutation',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  kClosestPointsToOrigin: {
    method: 'kClosest',
    className: 'KClosestPointsToOrigin',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'points',
        type: 'intGrid',
        helperBase: 'Points',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
        javaArrayName: 'ks',
      },
    ]
  },
  intervalListIntersections: {
    method: 'intervalIntersection',
    className: 'IntervalListIntersections',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'firstList',
        type: 'intGrid',
        helperBase: 'FirstList',
      },
      {
        name: 'secondList',
        type: 'intGrid',
        helperBase: 'SecondList',
      },
    ]
  },
  combinationSumIii: {
    method: 'combinationSum3',
    className: 'CombinationSumIII',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
        javaArrayName: 'ks',
      },
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
    ]
  },
  sortColors: {
    method: 'sortColors',
    className: 'SortColors',
    returnType: 'intArray',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      },
    ]
  },
  kthSmallestInSortedMatrix: {
    method: 'kthSmallest',
    className: 'KthSmallestInSortedMatrix',
    returnType: 'int',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
        javaArrayName: 'ks',
      },
    ]
  },
  shortestPathInBinaryMatrix: {
    method: 'shortestPathBinaryMatrix',
    className: 'ShortestPathInBinaryMatrix',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      },
    ]
  },
  decodeString: {
    method: 'decodeString',
    className: 'DecodeString',
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
  evaluateReversePolishNotation: {
    method: 'evalRPN',
    className: 'EvaluateReversePolishNotation',
    returnType: 'int',
    inputs: [
      {
        name: 'tokens',
        type: 'stringArray',
        helperBase: 'Tokens',
      },
    ]
  },
  asteroidCollision: {
    method: 'asteroidCollision',
    className: 'AsteroidCollision',
    returnType: 'intArray',
    inputs: [
      {
        name: 'asteroids',
        type: 'intArray',
        helperBase: 'Asteroids',
      },
    ]
  },
  findAllAnagramsInAString: {
    method: 'findAnagrams',
    className: 'FindAllAnagramsInAString',
    returnType: 'intArray',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'String',
        stringEscape: 'basic',
      },
      {
        name: 'p',
        type: 'string',
        helperBase: 'Pattern',
        stringEscape: 'basic',
      },
    ]
  },
  subarrayProductLessThanK: {
    method: 'numSubarrayProductLessThanK',
    className: 'SubarrayProductLessThanK',
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
        javaArrayName: 'ks',
      },
    ]
  },
  maximalSquare: {
    method: 'maximalSquare',
    className: 'MaximalSquare',
    returnType: 'int',
    inputs: [
      {
        name: 'matrix',
        type: 'charGrid',
        helperBase: 'Matrix',
      },
    ]
  },

  maxProductSubarray: {
    method: 'maxProductSubarray',
    className: 'MaxProductSubarray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  longestSubarraySumEqualsK: {
    method: 'longestSubarraySumEqualsK',
    className: 'LongestSubarraySumEqualsK',
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
      }
    ]
  },
  subarraySumDivisibleByK: {
    method: 'subarraySumDivisibleByK',
    className: 'SubarraySumDivisibleByK',
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
      }
    ]
  },
  maxConsecutiveOnesWithKFlips: {
    method: 'maxConsecutiveOnesWithKFlips',
    className: 'MaxConsecutiveOnesWithKFlips',
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
      }
    ]
  },
  rotateArrayByK: {
    method: 'rotateArrayByK',
    className: 'RotateArrayByK',
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
      }
    ]
  },
  minimumSwapsToGroupOnes: {
    method: 'minimumSwapsToGroupOnes',
    className: 'MinimumSwapsToGroupOnes',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  longestMountainInArray: {
    method: 'longestMountainInArray',
    className: 'LongestMountainInArray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  kthMissingPositiveNumber: {
    method: 'kthMissingPositiveNumber',
    className: 'KthMissingPositiveNumber',
    returnType: 'int',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      }
    ]
  },
  maxSumOfMinPairs: {
    method: 'maxSumOfMinPairs',
    className: 'MaxSumOfMinPairs',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  removeDuplicatesAllowTwo: {
    method: 'removeDuplicatesAllowTwo',
    className: 'RemoveDuplicatesAllowTwo',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  countSubarraysWithEvenSum: {
    method: 'countSubarraysWithEvenSum',
    className: 'CountSubarraysWithEvenSum',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  longestSubarrayAtMostKDistinct: {
    method: 'longestSubarrayAtMostKDistinct',
    className: 'LongestSubarrayAtMostKDistinct',
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
      }
    ]
  },
  minimumRemoveToMakeValidParentheses: {
    method: 'minimumRemoveToMakeValidParentheses',
    className: 'MinimumRemoveToMakeValidParentheses',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      }
    ]
  },
  removeAdjacentKDuplicates: {
    method: 'removeAdjacentKDuplicates',
    className: 'RemoveAdjacentKDuplicates',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      }
    ]
  },
  oneEditDistance: {
    method: 'oneEditDistance',
    className: 'OneEditDistance',
    returnType: 'boolean',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      },
      {
        name: 't',
        type: 'string',
        helperBase: 'T',
        stringEscape: 'basic',
      }
    ]
  },
  longestPalindromeLength: {
    method: 'longestPalindromeLength',
    className: 'LongestPalindromeLength',
    returnType: 'int',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      }
    ]
  },
  longestSubstringKDistinct: {
    method: 'longestSubstringKDistinct',
    className: 'LongestSubstringKDistinct',
    returnType: 'int',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      }
    ]
  },
  countPalindromicSubstrings: {
    method: 'countPalindromicSubstrings',
    className: 'CountPalindromicSubstrings',
    returnType: 'int',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      }
    ]
  },
  stringRunLengthEncode: {
    method: 'stringRunLengthEncode',
    className: 'StringRunLengthEncode',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      }
    ]
  },
  simplifyPath: {
    method: 'simplifyPath',
    className: 'SimplifyPath',
    returnType: 'string',
    inputs: [
      {
        name: 'path',
        type: 'string',
        helperBase: 'Path',
        stringEscape: 'basic',
      }
    ]
  },
  matrixBlockSum: {
    method: 'matrixBlockSum',
    className: 'MatrixBlockSum',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'mat',
        type: 'intGrid',
        helperBase: 'Mat',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      }
    ]
  },
  diagonalTraverse: {
    method: 'diagonalTraverse',
    className: 'DiagonalTraverse',
    returnType: 'intArray',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      }
    ]
  },
  maxAreaOfIsland: {
    method: 'maxAreaOfIsland',
    className: 'MaxAreaOfIsland',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      }
    ]
  },
  numberOfClosedIslands: {
    method: 'numberOfClosedIslands',
    className: 'NumberOfClosedIslands',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      }
    ]
  },
  countBattleships: {
    method: 'countBattleships',
    className: 'CountBattleships',
    returnType: 'int',
    inputs: [
      {
        name: 'board',
        type: 'charGrid',
        helperBase: 'Board',
      }
    ]
  },
  longestConsecutiveSequence: {
    method: 'longestConsecutive',
    className: 'LongestConsecutiveSequence',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  minIncrementToMakeArrayUnique: {
    method: 'minIncrementForUnique',
    className: 'MinIncrementToMakeArrayUnique',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  checkSubarraySumMultipleOfK: {
    method: 'checkSubarraySum',
    className: 'CheckSubarraySumMultipleOfK',
    returnType: 'boolean',
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
      }
    ]
  },
  maximumSumCircularSubarray: {
    method: 'maxSubarraySumCircular',
    className: 'MaximumSumCircularSubarray',
    returnType: 'int',
    inputs: [
      {
        name: 'nums',
        type: 'intArray',
        helperBase: 'Nums',
      }
    ]
  },
  minCostClimbingStairs: {
    method: 'minCostClimbingStairs',
    className: 'MinCostClimbingStairs',
    returnType: 'int',
    inputs: [
      {
        name: 'cost',
        type: 'intArray',
        helperBase: 'Cost',
      }
    ]
  },
  findKClosestElements: {
    method: 'findClosestElements',
    className: 'FindKClosestElements',
    returnType: 'intArray',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      },
      {
        name: 'x',
        type: 'int',
        helperBase: 'X',
      }
    ]
  },
  kDiffPairsInArray: {
    method: 'findPairs',
    className: 'KDiffPairsInArray',
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
      }
    ]
  },
  minimumTimeDifference: {
    method: 'findMinDifference',
    className: 'MinimumTimeDifference',
    returnType: 'int',
    inputs: [
      {
        name: 'timePoints',
        type: 'stringArray',
        helperBase: 'TimePoints',
      }
    ]
  },
  reorganizeString: {
    method: 'reorganizeString',
    className: 'ReorganizeString',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      }
    ]
  },
  removeKDigits: {
    method: 'removeKdigits',
    className: 'RemoveKDigits',
    returnType: 'string',
    inputs: [
      {
        name: 'num',
        type: 'string',
        helperBase: 'Num',
        stringEscape: 'basic',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
      }
    ]
  },
  smallestSubsequenceOfDistinctChars: {
    method: 'smallestSubsequence',
    className: 'SmallestSubsequenceOfDistinctChars',
    returnType: 'string',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      }
    ]
  },
  longestCommonSubstring: {
    method: 'longestCommonSubstring',
    className: 'LongestCommonSubstring',
    returnType: 'int',
    inputs: [
      {
        name: 'a',
        type: 'string',
        helperBase: 'A',
        stringEscape: 'basic',
      },
      {
        name: 'b',
        type: 'string',
        helperBase: 'B',
        stringEscape: 'basic',
      }
    ]
  },
  groupShiftedStrings: {
    method: 'groupShiftedStrings',
    className: 'GroupShiftedStrings',
    returnType: 'stringMatrix',
    inputs: [
      {
        name: 'strings',
        type: 'stringArray',
        helperBase: 'Strings',
      }
    ]
  },
  validateIPAddress: {
    method: 'validIPAddress',
    className: 'ValidateIPAddress',
    returnType: 'string',
    inputs: [
      {
        name: 'queryIP',
        type: 'string',
        helperBase: 'QueryIP',
        stringEscape: 'basic',
      }
    ]
  },
  minimumDeletionsToMakeStringBalanced: {
    method: 'minimumDeletions',
    className: 'MinimumDeletionsToMakeStringBalanced',
    returnType: 'int',
    inputs: [
      {
        name: 's',
        type: 'string',
        helperBase: 'S',
        stringEscape: 'basic',
      }
    ]
  },
  maximalRectangle: {
    method: 'maximalRectangle',
    className: 'MaximalRectangle',
    returnType: 'int',
    inputs: [
      {
        name: 'matrix',
        type: 'charGrid',
        helperBase: 'Matrix',
      }
    ]
  },
  minimumFallingPathSum: {
    method: 'minFallingPathSum',
    className: 'MinimumFallingPathSum',
    returnType: 'int',
    inputs: [
      {
        name: 'matrix',
        type: 'intGrid',
        helperBase: 'Matrix',
      }
    ]
  },
  numberOfEnclaves: {
    method: 'numEnclaves',
    className: 'NumberOfEnclaves',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      }
    ]
  },
  countSubIslands: {
    method: 'countSubIslands',
    className: 'CountSubIslands',
    returnType: 'int',
    inputs: [
      {
        name: 'grid1',
        type: 'intGrid',
        helperBase: 'Grid1',
      },
      {
        name: 'grid2',
        type: 'intGrid',
        helperBase: 'Grid2',
      }
    ]
  },
  shortestBridge: {
    method: 'shortestBridge',
    className: 'ShortestBridge',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      }
    ]
  },
  equalRowAndColumnPairs: {
    method: 'equalPairs',
    className: 'EqualRowAndColumnPairs',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      }
    ]
  },
  longestTurbulentSubarray: {
    method: 'maxTurbulenceSize',
    className: 'LongestTurbulentSubarray',
    returnType: 'int',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      }
    ]
  },
  maxChunksToMakeSorted: {
    method: 'maxChunksToSorted',
    className: 'MaxChunksToMakeSorted',
    returnType: 'int',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      }
    ]
  },
  subarrayBitwiseORs: {
    method: 'subarrayBitwiseORs',
    className: 'SubarrayBitwiseOrs',
    returnType: 'int',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      }
    ]
  },
  peakIndexInMountainArray: {
    method: 'peakIndexInMountainArray',
    className: 'PeakIndexInMountainArray',
    returnType: 'int',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      }
    ]
  },
  wordLadderLength: {
    method: 'ladderLength',
    className: 'WordLadderLength',
    returnType: 'int',
    inputs: [
      {
        name: 'beginWord',
        type: 'string',
        helperBase: 'BeginWord',
      },
      {
        name: 'endWord',
        type: 'string',
        helperBase: 'EndWord',
      },
      {
        name: 'wordList',
        type: 'stringArray',
        helperBase: 'WordList',
      }
    ]
  },
  openTheLock: {
    method: 'openLock',
    className: 'OpenTheLock',
    returnType: 'int',
    inputs: [
      {
        name: 'deadends',
        type: 'stringArray',
        helperBase: 'Deadends',
      },
      {
        name: 'target',
        type: 'string',
        helperBase: 'Target',
      }
    ]
  },
  nearestExitInMaze: {
    method: 'nearestExit',
    className: 'NearestExitInMaze',
    returnType: 'int',
    inputs: [
      {
        name: 'maze',
        type: 'charGrid',
        helperBase: 'Maze',
      },
      {
        name: 'entrance',
        type: 'intArray',
        helperBase: 'Entrance',
      }
    ]
  },
  wallsAndGates: {
    method: 'wallsAndGates',
    className: 'WallsAndGates',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'rooms',
        type: 'intGrid',
        helperBase: 'Rooms',
      }
    ]
  },
  zeroOneMatrix: {
    method: 'updateMatrix',
    className: 'ZeroOneMatrix',
    returnType: 'intMatrix',
    inputs: [
      {
        name: 'mat',
        type: 'intGrid',
        helperBase: 'Mat',
      }
    ]
  },
  shortestPathToFood: {
    method: 'shortestPathToFood',
    className: 'ShortestPathToFood',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'charGrid',
        helperBase: 'Grid',
      }
    ]
  },
  minimumKnightMoves: {
    method: 'minKnightMoves',
    className: 'MinimumKnightMoves',
    returnType: 'int',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
      {
        name: 'start',
        type: 'intArray',
        helperBase: 'Start',
      },
      {
        name: 'end',
        type: 'intArray',
        helperBase: 'End',
      }
    ]
  },
  minimumGeneticMutation: {
    method: 'minMutation',
    className: 'MinimumGeneticMutation',
    returnType: 'int',
    inputs: [
      {
        name: 'start',
        type: 'string',
        helperBase: 'Start',
      },
      {
        name: 'end',
        type: 'string',
        helperBase: 'End',
      },
      {
        name: 'bank',
        type: 'stringArray',
        helperBase: 'Bank',
      }
    ]
  },
  shortestPathUnweightedGraph: {
    method: 'shortestPath',
    className: 'ShortestPathUnweightedGraph',
    returnType: 'int',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
      {
        name: 'edges',
        type: 'intGrid',
        helperBase: 'Edges',
      },
      {
        name: 'start',
        type: 'int',
        helperBase: 'Start',
        javaArrayName: 'starts',
      },
      {
        name: 'end',
        type: 'int',
        helperBase: 'End',
        javaArrayName: 'ends',
      }
    ]
  },
  shortestPathWithObstaclesElimination: {
    method: 'shortestPath',
    className: 'ShortestPathWithObstaclesElimination',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
        javaArrayName: 'ks',
      }
    ]
  },
  minStepsToReachTarget: {
    method: 'minStepsToReachTarget',
    className: 'MinStepsToReachTarget',
    returnType: 'int',
    inputs: [
      {
        name: 'start',
        type: 'int',
        helperBase: 'Start',
        javaArrayName: 'starts',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      }
    ]
  },
  jumpGameIvMinJumps: {
    method: 'minJumps',
    className: 'JumpGameIvMinJumps',
    returnType: 'int',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      }
    ]
  },
  busRoutesMinBuses: {
    method: 'numBusesToDestination',
    className: 'BusRoutesMinBuses',
    returnType: 'int',
    inputs: [
      {
        name: 'routes',
        type: 'intGrid',
        helperBase: 'Routes',
      },
      {
        name: 'source',
        type: 'int',
        helperBase: 'Source',
        javaArrayName: 'sources',
      },
      {
        name: 'target',
        type: 'int',
        helperBase: 'Target',
        javaArrayName: 'targets',
      }
    ]
  },
  rollingBallMazeShortestPath: {
    method: 'shortestDistance',
    className: 'RollingBallMazeShortestPath',
    returnType: 'int',
    inputs: [
      {
        name: 'maze',
        type: 'intGrid',
        helperBase: 'Maze',
      },
      {
        name: 'start',
        type: 'intArray',
        helperBase: 'Start',
      },
      {
        name: 'destination',
        type: 'intArray',
        helperBase: 'Destination',
      }
    ]
  },
  shortestPathInBinaryMatrix4Dir: {
    method: 'shortestPathBinaryMatrix4Dir',
    className: 'ShortestPathInBinaryMatrix4Dir',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      }
    ]
  },
  shortestPathCollectAllKeys: {
    method: 'shortestPathAllKeys',
    className: 'ShortestPathCollectAllKeys',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'charGrid',
        helperBase: 'Grid',
      }
    ]
  },
  maxDistanceFromLand: {
    method: 'maxDistance',
    className: 'MaxDistanceFromLand',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'intGrid',
        helperBase: 'Grid',
      }
    ]
  },
  shortestPathWithPortals: {
    method: 'shortestPathWithPortals',
    className: 'ShortestPathWithPortals',
    returnType: 'int',
    inputs: [
      {
        name: 'grid',
        type: 'charGrid',
        helperBase: 'Grid',
      }
    ]
  },
  wordLadderPathsCount: {
    method: 'ladderPathCount',
    className: 'WordLadderPathsCount',
    returnType: 'int',
    inputs: [
      {
        name: 'beginWord',
        type: 'string',
        helperBase: 'BeginWord',
      },
      {
        name: 'endWord',
        type: 'string',
        helperBase: 'EndWord',
      },
      {
        name: 'wordList',
        type: 'stringArray',
        helperBase: 'WordList',
      }
    ]
  },
  wordGraphDistances: {
    method: 'wordGraphDistances',
    className: 'WordGraphDistances',
    returnType: 'intArray',
    inputs: [
      {
        name: 'words',
        type: 'stringArray',
        helperBase: 'Words',
      },
      {
        name: 'start',
        type: 'string',
        helperBase: 'Start',
      }
    ]
  },
  graphDistancesFromSource: {
    method: 'distancesFromSource',
    className: 'GraphDistancesFromSource',
    returnType: 'intArray',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
      {
        name: 'edges',
        type: 'intGrid',
        helperBase: 'Edges',
      },
      {
        name: 'source',
        type: 'int',
        helperBase: 'Source',
        javaArrayName: 'sources',
      }
    ]
  },
  isGraphBipartiteMatrix: {
    method: 'isBipartite',
    className: 'IsGraphBipartiteMatrix',
    returnType: 'boolean',
    inputs: [
      {
        name: 'graph',
        type: 'intGrid',
        helperBase: 'Graph',
      }
    ]
  },
  countConnectedComponents: {
    method: 'countComponents',
    className: 'CountConnectedComponents',
    returnType: 'int',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
      {
        name: 'edges',
        type: 'intGrid',
        helperBase: 'Edges',
      }
    ]
  },
  nodesAtDistanceK: {
    method: 'nodesAtDistanceK',
    className: 'NodesAtDistanceK',
    returnType: 'intArray',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns',
      },
      {
        name: 'edges',
        type: 'intGrid',
        helperBase: 'Edges',
      },
      {
        name: 'start',
        type: 'int',
        helperBase: 'Start',
        javaArrayName: 'starts',
      },
      {
        name: 'k',
        type: 'int',
        helperBase: 'K',
        javaArrayName: 'ks',
      }
    ]
  },
  jumpGameIiiMinSteps: {
    method: 'minStepsToReachZero',
    className: 'JumpGameIiiMinSteps',
    returnType: 'int',
    inputs: [
      {
        name: 'arr',
        type: 'intArray',
        helperBase: 'Arr',
      },
      {
        name: 'start',
        type: 'int',
        helperBase: 'Start',
        javaArrayName: 'starts',
      }
    ]
  }

};
