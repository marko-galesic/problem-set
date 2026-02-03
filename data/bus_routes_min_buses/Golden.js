class BusRoutesMinBuses {
  numBusesToDestination(routes, source, target) {
    if (source === target) return 0;
    if (!Array.isArray(routes) || routes.length === 0) return -1;
    const stopToRoutes = new Map();
    for (let i = 0; i < routes.length; i++) {
      for (const stop of routes[i]) {
        if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);
        stopToRoutes.get(stop).push(i);
      }
    }
    const queue = [];
    const visitedRoute = Array(routes.length).fill(false);
    const startRoutes = stopToRoutes.get(source) || [];
    for (const r of startRoutes) {
      queue.push(r);
      visitedRoute[r] = true;
    }
    const visitedStops = new Set([source]);
    let head = 0;
    let buses = 1;
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const routeIdx = queue[head++];
        for (const stop of routes[routeIdx]) {
          if (stop === target) return buses;
          if (!visitedStops.has(stop)) {
            visitedStops.add(stop);
            const nextRoutes = stopToRoutes.get(stop) || [];
            for (const nr of nextRoutes) {
              if (!visitedRoute[nr]) {
                visitedRoute[nr] = true;
                queue.push(nr);
              }
            }
          }
        }
      }
      buses++;
    }
    return -1;
  }
}
