from collections import deque


class BusRoutesMinBuses:
    def numBusesToDestination(self, routes, source, target):
        if source == target:
            return 0
        if not routes:
            return -1
        stop_to_routes = {}
        for i, route in enumerate(routes):
            for stop in route:
                stop_to_routes.setdefault(stop, []).append(i)
        queue = deque()
        visited_route = [False] * len(routes)
        for r in stop_to_routes.get(source, []):
            queue.append(r)
            visited_route[r] = True
        visited_stops = {source}
        buses = 1
        while queue:
            for _ in range(len(queue)):
                route_idx = queue.popleft()
                for stop in routes[route_idx]:
                    if stop == target:
                        return buses
                    if stop in visited_stops:
                        continue
                    visited_stops.add(stop)
                    for nr in stop_to_routes.get(stop, []):
                        if not visited_route[nr]:
                            visited_route[nr] = True
                            queue.append(nr)
            buses += 1
        return -1
