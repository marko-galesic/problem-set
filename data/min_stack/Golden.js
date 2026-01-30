class MinStack {
  minStackOps(ops, values) {
    const stack = [];
    const mins = [];
    const outputs = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (op === 'push') {
        const val = values[i][0];
        stack.push(val);
        if (!mins.length || val <= mins[mins.length - 1]) {
          mins.push(val);
        }
      } else if (op === 'pop') {
        if (stack.length) {
          const val = stack.pop();
          if (mins.length && val === mins[mins.length - 1]) {
            mins.pop();
          }
        }
      } else if (op === 'top') {
        outputs.push(stack.length ? stack[stack.length - 1] : -1);
      } else if (op === 'getMin') {
        outputs.push(mins.length ? mins[mins.length - 1] : -1);
      }
    }
    return outputs;
  }
}
