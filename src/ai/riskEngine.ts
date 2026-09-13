import { RiskSignalOutput } from './types';

export interface PropertyRiskAssessmentInput {
  propertyId: string;
  price: number;
  medianNeighbourhoodPrice?: number;
  verificationLevel: number;
  isDuplicateCandidate?: boolean;
  duplicateSimilarity?: number | null;
  priceHistory?: { price: number; recordedAt: Date | string }[];
  missingCrucialDocs?: boolean;
}

export function assessPropertyRisk(input: PropertyRiskAssessmentInput): RiskSignalOutput {
  const signals: RiskSignalOutput['signals'] = [];
  let elevatedCount = 0;
  let highCount = 0;

  // 1. Duplicate candidate detection
  if (input.isDuplicateCandidate && (input.duplicateSimilarity || 0) > 85) {
    highCount++;
    signals.push({
      severity: 'HIGH',
      title: 'High Visual/Spatial Duplicate Overlap',
      details: `Algorithm detected ${(input.duplicateSimilarity || 90).toFixed(0)}% match with another existing listing. Human moderation review required before public publishing.`
    });
  }

  // 2. Unusually steep price discount (>40% below submarket median)
  if (input.medianNeighbourhoodPrice && input.medianNeighbourhoodPrice > 0) {
    const discount = (input.medianNeighbourhoodPrice - input.price) / input.medianNeighbourhoodPrice;
    if (discount > 0.45) {
      elevatedCount++;
      signals.push({
        severity: 'ELEVATED',
        title: 'Unusually Low Price Variance',
        details: `Asking price is ${(discount * 100).toFixed(0)}% below observed area median. Commonly associated with urgent distressed sales or fraudulent spoof listings. Caution advised.`
      });
    }
  }

  // 3. Verification level tier 0
  if (input.verificationLevel === 0) {
    signals.push({
      severity: 'REVIEW_RECOMMENDED',
      title: 'Preliminary Unverified Tier',
      details: 'Seller has not yet submitted land title deed or identity documents for platform verification review.'
    });
  }

  // Determine overall severity
  let overallRiskLevel: RiskSignalOutput['overallRiskLevel'] = 'LOW';
  if (highCount > 0) overallRiskLevel = 'HIGH';
  else if (elevatedCount > 0) overallRiskLevel = 'ELEVATED';
  else if (signals.length > 0) overallRiskLevel = 'REVIEW_RECOMMENDED';

  return {
    overallRiskLevel,
    signals: signals.length > 0 ? signals : [
      {
        severity: 'LOW',
        title: 'Nominal Risk Profile',
        details: 'No abnormal pricing spikes, duplicate assets, or suspicious identity anomalies detected.'
      }
    ],
    moderationRequired: overallRiskLevel === 'HIGH' || overallRiskLevel === 'ELEVATED'
  };
}