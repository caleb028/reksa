# REKSA — Genuine M-Pesa Payment & Commercial Monetization Architecture

> **SEARCH • VERIFY • ANALYSE • DISCOVER • INVEST • MANAGE**  
> **Production Engineering Document: M-Pesa Integration & Monetization Engine**

---

## 1. Architectural Overview & Philosophy

REKSA does **not** aggressively monetize individual property seekers. Property search, neighbourhood intelligence, spatial filtering, boundary inspection, and basic comparative analytics remain open and free for ordinary Kenyans looking for homes, land, and apartments.

Instead, the monetization model is anchored entirely in **B2B and Business-to-Marketplace commercial relationships**:
- Real estate agencies and corporate brokers
- Independent property agents and individual landlords
- Large-scale property developers and housing projects
- Professional property valuers, surveyors, and conveyancers

Payment transactions are powered by **Safaricom Daraja M-Pesa STK Push**, adhering to a **Zero-Trust Client Model**, **Strict Idempotency Protection**, and **Deterministic Webhook Fulfillment**.

```
┌─────────────────┐       1. Select Listing / Boost / Plan       ┌─────────────────┐
│  REKSA Web App  │ ───────────────────────────────────────────> │  REKSA Backend  │
│ (React/Next.js) │                                              │ (PricingEngine) │
└─────────────────┘                                              └─────────────────┘
         │                                                                │
         │ 2. Request STK Prompt with Phone                               │ 2. Recalculate Fee &
         │    (Amount omitted - determined server-side)                   │    Lock PaymentIntent
         ▼                                                                ▼
┌─────────────────┐         3. Initiate STK Push (/processrequest) ┌─────────────────┐
│ Safaricom Daraja│ <──────────────────────────────────────────── │ MpesaStkPushSvc │
│     Gateway     │                                               └─────────────────┘
└─────────────────┘
         │
         │ 4. STK Prompt sent to Subscriber SIM (PIN prompt)
         ▼
┌─────────────────┐
│ Customer Phone  │ ─── 5. Enters M-Pesa PIN ───┐
└─────────────────┘                             │
                                                ▼
┌─────────────────┐      6. POST Callback       ┌─────────────────┐
│ Safaricom Daraja│ ──────────────────────────> │ /api/payments/  │
│     Gateway     │                             │ mpesa/callback  │
└─────────────────┘                             └─────────────────┘
                                                        │
                                                        │ 7. Atomic DB Transaction:
                                                        │    - Mark PaymentIntent SUCCESS
                                                        │    - Issue REKSA-REC Receipt
                                                        │    - Fulfill Listing Entitlement
                                                        ▼
                                                ┌─────────────────┐
                                                │  Prisma / DB    │
                                                │ (Audit Logged)  │
                                                └─────────────────┘
```

---

## 2. Zero-Trust Pricing & Server-Side Security

A critical security flaw in many web platforms is allowing the frontend client to pass payment amounts (e.g. `{ amount: 1 }`). In REKSA:

1. **Client Never Dictates Amount**: The frontend submits only the `productType`, `propertyId`, and optional `promotionCode`.
2. **Server-Side Recalculation**: `PricingEngine.calculateFee` queries the database `PricingRule` and `VolumeDiscount` tables directly to calculate the exact, authoritative fee.
3. **Idempotency Key Guard**: Every payment initiation sends a unique, deterministic idempotency key (`reksa_checkout_${type}_${id}_${timestamp}`). Repeated requests within the creation window return the existing intent without creating duplicate pending charges.
4. **Amount Verification on Callback**: When the Daraja callback is received, the actual amount deducted by Safaricom (`CallbackMetadata.Item[Amount]`) is cross-referenced with `PaymentIntent.amount`. Any discrepancy halts fulfillment immediately, marks the transaction as `RECONCILIATION_REQUIRED`, and logs an alert.

---

## 3. Service Boundaries & Responsibilities

The payments implementation is organized under `src/payments/`:

### 3.1 Safaricom Daraja Integration (`src/payments/mpesa/`)

