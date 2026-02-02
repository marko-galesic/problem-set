class SatisfiabilityOfEqualityEquations {
  equationsPossible(equations) {
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
      if (ra !== rb) {
        parent[rb] = ra;
      }
    };

    for (const eq of equations) {
      if (eq[1] === '=') {
        union(eq.charCodeAt(0) - 97, eq.charCodeAt(3) - 97);
      }
    }

    for (const eq of equations) {
      if (eq[1] === '!') {
        if (find(eq.charCodeAt(0) - 97) === find(eq.charCodeAt(3) - 97)) {
          return false;
        }
      }
    }

    return true;
  }
}
