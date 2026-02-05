// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/vue"
import {
    emailOTPClient,
    inferAdditionalFields,
} from "better-auth/client/plugins"
import { dodopaymentsClient } from "@dodopayments/better-auth"
import { env } from "@/env"

const apiUrl = import.meta.env.VITE_BETTERAUTH_URL || env.VITE_BETTERAUTH_URL;

export const authClient = createAuthClient({
    baseURL: apiUrl,
    plugins: [
        emailOTPClient(),
        inferAdditionalFields({
            user: {
                tier: { type: "string", required: false },
                portalSlug: { type: "string", required: false },
                apiKeyRead: { type: "string", required: false },
                apiKeyWrite: { type: "string", required: false },
                dodoPaymentsCustomerId: { type: "string", required: false },
            }
        }),
        dodopaymentsClient(),
    ],
})

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    updateUser,
    changePassword,
    listSessions,
    revokeSession,
    deleteUser,
    forgetPassword,
    resetPassword
} = authClient;