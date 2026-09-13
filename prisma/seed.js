const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const defaultHash = bcrypt.hashSync('MaliTrace@2026!', 12);

const KENYA_COUNTIES = [
  { code: 1, name: 'Mombasa', capital: 'Mombasa', region: 'Coast', lat: -4.0435, lng: 39.6682 },
  { code: 2, name: 'Kwale', capital: 'Kwale', region: 'Coast', lat: -4.1816, lng: 39.4521 },
  { code: 3, name: 'Kilifi', capital: 'Kilifi', region: 'Coast', lat: -3.6305, lng: 39.8499 },
  { code: 4, name: 'Tana River', capital: 'Hola', region: 'Coast', lat: -1.5000, lng: 40.0000 },
  { code: 5, name: 'Lamu', capital: 'Lamu', region: 'Coast', lat: -2.2686, lng: 40.9006 },
  { code: 6, name: 'Taita-Taveta', capital: 'Mwatate', region: 'Coast', lat: -3.3161, lng: 38.3574 },
  { code: 7, name: 'Garissa', capital: 'Garissa', region: 'North Eastern', lat: -0.4532, lng: 39.6460 },
  { code: 8, name: 'Wajir', capital: 'Wajir', region: 'North Eastern', lat: 1.7471, lng: 40.0573 },
  { code: 9, name: 'Mandera', capital: 'Mandera', region: 'North Eastern', lat: 3.9373, lng: 41.8569 },
  { code: 10, name: 'Marsabit', capital: 'Marsabit', region: 'Eastern', lat: 2.3347, lng: 37.9902 },
  { code: 11, name: 'Isiolo', capital: 'Isiolo', region: 'Eastern', lat: 0.3546, lng: 37.5822 },
  { code: 12, name: 'Meru', capital: 'Meru', region: 'Eastern', lat: 0.0463, lng: 37.6559 },
  { code: 13, name: 'Tharaka-Nithi', capital: 'Kathwana', region: 'Eastern', lat: -0.2970, lng: 37.8687 },
  { code: 14, name: 'Embu', capital: 'Embu', region: 'Eastern', lat: -0.5344, lng: 37.4558 },
  { code: 15, name: 'Kitui', capital: 'Kitui', region: 'Eastern', lat: -1.3748, lng: 38.0106 },
  { code: 16, name: 'Machakos', capital: 'Machakos', region: 'Eastern', lat: -1.5177, lng: 37.2634 },
  { code: 17, name: 'Makueni', capital: 'Wote', region: 'Eastern', lat: -1.7808, lng: 37.6288 },
  { code: 18, name: 'Nyandarua', capital: 'Ol Kalou', region: 'Central', lat: -0.1804, lng: 36.3795 },
  { code: 19, name: 'Nyeri', capital: 'Nyeri', region: 'Central', lat: -0.4197, lng: 36.9511 },
  { code: 20, name: 'Kirinyaga', capital: 'Kerugoya', region: 'Central', lat: -0.4989, lng: 37.2803 },
  { code: 21, name: "Murang'a", capital: "Murang'a", region: 'Central', lat: -0.7211, lng: 37.1526 },
  { code: 22, name: 'Kiambu', capital: 'Kiambu', region: 'Central', lat: -1.1714, lng: 36.8356 },
  { code: 23, name: 'Turkana', capital: 'Lodwar', region: 'Rift Valley', lat: 3.1191, lng: 35.5973 },
  { code: 24, name: 'West Pokot', capital: 'Kapenguria', region: 'Rift Valley', lat: 1.2389, lng: 35.1119 },
  { code: 25, name: 'Samburu', capital: 'Maralal', region: 'Rift Valley', lat: 1.0968, lng: 36.6980 },
  { code: 26, name: 'Trans-Nzoia', capital: 'Kitale', region: 'Rift Valley', lat: 1.0157, lng: 35.0062 },
  { code: 27, name: 'Uasin Gishu', capital: 'Eldoret', region: 'Rift Valley', lat: 0.5143, lng: 35.2698 },
  { code: 28, name: 'Elgeyo-Marakwet', capital: 'Iten', region: 'Rift Valley', lat: 0.6732, lng: 35.5082 },
  { code: 29, name: 'Nandi', capital: 'Kapsabet', region: 'Rift Valley', lat: 0.2040, lng: 35.1051 },
  { code: 30, name: 'Baringo', capital: 'Kabarnet', region: 'Rift Valley', lat: 0.4900, lng: 35.7420 },
  { code: 31, name: 'Laikipia', capital: 'Rumuruti', region: 'Rift Valley', lat: 0.2713, lng: 36.5388 },
  { code: 32, name: 'Nakuru', capital: 'Nakuru', region: 'Rift Valley', lat: -0.3031, lng: 36.0800 },
  { code: 33, name: 'Narok', capital: 'Narok', region: 'Rift Valley', lat: -1.0783, lng: 35.8601 },
  { code: 34, name: 'Kajiado', capital: 'Kajiado', region: 'Rift Valley', lat: -1.8524, lng: 36.7768 },
  { code: 35, name: 'Kericho', capital: 'Kericho', region: 'Rift Valley', lat: -0.3689, lng: 35.2863 },
  { code: 36, name: 'Bomet', capital: 'Bomet', region: 'Rift Valley', lat: -0.7813, lng: 35.3416 },
  { code: 37, name: 'Kakamega', capital: 'Kakamega', region: 'Western', lat: 0.2827, lng: 34.7519 },
  { code: 38, name: 'Vihiga', capital: 'Mbale', region: 'Western', lat: 0.0765, lng: 34.7222 },
  { code: 39, name: 'Bungoma', capital: 'Bungoma', region: 'Western', lat: 0.5695, lng: 34.5584 },
  { code: 40, name: 'Busia', capital: 'Busia', region: 'Western', lat: 0.4608, lng: 34.1115 },
  { code: 41, name: 'Siaya', capital: 'Siaya', region: 'Nyanza', lat: 0.0607, lng: 34.2882 },
  { code: 42, name: 'Kisumu', capital: 'Kisumu', region: 'Nyanza', lat: -0.0917, lng: 34.7680 },
  { code: 43, name: 'Homa Bay', capital: 'Homa Bay', region: 'Nyanza', lat: -0.5273, lng: 34.4571 },
  { code: 44, name: 'Migori', capital: 'Migori', region: 'Nyanza', lat: -1.0634, lng: 34.4731 },
  { code: 45, name: 'Kisii', capital: 'Kisii', region: 'Nyanza', lat: -0.6817, lng: 34.7667 },
  { code: 46, name: 'Nyamira', capital: 'Nyamira', region: 'Nyanza', lat: -0.5633, lng: 34.9358 },
  { code: 47, name: 'Nairobi', capital: 'Nairobi City', region: 'Nairobi', lat: -1.2921, lng: 36.8219 }
];

