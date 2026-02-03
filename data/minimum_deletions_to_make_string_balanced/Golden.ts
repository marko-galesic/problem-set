class MinimumDeletionsToMakeStringBalanced {
  minimumDeletions(s) {
    let deletions = 0;
    let countB = 0;
    for (const ch of s) {
      if (ch === 'a') {
        deletions = Math.min(deletions + 1, countB);
      } else if (ch === 'b') {
        countB++;
      }
    }
    return deletions;
  }
}
