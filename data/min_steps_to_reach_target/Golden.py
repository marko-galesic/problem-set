from collections import deque


class MinStepsToReachTarget:
    def minStepsToReachTarget(self, start, target):
        if start == target:
            return 0
        max_val = max(start, target) * 2 + 2
        if max_val < 2:
            max_val = 2
        if start < 0 or start > max_val:
            return -1
        visited = [False] * (max_val + 1)
        queue = deque([start])
        visited[start] = True
        steps = 0
        while queue:
            for _ in range(len(queue)):
                cur = queue.popleft()
                if cur == target:
                    return steps
                for nxt in (cur - 1, cur + 1, cur * 2):
                    if 0 <= nxt <= max_val and not visited[nxt]:
                        visited[nxt] = True
                        queue.append(nxt)
            steps += 1
        return -1