async function main() {
  console.log('Seeding Mali Trace Kenya database...');

  // 1. Seed Counties
  for (const c of KENYA_COUNTIES) {
    await prisma.county.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        name: c.name,
        capital: c.capital,
        region: c.region,
        latitude: c.lat,
        longitude: c.lng
      }
    });
  }
  console.log('Seeded all 47 Kenyan Counties.');

  const nairobi = await prisma.county.findUnique({ where: { code: 47 } });
  const kiambu = await prisma.county.findUnique({ where: { code: 22 } });
  const mombasa = await prisma.county.findUnique({ where: { code: 1 } });
  const kisumu = await prisma.county.findUnique({ where: { code: 42 } });
  const nakuru = await prisma.county.findUnique({ where: { code: 32 } });
  const machakos = await prisma.county.findUnique({ where: { code: 16 } });

  // 2. Seed Neighbourhoods
  const kileleshwa = await prisma.neighbourhood.upsert({
    where: { slug: 'kileleshwa-nairobi' },
    update: {},
    create: {
      name: 'Kileleshwa',
      slug: 'kileleshwa-nairobi',
      countyId: nairobi.id,
      town: 'Nairobi',
      latitude: -1.2825,
      longitude: 36.7865,
      description: 'High-density upscale residential suburb favored by expatriates and young professionals. Known for leafy avenues and modern apartment towers.',
      medianAskingPrice: 9200000,
      rentalYieldAvg: 8.4,
      developmentScore: 88,
      securityRating: 4.6,
      infrastructureRating: 4.5,
      floodRiskLevel: 'Low',
      schoolsCount: 8,
      hospitalsCount: 4,
      shoppingCount: 6,
      transitAccess: 'Excellent',
      aiSummary: 'Kileleshwa maintains robust rental demand with strong occupancy rates around 89%. Yields for 2-bedroom units range between 7.9% and 8.8%. Prospective buyers should cross-reference building service charges and borehole water salinity.'
    }
  });

  const kilimani = await prisma.neighbourhood.upsert({
    where: { slug: 'kilimani-nairobi' },
    update: {},
    create: {
      name: 'Kilimani',
      slug: 'kilimani-nairobi',
      countyId: nairobi.id,
      town: 'Nairobi',
      latitude: -1.2945,
      longitude: 36.7905,
      description: 'Commercial and residential hub bordering Nairobi CBD. High concentration of mid-to-high-rise developments, vibrant dining, and top international schools.',
      medianAskingPrice: 11500000,
      rentalYieldAvg: 8.9,
      developmentScore: 92,
      securityRating: 4.4,
      infrastructureRating: 4.7,
      floodRiskLevel: 'Low',
      schoolsCount: 12,
      hospitalsCount: 6,
      shoppingCount: 9,
      transitAccess: 'Superior',
      aiSummary: 'Kilimani offers exceptional Airbnb and long-term rental liquidity. High construction density calls for strict verification of sectional title ownership and developer track records.'
    }
  });

  const ruiru = await prisma.neighbourhood.upsert({
    where: { slug: 'ruiru-kiambu' },
    update: {},
    create: {
      name: 'Ruiru',
      slug: 'ruiru-kiambu',
      countyId: kiambu.id,
      town: 'Ruiru',
      latitude: -1.1465,
      longitude: 36.9610,
      description: 'Fastest-growing satellite metropolis along Thika Superhighway and Eastern Bypass. Premium master-planned communities and industrial hubs.',
      medianAskingPrice: 6800000,
      rentalYieldAvg: 9.3,
      developmentScore: 86,
      securityRating: 4.2,
      infrastructureRating: 4.3,
      floodRiskLevel: 'Moderate',
      schoolsCount: 10,
      hospitalsCount: 4,
      shoppingCount: 5,
      transitAccess: 'High',
      aiSummary: 'High capital appreciation corridor. Gated communities around Tatu City and Kamakis command premium tenancy.'
    }
  });

  const nyali = await prisma.neighbourhood.upsert({
    where: { slug: 'nyali-mombasa' },
    update: {},
    create: {
      name: 'Nyali',
      slug: 'nyali-mombasa',
      countyId: mombasa.id,
      town: 'Mombasa',
      latitude: -4.0321,
      longitude: 39.7042,
      description: 'Prime coastal residential and resort hub with beachfront villas, luxury serviced apartments, and top-tier holiday letting potential.',
      medianAskingPrice: 14500000,
      rentalYieldAvg: 9.8,
      developmentScore: 84,
      securityRating: 4.7,
      infrastructureRating: 4.4,
      floodRiskLevel: 'Moderate',
      schoolsCount: 7,
      hospitalsCount: 3,
      shoppingCount: 5,
      transitAccess: 'Good',
      aiSummary: 'Premier coastal holiday home and serviced-apartment market. Yields surge to 11% during high-season tourist months.'
    }
  });

  // 3. Seed Users
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@malitrace.co.ke' }, update: { passwordHash: defaultHash },
    create: {
      name: 'Brian Mwangi',
      email: 'agent@malitrace.co.ke',
      role: 'AGENT',
      phone: '+254 722 890 123', isVerified: true, passwordHash: defaultHash,
      agentProfile: {
        create: {
          agencyName: 'Pinnacle Urban Properties KE',
          licenseNumber: 'EARB/2023/8491',
          experienceYears: 7,
          countiesServed: 'Nairobi, Kiambu, Machakos',
          rating: 4.9,
          reviewCount: 42,
          verifiedAgent: true,
          bio: 'Licensed real estate realtor specializing in verified residential apartments and commercial investments in Nairobi and Kiambu.'
        }
      }
    }
  });

  const devUser = await prisma.user.upsert({
    where: { email: 'developer@malitrace.co.ke' }, update: { passwordHash: defaultHash },
    create: {
      name: 'Savannah Horizon Dev',
      email: 'developer@malitrace.co.ke',
      role: 'DEVELOPER',
      phone: '+254 701 456 789', isVerified: true, passwordHash: defaultHash,
      developerProfile: {
        create: {
          companyName: 'Savannah Horizon Developments Ltd',
          regNumber: 'CPR/2016/284912',
          completedProjects: 8,
          trackRecordYears: 11,
          verifiedDeveloper: true,
          description: 'NCA 1 certified developer recognized for on-time delivery of sustainable green residences in Nairobi urban corridors.'
        }
      }
    }
  });

  const profUser = await prisma.user.upsert({
    where: { email: 'inspector@malitrace.co.ke' }, update: { passwordHash: defaultHash },
    create: {
      name: 'Eng. Dennis Otieno',
      email: 'inspector@malitrace.co.ke',
      role: 'PROFESSIONAL',
      phone: '+254 733 654 321', isVerified: true, passwordHash: defaultHash,
      professionalProfile: {
        create: {
          professionType: 'Inspector',
          boardRegNumber: 'EBK-P/2014/1982',
          yearsExperience: 12,
          countiesServed: 'Nairobi, Kiambu, Machakos, Kajiado, Nakuru',
          hourlyRate: 7500,
          rating: 4.95,
          reviewCount: 38,
          verifiedStatus: true,
          bio: 'Certified Structural Engineer and ISK property inspector providing objective, multi-point structural and safety audits across Kenya.'
        }
      }
    }
  });

  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@malitrace.co.ke' }, update: { passwordHash: defaultHash },
    create: {
      name: 'Wanjiku Kamau',
      email: 'buyer@malitrace.co.ke',
      role: 'BUYER',
      phone: '+254 712 345 678', isVerified: true, passwordHash: defaultHash
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@malitrace.co.ke' }, update: { passwordHash: defaultHash },
    create: {
      name: 'Mali Trace Admin',
      email: 'admin@malitrace.co.ke',
      role: 'SUPER_ADMIN',
      phone: '+254 700 000 001', isVerified: true, passwordHash: defaultHash
    }
  });

  // 4. Seed Development Project
  const developerRecord = await prisma.developer.findUnique({ where: { userId: devUser.id } });
  const devProject = await prisma.development.upsert({
    where: { slug: 'the-emerald-residences-kileleshwa' },
    update: {},
    create: {
      name: 'The Emerald Residences',
      slug: 'the-emerald-residences-kileleshwa',
      developerId: developerRecord.id,
      countyId: nairobi.id,
      neighbourhoodId: kileleshwa.id,
      town: 'Nairobi',
      estate: 'Kileleshwa',
      address: 'Githunguri Road, Kileleshwa, Nairobi',
      description: '14-storey eco-conscious residential tower featuring solar-integrated power, heated lap pool, full borehole filtration, and panoramic views of the Arboretum skyline.',
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      ]),
      stage: 'Roofing',
      overallProgress: 68,
      expectedCompletion: 'December 2026',
      totalUnits: 72,
      availableUnits: 24,
      startingPrice: 8500000,
      amenitiesJson: JSON.stringify(['Solar Water Heating', 'Heated Rooftop Pool', 'Fitted Gym', 'High Speed Lifts', 'Borehole with RO Filtration', 'CCTV & Biometric Access']),
      latitude: -1.2842,
      longitude: 36.7881,
      progressUpdates: {
        create: [
          { title: 'Substructure & Foundation Completed', description: 'Reinforced concrete raft foundation tested to 45 MPa.', milestone: 'Foundation', progressPct: 100, verifiedByInspector: true },
          { title: 'Structural Superstructure 14 Floors Complete', description: 'Floor slabs 1 through 14 cast and cured.', milestone: 'Structure', progressPct: 100, verifiedByInspector: true },
          { title: 'Roofing & Parapet Works in Progress', description: 'Waterproofing membrane installation and crown truss construction.', milestone: 'Roofing', progressPct: 75, verifiedByInspector: true },
          { title: 'Interior Masonry & 1st Fix MEP', description: 'Plumbing risers, conduit wiring, and dry-wall partitioning on floors 1-9.', milestone: 'Finishing', progressPct: 40, verifiedByInspector: false }
        ]
      },
      units: {
        create: [
          { unitType: '1 Bedroom Urban Suite', sizeSqm: 58, price: 6200000, availableCount: 8 },
          { unitType: '2 Bedroom Executive', sizeSqm: 94, price: 9200000, availableCount: 11 },
          { unitType: '3 Bedroom All Ensuite', sizeSqm: 142, price: 13800000, availableCount: 5 }
        ]
      }
    }
  });

  // 5. Seed Flagship Properties
  const prop1 = await prisma.property.upsert({
    where: { passportId: 'MLT-NBI-008421' },
    update: {},
    create: {
      passportId: 'MLT-NBI-008421',
      title: '2-Bedroom Executive Apartment with Forest View',
      slug: '2-bedroom-executive-kileleshwa-mlt-nbi-008421',
      description: 'Spacious and contemporary 2-bedroom (both ensuite) apartment situated in a tranquil cul-de-sac in Kileleshwa. Features fitted European kitchen appliances, high ceilings, large balcony with Arboretum views, and dedicated parking.',
      propertyType: 'Apartment',
      listingIntent: 'SALE',
      price: 9200000,
      rentalYieldEstimate: 8.7,
      estimatedMonthlyRent: 72000,
      bedrooms: 2,
      bathrooms: 2.5,
      sizeSqm: 98,
      landAcreage: null,
      furnished: false,
      gatedCommunity: true,
      parkingSpaces: 2,
      yearBuilt: 2024, floorNumber: 4, totalFloors: 10, apartmentBlock: 'Block A', unitNumber: 'A4', serviceCharge: 6500, balcony: true, elevator: true, borehole: true, backupGenerator: true, cctv: true, gym: true, completionStatus: 'READY_TO_OCCUPY', furnishingStatus: 'UNFURNISHED', countyId: nairobi.id,
      neighbourhoodId: kileleshwa.id,
      town: 'Nairobi',
      estate: 'Kileleshwa',
      address: 'Githunguri Cul-de-Sac, off Mandera Road, Kileleshwa',
      latitude: -1.2831,
      longitude: 36.7872,
      trustScore: 87,
      verificationLevel: 4,
      verificationStatus: 'INSPECTED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: agentUser.id,
      listingQualityScore: 94,
      isDuplicateCandidate: false,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', caption: 'Modern Living Area with Natural Sunlight', roomType: 'Living', isPrimary: true, aiQualityScore: 96, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', caption: 'Fitted Kitchen with Quartz Countertops', roomType: 'Kitchen', isPrimary: false, aiQualityScore: 92, orderIndex: 1 },
          { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', caption: 'Master Bedroom Ensuite', roomType: 'Bedroom', isPrimary: false, aiQualityScore: 95, orderIndex: 2 },
          { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', caption: 'Designer Bathroom with Rain Shower', roomType: 'Bathroom', isPrimary: false, aiQualityScore: 90, orderIndex: 3 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-NBI-008421',
          initialRegistered: new Date('2024-03-15'),
          lastVerified: new Date('2026-08-20'),
          blockchainTxHash: '0x8f2d...41b9',
          ownershipChainJson: JSON.stringify([
            { year: 2024, event: 'Original Sectional Title Deed Registration under Sectional Properties Act 2020', party: 'Savannah Horizon Dev Ltd' },
            { year: 2025, event: 'First Acquisition & Private Transfer', party: 'Verified Private Investor' },
            { year: 2026, event: 'Mali Trace Level 4 On-Site Physical Inspection & Audit', party: 'Eng. Dennis Otieno (EBK)' }
          ]),
          riskLevel: 'LOW',
          structuralStatus: 'Sound (9.2/10 Certified)',
          boundaryConfidence: 0.98,
          changesDetected: 'Interior wall repaint to neutral white; balcony glass balustrade reinforced.'
        }
      },
      priceHistory: {
        create: [
          { price: 8100000, effectiveYear: 2024, changePercentage: 0, event: 'LISTED' },
          { price: 8700000, effectiveYear: 2025, changePercentage: 7.4, event: 'PRICE_INCREASE' },
          { price: 9200000, effectiveYear: 2026, changePercentage: 5.7, event: 'PRICE_INCREASE' }
        ]
      },
      amenities: {
        create: [
          { name: 'Borehole Water + Filtration', category: 'Utilities' },
          { name: 'Full Backup Generator', category: 'Utilities' },
          { name: 'High Speed Otis Elevators', category: 'Convenience' },
          { name: 'Heated Swimming Pool', category: 'Wellness' },
          { name: '24/7 Manned Guard Post & CCTV', category: 'Security' },
          { name: 'Electric Perimeter Fence', category: 'Security' }
        ]
      },
      documents: {
        create: [
          {
            docType: 'Sectional_Plan',
            documentNumber: 'SP-NBI-209/8492-U14',
            fileUrl: '/docs/sectional_plan_008421.pdf',
            fileName: 'Sectional_Title_Survey_Plan_Unit14.pdf',
            fileSize: 2450000,
            completenessScore: 92,
            isPublic: false,
            aiNotes: 'Unit boundary lines and shared common areas match Sectional Properties Act 2020 provisions. Mutation references verified with Director of Surveys coordinates.',
            status: 'ANALYSED'
          }
        ]
      },
      aiAnalyses: {
        create: {
          investmentScore: 88,
          affordabilityScore: 82,
          locationScore: 91,
          rentalPotentialScore: 86,
          valueScore: 85,
          riskSignalScore: 12,
          overallScore: 87,
          summaryText: 'This 2-bedroom apartment is competitively priced at KSh 9.2M, well aligned with Kileleshwa\'s median asking price (KSh 9.2M). The projected 8.7% gross rental yield provides strong cashflow coverage for active investors.',
          positiveFactorsJson: JSON.stringify([
            'Asking price (KSh 93,877/sqm) is within the bottom 30th percentile for modern builds in Kileleshwa.',
            'Full Level 4 physical inspection completed by EBK certified engineer with zero structural defects.',
            'Documented sectional title under Sectional Properties Act 2020 eliminates common title lease ambiguities.'
          ]),
          riskSignalsJson: JSON.stringify([
            'Monthly service charge of KSh 8,500 should be verified with the active resident management company.',
            'Arboretum road access can experience peak-hour rush traffic between 7:30 AM - 8:45 AM.'
          ]),
          assumptionsJson: JSON.stringify([
            'Estimated monthly rent of KSh 72,000 based on 4 recent comparable leases in the same court.',
            '90% occupancy assumption across a 12-month trailing period.'
          ]),
          dataSourcesJson: JSON.stringify([
            'Mali Trace Platform Transaction Index (Q2 2026)',
            'On-site Engineering Inspection Report #IR-2026-081',
            'Nairobi County Spatial Plan Data'
          ]),
          confidenceLevel: 'High'
        }
      }
    }
  });

  const prop2 = await prisma.property.upsert({
    where: { passportId: 'MLT-NBI-009142' },
    update: {},
    create: {
      passportId: 'MLT-NBI-009142',
      title: '3-Bedroom Penthouse with Private Terrace - Kilimani',
      slug: '3-bedroom-penthouse-kilimani-mlt-nbi-009142',
      description: 'Sophisticated 3-bedroom duplex penthouse featuring 360-degree city views, rooftop entertainment terrace, automated smart home lighting, and private elevator access.',
      propertyType: 'Penthouse',
      listingIntent: 'SALE',
      price: 18500000,
      rentalYieldEstimate: 9.1,
      estimatedMonthlyRent: 145000,
      bedrooms: 3,
      bathrooms: 3.5,
      sizeSqm: 185,
      furnished: true,
      gatedCommunity: true,
      parkingSpaces: 2,
      yearBuilt: 2025,
      countyId: nairobi.id,
      neighbourhoodId: kilimani.id,
      town: 'Nairobi',
      estate: 'Kilimani',
      address: 'Wood Avenue, Kilimani, Nairobi',
      latitude: -1.2952,
      longitude: 36.7891,
      trustScore: 91,
      verificationLevel: 3,
      verificationStatus: 'REVIEWED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: agentUser.id,
      listingQualityScore: 96,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Panoramic Rooftop Terrace & Lounge', roomType: 'Exterior', isPrimary: true, aiQualityScore: 98, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', caption: 'Double-Volume Living Room', roomType: 'Living', isPrimary: false, aiQualityScore: 94, orderIndex: 1 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-NBI-009142',
          initialRegistered: new Date('2025-01-10'),
          lastVerified: new Date('2026-07-14'),
          riskLevel: 'LOW',
          structuralStatus: 'Modern Reinforced Concrete',
          boundaryConfidence: 0.99
        }
      },
      priceHistory: {
        create: [
          { price: 17200000, effectiveYear: 2025, changePercentage: 0, event: 'LISTED' },
          { price: 18500000, effectiveYear: 2026, changePercentage: 7.5, event: 'PRICE_INCREASE' }
        ]
      }
    }
  });

  const prop3 = await prisma.property.upsert({
    where: { passportId: 'MLT-KBU-004128' },
    update: {},
    create: {
      passportId: 'MLT-KBU-004128',
      title: 'Prime 1/2 Acre Serviced Residential Plot - Ruiru Tatu Vicinity',
      slug: 'half-acre-serviced-plot-ruiru-tatu-mlt-kbu-004128',
      description: 'Controlled development gated estate, red soil, fully beaconed with tarmac access, water and three-phase power at the gate. Ready freehold title deed available for transfer.',
      propertyType: 'Land',
      listingIntent: 'SALE',
      price: 12800000,
      sizeSqm: 2023,
      landAcreage: 0.5,
      countyId: kiambu.id,
      neighbourhoodId: ruiru.id,
      town: 'Ruiru',
      estate: 'Mugutha/Tatu Corridor',
      address: 'Off Eastern Bypass, Ruiru, Kiambu',
      latitude: -1.1492,
      longitude: 36.9634,
      trustScore: 89,
      verificationLevel: 3,
      verificationStatus: 'REVIEWED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: agentUser.id,
      listingQualityScore: 91,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', caption: 'Level Red Soil Plot with Perimeter Beacons', roomType: 'Exterior', isPrimary: true, aiQualityScore: 95, orderIndex: 0 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-KBU-004128',
          initialRegistered: new Date('2024-06-12'),
          lastVerified: new Date('2026-08-01'),
          riskLevel: 'LOW',
          structuralStatus: 'Undeveloped Prime Land',
          boundaryConfidence: 0.97
        }
      },
      priceHistory: {
        create: [
          { price: 10500000, effectiveYear: 2024, changePercentage: 0, event: 'LISTED' },
          { price: 11800000, effectiveYear: 2025, changePercentage: 12.3, event: 'PRICE_INCREASE' },
          { price: 12800000, effectiveYear: 2026, changePercentage: 8.5, event: 'PRICE_INCREASE' }
        ]
      }
    }
  });

  const prop4 = await prisma.property.upsert({
    where: { passportId: 'MLT-MBA-002194' },
    update: {},
    create: {
      passportId: 'MLT-MBA-002194',
      title: 'Luxury 3-Bedroom Oceanfront Villa with Private Pool - Nyali',
      slug: 'luxury-3-bedroom-oceanfront-villa-nyali-mlt-mba-002194',
      description: 'Exclusive beachfront residence with swahili-inspired architecture, private infinity swimming pool, manicured tropical gardens, and direct access to Nyali Beach.',
      propertyType: 'Villa',
      listingIntent: 'SALE',
      price: 32000000,
      rentalYieldEstimate: 10.4,
      estimatedMonthlyRent: 280000,
      bedrooms: 3,
      bathrooms: 4,
      sizeSqm: 280,
      landAcreage: 0.25,
      furnished: true,
      gatedCommunity: true,
      parkingSpaces: 4,
      yearBuilt: 2023,
      countyId: mombasa.id,
      neighbourhoodId: nyali.id,
      town: 'Mombasa',
      estate: 'Nyali Beachfront',
      address: 'Links Road, Nyali, Mombasa',
      latitude: -4.0298,
      longitude: 39.7121,
      trustScore: 94,
      verificationLevel: 4,
      verificationStatus: 'INSPECTED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: agentUser.id,
      listingQualityScore: 97,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', caption: 'Private Infinity Pool with Indian Ocean Views', roomType: 'Exterior', isPrimary: true, aiQualityScore: 99, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', caption: 'Grand Living Room with Swahili Carvings', roomType: 'Living', isPrimary: false, aiQualityScore: 96, orderIndex: 1 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-MBA-002194',
          initialRegistered: new Date('2023-11-20'),
          lastVerified: new Date('2026-06-15'),
          riskLevel: 'LOW',
          structuralStatus: 'High Marine Grade Concrete (Sound)',
          boundaryConfidence: 0.99
        }
      },
      priceHistory: {
        create: [
          { price: 28000000, effectiveYear: 2024, changePercentage: 0, event: 'LISTED' },
          { price: 30000000, effectiveYear: 2025, changePercentage: 7.1, event: 'PRICE_INCREASE' },
          { price: 32000000, effectiveYear: 2026, changePercentage: 6.6, event: 'PRICE_INCREASE' }
        ]
      }
    }
  });

    const prop5 = await prisma.property.upsert({
    where: { passportId: 'MLT-NBI-003819' },
    update: {},
    create: {
      passportId: 'MLT-NBI-003819',
      title: 'Furnished 1-Bedroom Studio Apartment - Rent in Kilimani',
      slug: 'furnished-1-bedroom-studio-kilimani-mlt-nbi-003819',
      description: 'Fully furnished, high-speed fiber ready executive studio in the heart of Kilimani. Ideal for corporate relocations or business travelers seeking flexible leases.',
      propertyType: 'Apartment',
      listingIntent: 'RENT',
      price: 55000,
      monthlyRent: 55000,
      deposit: 110000,
      serviceCharge: 4500,
      rentalYieldEstimate: 8.9,
      estimatedMonthlyRent: 55000,
      bedrooms: 1,
      bathrooms: 1,
      sizeSqm: 48,
      floorNumber: 3,
      totalFloors: 8,
      apartmentBlock: 'Oakwood Suites',
      unitNumber: '304',
      balcony: true,
      elevator: true,
      borehole: true,
      backupGenerator: true,
      cctv: true,
      furnished: true,
      furnishingStatus: 'FULLY_FURNISHED',
      completionStatus: 'READY_TO_OCCUPY',
      gatedCommunity: true,
      parkingSpaces: 1,
      yearBuilt: 2024,
      countyId: nairobi.id,
      neighbourhoodId: kilimani.id,
      town: 'Nairobi',
      estate: 'Kilimani',
      address: 'Wood Avenue, Kilimani',
      latitude: -1.2982,
      longitude: 36.7918,
      trustScore: 84,
      verificationLevel: 2,
      verificationStatus: 'REVIEWED',
      isFeatured: false,
      status: 'ACTIVE',
      agentId: agentUser.id,
      listingQualityScore: 88,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', caption: 'Cozy Living and Sleeping Space with Warm Oak Finishes', roomType: 'Living', isPrimary: true, aiQualityScore: 93, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', caption: 'Fitted Kitchenette with Induction Hob and Fridge', roomType: 'Kitchen', isPrimary: false, aiQualityScore: 91, orderIndex: 1 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-NBI-003819',
          initialRegistered: new Date('2024-04-10'),
          lastVerified: new Date('2026-07-25'),
          riskLevel: 'LOW',
          structuralStatus: 'Modern Reinforced Concrete',
          boundaryConfidence: 0.95
        }
      }
    }
  });

  const prop6 = await prisma.property.upsert({
    where: { passportId: 'MLT-NBI-007211' },
    update: {},
    create: {
      passportId: 'MLT-NBI-007211',
      title: 'Luxury 2-Bedroom Serviced Apartment - Rent in Westlands',
      slug: 'luxury-2-bedroom-serviced-westlands-mlt-nbi-007211',
      description: 'Ultra-modern serviced apartment along Rhapta Road, Westlands. Offers panoramic city skyline views, infinity pool, fitness center, high-speed fiber, and 24/7 concierge services.',
      propertyType: 'Apartment',
      listingIntent: 'RENT',
      price: 120000,
      monthlyRent: 120000,
      deposit: 240000,
      serviceCharge: 15000,
      rentalYieldEstimate: 9.4,
      estimatedMonthlyRent: 120000,
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 112,
      floorNumber: 8,
      totalFloors: 14,
      apartmentBlock: 'Westlands Gate',
      unitNumber: '8B',
      balcony: true,
      elevator: true,
      borehole: true,
      backupGenerator: true,
      swimmingPool: true,
      gym: true,
      cctv: true,
      internetReady: true,
      furnished: true,
      furnishingStatus: 'FULLY_FURNISHED',
      completionStatus: 'READY_TO_OCCUPY',
      gatedCommunity: true,
      parkingSpaces: 2,
      yearBuilt: 2025,
      countyId: nairobi.id,
      neighbourhoodId: kilimani.id,
      town: 'Nairobi',
      estate: 'Westlands',
      address: 'Rhapta Road, Westlands, Nairobi',
      latitude: -1.2683,
      longitude: 36.8042,
      trustScore: 92,
      verificationLevel: 4,
      verificationStatus: 'INSPECTED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: agentUser.id,
      listingQualityScore: 96,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', caption: 'Sunlit Living Room with Floor-to-Ceiling Windows', roomType: 'Living', isPrimary: true, aiQualityScore: 97, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Rooftop Heated Pool with Nairobi Skyline Panorama', roomType: 'Exterior', isPrimary: false, aiQualityScore: 98, orderIndex: 1 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-NBI-007211',
          initialRegistered: new Date('2025-01-15'),
          lastVerified: new Date('2026-08-10'),
          riskLevel: 'LOW',
          structuralStatus: 'High-Rise Certified Concrete Core (9.4/10)',
          boundaryConfidence: 0.99
        }
      }
    }
  });

  const prop7 = await prisma.property.upsert({
    where: { passportId: 'MLT-KBU-005190' },
    update: {},
    create: {
      passportId: 'MLT-KBU-005190',
      title: 'Modern 2-Bedroom Master Ensuite Apartment for Sale - Ruiru',
      slug: 'modern-2-bedroom-apartment-ruiru-mlt-kbu-005190',
      description: 'Affordable modern apartment minutes from Tatu City and Thika Superhighway. Fitted kitchen cabinets, ceramic tile flooring, designated children playpark, and abundant borehole water supply.',
      propertyType: 'Apartment',
      listingIntent: 'SALE',
      price: 6500000,
      monthlyRent: null,
      serviceCharge: 3500,
      rentalYieldEstimate: 9.1,
      estimatedMonthlyRent: 48000,
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 88,
      floorNumber: 2,
      totalFloors: 6,
      apartmentBlock: 'Acacia Court',
      unitNumber: 'C2',
      balcony: true,
      elevator: false,
      borehole: true,
      backupGenerator: true,
      cctv: true,
      childrenPlayArea: true,
      garden: true,
      furnished: false,
      furnishingStatus: 'UNFURNISHED',
      completionStatus: 'READY_TO_OCCUPY',
      gatedCommunity: true,
      parkingSpaces: 1,
      yearBuilt: 2024,
      countyId: kiambu.id,
      neighbourhoodId: ruiru.id,
      town: 'Ruiru',
      estate: 'Mugutha',
      address: 'Near Tatu City Link Road, Ruiru, Kiambu',
      latitude: -1.1478,
      longitude: 36.9621,
      trustScore: 89,
      verificationLevel: 3,
      verificationStatus: 'REVIEWED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: agentUser.id,
      listingQualityScore: 92,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80', caption: 'Modern Open-Plan Living & Dining Area', roomType: 'Living', isPrimary: true, aiQualityScore: 94, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80', caption: 'Master Bedroom with Built-in Wardrobes', roomType: 'Bedroom', isPrimary: false, aiQualityScore: 91, orderIndex: 1 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-KBU-005190',
          initialRegistered: new Date('2024-05-18'),
          lastVerified: new Date('2026-07-30'),
          riskLevel: 'LOW',
          structuralStatus: 'Compliant Masonry & RC Framework',
          boundaryConfidence: 0.97
        }
      }
    }
  });

  const prop8 = await prisma.property.upsert({
    where: { passportId: 'MLT-NBI-001923' },
    update: {},
    create: {
      passportId: 'MLT-NBI-001923',
      title: 'Luxury 4-Bedroom All Ensuite Penthouse with DSQ - Lavington',
      slug: 'luxury-4-bedroom-penthouse-lavington-mlt-nbi-001923',
      description: 'Palatial penthouse residence featuring expansive rooftop entertainment terrace, fitted imported Italian kitchen, private lift lobby access, en-suite domestic staff quarters (DSQ), and club-house gym & pool.',
      propertyType: 'Penthouse',
      listingIntent: 'SALE',
      price: 34500000,
      monthlyRent: null,
      serviceCharge: 18000,
      rentalYieldEstimate: 8.4,
      estimatedMonthlyRent: 240000,
      bedrooms: 4,
      bathrooms: 4.5,
      sizeSqm: 320,
      floorNumber: 7,
      totalFloors: 7,
      apartmentBlock: 'The Lavington Heights',
      unitNumber: 'PH-01',
      balcony: true,
      elevator: true,
      borehole: true,
      backupGenerator: true,
      swimmingPool: true,
      gym: true,
      servantQuarter: true,
      cctv: true,
      internetReady: true,
      furnished: false,
      furnishingStatus: 'UNFURNISHED',
      completionStatus: 'READY_TO_OCCUPY',
      gatedCommunity: true,
      parkingSpaces: 3,
      yearBuilt: 2024,
      countyId: nairobi.id,
      neighbourhoodId: kileleshwa.id,
      town: 'Nairobi',
      estate: 'Lavington',
      address: 'James Gichuru Road, Lavington, Nairobi',
      latitude: -1.2798,
      longitude: 36.7725,
      trustScore: 95,
      verificationLevel: 4,
      verificationStatus: 'INSPECTED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: agentUser.id,
      listingQualityScore: 98,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', caption: 'Double-Height Living Lounge with Floor-to-Ceiling Glass', roomType: 'Living', isPrimary: true, aiQualityScore: 99, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', caption: 'Designer Chef Kitchen with Central Island', roomType: 'Kitchen', isPrimary: false, aiQualityScore: 97, orderIndex: 1 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-NBI-001923',
          initialRegistered: new Date('2024-02-10'),
          lastVerified: new Date('2026-08-15'),
          riskLevel: 'LOW',
          structuralStatus: 'High-Strength Concrete Structure (9.5/10)',
          boundaryConfidence: 0.99
        }
      }
    }
  });

  // 6. Seed Professional Services
  const professionalRecord = await prisma.professional.findUnique({ where: { userId: profUser.id } });
  await prisma.service.createMany({
    data: [
      { professionalId: professionalRecord.id, name: 'Comprehensive Pre-Purchase Inspection', description: 'Complete 120-point structural, MEP, roofing, and safety audit with photographic evidence and stamp.', estimatedCost: 25000, turnaroundDays: 3 },
      { professionalId: professionalRecord.id, name: 'Title & Sectional Plan Verification Search', description: 'Deed search cross-referenced with survey maps and registry records.', estimatedCost: 15000, turnaroundDays: 2 },
      { professionalId: professionalRecord.id, name: 'Construction Milestone Audit', description: 'On-site technical evaluation of slab cures, rebar compliance, and finishing.', estimatedCost: 35000, turnaroundDays: 4 }
    ]
  });

  // 7. Seed Multi-Tenant Organizations & Seller Types
  console.log('Seeding Multi-Tenant Organizations, Agents & Leads CRM...');

  // Additional agent user for ABC Properties
  const janeAgent = await prisma.user.upsert({
    where: { email: 'jane@abcproperties.co.ke' },
    update: { passwordHash: defaultHash },
    create: {
      name: 'Jane Muthoni',
      email: 'jane@abcproperties.co.ke',
      role: 'AGENT',
      phone: '+254 722 987 654',
      isVerified: true,
      passwordHash: defaultHash,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    }
  });

  // A. ABC Properties Ltd (Real Estate Company)
  const abcOrg = await prisma.organization.upsert({
    where: { slug: 'abc-properties' },
    update: {},
    create: {
      name: 'ABC Properties Ltd',
      slug: 'abc-properties',
      businessType: 'REAL_ESTATE_COMPANY',
      description: "Nairobi's premier full-service real estate brokerage specializing in verified luxury apartments, penthouses, and gated residences across Kilimani, Kileleshwa, and Westlands.",
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      phone: '+254 700 123 456',
      email: 'info@abcproperties.co.ke',
      website: 'https://abcproperties.co.ke',
      county: 'Nairobi',
      town: 'Nairobi',
      address: '7th Floor, Delta Corner Tower, Westlands, Nairobi',
      registrationNumber: 'CPR/2019/84920',
      taxPin: 'P051839201A',
      verificationStatus: 'VERIFIED',
      verificationBadge: 'REKSA VERIFIED COMPANY',
      verifiedAt: new Date('2025-01-15'),
      trustScore: 94,
      subscriptionTier: 'PROFESSIONAL',
      subscriptionStatus: 'ACTIVE'
    }
  });

  // ABC Properties Members
  const abcOwnerMember = await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: abcOrg.id, userId: agentUser.id } },
    update: {},
    create: {
      organizationId: abcOrg.id,
      userId: agentUser.id,
      role: 'OWNER',
      title: 'Principal Broker & Managing Director',
      phone: '+254 720 000 002'
    }
  });

  const abcAgentMember = await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: abcOrg.id, userId: janeAgent.id } },
    update: {},
    create: {
      organizationId: abcOrg.id,
      userId: janeAgent.id,
      role: 'AGENT',
      title: 'Senior Residential Consultant',
      phone: '+254 722 987 654'
    }
  });

  // B. PrimeLand Agency (Real Estate Company)
  const primeLandOrg = await prisma.organization.upsert({
    where: { slug: 'primeland-agency' },
    update: {},
    create: {
      name: 'PrimeLand Agency Ltd',
      slug: 'primeland-agency',
      businessType: 'REAL_ESTATE_COMPANY',
      description: 'Licensed land survey and master-planned parcel acquisition firm specializing in gated serviced plots along Kiambu Road and the Eastern Bypass.',
      logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      phone: '+254 711 555 777',
      email: 'sales@primeland.co.ke',
      website: 'https://primeland.co.ke',
      county: 'Kiambu',
      town: 'Kiambu',
      address: 'Prime Plaza, Kiambu Road, Kiambu',
      registrationNumber: 'CPR/2021/33918',
      taxPin: 'P052981043C',
      verificationStatus: 'VERIFIED',
      verificationBadge: 'REKSA VERIFIED COMPANY',
      verifiedAt: new Date('2025-03-20'),
      trustScore: 91,
      subscriptionTier: 'BUSINESS',
      subscriptionStatus: 'ACTIVE'
    }
  });

  // C. Developer Organization: The Emerald Developments
  const devOrg = await prisma.organization.upsert({
    where: { slug: 'the-emerald-developments' },
    update: {},
    create: {
      name: 'The Emerald Developments Ltd',
      slug: 'the-emerald-developments',
      businessType: 'DEVELOPER',
      description: 'Institutional real estate developer specializing in eco-conscious, high-density residential towers and luxury urban estates in Nairobi.',
      logo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      phone: '+254 700 888 999',
      email: 'developments@emerald.co.ke',
      website: 'https://emerald.co.ke',
      county: 'Nairobi',
      town: 'Nairobi',
      address: 'Riverside Square, Riverside Drive, Nairobi',
      registrationNumber: 'CPR/2018/11094',
      taxPin: 'P051009841D',
      verificationStatus: 'VERIFIED',
      verificationBadge: 'REKSA VERIFIED DEVELOPER',
      verifiedAt: new Date('2024-11-10'),
      trustScore: 96,
      subscriptionTier: 'ENTERPRISE',
      subscriptionStatus: 'ACTIVE'
    }
  });

  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: devOrg.id, userId: devUser.id } },
    update: {},
    create: {
      organizationId: devOrg.id,
      userId: devUser.id,
      role: 'OWNER',
      title: 'Managing Director & Head of Development',
      phone: '+254 720 000 001'
    }
  });

  // Link dev project to devOrg
  await prisma.development.update({
    where: { id: devProject.id },
    data: { organizationId: devOrg.id }
  });

  // D. Independent Agent Organization/Profile: John Mwangi
  const johnMwangiUser = await prisma.user.upsert({
    where: { email: 'john.mwangi@realtor.co.ke' },
    update: { passwordHash: defaultHash },
    create: {
      name: 'John Mwangi',
      email: 'john.mwangi@realtor.co.ke',
      role: 'AGENT',
      phone: '+254 721 334 455',
      isVerified: true,
      passwordHash: defaultHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    }
  });

  const johnAgentOrg = await prisma.organization.upsert({
    where: { slug: 'john-mwangi-realtor' },
    update: {},
    create: {
      name: 'John Mwangi — Independent Realtor',
      slug: 'john-mwangi-realtor',
      businessType: 'INDEPENDENT_AGENT',
      description: 'Licensed independent real estate agent with 7+ years advising private buyers and diaspora investors in Kilimani, Westlands, and South C.',
      phone: '+254 721 334 455',
      email: 'john.mwangi@realtor.co.ke',
      county: 'Nairobi',
      town: 'Nairobi',
      verificationStatus: 'VERIFIED',
      verificationBadge: 'IDENTITY VERIFIED',
      verifiedAt: new Date('2025-02-18'),
      trustScore: 89,
      subscriptionTier: 'FREE',
      subscriptionStatus: 'ACTIVE'
    }
  });

  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: johnAgentOrg.id, userId: johnMwangiUser.id } },
    update: {},
    create: {
      organizationId: johnAgentOrg.id,
      userId: johnMwangiUser.id,
      role: 'OWNER',
      title: 'Licensed Independent Property Consultant',
      phone: '+254 721 334 455'
    }
  });

  // Update existing properties with Seller Types & Organization assignments
  // prop1 (Kileleshwa Apartment) -> ABC Properties Ltd, assigned to Jane Muthoni
  await prisma.property.update({
    where: { id: prop1.id },
    data: {
      sellerType: 'REAL_ESTATE_COMPANY',
      organizationId: abcOrg.id,
      assignedAgentMemberId: abcAgentMember.id
    }
  });

  // prop2 (Kiambu Land) -> PrimeLand Agency Ltd
  await prisma.property.update({
    where: { id: prop2.id },
    data: {
      sellerType: 'REAL_ESTATE_COMPANY',
      organizationId: primeLandOrg.id
    }
  });

  // prop3 (Riverside Penthouse) -> ABC Properties Ltd, assigned to Owner (Kariuki)
  await prisma.property.update({
    where: { id: prop3.id },
    data: {
      sellerType: 'REAL_ESTATE_COMPANY',
      organizationId: abcOrg.id,
      assignedAgentMemberId: abcOwnerMember.id
    }
  });

  // E. Create an authentic Independent Seller property: Wanjiku Kamau's Karen Townhouse
  const independentProp = await prisma.property.upsert({
    where: { slug: 'charming-4-bed-colonial-townhouse-karen' },
    update: {},
    create: {
      passportId: 'MLT-NBI-009941',
      title: 'Charming 4-Bedroom Colonial Townhouse with Mature Half-Acre Garden',
      slug: 'charming-4-bed-colonial-townhouse-karen',
      description: 'Direct owner sale. Beautifully maintained double-storey character home situated inside a private 24-hour guarded cul-de-sac in Karen Hardy. Features solid cedar flooring, stone fireplace, spacious wrap-around verandah, mature indigenous trees, and detached two-room staff quarter. Ready freehold title deed available for direct conveyancing.',
      propertyType: 'Townhouse',
      listingIntent: 'SALE',
      price: 68000000,
      currency: 'KES',
      bedrooms: 4,
      bathrooms: 4.5,
      sizeSqm: 420,
      landAcreage: 0.5,
      furnished: false,
      gatedCommunity: true,
      parkingSpaces: 4,
      yearBuilt: 2017,
      countyId: nairobi.id,
      town: 'Nairobi',
      estate: 'Karen Hardy',
      address: 'Miotoni Close, Karen, Nairobi',
      latitude: -1.3321,
      longitude: 36.7112,
      trustScore: 88,
      verificationLevel: 3,
      verificationStatus: 'REVIEWED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: buyerUser.id, // Direct owner
      sellerType: 'INDIVIDUAL_SELLER',
      listingQualityScore: 92,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', caption: 'Front Elevation & Landscaped Garden', roomType: 'Exterior', isPrimary: true, aiQualityScore: 95, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Sunlit Living Room with Fireplace', roomType: 'Living', isPrimary: false, aiQualityScore: 94, orderIndex: 1 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-NBI-009941',
          initialRegistered: new Date('2024-05-12'),
          lastVerified: new Date('2026-07-20'),
          riskLevel: 'LOW',
          structuralStatus: 'Sound Structural Integrity (9.1/10)',
          boundaryConfidence: 0.98
        }
      }
    }
  });

  // F. Create an authentic Independent Agent property: John Mwangi's Kilimani Listing
  const agentProp = await prisma.property.upsert({
    where: { slug: 'executive-2-bed-apartment-argwings-kodhek' },
    update: {},
    create: {
      passportId: 'MLT-NBI-004812',
      title: 'Executive 2-Bedroom Apartment with Rooftop Heated Pool',
      slug: 'executive-2-bed-apartment-argwings-kodhek',
      description: 'Exclusive mandate by Independent Agent John Mwangi. Turnkey investor unit generating KES 140,000 monthly executive rental income. Fully equipped European fitted kitchen, balcony with panoramic skyline views, high-speed elevators, full borehole backup, and gym.',
      propertyType: 'Apartment',
      listingIntent: 'SALE',
      price: 15500000,
      currency: 'KES',
      rentalYieldEstimate: 10.8,
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 110,
      furnished: true,
      gatedCommunity: true,
      parkingSpaces: 1,
      yearBuilt: 2023,
      countyId: nairobi.id,
      neighbourhoodId: kilimani.id,
      town: 'Nairobi',
      estate: 'Kilimani',
      address: 'Argwings Kodhek Road, Kilimani, Nairobi',
      latitude: -1.2965,
      longitude: 36.7882,
      trustScore: 92,
      verificationLevel: 4,
      verificationStatus: 'INSPECTED',
      isFeatured: true,
      status: 'ACTIVE',
      agentId: johnMwangiUser.id,
      sellerType: 'INDEPENDENT_AGENT',
      organizationId: johnAgentOrg.id,
      listingQualityScore: 96,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', caption: 'Spacious Open Concept Living Room', roomType: 'Living', isPrimary: true, aiQualityScore: 96, orderIndex: 0 },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Modern Master Bedroom', roomType: 'Bedroom', isPrimary: false, aiQualityScore: 94, orderIndex: 1 }
        ]
      },
      passport: {
        create: {
          passportNumber: 'MLT-NBI-004812',
          initialRegistered: new Date('2024-03-01'),
          lastVerified: new Date('2026-08-10'),
          riskLevel: 'LOW',
          structuralStatus: 'Reinforced Concrete with Clean Title (9.4/10)',
          boundaryConfidence: 0.99
        }
      }
    }
  });

  // G. Seed Leads in ABC Properties CRM Pipeline
  await prisma.lead.createMany({
    data: [
      {
        organizationId: abcOrg.id,
        propertyId: prop1.id,
        assignedAgentId: abcAgentMember.id,
        clientName: 'David Ochieng',
        clientEmail: 'david.ochieng@gmail.com',
        clientPhone: '+254 722 111 222',
        message: 'Looking to buy a 3-bedroom unit for family residence. Pre-approved with Stanbic Bank.',
        source: 'PROPERTY_DETAIL',
        status: 'QUALIFIED',
        budget: 18500000,
        notes: 'Pre-approval letter sighted. Wants to schedule viewing on Saturday morning.'
      },
      {
        organizationId: abcOrg.id,
        propertyId: prop3.id,
        assignedAgentId: abcOwnerMember.id,
        clientName: 'Dr. Amina Hassan',
        clientEmail: 'amina.hassan@hospital.org',
        clientPhone: '+254 733 445 566',
        message: 'Interested in the Riverside luxury penthouse. Please send sectional title copy.',
        source: 'MARKETPLACE_CARD',
        status: 'VIEWING',
        budget: 65000000,
        notes: 'VIP client. Viewing booked for Thursday 2:00 PM with Kariuki.'
      },
      {
        organizationId: abcOrg.id,
        propertyId: prop1.id,
        assignedAgentId: abcAgentMember.id,
        clientName: 'Peter Kimani (Diaspora)',
        clientEmail: 'pkimani@london.co.uk',
        clientPhone: '+44 7911 123456',
        message: 'UK-based investor looking for 2 units for buy-to-let cash flow.',
        source: 'WHATSAPP',
        status: 'NEW',
        budget: 35000000,
        notes: 'Requested virtual video tour and rental yield breakdown.'
      },
      {
        organizationId: abcOrg.id,
        propertyId: prop3.id,
        assignedAgentId: abcOwnerMember.id,
        clientName: 'Michael Kiprop',
        clientEmail: 'kiprop@holdings.co.ke',
        clientPhone: '+254 720 778 899',
        message: 'Offer submitted at KES 62M with 20% deposit.',
        source: 'DIRECT_ENQUIRY',
        status: 'NEGOTIATION',
        budget: 62000000,
        notes: 'Seller countered at KES 64M. Awaiting lawyer feedback.'
      }
    ]
  });

  // H. Seed Viewing Requests
  await prisma.viewingRequest.createMany({
    data: [
      {
        organizationId: abcOrg.id,
        propertyId: prop1.id,
        clientName: 'David Ochieng',
        clientPhone: '+254 722 111 222',
        clientEmail: 'david.ochieng@gmail.com',
        preferredDate: new Date('2026-09-12T10:00:00Z'),
        timeSlot: 'Morning',
        status: 'CONFIRMED',
        notes: 'Jane Muthoni assigned to meet client at gate security.'
      },
      {
        organizationId: abcOrg.id,
        propertyId: prop3.id,
        clientName: 'Dr. Amina Hassan',
        clientPhone: '+254 733 445 566',
        clientEmail: 'amina.hassan@hospital.org',
        preferredDate: new Date('2026-09-10T14:00:00Z'),
        timeSlot: 'Afternoon',
        status: 'CONFIRMED',
        notes: 'Penthouse private viewing with Kariuki.'
      }
    ]
  });

  console.log('Database seeded successfully with Kenyan PropTech data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });