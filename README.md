# GlowLink Salon Marketplace

A mobile-friendly salon discovery and booking app with role-based views for:

- **Clients:** discover salons, view services, and request bookings
- **Salon owners:** manage appointments and salon revenue
- **Agents:** view 10% commission earnings

## Run locally

```bash
npm install
npm run dev
```

## Supabase authentication

Add the following variables to a `.env` file:

```text
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Enable Google provider in Supabase Authentication > Providers and use the deployed app URL as an authorized redirect URL.
