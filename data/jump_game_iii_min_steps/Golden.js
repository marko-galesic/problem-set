class JumpGameIiiMinSteps {
  minStepsToReachZero(arr, start) {
    if (!Array.isArray(arr) || start < 0 || start >= arr.length) return -1;
    if (arr[start] === 0) return 0;
    const n = arr.length;
    const visited = Array(n).fill(false);
    const queue = [start];
    let head = 0;
    visited[start] = true;
    let steps = 0;
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const idx = queue[head++];
        if (arr[idx] === 0) return steps;
        const left = idx - arr[idx];
        const right = idx + arr[idx];
        if (left >= 0 && !visited[left]) {
          visited[left] = true;
          queue.push(left);
        }
        if (right < n && !visited[right]) {
          visited[right] = true;
          queue.push(right);
        }
      }
      steps++;
    }
    return -1;
  }
}
