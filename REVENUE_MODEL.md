# REKSA — Commercial Revenue Model & Financial Unit Economics

> **REKSA — Real Estate Kenya Search & Analysis**  
> **Commercial Strategy, Tariff Structure, Monetization Engine & 12-Month Projections**

---

## 1. Core Monetization Philosophy

A fundamental principle governs the commercial strategy of REKSA:

> **Property seekers never pay to search, discover, verify, or contact.**

Traditional classified websites in East Africa frequently stumble by erecting paywalls or aggressive contact locks in front of ordinary citizens looking for a home, apartment, or plot. This depresses engagement, lowers liquidity, and encourages circumvention.

REKSA monetizes **the supply side and professional participants**:
1. **Real Estate Agencies & Brokerages** seeking tenant/buyer acquisition and branded presence
2. **Independent Agents & Property Flippers** needing visibility, analytics, and verified reputation
3. **Property Developers** launching multi-unit off-plan projects, apartments, and estates
4. **Institutional Lenders, Valuers, and Conveyancers** seeking high-intent business leads

---

## 2. Listing Tariffs & Property Category Pricing

Listing tariffs are dynamic and reflect the underlying commercial transaction value of the property in Kenya:

| Property Category | Intent | Duration | Base Fee (KES) | Rationale & Market Fit |
| :--- | :---: | :---: | :---: | :--- |
| **Bedsitter** | Rent | 30 days | **KES 80** | Affordable micro-tier for low-income & student housing landlords |
| **Studio Apartment** | Rent | 30 days | **KES 100** | Budget urban rentals in high-density areas (Roysambu, Ruaka, Ngong Rd) |
| **1–2 Bedroom Apartment**| Rent | 30 days | **KES 150** | Standard middle-class urban rental inventory |
| **3+ Bedroom Apartment** | Rent | 30 days | **KES 200** | Premium rental residential units (Kilimani, Kileleshwa, Westlands) |
| **Apartment** | Sale | 30 days | **KES 300** | Capital sale listings with significant transaction commissions |
| **Townhouse / Maisonette**| Sale | 30 days | **KES 450** | Suburban gated communities (Syokimau, Kitengela, Ruiru, Kikuyu) |
| **Standalone Villa / Mansion**| Sale | 30 days | **KES 650** | High-value luxury residences (Karen, Runda, Muthaiga, Nyali) |
| **Land / Plot (Eighth/Quarter)**| Sale | 30 days | **KES 350** | Fast-moving speculative and residential plots across peri-urban counties |
| **Commercial Retail / Office**| Rent/Sale| 30 days | **KES 400 – 600** | Business premises, retail shops, warehouses, and office suites |

*Note: Free baseline quota of 1 active listing is granted to any new verified individual seller or landlord to ensure immediate marketplace participation.*

---

## 3. Volume Discount Tiers for Agencies & High-Volume Sellers

To incentivize agents and property management firms to centralize their entire inventory on REKSA, tiered volume discounts apply automatically via the server-side `PricingEngine`:

```
+-------------------------------------------------------------------------+
| VOLUME DISCOUNT TIERS (Calculated across active listings)               |
+-------------------+-----------------+-------------------+---------------+
| Tier Name         | Active Volume   | Unit Discount (%) | Effective Apt |
|                   |                 |                   | Sale Unit Fee |
+-------------------+-----------------+-------------------+---------------+
| Tier 1 (Standard) | 1 – 5 Listings  |      0%           |    KES 300    |
| Tier 2 (Growth)   | 6 – 20 Listings |     15%           |    KES 255    |
| Tier 3 (Pro)      | 21 – 50 Listings|     30%           |    KES 210    |
| Tier 4 (Enterprise| 51+ Listings    |     45%           |    KES 165    |
+-------------------+-----------------+-------------------+---------------+
```

**Agency Incentive Mechanism**: As an agency increases its listing count, the marginal cost per listing drops by nearly half. This drives lock-in and discourages split listings across fragmented competitor sites.

---

