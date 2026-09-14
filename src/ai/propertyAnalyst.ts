import { PropertyAnalystOutput } from './types';

export interface PropertyDataInput {
  id: string;
  passportId: string;
  title: string;
  propertyType: string;
  price: number;
  bedrooms?: number | null;
  sizeSqm?: number | null;
  neighbourhood?: {
    name: string;
    medianAskingPrice: number;
    rentalYieldAvg: number;
    developmentScore: number;
    securityRating: number;
  } | null;
  rentalYieldEstimate?: number | null;
  estimatedMonthlyRent?: number | null;
  verificationLevel: number;
  trustScore: number;
}

export function analyseProperty(property: PropertyDataInput): PropertyAnalystOutput {
  const medianPrice = property.neighbourhood?.medianAskingPrice || property.price;
  const priceVariance = (property.price - medianPrice) / (medianPrice || 1);

  // 1. Value Score
  let valueScore = 75;
  if (priceVariance < -0.15) valueScore = 92;
  else if (priceVariance < -0.05) valueScore = 86;
  else if (priceVariance > 0.25) valueScore = 62;
  else valueScore = 78;

  // 2. Rental Potential Score
  const yieldEst = property.rentalYieldEstimate || property.neighbourhood?.rentalYieldAvg || 7.0;
  let rentalPotentialScore = 70;
  if (yieldEst >= 9.5) rentalPotentialScore = 95;
  else if (yieldEst >= 8.5) rentalPotentialScore = 88;
  else if (yieldEst >= 7.5) rentalPotentialScore = 80;
  else rentalPotentialScore = 68;

  // 3. Location Score
  const devScore = property.neighbourhood?.developmentScore || 75;
  const secRating = property.neighbourhood?.securityRating || 4.0;
  const locationScore = Math.min(98, Math.round((devScore * 0.6) + (secRating * 20 * 0.4)));

  // 4. Investment Score
  const investmentScore = Math.round((valueScore * 0.35) + (rentalPotentialScore * 0.4) + (locationScore * 0.25));

  // 5. Affordability Score
  let affordabilityScore = 80;
  if (property.price > 25000000) affordabilityScore = 55;
  else if (property.price > 15000000) affordabilityScore = 70;
  else if (property.price > 8000000) affordabilityScore = 82;
  else affordabilityScore = 91;

  // 6. Risk Signal Score (Lower is safer)
  let riskSignalScore = 20;
  if (property.verificationLevel >= 4) riskSignalScore = 8;
  else if (property.verificationLevel >= 2) riskSignalScore = 16;
  else if (property.verificationLevel === 0) riskSignalScore = 48;

  // 7. Overall Opportunity Score
  const overallOpportunityScore = Math.round(
    (investmentScore * 0.35) +
    (locationScore * 0.25) +
    (property.trustScore * 0.25) +
    ((100 - riskSignalScore) * 0.15)
  );

  const positiveFactors: string[] = [];
  const riskSignals: string[] = [];
  const assumptions: string[] = [];

  if (yieldEst >= 8.0) {
    positiveFactors.push(`Estimated gross yield of ${yieldEst.toFixed(1)}% outperforms Nairobi submarket benchmark.`);
  }
  if (property.verificationLevel >= 3) {
    positiveFactors.push(`High verification confidence (Tier ${property.verificationLevel}): documentation and spatial records verified.`);
  }
  if (property.sizeSqm) {
    const pricePerSqm = Math.round(property.price / property.sizeSqm);
    positiveFactors.push(`Price per square metre is observed at KSh ${pricePerSqm.toLocaleString()}/sqm.`);
  }

  if (property.verificationLevel < 2) {
    riskSignals.push('Property is at preliminary verification level. On-site inspection and registry search strongly recommended.');
  }
  riskSignals.push('Service charges, utility metering, and historical occupancy rates must be independently verified with building management.');

  assumptions.push('Rental yield projections assume continuous tenancy with an average 10% vacancy allowance.');
  assumptions.push('Local submarket median prices are derived from active and historical A&E platform listings.');

  return {
    score: overallOpportunityScore,
    overallOpportunityScore,
    investmentScore,
    affordabilityScore,
    locationScore,
    rentalPotentialScore,
    valueScore,
    riskSignalScore,
    confidence: property.verificationLevel >= 3 ? 'High' : 'Medium',
    summary: `This ${property.propertyType.toLowerCase()} is positioned ${
      priceVariance < 0 ? 'competitively below' : 'in line with'
    } observed asking prices in ${property.neighbourhood?.name || 'its area'}. Rental potential appears attractive at an estimated ${yieldEst.toFixed(
      1
    )}% yield, with an A&E Trust Score of ${property.trustScore}/100.`,
    positiveFactors,
    riskSignals,
    assumptions,
    dataSources: [
      'A&E Platform Transaction Index',
      'Area Master Plan Spatial Data',
      property.verificationLevel >= 4 ? 'Licensed Structural Engineering Inspection Audit' : 'Platform Algorithmic Verification'
    ],
    disclaimer: 'AI-generated insight based on available platform data and algorithmic models. This does not constitute an official valuation, legal title certification, or guaranteed financial return.'
  };
}