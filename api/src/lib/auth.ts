// api/src/lib/auth.ts
import { betterAuth, type User } from "better-auth";
import { emailOTP, lastLoginMethod } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { haveIBeenPwned } from "better-auth/plugins"

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createMiddleware } from 'hono/factory';
import { db } from '../db/index.js';
import { config } from '../config.js';
import * as schema from '../db/schema.js';
import { sendAuthEmail } from './email.js';

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
        additionalFields: {
            tier: {
                type: "string",
                required: false,
                defaultValue: "free",
                input: false // Not user-editable
            },
            paymongoCustomerId: {
                type: "string",
                required: false,
                input: false
            }
        }
    },
    trustedOrigins: [
        config.app.frontendUrl,
    ],
    baseURL: config.app.backendUrl,
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,
        validator: {
            validatePassword: async (password: string) => {
                const isStrong = password.length >= 8 &&
                    /[A-Z].*[A-Z]/.test(password) && // At least 2 capital letters
                    /[0-9]/.test(password);         // At least 1 number

                if (!isStrong) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Your password is not strong enough. Add more words that are less common. Capitalize more than the first letter."
                    });
                }
            }
        }
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
                        await sendAuthEmail(email, "Reset your password", `<p>Your password reset code is: <strong>${otp}</strong></p>`);
                    } else if (type === "sign-in") {
                        await sendAuthEmail(email, "Your login code", `<p>Your login code is: <strong>${otp}</strong></p>`);
                    } else if (type === "email-verification") {
                        await sendAuthEmail(email, "Verify your email", `<p>Your verification code is: <strong>${otp}</strong></p>`);
                    }
                } catch (e) {
                    console.error("Failed to send OTP email", e)
                }
            },
            otpLength: 6,
            expiresIn: 300 // 5 minutes
        }),
        lastLoginMethod({
            storeInDatabase: true
        }),
    ]
});

export const requireAuth = createMiddleware<{ Variables: { userId: string, user: User, session: any } }>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) {
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