class AddStrings {
  addStrings(num1, num2) {
    let i = num1.length - 1;
    let j = num2.length - 1;
    let carry = 0;
    const out = [];
    while (i >= 0 || j >= 0 || carry) {
      const a = i >= 0 ? num1.charCodeAt(i--) - 48 : 0;
      const b = j >= 0 ? num2.charCodeAt(j--) - 48 : 0;
      const sum = a + b + carry;
      out.push(String(sum % 10));
      carry = Math.floor(sum / 10);
    }
    return out.reverse().join('');
  }
}
