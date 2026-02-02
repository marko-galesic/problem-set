class AsteroidCollision:
    def asteroidCollision(self, asteroids):
        stack = []
        for asteroid in asteroids:
            alive = True
            while alive and asteroid < 0 and stack and stack[-1] > 0:
                top = stack[-1]
                if top < -asteroid:
                    stack.pop()
                    continue
                if top == -asteroid:
                    stack.pop()
                alive = False
            if alive:
                stack.append(asteroid)
        return stack
