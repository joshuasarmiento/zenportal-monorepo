import { Hono } from 'hono';
import { db } from '../db';
import { workLogs, clients } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, and, desc } from 'drizzle-orm';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

app.get('/', async (c) => {
  const userId = c.get('userId');

  // 1. Fetch All Logs with Client Details
  const logs = await db
    .select({
      id: workLogs.id,
      date: workLogs.date,
      hours: workLogs.hoursWorked,
      isBlocked: workLogs.isBlocked,
      clientId: workLogs.clientId,
      clientStatus: clients.status,
      clientName: clients.companyName,
      hourlyRate: clients.hourlyRate,
    })
    .from(workLogs)
    .innerJoin(clients, eq(workLogs.clientId, clients.id))
    .where(eq(workLogs.userId, userId));

  // 2. Initialize Variables
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2023-10"
  
  // Dashboard Counters
  let hoursThisMonth = 0;
  let totalEarnings = 0;
  let monthlyEarnings = 0;
  let pendingBlockers = 0;
  const activeClientIds = new Set<string>();

  // Financial Aggregators
  const historyMap: Record<string, number> = {};
  const clientMap: Record<string, number> = {};

  // 3. Loop through data ONCE
  logs.forEach(log => {
    // Handle NULL values safely
    const hours = log.hours ?? 0;
    const rate = log.hourlyRate ?? 0;
    const amount = hours * rate;

    // --- A. Dashboard Stats ---
    if (log.date.startsWith(currentMonth)) {
      hoursThisMonth += hours;
      monthlyEarnings += amount;
    }
    
    if (log.isBlocked) {
      pendingBlockers++;
    }

    if (log.clientStatus === 'active') {
      activeClientIds.add(log.clientId as string);
    }

    // --- B. Financial Stats ---
    totalEarnings += amount;

    // Revenue History (Group by Month YYYY-MM)
    const monthKey = log.date.slice(0, 7);
    historyMap[monthKey] = (historyMap[monthKey] || 0) + amount;

    // Top Clients (Group by Company Name)
    if (log.clientName) {
      clientMap[log.clientName] = (clientMap[log.clientName] || 0) + amount;
    }
  });

  // 4. Transform Maps to Arrays for Frontend

  // Format Revenue History (Sort by Date -> Last 6 Months)
  const revenueHistory = Object.entries(historyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([date, amount]) => ({
      // Convert "2023-10" -> "Oct"
      month: new Date(date + '-01').toLocaleString('default', { month: 'short' }),
      amount: amount
    }));

  // Format Top Clients (Sort by Amount -> Top 3)
  const topClients = Object.entries(clientMap)
    .map(([name, amount]) => ({
      name,
      amount,
      percent: totalEarnings > 0 ? Math.round((amount / totalEarnings) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // 5. Return Complete JSON
  return c.json({
    // Dashboard Page Needs:
    hoursThisMonth,
    activeClients: activeClientIds.size,
    pendingBlockers,
    
    // Earnings Page Needs:
    totalEarnings: monthlyEarnings, // Showing current month earnings
    pending: 0, 
    goalTarget: 2000,
    goalPercent: Math.min(100, Math.round((monthlyEarnings / 2000) * 100)),
    revenueHistory,
    topClients
  });
});

export { app as statsRouter };