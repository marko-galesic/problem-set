from collections import deque


class OpenTheLock:
    def openLock(self, deadends, target):
        dead = set(deadends or [])
        start = "0000"
        if start in dead:
            return -1
        if target == start:
            return 0
        queue = deque([start])
        seen = {start}
        steps = 0
        while queue:
            for _ in range(len(queue)):
                cur = queue.popleft()
                if cur == target:
                    return steps
                for i in range(4):
                    digit = int(cur[i])
                    for delta in (1, -1):
                        nd = (digit + delta) % 10
                        nxt = cur[:i] + str(nd) + cur[i + 1:]
                        if nxt not in dead and nxt not in seen:
                            seen.add(nxt)
                            queue.append(nxt)
            steps += 1
        return -1
