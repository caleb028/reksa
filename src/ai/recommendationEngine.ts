export interface UserPreferences {
  county?: string;
  neighbourhood?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  intent?: 'SALE' | 'RENT' | 'LAND';
  minBedrooms?: number;
}

export interface CandidateProperty {
  id: string;
  passportId: string;
  title: string;
  price: number;
  propertyType: string;
  listingIntent: string;
  bedrooms?: number | null;
  countyName: string;
  neighbourhoodName?: string | null;
  trustScore: number;
  verificationLevel: number;
}

export interface RecommendationResult {
  property: CandidateProperty;
  matchScore: number; // 0 - 100
  reasoning: string;
}

export function generateRecommendations(
  prefs: UserPreferences,
  properties: CandidateProperty[]
): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  for (const prop of properties) {
    let score = 50;
    const reasons: string[] = [];

    // Intent match
    if (prefs.intent && prop.listingIntent === prefs.intent) {
      score += 15;
    }

    // Type match
    if (prefs.propertyType && prop.propertyType.toLowerCase() === prefs.propertyType.toLowerCase()) {
      score += 15;
      reasons.push(prop.propertyType);
    }

    // County / Neighbourhood match
    if (prefs.neighbourhood && prop.neighbourhoodName?.toLowerCase() === prefs.neighbourhood.toLowerCase()) {
      score += 20;
      reasons.push(`in ${prop.neighbourhoodName}`);
    } else if (prefs.county && prop.countyName.toLowerCase() === prefs.county.toLowerCase()) {
      score += 10;
      reasons.push(`in ${prop.countyName}`);
    }

    // Budget match
    if (prefs.maxPrice && prop.price <= prefs.maxPrice) {
      score += 10;
      reasons.push(`within your budget under KES ${prefs.maxPrice.toLocaleString()}`);
    }

    // Bed match
    if (prefs.minBedrooms && prop.bedrooms && prop.bedrooms >= prefs.minBedrooms) {
      score += 10;
      reasons.push(`matching your ${prefs.minBedrooms}+ bedroom preference`);
    }

    // Quality bonus
    if (prop.trustScore >= 85) score += 5;
    if (prop.verificationLevel >= 3) score += 5;

    const formattedReason =
      reasons.length > 0
        ? `Recommended because you explored ${reasons.join(', ')}.`
        : `Recommended based on popular high-trust verified properties in ${prop.countyName}.`;

    results.push({
      property: prop,
      matchScore: Math.min(99, score),
      reasoning: formattedReason
    });
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}