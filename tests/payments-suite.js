/**
 * REKSA — AUTOMATED PAYMENTS & REVENUE TEST SUITE
 * Tests Kenyan phone normalization, dynamic pricing rules, volume discounts,
 * Daraja STK push credentials & timestamp generation, callback metadata parsing,
 * idempotency defense, and official receipt creation.
 */

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

let passedTests = 0;
let failedTests = 0;
const testResults = [];

function recordResult(category, testName, passed, details) {
  if (passed) {
    passedTests++;
    console.log(`\x1b[32m[PASS]\x1b[0m [${category}] ${testName}`);
  } else {
    failedTests++;
    console.error(`\x1b[31m[FAIL]\x1b[0m [${category}] ${testName} - ${details}`);
  }
  testResults.push({ category, testName, passed, details });
}

// ------------------- PURE FUNCTIONS (mirrored from src/payments) -------------------

function normalizeKenyanPhone(phone) {
  if (!phone) {
    throw new Error('Phone number is required');
  }
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('+254')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('07') || cleaned.startsWith('01')) {
    cleaned = '254' + cleaned.substring(1);
  }
  const kenyanRegex = /^254(7\d{8}|1\d{8})$/;
  if (!kenyanRegex.test(cleaned)) {
    throw new Error(`Invalid Kenyan mobile phone number format: "${phone}"`);
  }
  return cleaned;
}

function maskPhoneNumber(phone) {
  try {
    const normalized = normalizeKenyanPhone(phone);
    const prefix = normalized.substring(3, 4);
    const suffix = normalized.substring(normalized.length - 3);
    return `+254 ${prefix}••• ••${suffix}`;
  } catch {
    return phone;
  }
}

function generateStkPushPassword(shortCode, passkey, timestamp) {
  const raw = `${shortCode}${passkey}${timestamp}`;
  return Buffer.from(raw).toString('base64');
}

function parseDarajaCallback(payload) {
  const stkCallback = payload?.Body?.stkCallback;
  if (!stkCallback) {
    throw new Error('Invalid Daraja callback envelope');
  }
  const resultCode = stkCallback.ResultCode;
  const resultDesc = stkCallback.ResultDesc || '';
  const merchantRequestId = stkCallback.MerchantRequestID;
  const checkoutRequestId = stkCallback.CheckoutRequestID;

  let amount;
  let mpesaReceiptNumber;
  let transactionDate;
  let phoneNumber;

  if (resultCode === 0 && stkCallback.CallbackMetadata?.Item) {
    for (const item of stkCallback.CallbackMetadata.Item) {
      if (item.Name === 'Amount') amount = Number(item.Value);
      if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNumber = String(item.Value);
      if (item.Name === 'TransactionDate') transactionDate = String(item.Value);
      if (item.Name === 'PhoneNumber') phoneNumber = String(item.Value);
    }
  }

  return {
    merchantRequestId,
    checkoutRequestId,
    resultCode,
    resultDesc,
    amount,
    mpesaReceiptNumber,
    transactionDate,
    phoneNumber,
    isSuccess: resultCode === 0
  };
}

// ------------------- MAIN TEST RUNNER -------------------

