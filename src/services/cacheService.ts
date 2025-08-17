interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

class SmartCacheService {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 1000;
  private defaultTTL = 3600000; // 1 hour

  // Generate cache key from prompt and parameters
  generateKey(prompt: string, params: any = {}): string {
    const normalized = prompt.toLowerCase().trim();
    const paramsKey = JSON.stringify(params);
    return btoa(normalized + paramsKey).replace(/[^a-zA-Z0-9]/g, "");
  }

  // Check for similar prompts (semantic caching)
  findSimilarKey(prompt: string, threshold: number = 0.8): string | null {
    const words = prompt.toLowerCase().split(/\s+/);

    for (const [key, item] of this.cache.entries()) {
      try {
        const cachedPrompt = atob(key.split("|")[0] || "");
        const cachedWords = cachedPrompt.split(/\s+/);

        const similarity = this.calculateSimilarity(words, cachedWords);
        if (similarity >= threshold) {
          return key;
        }
      } catch (e) {
        // Skip invalid keys
      }
    }

    return null;
  }

  private calculateSimilarity(words1: string[], words2: string[]): number {
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    // Clean expired items before adding new ones
    this.cleanup();

    // If cache is full, remove least recently used items
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access stats
    item.accessCount++;
    item.lastAccessed = Date.now();

    return item.data;
  }

  // Try to get from cache, including similar prompts
  getWithFallback<T>(prompt: string, params: any = {}): T | null {
    const exactKey = this.generateKey(prompt, params);
    let result = this.get<T>(exactKey);

    if (result) {
      console.log("🎯 Cache hit (exact):", exactKey.substring(0, 20));
      return result;
    }

    // Try to find similar cached content
    const similarKey = this.findSimilarKey(prompt);
    if (similarKey) {
      result = this.get<T>(similarKey);
      if (result) {
        console.log("🎯 Cache hit (similar):", similarKey.substring(0, 20));
        return result;
      }
    }

    return null;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evictLRU(): void {
    let oldestKey = "";
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
    };
  }

  private calculateHitRate(): number {
    let totalAccess = 0;
    for (const [, item] of this.cache.entries()) {
      totalAccess += item.accessCount;
    }
    return totalAccess > 0 ? totalAccess / this.cache.size : 0;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new SmartCacheService();
