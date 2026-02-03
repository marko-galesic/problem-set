class NearestExitInMaze {
  nearestExit(maze, entrance) {
    if (!Array.isArray(maze) || maze.length === 0) return -1;
    const rows = maze.length;
    const cols = maze[0].length;
    const [sr, sc] = entrance;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [[sr, sc]];
    let head = 0;
    visited[sr][sc] = true;
    let steps = 0;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const [r, c] = queue[head++];
        if (!(r === sr && c === sc) && (r === 0 || c === 0 || r === rows - 1 || c === cols - 1)) {
          return steps;
        }
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (visited[nr][nc] || maze[nr][nc] === '+') continue;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
      steps++;
    }
    return -1;
  }
}
