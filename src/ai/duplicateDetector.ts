import { DuplicateDetectionResult } from './types';

export interface ListingCandidate {
  id?: string;
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  bedrooms?: number | null;
  sizeSqm?: number | null;
  countyName: string;
  town: string;
}

export function detectDuplicateListing(
  candidate: ListingCandidate,
  existingListings: ListingCandidate[]
): DuplicateDetectionResult {
  let highestSimilarity = 0;
  let matchedListingId: string | undefined;
  let matchingAttributes: string[] = [];

  for (const existing of existingListings) {
    if (candidate.id && existing.id === candidate.id) continue;

    let score = 0;
    const currentMatches: string[] = [];

    // 1. Spatial distance (< 50 meters)
    const latDiff = Math.abs(candidate.latitude - existing.latitude);
    const lngDiff = Math.abs(candidate.longitude - existing.longitude);
    if (latDiff < 0.0005 && lngDiff < 0.0005) {
      score += 40;
      currentMatches.push('Geographical coordinates match within 50m radius');
    }

    // 2. Price similarity (< 3% difference)
    const priceRatio = Math.abs(candidate.price - existing.price) / (existing.price || 1);
    if (priceRatio < 0.03) {
      score += 25;
      currentMatches.push(`Asking price is identical or within 3% (KES ${existing.price.toLocaleString()})`);
    }

    // 3. Specs match
    if (candidate.bedrooms && existing.bedrooms && candidate.bedrooms === existing.bedrooms) {
      score += 15;
      currentMatches.push(`Identical bedroom count (${candidate.bedrooms} bed)`);
    }

    // 4. Text similarity heuristic
    const titleA = candidate.title.toLowerCase();
    const titleB = existing.title.toLowerCase();
    if (titleA === titleB || titleA.includes(titleB) || titleB.includes(titleA)) {
      score += 20;
      currentMatches.push('Listing titles share strong lexical overlap');
    }

    if (score > highestSimilarity) {
      highestSimilarity = score;
      matchedListingId = existing.id;
      matchingAttributes = currentMatches;
    }
  }

  const isPotentialDuplicate = highestSimilarity >= 75;

  return {
    isPotentialDuplicate,
    similarityPercentage: highestSimilarity,
    matchedListingId,
    matchingAttributes,
    actionRecommendation: isPotentialDuplicate ? 'FLAG_FOR_MODERATION' : 'APPROVE',
    reasoning: isPotentialDuplicate
      ? `High correlation (${highestSimilarity}%) detected with listing ${matchedListingId || 'existing record'}. Automated hold placed for moderator audit to prevent spam/double-brokerage.`
      : 'Listing passed duplicate checks with no significant overlapping signals.'
  };
}