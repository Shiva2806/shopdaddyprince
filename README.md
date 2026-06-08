# Daddy Prince — Heritage Indian Arts

**shopdaddyprince.com**

## Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database / Auth**: Supabase
- **Payments**: Razorpay
- **Auth**: NextAuth v4 + Google OAuth
- **Hosting**: Vercel
- **AI Admin Agent**: Anthropic Claude API

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
```bash
cp .env.local.example .env.local
# Fill in all values
```

### 3. Supabase
1. Create a new Supabase project at supabase.com
2. Run `supabase/schema.sql` in the SQL Editor
3. Enable Google OAuth under Authentication → Providers
4. Copy project URL and keys into `.env.local`

### 4. Google OAuth
1. Go to console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Add `http://localhost:3000/api/auth/callback/google` to redirect URIs
4. Copy client ID and secret into `.env.local`

### 5. Razorpay
1. Create account at razorpay.com
2. Copy Key ID and Key Secret from Dashboard → Settings → API Keys
3. Add to `.env.local`

### 6. Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### 7. Run dev server
```bash
npm run dev
```

## Project Structure
```
src/
├── app/
│   ├── (store)/          # Public storefront
│   │   ├── (auth)/       # Login, register
│   │   ├── shop/         # Product listing
│   │   ├── product/[slug]/ # Product detail
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── orders/
│   ├── admin/            # Protected admin panel
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   └── agent/        # AI agent chat
│   └── api/              # Route handlers
├── components/
│   ├── layout/           # Navbar, Footer, AuthProvider
│   ├── store/            # Product cards, cart, etc.
│   ├── admin/            # Admin sidebar, tables
│   └── ui/               # Buttons, inputs, modals
├── lib/
│   ├── supabase/         # DB clients
│   ├── auth/             # NextAuth config
│   ├── razorpay/         # Payment utils
│   └── ai/               # Claude agent
├── store/                # Zustand (cart state)
├── types/                # TypeScript interfaces
└── utils/                # format, cn helpers
```
