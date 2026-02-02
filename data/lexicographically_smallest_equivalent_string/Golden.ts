class LexicographicallySmallestEquivalentString {
  smallestEquivalentString(s1, s2, baseStr) {
    const parent = Array.from({ length: 26 }, (_, i) => i);

    const find = (x) => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (a, b) => {
      const ra = find(a);
      const rb = find(b);
      if (ra === rb) {
        return;
      }
      if (ra < rb) {
        parent[rb] = ra;
      } else {
        parent[ra] = rb;
      }
    };

    for (let i = 0; i < s1.length; i++) {
      union(s1.charCodeAt(i) - 97, s2.charCodeAt(i) - 97);
    }

    let out = '';
    for (let i = 0; i < baseStr.length; i++) {
      const root = find(baseStr.charCodeAt(i) - 97);
      out += String.fromCharCode(97 + root);
    }
    return out;
  }
}
