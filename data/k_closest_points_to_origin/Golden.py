class KClosestPointsToOrigin:
    def kClosest(self, points, k):
        def key(point):
            return (point[0] * point[0] + point[1] * point[1], point[0], point[1])
        points_sorted = sorted(points, key=key)
        return points_sorted[:k]
