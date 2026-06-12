-- =========================================================
-- Daddy Prince — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =========================================================

create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────

create table public.profiles (
  id           uuid primary key,
  email        text not null unique,
  full_name    text,
  avatar_url   text,
  phone        text,
  role         text not null default 'customer' check (role in ('customer', 'admin')),
  created_at   timestamptz not null default now()
);

-- ─── Products ────────────────────────────────────────────────────────────────

create table public.products (
  id               uuid primary key default uuid_generate_v4(),
  slug             text not null unique,
  name             text not null,
  description      text,
  price            integer not null,
  compare_at_price integer,
  category         text not null check (
    category in ('paintings', 'home-decor', 'regional-arts', 'brass', 'vintage')
  ),
  subcategory      text,
  images           text[] not null default '{}',
  stock            integer not null default 0,
  is_active        boolean not null default true,
  tags             text[] default '{}',
  weight_grams     integer,
  dimensions       jsonb,
  artist           text,
  origin           text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index products_category_idx    on public.products(category);
create index products_subcategory_idx on public.products(subcategory);
create index products_is_active_idx   on public.products(is_active);
create index products_slug_idx        on public.products(slug);

-- ─── Orders ──────────────────────────────────────────────────────────────────

create table public.orders (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.profiles(id),
  items                jsonb not null,
  subtotal             integer not null,
  shipping             integer not null default 0,
  total                integer not null,
  status               text not null default 'pending' check (
    status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')
  ),
  shipping_address     jsonb not null,
  razorpay_order_id    text,
  razorpay_payment_id  text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index orders_user_id_idx on public.orders(user_id);
create index orders_status_idx  on public.orders(status);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.products  enable row level security;
alter table public.orders    enable row level security;

create policy "profiles: self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: self update" on public.profiles for update 
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      (case 
        when (select role from public.profiles where id = auth.uid()) = 'customer' then role = 'customer'
        else true
       end)
    )
  );

create policy "products: public read" on public.products for select using (is_active = true);
create policy "products: admin write" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "orders: owner read"   on public.orders for select using (auth.uid() = user_id);
create policy "orders: admin all"    on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
