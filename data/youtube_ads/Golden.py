from bisect import bisect_right


class YouTubeAds:
    def maxPayout(self, ads):
        sorted_ads = sorted(ads, key=lambda ad: ad[1])
        ends = [ad[1] for ad in sorted_ads]
        dp = [0] * (len(sorted_ads) + 1)

        for i, (start, _end, payout) in enumerate(sorted_ads, start=1):
            compatible_count = bisect_right(ends, start, 0, i - 1)
            dp[i] = max(dp[i - 1], payout + dp[compatible_count])

        return dp[-1]

