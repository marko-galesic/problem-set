class SearchSuggestionsSystem {
  _lowerBound(products, prefix) {
    let lo = 0;
    let hi = products.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (products[mid] < prefix) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  suggestedProducts(products, searchWord) {
    products.sort();
    const result = [];
    let prefix = '';
    for (let i = 0; i < searchWord.length; i++) {
      prefix += searchWord[i];
      const start = this._lowerBound(products, prefix);
      const suggestions = [];
      for (let j = start; j < products.length && suggestions.length < 3; j++) {
        if (products[j].startsWith(prefix)) {
          suggestions.push(products[j]);
        } else {
          break;
        }
      }
      result.push(suggestions);
    }
    return result;
  }
}
