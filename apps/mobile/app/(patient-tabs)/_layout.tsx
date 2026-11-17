import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function PatientTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f3eb',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(15, 62, 23, 0.1)',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#080331',
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#efeeeb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0f3e17',
        tabBarInactiveTintColor: '#747679',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Manga Healthcare',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="triage"
        options={{
          title: 'Triage Gate',
          headerTitle: 'Safety Triage',
          tabBarLabel: 'Consult',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🩺</Text>,
        }}
      />
      <Tabs.Screen
        name="checkout"
        options={{
          title: 'Checkout',
          headerTitle: 'Payment & Confirm',
          href: null, // Hidden from tab bar; opened via navigation
        }}
      />
      <Tabs.Screen
        name="consultation/[id]"
        options={{
          title: 'Active Room',
          headerTitle: 'Consultation Room',
          href: null,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Medical Records',
          headerTitle: 'My Health Records & Rx',
          tabBarLabel: 'Records',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📋</Text>,
        }}
      />
    </Tabs>
  );
}
