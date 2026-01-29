// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/vue"
import { 
    emailOTPClient,
    inferAdditionalFields,
    lastLoginMethodClient
} from "better-auth/client/plugins"
import { env } from "@/env"

const apiUrl = import.meta.env.VITE_BETTERAUTH_URL || env.VITE_BETTERAUTH_URL || "http://localhost:3000/api/auth";

export const authClient = createAuthClient({
    baseURL: apiUrl,
    plugins: [
        emailOTPClient(),
        lastLoginMethodClient(),
        inferAdditionalFields({
            user: {
                tier: { type: "string", required: false },
                portalSlug: { type: "string", required: false },
                apiKeyRead: { type: "string", required: false },
                apiKeyWrite: { type: "string", required: false },
                paymongoCustomerId: { type: "string", required: false }, // Renamed from stripeCustomerId
            }
        }),
        // Removed stripeClient plugin entirely
    ],
})

export const { 
    signIn, 
    signUp, 
    signOut, 
    useSession, 
    updateUser, 
    changePassword,
    deleteUser,
    forgetPassword,
    resetPassword 
} = authClient;