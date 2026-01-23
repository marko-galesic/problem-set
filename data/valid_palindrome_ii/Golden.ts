class ValidPalindromeII {
  validPalindrome(s) {
    const isPal = (left, right) => {
      while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
      }
      return true;
    };
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
      if (s[left] === s[right]) {
        left++;
        right--;
      } else {
        return isPal(left + 1, right) || isPal(left, right - 1);
      }
    }
    return true;
  }
}
