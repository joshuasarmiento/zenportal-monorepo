// api/src/lib/auth.ts
import { betterAuth, type User } from "better-auth";
import { eq } from "drizzle-orm";
import { emailOTP, admin } from "better-auth/plugins";
// import { APIError } from "better-auth/api";
import { haveIBeenPwned } from "better-auth/plugins"
import {
    dodopayments,
    checkout,
    portal,
    webhooks as dodoWebhooks,
} from "@dodopayments/better-auth";
import DodoPayments from "dodopayments";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createMiddleware } from 'hono/factory';
import { db } from '../db/index.js';
import { config } from '../config.js';
import * as schema from '../db/schema.js';
import { sendAuthEmail } from './email.js';
import { redis } from './redis.js';

export const dodo = new DodoPayments({
    bearerToken: config.dodoPayments.apiKey,
    environment: 'test_mode', // Switch to 'live_mode' in production
});


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            ...schema,
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
            twoFactor: schema.twoFactor,
            subscription: schema.subscription
        }
    }),
    user: {
        deleteUser: {
            enabled: true
        },
        additionalFields: {
            tier: {
                type: "string",
                required: false,
                defaultValue: "free",
                input: false // Not user-editable
            },
            dodoPaymentsCustomerId: {
                type: "string",
                required: false,
                input: false
            }
        }
    },
    trustedOrigins: config.app.allowedOrigins,
    baseURL: config.app.backendUrl,
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,
        // validator: {
        //     validatePassword: async (password: string) => {
        //         const isStrong = password.length >= 8 &&
        //             /[A-Z].*[A-Z]/.test(password) && // At least 2 capital letters
        //             /[0-9]/.test(password);         // At least 1 number

        //         if (!isStrong) {
        //             throw new APIError("BAD_REQUEST", {
        //                 message: "Your password is not strong enough. Add more words that are less common. Capitalize more than the first letter."
        //             });
        //         }
        //     }
        // }
    },
    secondaryStorage: {
        get: async (key) => await redis.get(key),
        set: async (key, value, ttl) => {
            if (ttl) await redis.set(key, value, "EX", ttl);
            else await redis.set(key, value);
        },
        delete: async (key) => {
            await redis.del(key);
        },
    },
    socialProviders: {
        google: {
            accessType: "offline",
            prompt: "select_account consent",
            clientId: config.google.googleclientId,
            clientSecret: config.google.googleclientSecret,
            redirectURI: `${config.app.backendUrl}/api/auth/callback/google`
        }
    },
    plugins: [
        haveIBeenPwned({
            customPasswordCompromisedMessage: "This password has been found in a data breach. Please choose a more secure password."
        }),
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                try {
                    if (type === "forget-password") {
                        await sendAuthEmail(email, "Reset your password", `<p> Your password reset code is: <strong>${otp} </strong></p>`);
                    } else if (type === "sign-in") {
                        await sendAuthEmail(email, "Your login code", `<p> Your login code is: <strong>${otp} </strong></p>`);
                    } else if (type === "email-verification") {
                        await sendAuthEmail(email, "Verify your email", `<p> Your verification code is: <strong>${otp} </strong></p>`);
                    }
                } catch (e) {
                    console.error("Failed to send OTP email", e)
                }
            },
            otpLength: 6,
            expiresIn: 300 // 5 minutes
        }),
        dodopayments({
            client: dodo,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [{
                        productId: config.dodoPayments.productId,
                        slug: "pro-plan",
                    }],
                    successUrl: `${config.app.frontendUrl}/settings/billing?success=true`,
                    authenticatedUsersOnly: true,
                }),
                portal(),
                dodoWebhooks({
                    webhookKey: config.dodoPayments.webhookSecret,
                    onPayload: async (payload) => {
                        const eventId = (payload as any).id || `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                        const eventType = payload.type;

                        console.log(`Received Dodo webhook: ${eventType} (ID: ${eventId})`);

                        try {
                            await db.transaction(async (tx) => {
                                // 1. Idempotency Check
                                const existing = await tx.select()
                                    .from(schema.webhookEvents)
                                    .where(eq(schema.webhookEvents.id, eventId))
                                    .get();

                                if (existing) {
                                    console.log(`⚠️ Webhook event ${eventId} already processed. Skipping.`);
                                    return;
                                }

                                // 2. Process Payload
                                if (eventType === 'subscription.active') {
                                    const subscription = payload.data as any;
                                    const customerId = subscription.customer.customer_id;
                                    const userId = subscription.metadata?.userId || subscription.customer?.metadata?.userId;

                                    if (userId) {
                                        await tx.update(schema.users)
                                            .set({ tier: 'pro', dodoPaymentsCustomerId: customerId })
                                            .where(eq(schema.users.id, userId));
                                        console.log(`✅ User ${userId} upgraded to PRO`);
                                    } else {
                                        await tx.update(schema.users)
                                            .set({ tier: 'pro', dodoPaymentsCustomerId: customerId })
                                            .where(eq(schema.users.dodoPaymentsCustomerId, customerId));
                                        console.log(`✅ User with customerId ${customerId} upgraded to PRO`);
                                    }
                                } else if (eventType === 'subscription.cancelled' || eventType === 'subscription.failed') {
                                    const subscription = payload.data as any;
                                    const customerId = subscription.customer.customer_id;
                                    const userId = subscription.metadata?.userId || subscription.customer?.metadata?.userId;

                                    if (userId) {
                                        await tx.update(schema.users)
                                            .set({ tier: 'free' })
                                            .where(eq(schema.users.id, userId));
                                        console.log(`❌ User ${userId} downgraded to FREE`);
                                    } else {
                                        await tx.update(schema.users)
                                            .set({ tier: 'free' })
                                            .where(eq(schema.users.dodoPaymentsCustomerId, customerId));
                                        console.log(`❌ User with customerId ${customerId} downgraded to FREE`);
                                    }
                                }

                                // 3. Record Successful Processing
                                await tx.insert(schema.webhookEvents).values({
                                    id: eventId,
                                    type: eventType,
                                    createdAt: new Date(),
                                    processedAt: new Date(),
                                    status: 'processed'
                                });
                            });
                        } catch (error) {
                            console.error(`🚨 Webhook processing failed for ${eventId}:`, error);
                            // Rethrow to ensure Dodo retries the webhook
                            throw error;
                        }
                    },
                }),
            ],
        }),
    ]
});

export const requireAuth = createMiddleware<{ Variables: { userId: string, user: User, session: any } }>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    c.set('user', session.user);
    c.set('userId', session.user.id);
    c.set('session', session.session);
    return next();
});

export type AuthVariables = {
    userId: string;
    user: User;
    session: any;
};