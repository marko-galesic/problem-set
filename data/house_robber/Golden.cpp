#include <algorithm>
#include <vector>

class HouseRobber {
public:
    int rob(std::vector<int>& nums) {
        int twoBack = 0;
        int oneBack = 0;

        for (int value : nums) {
            int current = std::max(oneBack, twoBack + value);
            twoBack = oneBack;
            oneBack = current;
        }

        return oneBack;
    }
};
