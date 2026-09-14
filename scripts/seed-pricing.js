const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPricing() {
  console.log('Seeding A&E Pricing Rules, Volume Discounts, and Promotion Plans...');

  // 1. Volume Discounts
  const volumeTiers = [
    { tierName: 'Tier 1 (Standard 1–5 Listings)', minListings: 1, maxListings: 5, discountPercent: 0 },
    { tierName: 'Tier 2 (Growth 6–20 Listings)', minListings: 6, maxListings: 20, discountPercent: 15 },
    { tierName: 'Tier 3 (Pro 21–50 Listings)', minListings: 21, maxListings: 50, discountPercent: 30 },
    { tierName: 'Tier 4 (Enterprise 51+ Listings)', minListings: 51, maxListings: null, discountPercent: 45 },
  ];

  for (const tier of volumeTiers) {
    const existing = await prisma.volumeDiscount.findFirst({ where: { tierName: tier.tierName } });
    if (!existing) {
      await prisma.volumeDiscount.create({ data: tier });
    }
  }

  // 2. Promotion Plans
  const promotions = [
    { code: 'FEATURED_LISTING', name: 'Featured Placement', description: 'Top ranking and gold badge in search listings for 14 days', durationDays: 14, priceKes: 500 },
    { code: 'SEARCH_BOOST', name: 'Search Algorithm Boost', description: 'Priority visibility in keyword and spatial filter results for 7 days', durationDays: 7, priceKes: 350 },
    { code: 'HOMEPAGE_SPOTLIGHT', name: 'Homepage Flagship Spotlight', description: 'Hero carousel and verified spotlight banner on A&E homepage for 7 days', durationDays: 7, priceKes: 1200 },
    { code: 'COUNTY_SPOTLIGHT', name: 'County Regional Spotlight', description: 'Prominent header placement in county-specific landing pages for 14 days', durationDays: 14, priceKes: 800 },
  ];

  for (const promo of promotions) {
    const existing = await prisma.promotionPlan.findUnique({ where: { code: promo.code } });
    if (!existing) {
      await prisma.promotionPlan.create({ data: promo });
    }
  }

  // 3. Base Listing Pricing Rules
  const pricingRules = [
    { productType: 'LISTING', propertyType: 'Bedsitter', listingIntent: 'RENT', countyName: 'ALL', durationDays: 30, baseFeeKes: 80 },
    { productType: 'LISTING', propertyType: 'Studio', listingIntent: 'RENT', countyName: 'ALL', durationDays: 30, baseFeeKes: 100 },
    { productType: 'LISTING', propertyType: 'Apartment', listingIntent: 'RENT', countyName: 'ALL', durationDays: 30, baseFeeKes: 150 },
    { productType: 'LISTING', propertyType: 'Apartment', listingIntent: 'SALE', countyName: 'ALL', durationDays: 30, baseFeeKes: 300 },
    { productType: 'LISTING', propertyType: 'Penthouse', listingIntent: 'SALE', countyName: 'ALL', durationDays: 30, baseFeeKes: 450 },
    { productType: 'LISTING', propertyType: 'Townhouse', listingIntent: 'SALE', countyName: 'ALL', durationDays: 30, baseFeeKes: 400 },
    { productType: 'LISTING', propertyType: 'Maisonette', listingIntent: 'SALE', countyName: 'ALL', durationDays: 30, baseFeeKes: 400 },
    { productType: 'LISTING', propertyType: 'Villa', listingIntent: 'SALE', countyName: 'ALL', durationDays: 30, baseFeeKes: 650 },
    { productType: 'LISTING', propertyType: 'Land', listingIntent: 'SALE', countyName: 'ALL', durationDays: 30, baseFeeKes: 350 },
    { productType: 'LISTING', propertyType: 'Commercial', listingIntent: 'RENT', countyName: 'ALL', durationDays: 30, baseFeeKes: 400 },
    { productType: 'LISTING', propertyType: 'Commercial', listingIntent: 'SALE', countyName: 'ALL', durationDays: 30, baseFeeKes: 600 },
    { productType: 'LISTING', propertyType: 'ALL', listingIntent: 'ALL', countyName: 'ALL', durationDays: 30, baseFeeKes: 250 },
    { productType: 'LISTING_RENEWAL', propertyType: 'ALL', listingIntent: 'ALL', countyName: 'ALL', durationDays: 30, baseFeeKes: 200 },
  ];

  for (const rule of pricingRules) {
    const existing = await prisma.pricingRule.findFirst({
      where: {
        productType: rule.productType,
        propertyType: rule.propertyType,
        listingIntent: rule.listingIntent,
        countyName: rule.countyName,
      }
    });
    if (!existing) {
      await prisma.pricingRule.create({ data: rule });
    }
  }

  console.log('A&E Pricing Rules seeded successfully.');
}

seedPricing()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
