import { db } from '../db';
import { users, workLogs, clients } from '../db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';
import { sendWeeklyRecapEmail } from '../lib/email';

async function runWeeklyRecap() {
  console.log('⏳ Starting Weekly Recap...');

  // 1. Get users who enabled weekly recap
  const subscribedUsers = await db.query.users.findMany({
    where: eq(users.notifyWeeklyRecap, true),
    columns: { id: true, email: true, fullName: true }
  });

  // 2. Calculate stats for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateStr = sevenDaysAgo.toISOString().split('T')[0];

  for (const user of subscribedUsers) {
    // Aggregate logs for this user since last week
    const [stats] = await db
      .select({
        hours: sql<number>`SUM(${workLogs.hoursWorked})`,
        earnings: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
      })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(and(
        eq(workLogs.userId, user.id),
        gte(workLogs.date, dateStr)
      ));

    const totalHours = Number(stats?.hours || 0);
    const totalEarnings = Number(stats?.earnings || 0);

    if (totalHours > 0) {
      console.log(`Sending email to ${user.email} (Hours: ${totalHours})`);
      await sendWeeklyRecapEmail(user.email, user.fullName || 'User', totalHours, totalEarnings);
    }
  }

  console.log('✅ Weekly Recap Complete');
  process.exit(0);
}

runWeeklyRecap();