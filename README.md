# DigitalBroker Portfolio Dashboard

Customer portfolio analytics, property management, and profile.

## Run locally

```bash
npm install
cp .env.example .env.local   # Clerk + MongoDB credentials
npm run dev                  # http://localhost:3001
```

## Environment

| Variable | Purpose |
|---|---|
| `MONGODB_URI_PORTFOLIO` | MongoDB Atlas URI |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth |
| `CLERK_SECRET_KEY` | Clerk auth |

## Deploy

Deploy to Vercel (or similar). Set the same env vars in production and add your domain to Clerk redirect URLs.