## 4. Paid Promotional Boosts & Algorithmic Exposure

Sellers and agencies can purchase time-bound visibility enhancements directly via M-Pesa STK push:

| Promotion Plan | Code | Price (KES) | Duration | Visibility Mechanism |
| :--- | :--- | :---: | :---: | :--- |
| **Featured Placement** | `FEATURED_LISTING` | **KES 500** | 14 days | Gold badge, pinned to top of county & category search results |
| **Search Boost** | `SEARCH_BOOST` | **KES 350** | 7 days | Algorithmic ranking multiplier in spatial search and keyword filters |
| **Homepage Spotlight** | `HOMEPAGE_SPOTLIGHT` | **KES 1,200** | 7 days | Primary rotating hero showcase on REKSA homepage |
| **County Spotlight** | `COUNTY_SPOTLIGHT` | **KES 800** | 14 days | Banner sponsorship on county hub pages (e.g. `/nairobi`, `/kiambu`) |

---

## 5. Multi-Tenant Business Subscription Tiers

Agencies and developers can subscribe to monthly operational tiers that include listing quotas, team seats, analytics, and CRM capabilities:

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┬─────────────────────────┐
│     INDIVIDUAL FREE     │     GROWTH AGENCY       │    PRO REALTY FIRM      │   DEVELOPER ENTERPRISE  │
│       KES 0 / mo        │      KES 4,500 / mo     │     KES 12,500 / mo     │     KES 35,000 / mo     │
├─────────────────────────┼─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ • 1 Active Listing Free │ • 30 Active Listings    │ • 100 Active Listings   │ • Unlimited Listings    │
│ • Pay-as-you-list       │ • 3 Team Agent Seats    │ • 10 Team Agent Seats   │ • Unlimited Team Seats  │
│ • Standard Lead Inbox   │ • REKSA Digital Store   │ • Custom REKSA Storefront│ • Branded Project Portal│
│ • Direct Buyer WhatsApp │ • Standard Analytics    │ • 3 Free Monthly Boosts │ • 10 Free Monthly Boosts│
│ • Standard Verification │ • Priority Verification │ • Dedicated Account Mgr │ • Off-plan Showroom     │
│                         │ • Downloadable Receipts │ • API & CRM Integration │ • Priority Lead Routing │
└─────────────────────────┴─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 6. Financial Projections & Unit Economics (Year 1)

Assumed ramp across Nairobi, Kiambu, Machakos, Kajiado, Mombasa, and Nakuru real-estate markets:

### Quarterly Target Metrics

| Metric | Q1 | Q2 | Q3 | Q4 |
| :--- | :---: | :---: | :---: | :---: |
| **Active Agencies & Companies** | 25 | 75 | 180 | 350 |
| **Independent Agents & Sellers** | 150 | 500 | 1,400 | 3,200 |
| **Total Active Listings** | 1,200 | 4,500 | 12,000 | 28,000 |
| **Monthly Boost Purchases** | 80 | 320 | 950 | 2,400 |
| **Paying SaaS Subscribers** | 15 | 55 | 130 | 260 |

### Projected Monthly Gross Revenue (KES)

- **Listing Fees (Pay-as-you-go & Volume)**:
  - Average KES 180 net per listing cycle × 8,000 new monthly listing creations = **KES 1,440,000 / month**
- **Promotional Boosts**:
  - 2,400 boosts × KES 550 blended average = **KES 1,320,000 / month**
- **SaaS Subscriptions**:
  - 180 Growth Agencies @ KES 4,500 = KES 810,000
  - 60 Pro Realty Firms @ KES 12,500 = KES 750,000
  - 20 Developer Enterprises @ KES 35,000 = KES 700,000
  - Total SaaS MRR = **KES 2,260,000 / month**

### **Target Stabilized Year 1 Monthly Run-Rate**:
$$\text{Gross MRR} = 1,440,000 + 1,320,000 + 2,260,000 = \mathbf{KES\ 5,020,000\ / \text{month}}$$
*Equivalent to approximately \$38,500 USD / month.*
