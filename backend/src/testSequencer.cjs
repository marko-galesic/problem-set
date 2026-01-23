// Minimal test sequencer that just returns tests in order
class TestSequencer {
  sort(tests) {
    // Return tests in their original order
    return Array.from(tests);
  }

  shard(tests, options) {
    // Simple sharding implementation
    const shardIndex = options.shardIndex || 0;
    const shardCount = options.shardCount || 1;
    const shardSize = Math.ceil(tests.length / shardCount);
    const start = shardIndex * shardSize;
    const end = start + shardSize;
    return tests.slice(start, end);
  }

  cacheResults(tests, results) {
    // No-op: don't cache results
  }
}

module.exports = TestSequencer;
