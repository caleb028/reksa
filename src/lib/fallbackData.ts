import fallbackPropertiesRaw from './constants/fallbackProperties.json';

export interface FallbackProperty {
  id: string;
  passportId: string;
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  listingIntent: string;
  price: number;
  currency: string;
  rentalYieldEstimate?: number | null;
  estimatedMonthlyRent?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeSqm?: number | null;
  landAcreage?: number | null;
  furnished: boolean;
  gatedCommunity: boolean;
  parkingSpaces: number;
  yearBuilt?: number | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  apartmentBlock?: string | null;
  unitNumber?: string | null;
  monthlyRent?: number | null;
  serviceCharge?: number | null;
  deposit?: number | null;
  balcony: boolean;
  elevator: boolean;
  borehole: boolean;
  backupGenerator: boolean;
  cctv: boolean;
  swimmingPool: boolean;
  gym: boolean;
  childrenPlayArea: boolean;
  garden: boolean;
  solarWaterHeater: boolean;
  petFriendly: boolean;
  internetReady: boolean;
  servantQuarter: boolean;
  completionStatus?: string | null;
  furnishingStatus?: string | null;
  countyId: string;
  neighbourhoodId?: string | null;
  town: string;
  estate?: string | null;
  address: string;
  latitude: number;
  longitude: number;
  trustScore: number;
  verificationLevel: number;
  verificationStatus: string;
  isFeatured: boolean;
  status: string;
  sellerType: string;
  agentId?: string | null;
  organizationId?: string | null;
  assignedAgentMemberId?: string | null;
  county: {
    id: string;
    code: number;
    name: string;
    capital: string;
    region: string;
    latitude: number;
    longitude: number;
  };
  neighbourhood?: {
    id: string;
    name: string;
    slug: string;
    countyId: string;
    town: string;
    latitude: number;
    longitude: number;
    description: string;
    medianAskingPrice: number;
    rentalYieldAvg: number;
    developmentScore: number;
    securityRating: number;
    infrastructureRating: number;
    floodRiskLevel: string;
    schoolsCount: number;
    hospitalsCount: number;
    shoppingCount: number;
    transitAccess: string;
    aiSummary?: string | null;
  } | null;
  images: Array<{
    id: string;
    propertyId: string;
    url: string;
    caption?: string | null;
    roomType?: string | null;
    isPrimary: boolean;
    aiQualityScore?: number | null;
    isAIGenerated: boolean;
    orderIndex: number;
  }>;
  passport?: {
    id: string;
    propertyId: string;
    passportNumber: string;
    initialRegistered: string;
    lastVerified?: string | null;
    blockchainTxHash?: string | null;
    ownershipChainJson: string;
    riskLevel: string;
    structuralStatus: string;
    boundaryConfidence: number;
    changesDetected: string;
    publicNotes?: string | null;
  } | null;
}

export const FALLBACK_PROPERTIES = fallbackPropertiesRaw as unknown as FallbackProperty[];

export function getFallbackApartmentsForSale(filters?: {
  county?: string;
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  elevator?: string;
  borehole?: string;
  generator?: string;
  pool?: string;
  sort?: string;
}): FallbackProperty[] {
  let list = FALLBACK_PROPERTIES.filter(
    (p) =>
      p.status === 'ACTIVE' &&
      p.listingIntent === 'SALE' &&
      ['Apartment', 'Penthouse', 'Studio'].includes(p.propertyType)
  );

  if (filters?.county && filters.county !== 'All Counties') {
    const cLower = filters.county.toLowerCase();
    list = list.filter((p) => p.county.name.toLowerCase().includes(cLower));
  }
  if (filters?.bedrooms && filters.bedrooms !== 'Any') {
    const bed = parseInt(filters.bedrooms);
    if (!isNaN(bed)) {
      list = list.filter((p) => (p.bedrooms ?? 0) >= bed);
    }
  }
  if (filters?.minPrice) {
    const min = parseFloat(filters.minPrice);
    if (!isNaN(min)) {
      list = list.filter((p) => p.price >= min);
    }
  }
  if (filters?.maxPrice) {
    const max = parseFloat(filters.maxPrice);
    if (!isNaN(max)) {
      list = list.filter((p) => p.price <= max);
    }
  }
  if (filters?.elevator === 'true') list = list.filter((p) => p.elevator);
  if (filters?.borehole === 'true') list = list.filter((p) => p.borehole);
  if (filters?.generator === 'true') list = list.filter((p) => p.backupGenerator);
  if (filters?.pool === 'true') list = list.filter((p) => p.swimmingPool);

  const sort = filters?.sort || 'recommended';
  if (sort === 'lowest_price') list.sort((a, b) => a.price - b.price);
  else if (sort === 'highest_price') list.sort((a, b) => b.price - a.price);
  else if (sort === 'highest_yield') list.sort((a, b) => (b.rentalYieldEstimate ?? 0) - (a.rentalYieldEstimate ?? 0));
  else if (sort === 'trust_score') list.sort((a, b) => b.trustScore - a.trustScore);
  else list.sort((a, b) => b.trustScore - a.trustScore);

  return list;
}

