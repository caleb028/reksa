import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  StyleSheet
} from 'react-native';
import { ShieldCheck, MapPin, Sparkles, Filter, Lock } from 'lucide-react-native';

interface MobileProperty {
  id: string;
  passportId: string;
  title: string;
  town: string;
  county: string;
  priceKes: number;
  trustScore: number;
  propertyType: string;
  bedrooms: number;
  isUnlocked: boolean;
}

const SAMPLE_MOBILE_PROPERTIES: MobileProperty[] = [
  {
    id: 'p-1',
    passportId: 'MLT-NBI-008421',
    title: 'The Emerald 2-Bedroom Suite',
    town: 'Riverside',
    county: 'Nairobi',
    priceKes: 35000000,
    trustScore: 94,
    propertyType: 'Apartment',
    bedrooms: 2,
    isUnlocked: false
  },
  {
    id: 'p-2',
    passportId: 'MLT-NBI-009104',
    title: 'Modern 3-Bedroom Executive Apartment',
    town: 'Kilimani',
    county: 'Nairobi',
    priceKes: 18500000,
    trustScore: 91,
    propertyType: 'Apartment',
    bedrooms: 3,
    isUnlocked: true
  },
  {
    id: 'p-3',
    passportId: 'MLT-KBU-003412',
    title: 'Gated 1/4 Acre Serviced Plot',
    town: 'Ruiru',
    county: 'Kiambu',
    priceKes: 7500000,
    trustScore: 88,
    propertyType: 'Land',
    bedrooms: 0,
    isUnlocked: false
  }
];

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [lowDataMode, setLowDataMode] = useState(true);
  const [properties, setProperties] = useState<MobileProperty[]>(SAMPLE_MOBILE_PROPERTIES);

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.town.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Low-Data Mode Banner */}
      <View style={styles.lowDataBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.lowDataTitle}>Low-Data Network Mode</Text>
          <Text style={styles.lowDataSubtitle}>
            Optimized for Safaricom bundles (compresses image payloads)
          </Text>
        </View>
        <Switch
          value={lowDataMode}
          onValueChange={setLowDataMode}
          trackColor={{ false: '#CBD5E1', true: '#0B3D2E' }}
          thumbColor={lowDataMode ? '#D4A24C' : '#F1F5F9'}
        />
      </View>

      {/* Search & County Filter */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by estate, town, or passport ID..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#FAF8F4" size={18} />
        </TouchableOpacity>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filtered.length} Verified Properties</Text>
        <Text style={styles.resultsBadge}>Title Inspected</Text>
      </View>

      {/* Property List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header: Title Passport & Trust Score */}
            <View style={styles.cardHeader}>
              <View style={styles.passportBadge}>
                <ShieldCheck color="#0B3D2E" size={14} />
                <Text style={styles.passportText}>{item.passportId}</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustScoreText}>{item.trustScore}% Trust</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.locationRow}>
              <MapPin color="#64748B" size={12} />
              <Text style={styles.locationText}>
                {item.town}, {item.county} County
              </Text>
            </View>

            {/* Price & Specs */}
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.priceLabel}>Verified Price</Text>
                <Text style={styles.priceValue}>
                  KES {(item.priceKes / 1000000).toFixed(1)}M
                </Text>
              </View>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Passport</Text>
              </TouchableOpacity>
            </View>

            {/* Privacy tag */}
            <View style={styles.privacyRow}>
              <Lock color="#94A3B8" size={10} />
              <Text style={styles.privacyText}>
                Direct lister MSISDN protected (Kenya DPA 2019)
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    padding: 16
  },
  lowDataBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F4',
    borderWidth: 1,
    borderColor: '#B5DCCE',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12
  },
  lowDataTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B3D2E'
  },
  lowDataSubtitle: {
    fontSize: 10,
    color: '#3B8A73',
    marginTop: 2
  },
  searchBarContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A'
  },
  filterButton: {
    backgroundColor: '#0B3D2E',
    borderRadius: 14,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B3D2E'
  },
  resultsBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  passportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D9EDE4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  passportText: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#0B3D2E'
  },
  trustBadge: {
    backgroundColor: '#FAF5EA',
    borderWidth: 1,
    borderColor: '#F5E7CC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  trustScoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D4A24C'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12
  },
  locationText: {
    fontSize: 11,
    color: '#64748B'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10
  },
  priceLabel: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B3D2E'
  },
  actionButton: {
    backgroundColor: '#0B3D2E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12
  },
  actionButtonText: {
    color: '#FAF8F4',
    fontSize: 11,
    fontWeight: '800'
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC'
  },
  privacyText: {
    fontSize: 9,
    color: '#94A3B8'
  }
});
