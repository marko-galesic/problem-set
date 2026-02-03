class MinimumTimeDifference:
    def findMinDifference(self, timePoints):
        minutes = []
        for t in timePoints:
            hour = int(t[:2])
            minute = int(t[3:])
            minutes.append(hour * 60 + minute)
        minutes.sort()
        min_diff = 1440
        for i in range(1, len(minutes)):
            min_diff = min(min_diff, minutes[i] - minutes[i - 1])
        min_diff = min(min_diff, 1440 - minutes[-1] + minutes[0])
        return min_diff
