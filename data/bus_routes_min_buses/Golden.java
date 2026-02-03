import java.util.*;

class BusRoutesMinBuses {
    public int numBusesToDestination(int[][] routes, int source, int target) {
        if (source == target) {
            return 0;
        }
        if (routes == null || routes.length == 0) {
            return -1;
        }
        Map<Integer, List<Integer>> stopToRoutes = new HashMap<>();
        for (int i = 0; i < routes.length; i++) {
            for (int stop : routes[i]) {
                stopToRoutes.computeIfAbsent(stop, k -> new ArrayList<>()).add(i);
            }
        }
        Queue<Integer> queue = new ArrayDeque<>();
        boolean[] visitedRoute = new boolean[routes.length];
        for (int route : stopToRoutes.getOrDefault(source, Collections.emptyList())) {
            queue.offer(route);
            visitedRoute[route] = true;
        }
        Set<Integer> visitedStops = new HashSet<>();
        visitedStops.add(source);
        int buses = 1;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int routeIndex = queue.poll();
                for (int stop : routes[routeIndex]) {
                    if (stop == target) {
                        return buses;
                    }
                    if (!visitedStops.add(stop)) {
                        continue;
                    }
                    for (int nextRoute : stopToRoutes.getOrDefault(stop, Collections.emptyList())) {
                        if (!visitedRoute[nextRoute]) {
                            visitedRoute[nextRoute] = true;
                            queue.offer(nextRoute);
                        }
                    }
                }
            }
            buses++;
        }
        return -1;
    }
}
