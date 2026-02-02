class PrefixAndSuffixSearch {
  prefixSuffixSearch(words, queries) {
    const result = new Array(queries.length).fill(-1);
    for (let qi = 0; qi < queries.length; qi++) {
      const query = queries[qi];
      const sep = query.indexOf('|');
      const prefix = sep >= 0 ? query.slice(0, sep) : query;
      const suffix = sep >= 0 ? query.slice(sep + 1) : '';
      let best = -1;
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.startsWith(prefix) && word.endsWith(suffix)) {
          best = i;
        }
      }
      result[qi] = best;
    }
    return result;
  }
}
