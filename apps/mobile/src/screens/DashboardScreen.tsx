import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet
} from 'react-native';
import { Lock, Unlock, Phone, MessageSquare, CheckCircle2, Award } from 'lucide-react-native';

interface MobileLead {
  id: string;
  clientName: string;
  clientPhone: string;
  maskedPhone: string;
  propertyTitle: string;
  budgetKes: number;
  status: 'NEW_INQUIRY' | 'CONTACTED' | 'VIEWING_SCHEDULED' | 'OFFER_MADE' | 'CLOSED_WON';
  isUnlocked: boolean;
  preQualifiedMortgage: boolean;
}

const SAMPLE_LEADS: MobileLead[] = [
  {
    id: 'lead-m1',
    clientName: 'Peter Kimani (UK Diaspora)',
    clientPhone: '+44 7911 123456',
    maskedPhone: '+44 79•• •••456',
    propertyTitle: 'The Emerald 2-Bed Riverside',
    budgetKes: 35000000,
    status: 'NEW_INQUIRY',
    isUnlocked: false,
    preQualifiedMortgage: true
  },
  {
    id: 'lead-m2',
    clientName: 'David Ochieng',
    clientPhone: '+254 722 111 222',
    maskedPhone: '+254 722 ••• 222',
    propertyTitle: 'Modern 3-Bed Kilimani',
    budgetKes: 18500000,
    status: 'CONTACTED',
    isUnlocked: true,
    preQualifiedMortgage: false
  },
  {
    id: 'lead-m3',
    clientName: 'Dr. Amina Hassan',
    clientPhone: '+254 733 445 566',
    maskedPhone: '+254 733 ••• 566',
    propertyTitle: 'Ultra-Luxury Duplex Penthouse',
    budgetKes: 65000000,
    status: 'CLOSED_WON',
    isUnlocked: true,
    preQualifiedMortgage: true
  }
];

export function DashboardScreen() {
  const [leads, setLeads] = useState<MobileLead[]>(SAMPLE_LEADS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const handleUnlock = (leadId: string) => {
    Alert.alert(
      'Unlock Verified Lead',
      'KES 200 will be debited via Safaricom M-Pesa STK Push. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay KES 200 via M-Pesa',
          onPress: () => {
            setLeads((prev) =>
              prev.map((l) => (l.id === leadId ? { ...l, isUnlocked: true } : l))
            );
            Alert.alert('Lead Unlocked', 'Contact details revealed. Audit logged under DPA 2019.');
          }
        }
      ]
    );
  };

  const filtered = activeFilter === 'ALL'
    ? leads
    : leads.filter((l) => l.status === activeFilter);

  return (
    <View style={styles.container}>
      {/* Overview Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Active Leads</Text>
          <Text style={styles.statValue}>{leads.length}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Pipeline Value</Text>
          <Text style={styles.statValue}>KES 118.5M</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['ALL', 'NEW_INQUIRY', 'CONTACTED', 'CLOSED_WON'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterTab,
              activeFilter === f && styles.filterTabActive
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === f && styles.filterTabTextActive
              ]}
            >
              {f.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leads List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.leadCard}>
            <View style={styles.leadHeader}>
              <View>
                <Text style={styles.clientName}>{item.clientName}</Text>
                <Text style={styles.propertyTitle}>{item.propertyTitle}</Text>
              </View>
              {item.preQualifiedMortgage && (
                <View style={styles.mortgageBadge}>
                  <CheckCircle2 color="#4338CA" size={10} />
                  <Text style={styles.mortgageText}>Bank Pre-Approved</Text>
                </View>
              )}
            </View>

            <Text style={styles.budgetText}>
              KES {(item.budgetKes / 1000000).toFixed(1)}M Budget
            </Text>

            {/* Unlocked vs Locked Contact Details */}
            <View style={styles.contactContainer}>
              {item.isUnlocked ? (
                <View style={styles.unlockedRow}>
                  <View>
                    <Text style={styles.phoneText}>{item.clientPhone}</Text>
                    <View style={styles.verifiedTag}>
                      <Unlock color="#10B981" size={10} />
                      <Text style={styles.verifiedTagText}>Unlocked &amp; Verified</Text>
                    </View>
                  </View>
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity style={styles.iconButton}>
                      <Phone color="#0B3D2E" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                      <MessageSquare color="#10B981" size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.lockedRow}>
                    <Text style={styles.maskedText}>{item.maskedPhone}</Text>
                    <View style={styles.lockedTag}>
                      <Lock color="#D97706" size={10} />
                      <Text style={styles.lockedTagText}>Protected (DPA 2019)</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.unlockButton}
                    onPress={() => handleUnlock(item.id)}
                  >
                    <Lock color="#FAF8F4" size={12} />
                    <Text style={styles.unlockButtonText}>
                      Unlock Verified Lead (KES 200)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {item.status === 'CLOSED_WON' && (
              <View style={styles.handoverBanner}>
                <Award color="#0B3D2E" size={14} />
                <Text style={styles.handoverText}>
                  Deal Closed! Handover Insurance &amp; Title Transfer Active
                </Text>
              </View>
            )}
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14
  },
  statLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B3D2E',
    marginTop: 4
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#E2E8F0'
  },
  filterTabActive: {
    backgroundColor: '#0B3D2E'
  },
  filterTabText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569'
  },
  filterTabTextActive: {
    color: '#FAF8F4'
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  clientName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  propertyTitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  mortgageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  mortgageText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4338CA'
  },
  budgetText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B3D2E',
    marginBottom: 10
  },
  contactContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  unlockedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  phoneText: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#0F172A'
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10B981'
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lockedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  maskedText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#64748B'
  },
  lockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  lockedTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D97706'
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0B3D2E',
    paddingVertical: 8,
    borderRadius: 12
  },
  unlockButtonText: {
    color: '#FAF8F4',
    fontSize: 11,
    fontWeight: '800'
  },
  handoverBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D9EDE4',
    padding: 10,
    borderRadius: 12,
    marginTop: 10
  },
  handoverText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B3D2E',
    flex: 1
  }
});
