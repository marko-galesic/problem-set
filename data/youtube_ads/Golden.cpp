#include <algorithm>
#include <vector>

class YouTubeAds {
public:
    int maxPayout(std::vector<std::vector<int>>& ads) {
        std::vector<std::vector<int>> sorted = ads;
        std::sort(sorted.begin(), sorted.end(), [](const auto& left, const auto& right) {
            return left[1] < right[1];
        });

        std::vector<int> ends;
        ends.reserve(sorted.size());
        for (const auto& ad : sorted) {
            ends.push_back(ad[1]);
        }

        std::vector<int> best(sorted.size() + 1, 0);
        for (std::size_t i = 1; i <= sorted.size(); ++i) {
            const auto& ad = sorted[i - 1];
            auto compatibleEnd = std::upper_bound(ends.begin(), ends.begin() + (i - 1), ad[0]);
            std::size_t compatibleCount = static_cast<std::size_t>(compatibleEnd - ends.begin());
            best[i] = std::max(best[i - 1], ad[2] + best[compatibleCount]);
        }

        return best.back();
    }
};
