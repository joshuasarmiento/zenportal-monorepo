To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

Push Schema to Turso
Now upload your database tables (users, clients, logs) to the live Turso database.

Bash
# This reads src/db/schema.ts and creates tables in Turso
npx drizzle-kit push
If this fails, ensure your .env variables are correct.

Step 4: Run the Development Server
Start the Hono server.

Bash
npm run dev
Your backend is now live at http://localhost:3000.

Step 5: How to Test Stripe Webhooks Locally
Since localhost is not on the public internet, Stripe cannot send events to your server directly. You must use the Stripe CLI to forward them.

Install Stripe CLI (if you haven't).

Login: stripe login

Forward Events: Run this command in a separate terminal:

Bash
# Note: We mapped the route to /api/webhooks/stripe in routes/webhooks.ts
stripe listen --forward-to localhost:3000/api/webhooks/stripe
Get the Secret: The CLI will output a webhook signing secret:

Ready! You are using Stripe API Version... Your webhook signing secret is whsec_12345...

Update .env: Copy that whsec_... key and paste it into your .env file as STRIPE_WEBHOOK_SECRET.

Restart Server: Restart your Hono server (npm run dev) to load the new .env value.

To trigger a test event: Open a new terminal and run:

Bash
stripe trigger checkout.session.completed
If successful, your Hono terminal will show: ✅ User [undefined] upgraded to PRO. (It says undefined because the test trigger doesn't have your metadata, but it proves the connection works!)