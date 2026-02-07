import { createMiddleware } from 'hono/factory';
import { redis } from './redis.js';
import { env } from '../env.js';

interface RateLimitOptions {
    limit?: number;
    windowMs?: number;
    keyGenerator?: (c: any) => string;
}

export const rateLimit = (options: RateLimitOptions = {}) => {
    const limit = options.limit || env.RATE_LIMIT_MAX;
    const windowMs = options.windowMs || env.RATE_LIMIT_WINDOW_MS;
    const windowSeconds = Math.ceil(windowMs / 1000);

    return createMiddleware(async (c, next) => {
        // Determine the key for the rate limit
        // Trust the first IP in X-Forwarded-For if behind a proxy
        const forwardedFor = c.req.header('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown-ip';

        const key = options.keyGenerator
            ? options.keyGenerator(c)
            : ip;

        // Current window timestamp (floored to the start of the window)
        const now = Date.now();
        const windowStart = Math.floor(now / windowMs) * windowMs;

        const redisKey = `rate_limit:${key}:${windowStart}`;

        try {
            // Clean up old keys (optional, but good for hygiene if keys are unique per window)
            // For fixed window with expiration, we rely on Redis TTL.

            // Increment request count
            const currentCount = await redis.incr(redisKey);

            // Set expiration if it's the first request in the window
            if (currentCount === 1) {
                await redis.expire(redisKey, windowSeconds + 1); // Add slight buffer
            }

            // Set standard RateLimit headers AND Retry-After if limited
            c.header('X-RateLimit-Limit', limit.toString());
            c.header('X-RateLimit-Window', Math.ceil(windowMs / 1000).toString());
            // Remaining requests. Use 0 if we've exceeded the limit.
            const remaining = Math.max(0, limit - currentCount);
            c.header('X-RateLimit-Remaining', remaining.toString());

            // Calculate reset time (end of current window)
            const resetTime = Math.ceil((windowStart + windowMs) / 1000);
            c.header('X-RateLimit-Reset', resetTime.toString());

            if (currentCount > limit) {
                // Calculate retry after in seconds
                const retryAfter = Math.ceil((windowStart + windowMs - now) / 1000);
                c.header('Retry-After', retryAfter.toString());

                return c.text('Too Many Requests', 429);
            }

            await next();
        } catch (error) {
            console.error('Rate limit error:', error);
            // Fail open: If Redis fails, allow the request to proceed
            // but log it to Sentry if available.
            // Sentry exception capture should ideally handle this if configured globally,
            // but we ensure flow continues.
            await next();
        }
    });
};
