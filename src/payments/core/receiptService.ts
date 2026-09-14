import { Prisma, PrismaClient } from '@prisma/client';
import { db } from '@/lib/db';

export interface CreateReceiptParams {
  paymentIntentId: string;
  organizationId?: string | null;
  userId?: string | null;
  amount: number;
  currency?: string;
  mpesaReceipt?: string;
  customerPhone?: string;
  productSummary: string;
}

export class PaymentReceiptService {
  /**
   * Generates a unique, chronological A&E receipt number
   * e.g. AE-REC-2026-89412
   */
  public static generateReceiptNumber(): string {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    return `AE-REC-${year}-${randomSuffix}`;
  }

  /**
   * Creates an official database record of the payment receipt
   */
  public static async createReceipt(
    tx: Prisma.TransactionClient | PrismaClient = db,
    params: CreateReceiptParams
  ) {
    const receiptNumber = this.generateReceiptNumber();

    const receipt = await tx.paymentReceipt.create({
      data: {
        receiptNumber,
        paymentIntentId: params.paymentIntentId,
        organizationId: params.organizationId || null,
        userId: params.userId || null,
        amount: params.amount,
        currency: params.currency || 'KES',
        paymentMethod: 'M-Pesa (Safaricom Daraja)',
        mpesaReceipt: params.mpesaReceipt || 'CONFIRMED',
        customerPhone: params.customerPhone || null,
        productSummary: params.productSummary,
        issuedAt: new Date()
      }
    });

    return receipt;
  }

  /**
   * Retrieves full receipt details by receipt number or payment intent ID
   */
  public static async getReceiptByNumber(receiptNumber: string) {
    return db.paymentReceipt.findUnique({
      where: { receiptNumber },
      include: {
        paymentIntent: true,
        organization: true,
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });
  }

  /**
   * Retrieves all receipts for an organization
   */
  public static async getOrganizationReceipts(organizationId: string) {
    return db.paymentReceipt.findMany({
      where: { organizationId },
      orderBy: { issuedAt: 'desc' },
      include: {
        paymentIntent: true
      }
    });
  }
}
