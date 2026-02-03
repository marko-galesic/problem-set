class JumpGameIvMinJumps {
  minJumps(arr) {
    if (!Array.isArray(arr) || arr.length <= 1) return 0;
    const n = arr.length;
    const map = new Map();
    for (let i = 0; i < n; i++) {
      const val = arr[i];
      if (!map.has(val)) map.set(val, []);
      map.get(val).push(i);
    }
    const queue = [0];
    let head = 0;
    const visited = Array(n).fill(false);
    visited[0] = true;
    let steps = 0;
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const idx = queue[head++];
        if (idx === n - 1) return steps;
        const same = map.get(arr[idx]) || [];
        for (const next of same) {
          if (!visited[next]) {
            visited[next] = true;
            queue.push(next);
          }
        }
        same.length = 0;
        const left = idx - 1;
        const right = idx + 1;
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
