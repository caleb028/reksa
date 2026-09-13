import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Search, Heart, MessageSquare, LayoutDashboard, User } from 'lucide-react-native';
import { SearchScreen } from '../screens/SearchScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

// Placeholder screens for Saved, Messages, and Profile
function SavedScreen() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.screenTitle}>Saved Properties</Text>
      <Text style={styles.screenSubtitle}>Properties saved with verified title passports</Text>
    </View>
  );
}

function MessagesScreen() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.screenTitle}>Inquiries &amp; Messages</Text>
      <Text style={styles.screenSubtitle}>Kenya DPA 2019 encrypted communication</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.screenTitle}>User Profile &amp; Preferences</Text>
      <Text style={styles.screenSubtitle}>Manage low-data mode, notifications &amp; KRA PIN verification</Text>
    </View>
  );
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0B3D2E', // REKSA Deep Forest Green
        },
        headerTintColor: '#FAF8F4',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 18
        },
        tabBarStyle: {
          backgroundColor: '#FAF8F4',
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6
        },
        tabBarActiveTintColor: '#0B3D2E',
        tabBarInactiveTintColor: '#64748B'
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'REKSA Search',
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          title: 'Saved Listings',
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          title: 'Direct Inquiries',
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'CRM Console',
          tabBarLabel: 'CRM',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Account Settings',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B3D2E',
    marginBottom: 8
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center'
  }
});
