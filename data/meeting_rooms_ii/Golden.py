class MeetingRoomsII:
    def minMeetingRooms(self, intervals):
        if intervals is None or len(intervals) == 0:
            return 0

        starts = sorted(interval[0] for interval in intervals)
        ends = sorted(interval[1] for interval in intervals)

        rooms = 0
        end_index = 0

        for start in starts:
            if start < ends[end_index]:
                rooms += 1
            else:
                end_index += 1

        return rooms
