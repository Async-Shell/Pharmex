# Pharmex — Mart & Pharmacy website

Next.js + Tailwind storefront with cart, checkout (JazzCash / Easypaisa /
cash on delivery), prescription upload, and an admin dashboard to approve
orders. Backed by Supabase (database + file storage).

## What's included

- `app/` — all pages: home, products, product detail, cart, checkout,
  order confirmation, admin dashboard
- `lib/products.ts` — starter product catalog (dummy data — swap for a
  live Supabase query once you populate the `products` table)
- `lib/cart-context.tsx` — cart state, persisted in the browser
- `app/api/orders/route.ts` — receives checkout submissions, uploads
  prescription/payment-screenshot files to Supabase Storage, saves the
  order, and emails you
- `app/admin` + `app/api/admin/orders/route.ts` — password-protected
  dashboard to view orders and mark them confirmed / rejected / fulfilled
- `supabase/schema.sql` — database tables and storage bucket setup

## 1. Install and run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the keys below
npm run dev
```

Visit `http://localhost:3000`.

## 2. Set up Supabase (free)

1. Sign up at supabase.com, create a new project
2. Open the **SQL Editor**, paste the contents of `supabase/schema.sql`, run it
3. Go to **Storage** → New bucket → name it `order-uploads` → mark it **Public**
4. Go to **Project Settings → API** and copy three values into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep this one secret — it's server-only)

## 3. Set your admin password

In `.env.local`, set `ADMIN_PASSWORD` to whatever you like. Visit `/admin`
on your site and log in with it to see and manage orders.

## 4. (Optional) Order email notifications

1. Sign up at resend.com (free tier)
2. Verify a sending domain or use their test sender
3. Create an API key, paste into `RESEND_API_KEY`
4. Set `ORDER_NOTIFY_EMAIL` to the address that should get new-order emails

If you skip this, orders still save to Supabase and show up in `/admin` —
you just won't get an email ping.

## 5. Payments (JazzCash / Easypaisa)

This starter uses the **manual verification flow**: your JazzCash/Easypaisa
number is shown at checkout, the customer pays and uploads a screenshot,
and you confirm it from `/admin`. No merchant account needed to launch.

To edit the payment number shown at checkout, open
`app/checkout/page.tsx` and update the phone number in the payment section.

When you're ready for automatic checkout (no manual screenshot review),
look at a unified gateway like Simpaisa or XPay — they issue a single API
key that covers JazzCash, Easypaisa, and cards.

## 6. Deploy for free

1. Push this project to a GitHub repository
2. Go to netlify.com → sign up → "Add new site" → import from GitHub
3. Netlify auto-detects Next.js — just click deploy
4. In **Site settings → Environment variables**, paste in the same values
   from your `.env.local`
5. Your site goes live at `your-site-name.netlify.app`

## Notes on the pharmacy side

- Any product with `requiresPrescription: true` in `lib/products.ts` forces
  a prescription upload at checkout
- Prescription files are stored privately per order and linked in the
  admin dashboard for your pharmacist to review before confirming
- This starter does not handle licensing or regulatory compliance for
  online pharmacy sales — check your local requirements separately
