from collections import OrderedDict


class LRUCache:
    def __init__(self, capacity, ttlMillis):
        self.capacity = capacity
        self.ttl = ttlMillis
        self.cache = OrderedDict()

    def _now(self):
        return TestClock.current_time_millis()

    def _purge_expired(self):
        if self.ttl is None:
            return
        now = self._now()
        expired_keys = [k for k, (_, exp) in self.cache.items() if exp is not None and exp <= now]
        for key in expired_keys:
            if key in self.cache:
                del self.cache[key]

    def get(self, key):
        self._purge_expired()
        if key not in self.cache:
            return -1
        value, exp = self.cache.pop(key)
        if exp is not None and exp <= self._now():
            return -1
        self.cache[key] = (value, exp)
        return value

    def put(self, key, value):
        self._purge_expired()
        exp = None
        if self.ttl is not None:
            exp = self._now() + self.ttl
        if key in self.cache:
            self.cache.pop(key)
        self.cache[key] = (value, exp)
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
