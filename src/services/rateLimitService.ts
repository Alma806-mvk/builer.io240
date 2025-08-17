interface QueueItem {
  id: string;
  request: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  priority: number;
  timestamp: number;
}

class APIRateLimiter {
  private queue: QueueItem[] = [];
  private processing: boolean = false;
  private requestsInLastMinute: number[] = [];
  private maxRequestsPerMinute: number = 60;
  private concurrentRequests: number = 0;
  private maxConcurrentRequests: number = 3;

  async enqueue<T>(
    request: () => Promise<T>,
    priority: number = 0,
    id: string = crypto.randomUUID(),
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id,
        request,
        resolve,
        reject,
        priority,
        timestamp: Date.now(),
      });

      // Sort by priority (higher = more important)
      this.queue.sort((a, b) => b.priority - a.priority);

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    if (this.concurrentRequests >= this.maxConcurrentRequests) return;
    if (!this.canMakeRequest()) return;

    this.processing = true;
    const item = this.queue.shift()!;
    this.concurrentRequests++;

    try {
      this.recordRequest();
      const result = await item.request();
      item.resolve(result);
    } catch (error) {
      // If rate limited, put back at front of queue
      if (this.isRateLimitError(error)) {
        this.queue.unshift(item);
        await this.exponentialBackoff();
      } else {
        item.reject(error);
      }
    } finally {
      this.concurrentRequests--;
      this.processing = false;

      // Process next item
      setTimeout(() => this.processQueue(), 100);
    }
  }

  private canMakeRequest(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Clean old requests
    this.requestsInLastMinute = this.requestsInLastMinute.filter(
      (timestamp) => timestamp > oneMinuteAgo,
    );

    return this.requestsInLastMinute.length < this.maxRequestsPerMinute;
  }

  private recordRequest(): void {
    this.requestsInLastMinute.push(Date.now());
  }

  private isRateLimitError(error: any): boolean {
    return (
      error?.status === 429 ||
      error?.code === 503 ||
      error?.message?.includes("rate limit") ||
      error?.message?.includes("overloaded")
    );
  }

  private async exponentialBackoff(): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, this.concurrentRequests), 30000);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      requestsInLastMinute: this.requestsInLastMinute.length,
      concurrentRequests: this.concurrentRequests,
    };
  }
}

export const apiRateLimiter = new APIRateLimiter();
