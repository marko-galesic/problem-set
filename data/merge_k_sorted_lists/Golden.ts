class MergeKSortedLists {
  mergeKSortedLists(lists) {
    if (!Array.isArray(lists)) return [];
    const values = [];
    for (const list of lists) {
      if (!Array.isArray(list)) continue;
      for (const val of list) values.push(val);
    }
    values.sort((a, b) => a - b);
    return values;
  }
}
