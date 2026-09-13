# REKSA — Production Readiness & Operational Go-Live Architecture

> **REKSA — Real Estate Kenya Search & Analysis**  
> **Production Hardening, Safaricom Daraja Go-Live Checklist, Database Scaling & Security**

---

## 1. Safaricom Daraja M-Pesa Go-Live Checklist

Moving from sandbox testing to live Safaricom production requires following this strict operational protocol:

### Step 1: Safaricom Business Organization Account
- Ensure the operating entity holds an active **Safaricom Lipa Na M-Pesa Paybill or Buy Goods Till Number**.
- Create an organization admin account on the [Safaricom Developer Portal](https://developer.safaricom.co.ke/).

### Step 2: "Go Live" Application in Daraja Portal
1. Navigate to **My Apps** > **Create New App** in Production Mode.
2. Select **Lipa Na M-Pesa Online (STK Push)** and **Transaction Status Query**.
3. Submit the required KYC documents (Certificate of Incorporation, CR12, Director IDs, KRA Tax Compliance).
4. Upon approval, Safaricom generates:
   - `MPESA_CONSUMER_KEY` (Live Production)
   - `MPESA_CONSUMER_SECRET` (Live Production)
   - `MPESA_PASSKEY` (Live Production)
   - `MPESA_SHORTCODE` (Your 6 or 7-digit Business Paybill / Store Number)

### Step 3: Public Webhook & SSL Verification
- Safaricom Daraja requires a **publicly reachable HTTPS endpoint** with a valid TLS/SSL certificate (Let's Encrypt or DigiCert):
  ```
  https://api.reksa.co.ke/api/payments/mpesa/callback
  ```
- **Self-signed certificates are rejected by Safaricom servers.**
- Ensure server firewalls allow inbound traffic from Safaricom callback IP ranges:
  - `196.201.214.0/24`
  - `196.201.213.0/24`
  - `196.201.212.0/24`

### Step 4: Environment Configuration Switch
In production `.env`:
```env
MPESA_ENVIRONMENT="production"
MPESA_CONSUMER_KEY="<production_consumer_key>"
MPESA_CONSUMER_SECRET="<production_consumer_secret>"
MPESA_PASSKEY="<production_passkey>"
MPESA_SHORTCODE="<production_paybill_number>"
MPESA_CALLBACK_URL="https://reksa.co.ke/api/payments/mpesa/callback"
```

---

## 2. Database Migration: SQLite to PostgreSQL

The development database operates on SQLite (`prisma/dev.db`). Before production deployment with concurrent web traffic:

### Step 1: Update Prisma Datasource
In `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Recommended for Supabase / Neon connection pooling
}
```

### Step 2: Migration Command
Run migration deployment in staging and production CI/CD pipelines:
```bash
npx prisma migrate deploy
npx prisma generate
node scripts/seed-pricing.js
```

### Step 3: Connection Pool Optimization
- When deploying to serverless platforms (Vercel, AWS Lambda), configure connection pooling via **PgBouncer** or **Supabase Transaction Pooler (port 6543)** to avoid exhausting PostgreSQL client connection limits.
- Set Prisma connection pool size:
  ```env
  DATABASE_URL="postgresql://user:password@aws-rds.amazonaws.com:5432/reksa_prod?connection_limit=20&pool_timeout=10"
  ```

---

## 3. High-Availability & Transaction Integrity Architecture

### 3.1 Automated Stale Intent Reconciliation Cron
In high-throughput environments, users occasionally encounter mobile network drops or delay entering their PIN until after the frontend checkout window has closed. REKSA includes an automated reconciliation service:

- **Schedule**: Run every 5 minutes (`*/5 * * * *`) via scheduled job or Vercel Cron.
- **Endpoint**: `POST /api/admin/revenue` with body `{ "action": "reconcile" }` or automated worker calling `PaymentReconciliationService.reconcilePendingTransactions()`.
- **Function**:
  1. Finds all `PaymentIntent` records in `PENDING` state created > 3 minutes ago.
  2. Calls Daraja `/mpesa/stkpushquery/v1/query`.
  3. If Daraja confirms successful payment (`ResultCode: 0`), atomically issues receipt and fulfills entitlement.
  4. If Daraja confirms cancellation or timeout (`1032`, `1037`), updates status to `FAILED`.

### 3.2 Idempotent Webhook Processing
- Daraja occasionally re-delivers callbacks if the response is delayed.
- `MpesaCallbackService` checks `intent.status === 'SUCCESS'` first. If already fulfilled, it immediately returns `{ ResultCode: 0, ResultDesc: "Callback already processed" }` without re-applying entitlements or double-issuing receipts.

---

## 4. Production Security & Data Governance Checklist

| Security Control | Implementation Mechanism | Status |
| :--- | :--- | :---: |
| **Client Zero-Trust** | Amounts calculated server-side only from DB tariffs | **ENFORCED** |
| **Phone Privacy Masking** | Numbers masked in UI (`+254 7••• ••123`) & DB receipts | **ENFORCED** |
| **Audit Logging** | Sensitive tokens, PINs, and passwords scrubbed before saving | **ENFORCED** |
| **Security Headers** | CSP, Strict-Transport-Security, X-Frame-Options: DENY, nosniff | **ENFORCED** |
| **RBAC Authorization** | `requireAuth` and `requireRole` on all sensitive and payment endpoints | **ENFORCED** |
| **Rate Limiting** | Sliding window rate limits on STK push and auth endpoints | **ENFORCED** |
| **CORS Restriction** | Strict allowed origins matching `reksa.co.ke` | **ENFORCED** |

---

## 5. Deployment Verification Runbook

Follow these verification steps upon deploying a new release:
1. Verify database connectivity and pending migrations: `npx prisma status`.
2. Validate pricing rules exist: `curl -s https://reksa.co.ke/api/pricing | jq .`.
3. Check application health: `curl -I https://reksa.co.ke/`.
4. Verify PWA manifest: `curl -I https://reksa.co.ke/manifest.json`.
5. Execute end-to-end payments test suite: `node tests/payments-suite.js`.
6. Verify Admin Revenue Intelligence dashboard loads at `/dashboard` under Administrator credentials.