export function getFallbackApartmentsForRent(filters?: {
  county?: string;
  bedrooms?: string;
  maxRent?: string;
  elevator?: string;
  borehole?: string;
  generator?: string;
  furnished?: string;
  sort?: string;
}): FallbackProperty[] {
  let list = FALLBACK_PROPERTIES.filter(
    (p) =>
      p.status === 'ACTIVE' &&
      p.listingIntent === 'RENT' &&
      ['Apartment', 'Penthouse', 'Studio'].includes(p.propertyType)
  );

  if (filters?.county && filters.county !== 'All Counties') {
    const cLower = filters.county.toLowerCase();
    list = list.filter((p) => p.county.name.toLowerCase().includes(cLower));
  }
  if (filters?.bedrooms && filters.bedrooms !== 'Any') {
    const bed = parseInt(filters.bedrooms);
    if (!isNaN(bed)) {
      list = list.filter((p) => (p.bedrooms ?? 0) >= bed);
    }
  }
  if (filters?.maxRent) {
    const max = parseFloat(filters.maxRent);
    if (!isNaN(max)) {
      list = list.filter((p) => p.price <= max);
    }
  }
  if (filters?.elevator === 'true') list = list.filter((p) => p.elevator);
  if (filters?.borehole === 'true') list = list.filter((p) => p.borehole);
  if (filters?.generator === 'true') list = list.filter((p) => p.backupGenerator);
  if (filters?.furnished === 'true') list = list.filter((p) => p.furnished);

  const sort = filters?.sort || 'recommended';
  if (sort === 'lowest_price') list.sort((a, b) => a.price - b.price);
  else if (sort === 'highest_price') list.sort((a, b) => b.price - a.price);
  else if (sort === 'highest_yield') list.sort((a, b) => (b.rentalYieldEstimate ?? 0) - (a.rentalYieldEstimate ?? 0));
  else if (sort === 'trust_score') list.sort((a, b) => b.trustScore - a.trustScore);
  else list.sort((a, b) => b.trustScore - a.trustScore);

  return list;
}

export function getFallbackAllProperties(filters?: {
  county?: string;
  type?: string;
  intent?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  minTrustScore?: string;
  sort?: string;
}): FallbackProperty[] {
  let list = [...FALLBACK_PROPERTIES];

  if (filters?.intent) {
    list = list.filter((p) => p.listingIntent === filters.intent);
  }
  if (filters?.county && filters.county !== 'All Counties') {
    const cLower = filters.county.toLowerCase();
    list = list.filter((p) => p.county.name.toLowerCase().includes(cLower));
  }
  if (filters?.type && filters.type !== 'ALL') {
    list = list.filter((p) => p.propertyType.toLowerCase().includes(filters.type!.toLowerCase()));
  }
  if (filters?.minPrice) {
    const min = parseFloat(filters.minPrice);
    if (!isNaN(min)) list = list.filter((p) => p.price >= min);
  }
  if (filters?.maxPrice) {
    const max = parseFloat(filters.maxPrice);
    if (!isNaN(max)) list = list.filter((p) => p.price <= max);
  }
  if (filters?.bedrooms && filters.bedrooms !== 'Any') {
    const bed = parseInt(filters.bedrooms);
    if (!isNaN(bed)) list = list.filter((p) => (p.bedrooms ?? 0) >= bed);
  }
  if (filters?.minTrustScore) {
    const ts = parseInt(filters.minTrustScore);
    if (!isNaN(ts)) list = list.filter((p) => p.trustScore >= ts);
  }

  const sort = filters?.sort || 'recommended';
  if (sort === 'lowest_price') list.sort((a, b) => a.price - b.price);
  else if (sort === 'highest_price') list.sort((a, b) => b.price - a.price);
  else if (sort === 'highest_yield') list.sort((a, b) => (b.rentalYieldEstimate ?? 0) - (a.rentalYieldEstimate ?? 0));
  else if (sort === 'trust_score') list.sort((a, b) => b.trustScore - a.trustScore);
  else list.sort((a, b) => b.trustScore - a.trustScore);

  return list;
}

export function getFallbackPropertyByIdOrSlug(identifier: string): FallbackProperty | undefined {
  return FALLBACK_PROPERTIES.find(
    (p) => p.id === identifier || p.slug === identifier || p.passportId === identifier
  );
}
