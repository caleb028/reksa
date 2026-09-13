import { ListingQualityOutput } from './types';

export interface ListingPayload {
  title?: string;
  description?: string;
  price?: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeSqm?: number | null;
  latitude?: number;
  longitude?: number;
  imagesCount?: number;
  amenitiesCount?: number;
  floorPlanUrl?: string;
}

export function evaluateListingQuality(payload: ListingPayload): ListingQualityOutput {
  let score = 0;
  const missingFields: string[] = [];
  const actionableSuggestions: string[] = [];

  // Description completeness (max 25)
  const descLength = payload.description?.length || 0;
  if (descLength > 200) {
    score += 25;
  } else if (descLength > 80) {
    score += 15;
    actionableSuggestions.push('Expand property description with details about the neighbourhood, water reliability, and security.');
  } else {
    missingFields.push('Detailed description');
    actionableSuggestions.push('Write a comprehensive description (at least 150 words) to attract serious buyers.');
  }

  // Images (max 25)
  const images = payload.imagesCount || 0;
  if (images >= 5) {
    score += 25;
  } else if (images >= 2) {
    score += 15;
    actionableSuggestions.push('Upload at least 5 high-resolution photos to reach maximum buyer engagement.');
  } else {
    missingFields.push('Property photos (min 3 recommended)');
    actionableSuggestions.push('Add clear photos of all key rooms and the exterior compound.');
  }

  // Location precision (max 20)
  if (payload.latitude && payload.longitude) {
    score += 20;
  } else {
    missingFields.push('Exact GPS pin / coordinates');
    actionableSuggestions.push('Pinpoint exact location on the map to enable commute route discovery.');
  }

  // Specifications (max 20)
  let specScore = 0;
  if (payload.price && payload.price > 0) specScore += 5;
  if (payload.bedrooms) specScore += 5;
  if (payload.bathrooms) specScore += 5;
  if (payload.sizeSqm) specScore += 5;
  else actionableSuggestions.push('Add floor area in square metres (sqm) to unlock price-per-square-metre analytics.');
  score += specScore;

  // Amenities & Floorplan (max 10)
  if ((payload.amenitiesCount || 0) >= 3) score += 5;
  if (payload.floorPlanUrl) score += 5;
  else actionableSuggestions.push('Attach an architectural floor plan to boost listing quality score by +5 points.');

  let tier: ListingQualityOutput['tier'] = 'Good';
  if (score >= 90) tier = 'Excellent';
  else if (score >= 75) tier = 'Good';
  else if (score >= 50) tier = 'Average';
  else tier = 'Poor';

  return {
    qualityScore: score,
    tier,
    completenessPercentage: score,
    missingFields,
    actionableSuggestions
  };
}