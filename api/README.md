# ZenPortal API

The backend API for ZenPortal, built with Hono, Drizzle ORM, and Turso (SQLite).

## Tech Stack
-   **Framework:** [Hono](https://hono.dev/)
-   **Database:** [Turso](https://turso.tech/) (SQLite)
-   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
-   **Auth:** [Better Auth](https://www.better-auth.com/)
-   **Payments:** [Dodo Payments](https://dodopayments.com/)

## Getting Started

### Prerequisites
-   [Bun](https://bun.sh/) (Runtime & Package Manager)

### Installation

Install dependencies:
```sh
bun install
```

### Running the Server

Start the Hono development server:
```sh
bun run dev
```
The server will be available at `http://localhost:3000`.

## Database Setup

Push schema changes to the live Turso database:
```sh
# This reads src/db/schema.ts and creates tables in Turso
bun run dk:push
```
*Note: Ensure your `.env` variables are correctly set for Turso connection.*

## Payments Setup (Dodo Payments)

Ensure you have your Dodo Payments credentials configured in your `.env` file.

```env
DODO_PAYMENTS_API_KEY=your_api_key
DODO_PAYMENTS_WEBHOOK_SECRET=your_webhook_secret
```