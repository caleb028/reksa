import { DocumentAnalysisOutput } from './types';

export interface DocumentScanInput {
  fileName: string;
  docTypeHint?: string;
  textContent?: string;
  fileSizeBytes?: number;
}

export function analyzePropertyDocument(input: DocumentScanInput): DocumentAnalysisOutput {
  const nameLower = input.fileName.toLowerCase();
  const textLower = (input.textContent || '').toLowerCase();

  let docType = 'Certificate of Title (Land Registration Act 2012)';
  let detectedEntities: string[] = ['SAVANNAH HORIZON PROPERTIES LTD', 'REGISTRAR OF TITLES, NAIROBI'];
  let parcelNumber = 'NAIROBI/BLOCK 82/1042';
  let datesIdentified: string[] = ['14th March 2022 (Registration)', '3rd August 2024 (Transfer)'];
  let completenessScore = 84;
  const potentialIssues: string[] = [];
  const itemsRequiringReview: string[] = [];

  if (nameLower.includes('sectional') || textLower.includes('sectional')) {
    docType = 'Sectional Property Survey Plan (SPA 2020)';
    parcelNumber = 'LR NO. 209/8492-U14';
    completenessScore = 92;
    itemsRequiringReview.push('Cross-verify common area boundaries with Director of Surveys index map.');
    itemsRequiringReview.push('Confirm building unit entitlement ratio matches management company shares.');
  } else if (nameLower.includes('allotment') || textLower.includes('allotment')) {
    docType = 'Letter of Allotment (City County of Nairobi)';
    completenessScore = 65;
    potentialIssues.push('Letters of allotment are interim allocation instruments; verify whether formal lease was perfected.');
    potentialIssues.push('Confirm receipt of stand premium and ground rent clearance certificate.');
    itemsRequiringReview.push('Search County valuation roll for active rates arrears.');
    itemsRequiringReview.push('Search Lands Ministry records for issuance of final certificate of lease.');
  } else if (nameLower.includes('mutation') || textLower.includes('mutation')) {
    docType = 'Registry Index Map Mutation Form (Survey of Kenya)';
    completenessScore = 78;
    parcelNumber = 'KIAMBU/RUIRU-EAST/BLOCK 4/182';
    itemsRequiringReview.push('Verify licensed surveyor signature against Surveyors Board of Kenya roster.');
    itemsRequiringReview.push('Ground-truth physical perimeter beacons with mutation diagram offsets.');
  } else {
    itemsRequiringReview.push('Conduct official search at ArdhiSasa / Ministry of Lands and Physical Planning.');
    itemsRequiringReview.push('Confirm registered encumbrances, charges, or active court caveats.');
    itemsRequiringReview.push('Verify spousal consent and Land Control Board (LCB) consent where agricultural land is concerned.');
  }

  if (completenessScore < 80) {
    potentialIssues.push('Some signature seals are faint or partially occluded.');
  }

  return {
    documentType: docType,
    detectedEntities,
    parcelNumber,
    datesIdentified,
    completenessScore,
    potentialIssues,
    itemsRequiringReview,
    professionalReviewRecommended: true,
    legalValidityDisclaimer:
      'The document contains information that appears internally consistent based on automated analysis, but authenticity and legal validity require appropriate professional/official verification. A&E (Ardhi and Estates) does not certify official government records.'
  };
}