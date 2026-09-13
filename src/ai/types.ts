export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Insufficient data';

export interface AIAnalysisResult {
  score: number;
  confidence: ConfidenceLevel;
  summary: string;
  positiveFactors: string[];
  riskSignals: string[];
  assumptions: string[];
  dataSources: string[];
  breakdown?: Record<string, number>;
}

export interface PropertyAnalystOutput extends AIAnalysisResult {
  investmentScore: number;
  affordabilityScore: number;
  locationScore: number;
  rentalPotentialScore: number;
  valueScore: number;
  riskSignalScore: number;
  overallOpportunityScore: number;
  disclaimer: string;
}

export interface DocumentAnalysisOutput {
  documentType: string;
  detectedEntities: string[];
  parcelNumber?: string;
  datesIdentified: string[];
  completenessScore: number; // 0 - 100
  potentialIssues: string[];
  itemsRequiringReview: string[];
  professionalReviewRecommended: boolean;
  legalValidityDisclaimer: string;
}

export interface ImageAnalysisOutput {
  imageCount: number;
  qualityScore: number; // 0 - 100
  detectedRooms: {
    roomType: 'Living' | 'Bedroom' | 'Kitchen' | 'Bathroom' | 'Exterior' | 'Balcony' | 'Floorplan' | 'Unknown';
    confidence: number;
    count: number;
  }[];
  duplicatePhotosDetected: number;
  inconsistencies: string[];
  suggestedOrder: number[];
  recommendations: string[];
}

export interface DuplicateDetectionResult {
  isPotentialDuplicate: boolean;
  similarityPercentage: number;
  matchedListingId?: string;
  matchingAttributes: string[];
  actionRecommendation: 'APPROVE' | 'FLAG_FOR_MODERATION' | 'ESCALATE_TO_ADMIN';
  reasoning: string;
}

export interface ListingQualityOutput {
  qualityScore: number; // 0 - 100
  tier: 'Poor' | 'Average' | 'Good' | 'Excellent';
  completenessPercentage: number;
  missingFields: string[];
  actionableSuggestions: string[];
}

export interface PriceIntelligenceOutput {
  askingPrice: number;
  medianAskingPrice: number;
  localDataRange: { min: number; max: number };
  pricePerSqm?: number;
  marketPosition: 'Below observed median' | 'Within observed range' | 'Above observed median' | 'Insufficient local data';
  submarketTrend: string;
  disclaimer: string;
}

export interface RiskSignalOutput {
  overallRiskLevel: 'LOW' | 'REVIEW_RECOMMENDED' | 'ELEVATED' | 'HIGH';
  signals: {
    severity: 'LOW' | 'REVIEW_RECOMMENDED' | 'ELEVATED' | 'HIGH';
    title: string;
    details: string;
  }[];
  moderationRequired: boolean;
}