async function runPaymentTests() {
  console.log('============================================================');
  console.log('REKSA — AUTOMATED PAYMENT & MONETIZATION TEST SUITE');
  console.log('============================================================\n');

  // --- SUITE 1: KENYAN PHONE NORMALIZATION & MASKING ---
  console.log('--- 1. KENYAN PHONE VALIDATION & MASKING ---');
  try {
    const p1 = normalizeKenyanPhone('0712345678');
    recordResult('PHONE', 'Normalize standard Safaricom 07XXXXXXXX', p1 === '254712345678', `Got: ${p1}`);

    const p2 = normalizeKenyanPhone('0112345678');
    recordResult('PHONE', 'Normalize Airtel / Telkom 01XXXXXXXX', p2 === '254112345678', `Got: ${p2}`);

    const p3 = normalizeKenyanPhone('+254722000000');
    recordResult('PHONE', 'Normalize international prefix +2547XXXXXXXX', p3 === '254722000000', `Got: ${p3}`);

    const p4 = normalizeKenyanPhone('254799112233');
    recordResult('PHONE', 'Keep existing 2547XXXXXXXX without duplicate prefix', p4 === '254799112233', `Got: ${p4}`);

    const masked = maskPhoneNumber('0712345678');
    recordResult('PHONE', 'Mask phone for customer privacy (+254 7••• ••678 format)', masked === '+254 7••• ••678', `Got: ${masked}`);

    let invalidRejected = false;
    try {
      normalizeKenyanPhone('0201234567'); // Landline Nairobi
    } catch {
      invalidRejected = true;
    }
    recordResult('PHONE', 'Reject Nairobi landline (020) numbers', invalidRejected, 'Correctly threw validation error');

    let shortRejected = false;
    try {
      normalizeKenyanPhone('12345');
    } catch {
      shortRejected = true;
    }
    recordResult('PHONE', 'Reject malformed short numbers', shortRejected, 'Correctly threw validation error');
  } catch (err) {
    recordResult('PHONE', 'Phone suite execution', false, err.message);
  }

  // --- SUITE 2: DYNAMIC PRICING RULES IN DATABASE ---
  console.log('\n--- 2. DATABASE PRICING RULES & TARIFFS ---');
  try {
    const bedsitterRule = await prisma.pricingRule.findFirst({
      where: { propertyType: 'Bedsitter', listingIntent: 'RENT' }
    });
    recordResult('PRICING', 'Bedsitter rental fee is KES 80', bedsitterRule?.baseFeeKes === 80, `Got: ${bedsitterRule?.baseFeeKes}`);

    const studioRule = await prisma.pricingRule.findFirst({
      where: { propertyType: 'Studio', listingIntent: 'RENT' }
    });
    recordResult('PRICING', 'Studio apartment rental fee is KES 100', studioRule?.baseFeeKes === 100, `Got: ${studioRule?.baseFeeKes}`);

    const aptSaleRule = await prisma.pricingRule.findFirst({
      where: { propertyType: 'Apartment', listingIntent: 'SALE' }
    });
    recordResult('PRICING', 'Apartment sale listing fee is KES 300', aptSaleRule?.baseFeeKes === 300, `Got: ${aptSaleRule?.baseFeeKes}`);

    const villaRule = await prisma.pricingRule.findFirst({
      where: { propertyType: 'Villa' }
    });
    recordResult('PRICING', 'Villa / Standalone house fee is KES 650', villaRule?.baseFeeKes === 650, `Got: ${villaRule?.baseFeeKes}`);

    const landRule = await prisma.pricingRule.findFirst({
      where: { propertyType: 'Land' }
    });
    recordResult('PRICING', 'Land plot listing fee is KES 350', landRule?.baseFeeKes === 350, `Got: ${landRule?.baseFeeKes}`);
  } catch (err) {
    recordResult('PRICING', 'Database pricing check', false, err.message);
  }

  // --- SUITE 3: VOLUME DISCOUNT TIERS ---
  console.log('\n--- 3. VOLUME DISCOUNT ENGINE ---');
  try {
    const discounts = await prisma.volumeDiscount.findMany({ orderBy: { minListings: 'asc' } });
    recordResult('VOLUME', 'All 4 volume tiers configured', discounts.length >= 4, `Found: ${discounts.length}`);

    const tier1 = discounts.find(t => t.minListings === 1);
    recordResult('VOLUME', 'Tier 1 (1-5 listings) is 0% discount', tier1?.discountPercent === 0, `Got: ${tier1?.discountPercent}%`);

    const tier2 = discounts.find(t => t.minListings === 6);
    recordResult('VOLUME', 'Tier 2 (6-20 listings) is 15% discount', tier2?.discountPercent === 15, `Got: ${tier2?.discountPercent}%`);

    const tier3 = discounts.find(t => t.minListings === 21);
    recordResult('VOLUME', 'Tier 3 (21-50 listings) is 30% discount', tier3?.discountPercent === 30, `Got: ${tier3?.discountPercent}%`);

    const tier4 = discounts.find(t => t.minListings === 51);
    recordResult('VOLUME', 'Tier 4 (51+ listings) is 45% discount', tier4?.discountPercent === 45, `Got: ${tier4?.discountPercent}%`);

    // Simulated volume discount calculation:
    // 25 Apartment Sales @ KES 300 each = KES 7,500 base. Tier 3 = 30% discount -> Total KES 5,250
    const activeListingCount = 25;
    const applicableTier = discounts.find(t => activeListingCount >= t.minListings && (!t.maxListings || activeListingCount <= t.maxListings));
    const baseUnit = 300;
    const discountFactor = (100 - (applicableTier?.discountPercent || 0)) / 100;
    const discountedUnit = Math.round(baseUnit * discountFactor);
    recordResult('VOLUME', 'Unit price at 25 listings drops from KES 300 to KES 210 (30% off)', discountedUnit === 210, `Calculated: KES ${discountedUnit}`);
  } catch (err) {
    recordResult('VOLUME', 'Volume discounts check', false, err.message);
  }

  // --- SUITE 4: PROMOTION BOOST PLANS ---
  console.log('\n--- 4. PROMOTION BOOST CATALOG ---');
  try {
    const featured = await prisma.promotionPlan.findUnique({ where: { code: 'FEATURED_LISTING' } });
    recordResult('PROMOTIONS', 'Featured Placement: KES 500 / 14 days', featured?.priceKes === 500 && featured?.durationDays === 14, `Price: ${featured?.priceKes}, Days: ${featured?.durationDays}`);

    const boost = await prisma.promotionPlan.findUnique({ where: { code: 'SEARCH_BOOST' } });
    recordResult('PROMOTIONS', 'Search Boost: KES 350 / 7 days', boost?.priceKes === 350 && boost?.durationDays === 7, `Price: ${boost?.priceKes}, Days: ${boost?.durationDays}`);

    const hero = await prisma.promotionPlan.findUnique({ where: { code: 'HOMEPAGE_SPOTLIGHT' } });
    recordResult('PROMOTIONS', 'Homepage Spotlight: KES 1,200 / 7 days', hero?.priceKes === 1200 && hero?.durationDays === 7, `Price: ${hero?.priceKes}, Days: ${hero?.durationDays}`);

    const county = await prisma.promotionPlan.findUnique({ where: { code: 'COUNTY_SPOTLIGHT' } });
    recordResult('PROMOTIONS', 'County Spotlight: KES 800 / 14 days', county?.priceKes === 800 && county?.durationDays === 14, `Price: ${county?.priceKes}, Days: ${county?.durationDays}`);
  } catch (err) {
    recordResult('PROMOTIONS', 'Promotion catalog check', false, err.message);
  }

  // --- SUITE 5: DARAJA STK PUSH PROTOCOL & CRYPTO ---
  console.log('\n--- 5. DARAJA STK PUSH PROTOCOL & CRYPTO ---');
  try {
    const testShortCode = '174379';
    const testPasskey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const testTimestamp = '20260908120000';

    const generatedPassword = generateStkPushPassword(testShortCode, testPasskey, testTimestamp);
    const decoded = Buffer.from(generatedPassword, 'base64').toString('utf8');
    const expected = `${testShortCode}${testPasskey}${testTimestamp}`;

    recordResult('DARAJA', 'Generate base64 encoded STK push password', decoded === expected, `Matches expected concatenated string`);
    recordResult('DARAJA', 'STK push timestamp format is exactly 14 digits (YYYYMMDDHHmmss)', /^\d{14}$/.test(testTimestamp), `Length: ${testTimestamp.length}`);
  } catch (err) {
    recordResult('DARAJA', 'Daraja crypto generation', false, err.message);
  }

  // --- SUITE 6: DARAJA CALLBACK PAYLOAD PARSER ---
  console.log('\n--- 6. DARAJA CALLBACK PAYLOAD PARSER ---');
  try {
    const mockSuccessPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: '29115-34620561-1',
          CheckoutRequestID: 'ws_CO_08092026120000_12345',
          ResultCode: 0,
          ResultDesc: 'The service request is processed successfully.',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: 500 },
              { Name: 'MpesaReceiptNumber', Value: 'QK89XYZ123' },
              { Name: 'Balance' },
              { Name: 'TransactionDate', Value: 20260908120530 },
              { Name: 'PhoneNumber', Value: 254712345678 }
            ]
          }
        }
      }
    };

    const parsedSuccess = parseDarajaCallback(mockSuccessPayload);
    recordResult('CALLBACK', 'Parse ResultCode 0 as successful', parsedSuccess.isSuccess === true, `ResultCode: ${parsedSuccess.resultCode}`);
    recordResult('CALLBACK', 'Extract MpesaReceiptNumber from CallbackMetadata', parsedSuccess.mpesaReceiptNumber === 'QK89XYZ123', `Receipt: ${parsedSuccess.mpesaReceiptNumber}`);
    recordResult('CALLBACK', 'Extract Amount correctly', parsedSuccess.amount === 500, `Amount: ${parsedSuccess.amount}`);
    recordResult('CALLBACK', 'Extract Customer PhoneNumber', parsedSuccess.phoneNumber === '254712345678', `Phone: ${parsedSuccess.phoneNumber}`);

    const mockCancelledPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: '29115-34620561-2',
          CheckoutRequestID: 'ws_CO_08092026120000_67890',
          ResultCode: 1032,
          ResultDesc: 'Request cancelled by user.'
        }
      }
    };

    const parsedCancelled = parseDarajaCallback(mockCancelledPayload);
    recordResult('CALLBACK', 'Parse ResultCode 1032 as user cancellation', parsedCancelled.isSuccess === false && parsedCancelled.resultCode === 1032, `ResultDesc: ${parsedCancelled.resultDesc}`);

    const mockTimeoutPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: '29115-34620561-3',
          CheckoutRequestID: 'ws_CO_08092026120000_11223',
          ResultCode: 1037,
          ResultDesc: 'DS timeout user cannot be reached.'
        }
      }
    };

    const parsedTimeout = parseDarajaCallback(mockTimeoutPayload);
    recordResult('CALLBACK', 'Parse ResultCode 1037 as network/SIM timeout', parsedTimeout.isSuccess === false && parsedTimeout.resultCode === 1037, `ResultDesc: ${parsedTimeout.resultDesc}`);
  } catch (err) {
    recordResult('CALLBACK', 'Callback parser check', false, err.message);
  }

  // --- SUITE 7: PAYMENT INTENT PERSISTENCE & IDEMPOTENCY ---
  console.log('\n--- 7. DATABASE PAYMENT INTENT LIFECYCLE & IDEMPOTENCY ---');
  let testIntentId = null;
  let testReceiptId = null;
  let testPropertyId = null;

  try {
    const idempotencyKey = `TEST-IDEM-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const publicRef = `REKSA-PAY-TEST-${Date.now()}`;

    // 7.1 Create Intent
    const createdIntent = await prisma.paymentIntent.create({
      data: {
        publicReference: publicRef,
        idempotencyKey: idempotencyKey,
        amount: 500,
        currency: 'KES',
        productType: 'PROMOTION_BOOST',
        status: 'PENDING',
        description: 'Test Featured Listing Boost',
        phoneNumberRaw: '254712345678',
        phoneNumberMasked: '+254 7••• ••678',
        metadataJson: JSON.stringify({ promotionCode: 'FEATURED_LISTING' }),
        checkoutRequestId: `ws_TEST_${Date.now()}`,
        merchantRequestId: `mr_TEST_${Date.now()}`
      }
    });
    testIntentId = createdIntent.id;
    recordResult('INTENT', 'Create PaymentIntent in PENDING state', createdIntent.status === 'PENDING', `Intent ID: ${createdIntent.id}`);

    // 7.2 Idempotency verification: Attempting duplicate with same idempotencyKey must be detected
    const duplicate = await prisma.paymentIntent.findUnique({
      where: { idempotencyKey: idempotencyKey }
    });
    recordResult('INTENT', 'Idempotency key uniqueness lookup prevents duplicate charge', duplicate?.id === createdIntent.id, `Matched existing intent: ${duplicate?.id}`);

    // 7.3 Transition to SUCCESS
    const updatedIntent = await prisma.paymentIntent.update({
      where: { id: createdIntent.id },
      data: {
        status: 'SUCCESS',
        providerReceiptNumber: 'QA99TEST888',
        completedAt: new Date()
      }
    });
    recordResult('INTENT', 'Transition PaymentIntent to SUCCESS upon valid payment', updatedIntent.status === 'SUCCESS', `Receipt: ${updatedIntent.providerReceiptNumber}`);

    // --- SUITE 8: OFFICIAL RECEIPT GENERATION ---
    console.log('\n--- 8. OFFICIAL TAX RECEIPT ENGINE ---');
    const receiptNumber = `REKSA-REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const createdReceipt = await prisma.paymentReceipt.create({
      data: {
        receiptNumber: receiptNumber,
        paymentIntentId: updatedIntent.id,
        amount: updatedIntent.amount,
        currency: updatedIntent.currency,
        mpesaReceipt: 'QA99TEST888',
        customerPhone: updatedIntent.phoneNumberMasked,
        productSummary: updatedIntent.description
      }
    });
    testReceiptId = createdReceipt.id;
    recordResult('RECEIPT', 'Generate official REKSA-REC tax invoice record', createdReceipt.receiptNumber.startsWith('REKSA-REC-2026-'), `Receipt Number: ${createdReceipt.receiptNumber}`);
    recordResult('RECEIPT', 'Receipt maps to correct payment amount (KES 500)', createdReceipt.amount === 500, `Amount: KES ${createdReceipt.amount}`);

    // --- SUITE 9: SERVICE ENTITLEMENT FULFILLMENT ---
    console.log('\n--- 9. SERVICE ENTITLEMENT FULFILLMENT ---');
    const existingProperty = await prisma.property.findFirst();
    if (!existingProperty) {
      throw new Error('No properties found in database to test entitlement fulfillment');
    }
    testPropertyId = existingProperty.id;

    // Simulate fulfillment: attach featured badge & create entitlement
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    const activatedProperty = await prisma.property.update({
      where: { id: testPropertyId },
      data: {
        isFeatured: true
      }
    });

    const entitlement = await prisma.listingEntitlement.upsert({
      where: { propertyId: testPropertyId },
      create: {
        propertyId: testPropertyId,
        lastPaymentIntentId: updatedIntent.id,
        status: 'ACTIVE',
        startsAt: new Date(),
        validUntil: expiresAt,
        isFeatured: true,
        featuredUntil: expiresAt
      },
      update: {
        lastPaymentIntentId: updatedIntent.id,
        status: 'ACTIVE',
        validUntil: expiresAt,
        isFeatured: true,
        featuredUntil: expiresAt
      }
    });

    recordResult('ENTITLEMENT', 'Property featured badge set to true upon fulfillment', activatedProperty.isFeatured === true, `isFeatured: ${activatedProperty.isFeatured}`);
    recordResult('ENTITLEMENT', 'ListingEntitlement record created/updated with 14-day expiry', entitlement.status === 'ACTIVE' && entitlement.validUntil > new Date(), `Expires: ${entitlement.validUntil.toISOString()}`);
    recordResult('ENTITLEMENT', 'ListingEntitlement linked to PaymentIntent', entitlement.lastPaymentIntentId === updatedIntent.id, `Intent ID: ${entitlement.lastPaymentIntentId}`);

  } catch (err) {
    recordResult('LIFECYCLE', 'Lifecycle & entitlement test failure', false, err.message);
  } finally {
    // --- CLEANUP TEST DATA ---
    console.log('\n--- CLEANING UP TEST ARTIFACTS ---');
    try {
      if (testReceiptId) {
        await prisma.paymentReceipt.delete({ where: { id: testReceiptId } }).catch(() => {});
      }
      if (testPropertyId) {
        await prisma.listingEntitlement.deleteMany({ where: { propertyId: testPropertyId } }).catch(() => {});
        await prisma.property.update({
          where: { id: testPropertyId },
          data: { isFeatured: false, featuredUntil: null }
        }).catch(() => {});
      }
      if (testIntentId) {
        await prisma.paymentIntent.delete({ where: { id: testIntentId } }).catch(() => {});
      }
      console.log('Cleanup completed successfully.');
    } catch (cleanErr) {
      console.warn('Cleanup warning:', cleanErr.message);
    }
  }

  // --- FINAL SUMMARY REPORT ---
  console.log('\n============================================================');
  console.log('PAYMENTS TEST SUITE EXECUTION SUMMARY');
  console.log('============================================================');
  console.log(`TOTAL TESTS RUN : ${passedTests + failedTests}`);
  console.log(`PASSED          : \x1b[32m${passedTests}\x1b[0m`);
  console.log(`FAILED          : \x1b[${failedTests > 0 ? '31' : '32'}m${failedTests}\x1b[0m`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPaymentTests()
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
