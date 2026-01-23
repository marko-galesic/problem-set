class MeetingRoomsII {
  minMeetingRooms(intervals) {
    if (!Array.isArray(intervals) || intervals.length === 0) {
      return 0;
    }

    const starts = intervals.map(interval => interval[0]).sort((a, b) => a - b);
    const ends = intervals.map(interval => interval[1]).sort((a, b) => a - b);

    let rooms = 0;
    let endIndex = 0;

    for (const start of starts) {
      if (start < ends[endIndex]) {
        rooms += 1;
      } else {
        endIndex += 1;
      }
    }

    return rooms;
  }
}
