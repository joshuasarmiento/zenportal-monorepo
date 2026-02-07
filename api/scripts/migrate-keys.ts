
import { db } from '../src/db/index.js';
import { users } from '../src/db/schema.js';
import { hashApiKey } from '../src/lib/crypto.js';
import { isNotNull, or, eq } from 'drizzle-orm';
import process from 'node:process';

async function migrate() {
    console.log('🔄 Starting API Key Migration...');

    // Find users with existing, potentially unhashed API keys
    // We check if either key exists.
    const allUsers = await db.query.users.findMany({
        where: or(isNotNull(users.apiKeyRead), isNotNull(users.apiKeyWrite))
    });

    console.log(`Found ${allUsers.length} users to check.`);
    let updatedCount = 0;

    for (const user of allUsers) {
        let updates: { apiKeyRead?: string, apiKeyWrite?: string } = {};
        let needsUpdate = false;

        // Check Read Key: Should be hashed (Length 64 for SHA-256)
        if (user.apiKeyRead && user.apiKeyRead.length !== 64) {
            console.log(`Hashing Read Key for user ${user.id}...`);
            updates.apiKeyRead = hashApiKey(user.apiKeyRead);
            needsUpdate = true;
        }

        // Check Write Key
        if (user.apiKeyWrite && user.apiKeyWrite.length !== 64) {
            console.log(`Hashing Write Key for user ${user.id}...`);
            updates.apiKeyWrite = hashApiKey(user.apiKeyWrite);
            needsUpdate = true;
        }

        if (needsUpdate) {
            await db.update(users)
                .set(updates)
                .where(eq(users.id, user.id));
            updatedCount++;
        }
    }

    console.log(`✅ Migration Complete. Updated ${updatedCount} users.`);
    process.exit(0);
}

migrate().catch(err => {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
});
