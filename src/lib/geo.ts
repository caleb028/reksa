// Geographical and spatial helper functions for Kenyan coordinates and commute routing

export interface LatLng {
  lat: number;
  lng: number;
}

// Calculate distance in kilometers using the Haversine formula
export function calculateHaversineDistance(point1: LatLng, point2: LatLng): number {
  const R = 6371; // Earth radius in km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Estimate travel duration in minutes based on distance and typical Kenyan urban/suburban speeds
export function estimateTravelTimeMinutes(
  distanceKm: number,
  trafficCondition: 'Light' | 'Normal' | 'Peak' = 'Normal'
): number {
  let avgSpeedKmh = 35; // typical Nairobi arterial speed
  if (trafficCondition === 'Light') avgSpeedKmh = 50;
  if (trafficCondition === 'Peak') avgSpeedKmh = 18;

  const hours = distanceKm / avgSpeedKmh;
  return Math.max(5, Math.round(hours * 60));
}

// Commute route check
export function isWithinCommuteBoundary(
  propertyCoords: LatLng,
  originCoords: LatLng,
  maxTravelMinutes: number
): { isEligible: boolean; distanceKm: number; estimatedMinutes: number } {
  const distanceKm = calculateHaversineDistance(propertyCoords, originCoords);
  const estimatedMinutes = estimateTravelTimeMinutes(distanceKm, 'Normal');
  return {
    isEligible: estimatedMinutes <= maxTravelMinutes,
    distanceKm,
    estimatedMinutes
  };
}

// Popular Kenyan Commute Hubs
export const COMMUTE_HUBS = [
  { name: 'Nairobi CBD (Kenyatta Ave / City Hall)', lat: -1.2864, lng: 36.8219 },
  { name: 'Upper Hill Financial District (Nairobi)', lat: -1.2989, lng: 36.8152 },
  { name: 'Westlands Commercial Hub (Waiyaki Way)', lat: -1.2672, lng: 36.8078 },
  { name: 'Gigiri UN Complex / Diplomatic Blue Zone', lat: -1.2335, lng: 36.8049 },
  { name: 'Mombasa Old Town & Port District', lat: -4.0583, lng: 39.6738 },
  { name: 'Kisumu CBD / Lakefront', lat: -0.1022, lng: 34.7523 },
  { name: 'Nakuru Town Center (Kenyatta Ave)', lat: -0.2833, lng: 36.0667 }
];