class YouTubeAds {
  maxPayout(ads: number[][]): number {
    const sorted = ads.map((ad) => [...ad]).sort((a, b) => a[1] - b[1]);
    const ends = sorted.map((ad) => ad[1]);
    const dp = new Array<number>(sorted.length + 1).fill(0);

    for (let i = 1; i <= sorted.length; i += 1) {
      const [start, , payout] = sorted[i - 1];
      let low = 0;
      let high = i - 1;
      while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        if (ends[mid] <= start) low = mid + 1;
        else high = mid;
      }
      dp[i] = Math.max(dp[i - 1], payout + dp[low]);
    }

    return dp[sorted.length];
  }
}

