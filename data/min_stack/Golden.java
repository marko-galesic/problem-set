class MinStack {
    public int[] minStackOps(String[] ops, int[][] values) {
        java.util.ArrayDeque<Integer> stack = new java.util.ArrayDeque<>();
        java.util.ArrayDeque<Integer> minStack = new java.util.ArrayDeque<>();
        java.util.ArrayList<Integer> outputs = new java.util.ArrayList<>();
        for (int i = 0; i < ops.length; i++) {
            String op = ops[i];
            if ("push".equals(op)) {
                int val = values[i][0];
                stack.push(val);
                if (minStack.isEmpty() || val <= minStack.peek()) {
                    minStack.push(val);
                }
            } else if ("pop".equals(op)) {
                if (!stack.isEmpty()) {
                    int val = stack.pop();
                    if (!minStack.isEmpty() && val == minStack.peek()) {
                        minStack.pop();
                    }
                }
            } else if ("top".equals(op)) {
                outputs.add(stack.isEmpty() ? -1 : stack.peek());
            } else if ("getMin".equals(op)) {
                outputs.add(minStack.isEmpty() ? -1 : minStack.peek());
            }
        }
        int[] result = new int[outputs.size()];
        for (int i = 0; i < outputs.size(); i++) {
            result[i] = outputs.get(i);
        }
        return result;
    }
}
