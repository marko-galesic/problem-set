class LetterCombinationsOfAPhoneNumber {
  letterCombinations(digits) {
    if (!digits || digits.length === 0) {
      return [];
    }

    const mapping = {
      2: 'abc',
      3: 'def',
      4: 'ghi',
      5: 'jkl',
      6: 'mno',
      7: 'pqrs',
      8: 'tuv',
      9: 'wxyz'
    };

    const results = [];
    const current = [];

    const backtrack = (index) => {
      if (index === digits.length) {
        results.push(current.join(''));
        return;
      }
      const letters = mapping[digits[index]];
      if (!letters) {
        return;
      }
      for (const ch of letters) {
        current.push(ch);
        backtrack(index + 1);
        current.pop();
      }
    };

    backtrack(0);
    return results;
  }
}
