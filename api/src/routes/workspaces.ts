import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { workspaces, workspaceMembers, users } from '../db/schema.js';
import { requireAuth, type AuthVariables } from '../lib/auth.js';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { nanoid } from 'nanoid';

export const workspacesRouter = new Hono<{ Variables: AuthVariables }>();

// Middleware: All workspace routes require auth
workspacesRouter.use('*', requireAuth);

const createWorkspaceSchema = z.object({
    name: z.string().min(3).max(50),
    slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
    type: z.enum(['freelancer', 'agency']),
    logo: z.string().optional(),
});

// GET /api/workspaces - List user's workspaces
workspacesRouter.get('/', async (c) => {
    const userId = c.get('userId');

    const members = await db.query.workspaceMembers.findMany({
        where: (t, { eq }) => eq(t.userId, userId),
        with: {
            workspace: true
        }
    });

    return c.json({
        workspaces: members.map(m => ({
            ...m.workspace,
            role: m.role,
            joinedAt: m.joinedAt
        }))
    });
});

// POST /api/workspaces - Create a new workspace
workspacesRouter.post('/', zValidator('json', createWorkspaceSchema), async (c) => {
    const { name, slug, type, logo } = c.req.valid('json');
    const userId = c.get('userId');

    // Check if slug exists
    const existing = await db.query.workspaces.findFirst({
        where: (t, { eq }) => eq(t.slug, slug)
    });

    if (existing) {
        return c.json({ error: 'Workspace slug already taken' }, 409);
    }

    const workspaceId = nanoid();

    await db.transaction(async (tx) => {
        // 1. Create Workspace
        await tx.insert(workspaces).values({
            id: workspaceId,
            name,
            slug,
            type,
            logo,
        });

        // 2. Add User as Owner
        await tx.insert(workspaceMembers).values({
            id: nanoid(),
            workspaceId,
            userId,
            role: 'owner',
        });

        // 3. Set as default if user has none
        const user = await tx.select().from(users).where(eq(users.id, userId)).get();
        if (user && !user.defaultWorkspaceId) {
            await tx.update(users).set({ defaultWorkspaceId: workspaceId }).where(eq(users.id, userId));
        }
    });

    return c.json({ id: workspaceId, slug, name, role: 'owner' }, 201);
});

// GET /api/workspaces/current - Get details of currently active workspace context
workspacesRouter.get('/current', async (c) => {
    const workspace = c.get('workspace');
    const member = c.get('member');

    if (!workspace) {
        return c.json({ error: 'No active workspace found' }, 404);
    }

    return c.json({
        workspace,
        member: {
            role: member.role,
            joinedAt: member.joinedAt
        }
    });
});

// GET /:id/members
workspacesRouter.get('/:id/members', async (c) => {
    const workspaceId = c.req.param('id');
    const userWorkspace = c.get('workspace');

    if (!userWorkspace || userWorkspace.id !== workspaceId) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const members = await db.query.workspaceMembers.findMany({
        where: (t, { eq }) => eq(t.workspaceId, workspaceId),
        with: {
            user: {
                columns: { name: true, email: true, image: true }
            }
        }
    });

    return c.json(members);
});

// POST /:id/invite
workspacesRouter.post('/:id/invite', zValidator('json', z.object({ email: z.string().email(), role: z.enum(['admin', 'member']) })), async (c) => {
    const workspaceId = c.req.param('id');
    const userWorkspace = c.get('workspace');
    const member = c.get('member');
    const { email, role } = c.req.valid('json');

    if (!userWorkspace || userWorkspace.id !== workspaceId) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    // Only Owner/Admin can invite
    if (member?.role !== 'owner' && member?.role !== 'admin') {
        return c.json({ error: 'Insufficient permissions' }, 403);
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
        where: (t, { eq }) => eq(t.email, email)
    });

    if (existingUser) {
        const existingMember = await db.query.workspaceMembers.findFirst({
            where: (t, { and, eq }) => and(
                eq(t.workspaceId, workspaceId),
                eq(t.userId, existingUser.id)
            )
        });

        if (existingMember) {
            return c.json({ error: 'User is already a member' }, 400);
        }

        await db.insert(workspaceMembers).values({
            id: nanoid(),
            workspaceId: workspaceId,
            userId: existingUser.id,
            role: role
        });

        return c.json({ message: 'Member added' });
    } else {
        return c.json({ error: 'User not found. Invitations for non-users are not yet supported.' }, 400);
    }
});
