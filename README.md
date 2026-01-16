# Honolulu 🌺

> **Your code, in paradise.**

## ⚡ Quick Start

```bash
cd trail
bun install
bun dev
```

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000

---

## 🛠️ Configuration

### 1. Database Setup
### Database: Supabase (Cloud)
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your connection string from Settings → Database
3. Update `.env`:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   SUPABASE_URL=https://[PROJECT].supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Authentication
### Auth: Supabase
1. Enable Auth in Supabase Dashboard.
2. Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in `.env`.

---

## 🚀 Commands

- `bun dev`: Start development server
- `bun run db:push`: Push schema to database
- `bun run db:studio`: Open database GUI
- `bun run build`: Build for production
