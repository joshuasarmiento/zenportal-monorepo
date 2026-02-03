import Redis from 'ioredis';
import { config } from '../config.js';

// 1. Singleton Pattern: Prevent Vercel from creating a new connection 
// on every single function "warm" hit.
const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis(config.redis.url, {
    // 2. Security: Upstash requires TLS for the 'rediss://' protocol
    tls: {
        rejectUnauthorized: false,
    },
    // 3. Serverless Optimization: 
    // We don't want a serverless function to retry forever. 
    // If it can't connect in 10s, fail so the function can terminate.
    connectTimeout: 10000,
    maxRetriesPerRequest: 0,

    // 4. Custom Retry Strategy (kept but capped)
    retryStrategy(times) {
        if (times > 3) return null; // End retrying after 3 attempts to save execution time
        return Math.min(times * 50, 2000);
    },
});

// Save the instance to the global object in development
if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// 5. Minimal Logging
// In Vercel, console.logs inside the global scope only run during cold starts.
redis.on('error', (err: unknown) => {
    // Check if err is an object and has a 'code' property
    if (err && typeof err === 'object' && 'code' in err) {
        const error = err as { code: string; message: string };

        if (error.code !== 'ECONNRESET') {
            console.error('[Redis] Error:', error.message);
        }
    } else {
        console.error('[Redis] Unknown Error:', err);
    }
});