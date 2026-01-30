class MultiplyStrings {
  multiplyStrings(num1, num2) {
    if (num1 === '0' || num2 === '0') return '0';
    const m = num1.length;
    const n = num2.length;
    const pos = new Array(m + n).fill(0);
    for (let i = m - 1; i >= 0; i--) {
      const d1 = num1.charCodeAt(i) - 48;
      for (let j = n - 1; j >= 0; j--) {
        const d2 = num2.charCodeAt(j) - 48;
        const sum = d1 * d2 + pos[i + j + 1];
        pos[i + j + 1] = sum % 10;
        pos[i + j] += Math.floor(sum / 10);
      }
    }
    let idx = 0;
    while (idx < pos.length && pos[idx] === 0) idx++;
    return pos.slice(idx).join('') || '0';
  }
}
