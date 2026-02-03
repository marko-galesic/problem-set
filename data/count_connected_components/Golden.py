from collections import deque


class CountConnectedComponents:
    def countComponents(self, n, edges):
        if n <= 0:
            return 0
        adj = [[] for _ in range(n)]
        for e in edges or []:
            if not e or len(e) < 2:
                continue
            u, v = e[0], e[1]
            if 0 <= u < n and 0 <= v < n:
                adj[u].append(v)
                adj[v].append(u)
        visited = [False] * n
        components = 0
        for i in range(n):
            if visited[i]:
                continue
            components += 1
            queue = deque([i])
            visited[i] = True
            while queue:
                u = queue.popleft()
                for v in adj[u]:
                    if not visited[v]:
                        visited[v] = True
                        queue.append(v)
        return components
