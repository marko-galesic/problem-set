from collections import deque


class JumpGameIvMinJumps:
    def minJumps(self, arr):
        if not arr or len(arr) <= 1:
            return 0
        n = len(arr)
        mapping = {}
        for i, val in enumerate(arr):
            mapping.setdefault(val, []).append(i)
        queue = deque([0])
        visited = [False] * n
        visited[0] = True
        steps = 0
        while queue:
            for _ in range(len(queue)):
                idx = queue.popleft()
                if idx == n - 1:
                    return steps
                same = mapping.get(arr[idx], [])
                for nxt in same:
                    if not visited[nxt]:
                        visited[nxt] = True
                        queue.append(nxt)
                same.clear()
                left = idx - 1
                right = idx + 1
                if left >= 0 and not visited[left]:
                    visited[left] = True
                    queue.append(left)
                if right < n and not visited[right]:
                    visited[right] = True
                    queue.append(right)
            steps += 1
        return -1
