import { describe, expect, test } from '@jest/globals';
import { executeCppCode } from '../../executors/cppExecutor.js';
import { loadAdapter } from '../../adapters/index.js';
import { runTests as houseRobberTests } from '../../testCases/houseRobberTests.js';

describe('C++ executor', () => {
  test('compiles and runs a standard integer challenge', async () => {
    const adapter = await loadAdapter('standard:houseRobber:cpp');
    const code = `#include <algorithm>
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
};`;

    const result = await executeCppCode(code, [houseRobberTests[0]], adapter, 'house_robber');
    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ passed: true, actual: '14', expected: '14' });
  });

  test('returns a compilation error for invalid C++', async () => {
    const adapter = await loadAdapter('standard:houseRobber:cpp');
    const result = await executeCppCode('class HouseRobber {', [houseRobberTests[0]], adapter, 'house_robber');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Compilation error/i);
  });
});
