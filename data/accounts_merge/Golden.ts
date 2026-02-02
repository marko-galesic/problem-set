class AccountsMerge {
  _makeDsu(n) {
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
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
      if (rank[ra] < rank[rb]) {
        parent[ra] = rb;
      } else if (rank[ra] > rank[rb]) {
        parent[rb] = ra;
      } else {
        parent[rb] = ra;
        rank[ra] += 1;
      }
    };
    return { find, union };
  }

  accountsMerge(accounts) {
    const emailId = new Map();
    const emailName = new Map();
    const parsed = [];

    for (const account of accounts) {
      const tokens = account.split(',');
      if (tokens.length === 0) {
        continue;
      }
      const name = tokens[0];
      const emails = tokens.slice(1);
      parsed.push(emails);
      for (const email of emails) {
        if (!emailId.has(email)) {
          emailId.set(email, emailId.size);
        }
        emailName.set(email, name);
      }
    }

    const dsu = this._makeDsu(emailId.size);
    for (const emails of parsed) {
      if (emails.length === 0) {
        continue;
      }
      const firstId = emailId.get(emails[0]);
      for (let i = 1; i < emails.length; i++) {
        dsu.union(firstId, emailId.get(emails[i]));
      }
    }

    const groups = new Map();
    for (const [email, idx] of emailId.entries()) {
      const root = dsu.find(idx);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root).push(email);
    }

    const merged = [];
    for (const emails of groups.values()) {
      emails.sort();
      const name = emailName.get(emails[0]);
      merged.push([name, ...emails]);
    }

    merged.sort((a, b) => {
      if (a[0] !== b[0]) {
        return a[0].localeCompare(b[0]);
      }
      const aEmail = a.length > 1 ? a[1] : '';
      const bEmail = b.length > 1 ? b[1] : '';
      return aEmail.localeCompare(bEmail);
    });

    return merged;
  }
}
