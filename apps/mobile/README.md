# A&E Mobile — Ardhi and Estates

This package contains the official cross-platform mobile application for **A&E — Ardhi and Estates (Kenya)**.

---

## 1. Core Principles

- **Low-Data Mode**: Optimized specifically for Kenyan mobile data bundles (Safaricom, Airtel, Telkom) with adaptive image compression, aggressive local caching, and offline-first property viewing.
- **Kenya Data Protection Act (2019) Enforcement**: Phone numbers (MSISDNs) are masked by default (`+254 7••• ••890`). Agents unlock verified leads using Safaricom M-Pesa STK Push.
- **Title Passports & Cadastral GPS**: Biometric verification indicators and Trust Scores displayed on all property cards.
- **Institutional CRM Workflow**: 5-stage pipeline management (`NEW_INQUIRY` → `CONTACTED` → `VIEWING_SCHEDULED` → `OFFER_MADE` → `CLOSED_WON`) with point-of-sale handover insurance prompts.

---

## 2. Directory Structure

```
apps/mobile/
├── app.json                     # Expo configuration (bundle: ke.co.ardhiestates.mobile)
├── package.json                 # Dependencies
├── src/
│   ├── navigation/
│   │   └── TabNavigator.tsx     # 5-tab bottom navigation
│   ├── screens/
│   │   ├── SearchScreen.tsx     # Low-data search & verified title passports
│   │   └── DashboardScreen.tsx  # Mobile CRM, M-Pesa lead unlock & handover
│   └── hooks/
│       └── usePushNotifications.ts # Expo Push Token registration
```

---

## 3. Running the App

```bash
# Navigate to mobile app directory
cd apps/mobile

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Press `a` to launch in Android Emulator or `i` for iOS Simulator. Alternatively, scan the QR code with the Expo Go app on your physical device.

---

## 4. Production EAS Builds

```bash
# Build Android APK / AAB
eas build --platform android --profile production

# Build iOS IPA
eas build --platform ios --profile production
```
