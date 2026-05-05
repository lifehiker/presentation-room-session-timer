# Human Input Needed

The app currently runs fully in guest mode with local storage and a demo Pro toggle. The following inputs are only required if you want to enable real cloud sync, authentication, payments, and email in production.

## Required for saved accounts across devices

- `DATABASE_URL`
  - Provide a PostgreSQL connection string.
  - This is required to persist templates and subscriptions server-side.
- `AUTH_SECRET`
  - Generate a long random secret for Auth.js session signing.
- Google OAuth credentials
  - `AUTH_GOOGLE_ID`
  - `AUTH_GOOGLE_SECRET`
  - Configure the OAuth redirect URL after deployment.

## Required for real Stripe billing

- `STRIPE_SECRET_KEY`
  - Secret API key for server-side checkout/session creation.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Publishable API key for client checkout flows if you add them.
- `STRIPE_WEBHOOK_SECRET`
  - Webhook signing secret for subscription lifecycle events.
- Stripe price IDs
  - `STRIPE_PRICE_MONTHLY`
  - `STRIPE_PRICE_ANNUAL`

## Optional for transactional email

- `RESEND_API_KEY`
  - Needed if you want welcome emails, billing receipts outside Stripe, or template-sharing emails.
- `EMAIL_FROM`
  - Verified sender address for outbound emails.

## Implementation note

Without the values above, the app remains intentionally local-first:

- guest session building works
- local template saving works
- timer playback works
- marketing pages work
- pricing is shown in demo mode rather than live checkout
