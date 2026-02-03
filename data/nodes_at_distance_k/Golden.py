from collections import deque


class NodesAtDistanceK:
    def nodesAtDistanceK(self, n, edges, start, k):
        if n <= 0 or start < 0 or start >= n:
            return []
        adj = [[] for _ in range(n)]
        for e in edges or []:
            if not e or len(e) < 2:
                continue
            u, v = e[0], e[1]
            if 0 <= u < n and 0 <= v < n:
                adj[u].append(v)
                adj[v].append(u)
        dist = [-1] * n
        dist[start] = 0
        queue = deque([start])
        while queue:
            u = queue.popleft()
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    queue.append(v)
        return [i for i in range(n) if dist[i] == k]
