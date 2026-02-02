class SumOfSubarrayMinimums {
  sumSubarrayMins(arr) {
    const n = arr.length;
    const left = new Array(n);
    const right = new Array(n);
    const stack = [];

    for (let i = 0; i < n; i++) {
      while (stack.length && arr[stack[stack.length - 1]] > arr[i]) {
        stack.pop();
      }
      left[i] = stack.length ? i - stack[stack.length - 1] : i + 1;
      stack.push(i);
    }

    stack.length = 0;
    for (let i = n - 1; i >= 0; i--) {
      while (stack.length && arr[stack[stack.length - 1]] >= arr[i]) {
        stack.pop();
      }
      right[i] = stack.length ? stack[stack.length - 1] - i : n - i;
      stack.push(i);
    }

    const mod = 1000000007n;
    let sum = 0n;
    for (let i = 0; i < n; i++) {
      const contribution = BigInt(arr[i]) * BigInt(left[i]) * BigInt(right[i]);
      sum = (sum + contribution) % mod;
    }
    return Number(sum);
  }
}
