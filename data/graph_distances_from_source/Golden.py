from collections import deque


class GraphDistancesFromSource:
    def distancesFromSource(self, n, edges, source):
        if n <= 0:
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
        if source < 0 or source >= n:
            return dist
        queue = deque([source])
        dist[source] = 0
        while queue:
            u = queue.popleft()
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    queue.append(v)
        return dist
