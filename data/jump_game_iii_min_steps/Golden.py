from collections import deque


class JumpGameIiiMinSteps:
    def minStepsToReachZero(self, arr, start):
        if arr is None or start < 0 or start >= len(arr):
            return -1
        if arr[start] == 0:
            return 0
        n = len(arr)
        visited = [False] * n
        queue = deque([start])
        visited[start] = True
        steps = 0
        while queue:
            for _ in range(len(queue)):
                idx = queue.popleft()
                if arr[idx] == 0:
                    return steps
                left = idx - arr[idx]
                right = idx + arr[idx]
                if left >= 0 and not visited[left]:
                    visited[left] = True
                    queue.append(left)
                if right < n and not visited[right]:
                    visited[right] = True
                    queue.append(right)
            steps += 1
        return -1
