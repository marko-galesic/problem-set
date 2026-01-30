class MinStack:
    def minStackOps(self, ops, values):
        stack = []
        min_stack = []
        outputs = []
        for op, value in zip(ops, values):
            if op == "push":
                val = value[0]
                stack.append(val)
                if not min_stack or val <= min_stack[-1]:
                    min_stack.append(val)
            elif op == "pop":
                if stack:
                    val = stack.pop()
                    if min_stack and val == min_stack[-1]:
                        min_stack.pop()
            elif op == "top":
                outputs.append(stack[-1] if stack else -1)
            elif op == "getMin":
                outputs.append(min_stack[-1] if min_stack else -1)
        return outputs
