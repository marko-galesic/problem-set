class AsteroidCollision {
  asteroidCollision(asteroids) {
    if (!asteroids) {
      return [];
    }
    const stack = [];
    for (const asteroid of asteroids) {
      let alive = true;
      while (alive && asteroid < 0 && stack.length && stack[stack.length - 1] > 0) {
        const top = stack[stack.length - 1];
        if (top < -asteroid) {
          stack.pop();
          continue;
        }
        if (top === -asteroid) {
          stack.pop();
        }
        alive = false;
      }
      if (alive) {
        stack.push(asteroid);
      }
    }
    return stack;
  }
}
