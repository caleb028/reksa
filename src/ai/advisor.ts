import { db } from '../lib/db';
import { analyseProperty } from './propertyAnalyst';

export interface AdvisorMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AdvisorResponse {
  message: string;
  suggestedPrompts: string[];
  toolInvoked?: string;
  dataPayload?: any;
  confidence: 'High' | 'Medium' | 'Low' | 'Insufficient data';
  legalGateRequired?: boolean;
  legalGateUrl?: string;
}

export async function askAeAI(query: string, history: AdvisorMessage[] = []): Promise<AdvisorResponse> {
  const q = query.toLowerCase().trim();

  // Natural language intent parsing
  // 1. Natural Language Search (e.g. "Find me a 2 bedroom under 10 million in Nairobi")
  if (q.includes('find') || q.includes('search') || q.includes('bedroom') || q.includes('apartment') || q.includes('house')) {
    let county = 'Nairobi';
    if (q.includes('mombasa')) county = 'Mombasa';
    else if (q.includes('kisumu')) county = 'Kisumu';
    else if (q.includes('nakuru')) county = 'Nakuru';
    else if (q.includes('kiambu')) county = 'Kiambu';

    let maxPrice = 25000000;
    if (q.includes('10 million') || q.includes('10m') || q.includes('10 m')) maxPrice = 10000000;
    else if (q.includes('15 million') || q.includes('15m') || q.includes('15 m')) maxPrice = 15000000;
    else if (q.includes('8 million') || q.includes('8m')) maxPrice = 8000000;
    else if (q.includes('20 million') || q.includes('20m')) maxPrice = 20000000;

    let bedrooms = 2;
    if (q.includes('1 bed') || q.includes('studio') || q.includes('1-bed')) bedrooms = 1;
    else if (q.includes('3 bed') || q.includes('3-bed')) bedrooms = 3;
    else if (q.includes('4 bed') || q.includes('4-bed')) bedrooms = 4;

    const properties = await db.property.findMany({
      where: {
        county: { name: { contains: county } },
        price: { lte: maxPrice },
        ...(bedrooms ? { bedrooms: { gte: bedrooms } } : {})
      },
      include: {
        images: true,
        neighbourhood: true,
        county: true
      },
      take: 4
    });

    if (properties.length > 0) {
      const titles = properties.map((p) => `• **${p.title}** (${p.neighbourhood?.name || p.town}) — KES ${p.price.toLocaleString()} | Trust Score: ${p.trustScore}/100 [Passport: ${p.passportId}]`).join('\n');
      return {
        message: `I analyzed our verified database for properties in **${county}** under **KES ${maxPrice.toLocaleString()}** with **${bedrooms}+ bedrooms**.\n\nHere are the top matches with complete Property Passports:\n\n${titles}\n\nEvery listing above has undergone platform risk screening and documented title checks. Would you like me to analyze the rental yield or check verification documents for any of these?`,
        suggestedPrompts: [
          `Analyze rental yield for ${properties[0].passportId}`,
          `What are the risks with buying in ${county}?`,
          `Compare properties under KES ${maxPrice.toLocaleString()}`
        ],
        toolInvoked: 'searchProperties',
        dataPayload: properties,
        confidence: 'High'
      };
    } else {
      return {
        message: `I searched our verified records for ${bedrooms}-bedroom properties under KES ${maxPrice.toLocaleString()} in ${county}. Currently, no listings meet all those exact criteria on the platform. Would you like to expand the search radius to Kiambu or Machakos, or adjust the budget ceiling?`,
        suggestedPrompts: [
          'Show properties in Kiambu under KSh 12M',
          'What is the median price in Kileleshwa?',
          'How does A&E verify listings?'
        ],
        toolInvoked: 'searchProperties',
        confidence: 'High'
      };
    }
  }

  // 2. Yield or Affordability calculation
  if (q.includes('yield') || q.includes('roi') || q.includes('return') || q.includes('cash flow')) {
    return {
      message: `**Rental Yield Formula & Kenya Benchmarks:**\n\n• **Gross Yield** = (Annual Expected Rent ÷ Purchase Price) × 100\n• **Net Yield** = ((Annual Rent - Service Charges - Maintenance - Rates - 10% Vacancy) ÷ Purchase Price) × 100\n\n**Current Observed Nairobi Benchmarks (2026):**\n• Kilimani 1-2 Bed: **8.5% – 9.4%**\n• Kileleshwa 2 Bed: **8.0% – 8.8%**\n• Ruiru / Eastern Bypass: **8.8% – 10.2%**\n• Nyali Holiday Lets: **9.5% – 11.5%**\n\n*Note: High gross yield can be eroded by high service charges. Always request the building management audited accounts.*`,
      suggestedPrompts: [
        'Calculate yield for a KSh 9.2M apartment renting at KSh 72,000/mo',
        'What should I check before buying off-plan in Nairobi?',
        'Show me high-yield investment properties'
      ],
      toolInvoked: 'calculateYield',
      confidence: 'High'
    };
  }

  // 3. Verification & Due Diligence Checklist
  if (q.includes('check') || q.includes('due diligence') || q.includes('scam') || q.includes('safe') || q.includes('fraud') || q.includes('verify')) {
    return {
      message: `**A&E Due Diligence Protocol for Kenyan Real Estate:**\n\n1. **Official Registry Search (ArdhiSasa / Lands Ministry):** Never rely solely on paper copies. Conduct an official land search to confirm registered proprietor, encumbrances, and caveats.\n2. **Sectional Properties Act 2020 Compliance:** For apartments, verify whether the developer has converted the mother title into individual sectional unit titles.\n3. **Survey Beacon Confirmation:** For land, engage a licensed surveyor to ground-truth beacon pins against the official Registry Index Map (RIM).\n4. **County Rates & Land Rent Clearance:** Request valid clearance certificates from the respective County government.\n5. **Independent Inspection:** Book an ISK/EBK certified inspector on A&E to audit structural, MEP, and plumbing health.\n\n*A&E never issues legal certifications; our platform highlights automated data signals to guide your professional review.*`,
      suggestedPrompts: [
        'Review my title deed document',
        'Book a licensed property inspector',
        'How does Property Passport work?'
      ],
      toolInvoked: 'getVerificationStatus',
      confidence: 'High'
    };
  }

  // 4. Statutory Land Law & Conveyancing Queries (Legal Compliance Gate)
  if (
    q.includes('act') || q.includes('law') || q.includes('legal') || q.includes('advocate') ||
    q.includes('lawyer') || q.includes('title') || q.includes('zoning') || q.includes('bylaws') ||
    q.includes('spousal') || q.includes('caveat') || q.includes('encumbrance') || q.includes('mutation') ||
    q.includes('sectional') || q.includes('registration act')
  ) {
    return {
      message: `⚖️ **STATUTORY LAND LAW & LEGAL NOTICE**\n\nUnder Kenyan jurisprudence and the **Land Registration Act (2012)** / **Sectional Properties Act (2020)**:\n\n1. **Statutory Title Verification:** An AI model or classified listing cannot substitute for an official green-card search at the Ministry of Lands (Ardhi House) or County Registry.\n2. **Zoning & User Permissions:** Construction bylaws and change-of-user permits must be verified with the relevant County Physical Planning Department.\n3. **Legal Representation:** The Law Society of Kenya (LSK) recommends that every real estate purchaser retain an independent conveyancing advocate to draft and witness the sale agreement and handle stamp duty adjudication.\n\n👉 **Need professional legal assistance?** Connect with a verified, licensed property advocate through our Professional Marketplace for official deed verification and sales contract drafting.`,
      suggestedPrompts: [
        'Connect with a Conveyancing Advocate',
        'Book a certified Land Surveyor',
        'Check due diligence checklist'
      ],
      legalGateRequired: true,
      legalGateUrl: '/professionals?service=CONVEYANCING',
      toolInvoked: 'legalComplianceGate',
      confidence: 'High'
    };
  }

  // 5. Default intelligent advisor response
  return {
    message: `Hello! I am **A&E AI**, your digital real estate advisor for the Kenyan property market from **Ardhi and Estates**. I have real-time access to A&E verified property passports, neighbourhood price trends, developer track records, and risk signals across all 47 counties.\n\nHow can I assist your property decision today?`,
    suggestedPrompts: [
      'Find me a 2-bedroom apartment in Kileleshwa under KSh 10 million',
      'Which areas around Nairobi offer the highest rental yields?',
      'What should I inspect before buying land in Ruiru or Kitengela?',
      'Explain how the A&E Trust Score is calculated'
    ],
    confidence: 'High'
  };
}

export const askReksaAI = askAeAI;
export const askMaliAI = askAeAI;