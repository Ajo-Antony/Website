# Auth Setup — Email + Google + Microsoft Sign-In

The code is done and build-tested. Three things only you can do (they involve
your own Google/Microsoft/Supabase accounts), in order:

## 1. Supabase — Auth URL settings
Dashboard → your project → **Authentication → URL Configuration**
- **Site URL**: `https://strixmind.ai` (your production domain)
- **Redirect URLs**, add both:
  - `https://strixmind.ai/auth/callback`
  - `http://localhost:3000/auth/callback` (for local dev)

Dashboard → **Authentication → Providers → Email**
- Already on by default. Leave "Confirm email" ON unless you want
  instant sign-up without email verification.

## 2. Google sign-in
**Google Cloud Console** → console.cloud.google.com → create/select a project
→ **APIs & Services → Credentials → Create Credentials → OAuth client ID**
- Application type: **Web application**
- Authorized redirect URI — copy this exactly from
  Supabase Dashboard → **Authentication → Providers → Google** (it's
  pre-filled there, looks like
  `https://kdmyhhgzmepodszlxvfy.supabase.co/auth/v1/callback`)
- Copy the generated **Client ID** and **Client Secret**

Back in **Supabase Dashboard → Authentication → Providers → Google**:
- Toggle it **ON**
- Paste the Client ID and Client Secret
- Save

## 3. Microsoft sign-in (covers Outlook, Hotmail, Live, Microsoft 365)
Supabase calls this provider **"Azure"**.

**Azure Portal** → portal.azure.com → **Microsoft Entra ID → App registrations
→ New registration**
- Name: StrixMind
- Supported account types: **Accounts in any organizational directory and
  personal Microsoft accounts** (this is what allows plain @outlook.com /
  @hotmail.com sign-ins, not just work accounts)
- Redirect URI: Web → paste the callback URL shown in
  Supabase Dashboard → **Authentication → Providers → Azure**
  (looks like `https://kdmyhhgzmepodszlxvfy.supabase.co/auth/v1/callback`)
- After creating: **Certificates & secrets → New client secret** → copy the
  **value** immediately (it's hidden after you leave the page)
- Copy the **Application (client) ID** from the Overview page

Back in **Supabase Dashboard → Authentication → Providers → Azure**:
- Toggle it **ON**
- Paste the Client ID and Client Secret
- Under "Azure Tenant URL" leave the default (`common`) so both personal
  and work/school Microsoft accounts can sign in
- Save

## 4. Run the database migration
Supabase Dashboard → **SQL Editor** → paste the contents of
`sql/003_customer_profiles.sql` → Run.

## 5. Vercel environment variable
Vercel → your project → **Settings → Environment Variables** → add:
- `NEXT_PUBLIC_SITE_URL` = `https://strixmind.ai` (Production)

This makes sure OAuth and email-confirmation links always redirect back to
your real domain instead of a preview URL.

---

Once all of the above is saved, push the code — `/login` and `/signup` will
have fully working email/password, Google, and Microsoft sign-in.