| File | Primary Responsibility |
| :--- | :--- |
| `config.ts` | Validates environment variables (`MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, etc.) and determines Sandbox vs. Production API endpoints. Throws descriptive errors if misconfigured. |
| `validation.ts` | Kenyan phone number normalizer (`normalizeKenyanPhone`) supporting `07...`, `01...`, `+254...`, and `254...`. Rejects landlines and malformed numbers. Provides `maskPhoneNumber` (`+254 7••• ••123`) for consumer privacy. |
| `auth.ts` | `MpesaAuthService`: Handles OAuth `client_credentials` authentication with Safaricom. Implements in-memory token caching with a 60-second safety margin to prevent redundant roundtrips. |
| `stkPush.ts` | `MpesaStkPushService`: Generates 14-digit Daraja timestamps (`YYYYMMDDHHmmss`), computes base64 password hashes (`shortcode + passkey + timestamp`), and dispatches STK prompts to Safaricom's `/mpesa/stkpush/v1/processrequest`. |
| `callback.ts` | `MpesaCallbackService`: Validates incoming webhook payload envelopes, extracts `CallbackMetadata` items (`Amount`, `MpesaReceiptNumber`, `TransactionDate`, `PhoneNumber`), verifies idempotency, executes database state transitions, generates tax receipts, and fulfills entitlements inside an atomic Prisma transaction. |
| `query.ts` | `MpesaTransactionQueryService`: Directly queries Safaricom's `/mpesa/stkpushquery/v1/query` endpoint for on-demand verification of pending transactions. |
| `reconciliation.ts` | `PaymentReconciliationService`: Background service that identifies stale `PENDING` transactions older than 3 minutes, polls Daraja for definitive status, and reconciles abandoned or delayed transactions automatically. |

### 3.2 Core Monetization Services (`src/payments/core/`)

| File | Primary Responsibility |
| :--- | :--- |
| `pricingEngine.ts` | Evaluates dynamic listing fees based on property classification (Bedsitter, Studio, Apartment, Villa, Land, Commercial), applies volume discounts based on seller's active inventory, and computes promotional add-ons. |
| `intentService.ts` | Generates immutable `PaymentIntent` records with public human-readable references (`REKSA-PAY-YYYY-XXXXX`), tracks checkout request IDs, and locks in the transaction parameters. |
| `receiptService.ts` | Produces compliant tax invoices and receipts (`PaymentReceipt`) with reference `REKSA-REC-YYYY-XXXXX`, preserving M-Pesa receipt references and phone numbers. |
| `entitlementService.ts` | Grants verified platform capabilities upon payment confirmation: transitions listings from `DRAFT` to `ACTIVE`, creates/extends `ListingEntitlement` records, and updates featured/boost expiry timestamps. |

---

## 4. Payment Intent State Machine

Every payment transaction strictly follows the finite state machine:

```
                  ┌───────────────┐
                  │    CREATED    │
                  └───────────────┘
                          │ (STK Dispatched)
                          ▼
                  ┌───────────────┐
                  │    PENDING    │
                  └───────────────┘
                    │     │     │
       (ResultCode=0)     │     │ (Timeout / 1037)
            │             │     ▼
            │             │ ┌───────────────┐
            │             │ │    TIMEOUT    │
            │             │ └───────────────┘
            │             │ (User Cancelled / 1032)
            ▼             ▼
  ┌───────────────┐ ┌───────────────┐
  │    SUCCESS    │ │    FAILED     │
  └───────────────┘ └───────────────┘
          │ (Amount Mismatch detected)
          ▼
  ┌───────────────────────────┐
  │  RECONCILIATION_REQUIRED  │
  └───────────────────────────┘
```

- **CREATED**: Intent initialized and price locked in the database.
- **PENDING**: STK Push successfully acknowledged by Safaricom (`ResponseCode: 0`) and prompt sent to subscriber phone.
- **SUCCESS**: Verified callback received with `ResultCode: 0`, receipt created, and entitlement granted.
- **FAILED**: Subscriber entered wrong PIN, cancelled request (`ResultCode: 1032`), or had insufficient funds.
- **TIMEOUT**: Subscriber did not respond to STK push before SIM session expired (`ResultCode: 1037`).
- **RECONCILIATION_REQUIRED**: Callback amount differed from expected intent amount, or network inconsistency requires administrative inspection.

---

## 5. API Endpoint Specifications

### `POST /api/payments/intent`
Creates a locked payment intent.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "productType": "FEATURED_LISTING",
    "propertyId": "cmtldrhb60021idaqqauipbkh",
    "promotionCode": "FEATURED_LISTING"
  }
  ```
- **Response**: `200 OK` with `{ success: true, data: { id, publicReference, amount, currency, description } }`.

### `POST /api/payments/mpesa/stk`
Dispatches live STK prompt to customer's handset.
- **Request Body**:
  ```json
  {
    "paymentIntentId": "cmtldrhb60021idaqqauipbkh",
    "phoneNumber": "0712345678"
  }
  ```
- **Response**: `200 OK` with `{ success: true, message: "M-Pesa payment prompt sent to your phone", data: { checkoutRequestId } }`.
- **Note**: If Daraja credentials are not configured in `.env`, returns HTTP `503 Service Unavailable` with `MPESA_CREDENTIALS_REQUIRED`, adhering strictly to the no-mock-in-production rule.

### `POST /api/payments/mpesa/callback`
Webhook receiver for Safaricom Daraja callbacks.
- **Response**: `{ ResultCode: 0, ResultDesc: "Callback processed successfully" }` (Acknowledges Safaricom webhook immediately after processing).

### `GET /api/payments/intent/[id]`
Client polling endpoint to verify transaction status in real-time.
- **Response**: `{ success: true, data: { status, isCompleted, isFailed, isPending, receiptNumber } }`.

### `GET /api/pricing`
Public pricing catalog endpoint returning pricing rules, volume discount tiers, and promotion plans for marketplace transparency.

---

## 6. Official Tax Invoicing & Receipt Engine

Upon successful payment, REKSA issues an official printable and downloadable tax receipt:
- **Receipt Number Format**: `REKSA-REC-YYYY-XXXXX` (e.g. `REKSA-REC-2026-89412`)
- **Attributes Stored**:
  - `receiptNumber`: Unique public serial number
  - `mpesaReceipt`: Safaricom transaction reference (e.g. `QK89XYZ123`)
  - `customerPhone`: Masked telephone number (`+254 7••• ••678`)
  - `amount` & `currency`: Full settlement figure
  - `productSummary`: Clear item description
  - `issuedAt`: ISO timestamp of confirmation

Clients can view and print receipts directly from their dashboard via `<PaymentReceiptModal />`.
