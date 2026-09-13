export interface CountyData {
  code: number;
  name: string;
  capital: string;
  region: string;
  lat: number;
  lng: number;
}

export const KENYA_COUNTIES: CountyData[] = [
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

export const VERIFICATION_TIERS = [
  { level: 0, label: 'Unverified', badge: 'Tier 0', color: 'gray', desc: 'No independent verification has been conducted.' },
  { level: 1, label: 'Profile Reviewed', badge: 'Tier 1', color: 'blue', desc: 'Seller/Agent identity and contact credentials reviewed.' },
  { level: 2, label: 'Location Confirmed', badge: 'Tier 2', color: 'teal', desc: 'GPS coordinates and boundary mapped through platform spatial cross-check.' },
  { level: 3, label: 'Documentation Reviewed', badge: 'Tier 3', color: 'emerald', desc: 'Uploaded deeds/sectional plans scanned and checked for consistency.' },
  { level: 4, label: 'Professionally Inspected', badge: 'Tier 4', color: 'amber', desc: 'On-site physical inspection performed by a licensed professional inspector.' },
  { level: 5, label: 'Authorized External Verified', badge: 'Tier 5', color: 'purple', desc: 'Cross-checked against official registry / ArdhiSasa integration.' }
];