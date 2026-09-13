export interface NeighbourhoodData {
  name: string;
  town: string;
  countyName: string;
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
}

export function generateNeighbourhoodAnalysis(data: NeighbourhoodData) {
  const priceRange = {
    min: Math.round(data.medianAskingPrice * 0.85),
    max: Math.round(data.medianAskingPrice * 1.25)
  };

  const rentalRange = {
    min: Math.round(data.medianAskingPrice * 0.0065),
    max: Math.round(data.medianAskingPrice * 0.0095)
  };

  const aiSummary = `${data.name} has a strong concentration of residential and investment properties. Based on available platform data, the area yields approximately ${data.rentalYieldAvg}% annually. Prospective buyers and tenants benefit from ${data.transitAccess.toLowerCase()} transit connectivity and a security rating of ${data.securityRating}/5.0. When evaluating apartments in this corridor, users should independently verify monthly service charges, borehole water quality, and verified sectional title plans.`;

  return {
    priceRange,
    rentalRange,
    aiSummary,
    infrastructureBreakdown: {
      schools: data.schoolsCount,
      hospitals: data.hospitalsCount,
      retailCentres: data.shoppingCount,
      transit: data.transitAccess,
      floodRisk: data.floodRiskLevel
    },
    investmentPros: [
      `Sustained tenant demand supported by proximity to key commercial centres in ${data.town}.`,
      `Average gross rental yield of ${data.rentalYieldAvg}% sits comfortably above Treasury bond inflation benchmarks.`
    ],
    investmentConsiderations: [
      'Older units may require cosmetic renovations or plumbing fixture upgrades.',
      'Check sewer line connectivity and backup power generator provisioning.'
    ],
    disclaimer: 'Neighbourhood data is compiled from aggregated platform listings, municipal spatial plans, and resident survey samples. This does not replace physical site visits.'
  };
}