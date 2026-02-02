class SimplifyPath {
  simplifyPath(path) {
    if (!path) {
      return '/';
    }
    const parts = [];
    for (const part of path.split('/')) {
      if (!part || part === '.') {
        continue;
      }
      if (part === '..') {
        if (parts.length) {
          parts.pop();
        }
      } else {
        parts.push(part);
      }
    }
    return '/' + parts.join('/');
  }
}
