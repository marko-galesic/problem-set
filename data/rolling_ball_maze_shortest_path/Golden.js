class RollingBallMazeShortestPath {
  shortestDistance(maze, start, destination) {
    if (!Array.isArray(maze) || maze.length === 0) return -1;
    const rows = maze.length;
    const cols = maze[0].length;
    const [sr, sc] = start;
    const [tr, tc] = destination;
    if (sr === tr && sc === tc) return 0;
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
        if (r === tr && c === tc) return steps;
        for (const [dr, dc] of dirs) {
          let nr = r;
          let nc = c;
          while (true) {
            const rr = nr + dr;
            const cc = nc + dc;
            if (rr < 0 || cc < 0 || rr >= rows || cc >= cols || maze[rr][cc] === 1) break;
            nr = rr;
            nc = cc;
          }
          if (!visited[nr][nc]) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }
      steps++;
    }
    return -1;
  }
}
