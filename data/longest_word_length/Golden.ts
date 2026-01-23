class LongestWordLength {
  longestWordLength(words) {
    let maxLen = 0;
    for (const word of words) {
      if (word.length > maxLen) maxLen = word.length;
    }
    return maxLen;
  }
}
