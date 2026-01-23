class MeetingRooms:
    def canAttendMeetings(self, intervals):
        if intervals is None or len(intervals) <= 1:
            return True
        sorted_intervals = sorted(intervals, key=lambda interval: interval[0])
        for i in range(1, len(sorted_intervals)):
            if sorted_intervals[i][0] < sorted_intervals[i - 1][1]:
                return False
        return True
