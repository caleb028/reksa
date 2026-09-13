import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100)
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().email('Invalid email address').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  phone: z.string().trim().regex(/^(?:\+?254|0)?[17]\d{8}$/, 'Must be a valid Kenyan mobile number (e.g. 0712345678 or +254712345678)').optional()
});

export const propertyQuerySchema = z.object({
  county: z.string().max(50).optional(),
  ids: z.string().max(1000).optional(),
  intent: z.preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), z.enum(['SALE', 'RENT', 'INVEST', 'ALL'])).optional(),
  type: z.string().max(50).optional(),
  category: z.preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), z.enum(['ALL', 'APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'PENTHOUSE', 'MAISONETTE', 'TOWNHOUSE'])).optional(),
  minPrice: z.coerce.number().min(0).max(10_000_000_000).optional(),
  maxPrice: z.coerce.number().min(0).max(10_000_000_000).optional(),
  bedrooms: z.coerce.number().int().min(1).max(20).optional(),
  minSize: z.coerce.number().min(0).max(100_000).optional(),
  maxSize: z.coerce.number().min(0).max(100_000).optional(),
  minTrustScore: z.coerce.number().int().min(0).max(100).optional(),
  minVerification: z.coerce.number().int().min(0).max(5).optional(),
  elevator: z.coerce.boolean().optional(),
  borehole: z.coerce.boolean().optional(),
  generator: z.coerce.boolean().optional(),
  pool: z.coerce.boolean().optional(),
  gym: z.coerce.boolean().optional(),
  balcony: z.coerce.boolean().optional(),
  completionStatus: z.string().max(40).optional(),
  furnishingStatus: z.string().max(40).optional(),
  q: z.string().max(100).optional(),
  sort: z.enum(['recommended', 'lowest_price', 'highest_price', 'highest_yield', 'trust_score']).default('recommended'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  page: z.coerce.number().int().min(1).default(1)
});

export const paymentInitiateSchema = z.object({
  phoneNumber: z.string().trim().regex(/^(?:\+?254|0)?[17]\d{8}$/, 'Must be a valid Kenyan phone number (e.g. 0712345678)'),
  amount: z.coerce.number().positive('Amount must be greater than zero').max(1_000_000, 'Amount exceeds single transaction limit'),
  planName: z.string().trim().min(2).max(50)
});

export const documentReviewSchema = z.object({
  fileName: z.string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-zA-Z0-9_\-\. ]+\.(pdf|jpg|jpeg|png)$/i, 'Only PDF, JPG, and PNG files with safe names are permitted')
    .refine((name) => !name.includes('..') && !name.includes('/') && !name.includes('\\'), {
      message: 'Filename must not contain path traversal characters'
    }),
  textContent: z.string().max(100_000, 'Text content exceeds 100,000 character limit').optional()
});

export const aiAdvisorSchema = z.object({
  query: z.string().trim().min(1, 'Query is required').max(1000, 'Query exceeds maximum length of 1000 characters'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(2000)
  })).max(20).optional()
});