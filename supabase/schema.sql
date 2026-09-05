-- Run this in Supabase: Project → SQL Editor → New query → paste → Run

-- Orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  items jsonb not null,
  total numeric not null,
  payment_method text not null,
  payment_reference text,
  requires_prescription boolean default false,
  prescription_url text,
  receipt_url text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Products table (optional — the site ships with dummy data in lib/products.ts,
-- switch to this table once you're ready to manage real inventory)
create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  unit text not null,
  requires_prescription boolean default false,
  in_stock boolean default true,
  description text,
  image text
);

-- Row Level Security: allow the public (anon) key to insert orders and read products,
-- but never read/update orders directly — that goes through the service role key
-- via the admin API route only.
alter table orders enable row level security;
alter table products enable row level security;

create policy "Public can read products"
  on products for select
  using (true);

-- No insert/select/update policy is created for "orders" from the anon key —
-- all order writes happen server-side in app/api/orders/route.ts using the
-- service role key, which bypasses RLS by design.

-- Storage bucket for prescription photos and payment screenshots.
-- Create this manually: Storage → New bucket → name it "order-uploads" → set to Public.
