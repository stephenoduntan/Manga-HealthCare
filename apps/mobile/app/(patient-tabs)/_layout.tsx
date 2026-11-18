import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

const TabsComponent = Tabs as any;

export default function PatientTabsLayout() {
  return (
    <TabsComponent
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
      <TabsComponent.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Manga Healthcare',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>,
        }}
      />
      <TabsComponent.Screen
        name="triage"
        options={{
          title: 'Triage Gate',
          headerTitle: 'Safety Triage',
          tabBarLabel: 'Consult',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>🩺</Text>,
        }}
      />
      <TabsComponent.Screen
        name="checkout"
        options={{
          title: 'Checkout',
          headerTitle: 'Payment & Confirm',
          href: null, // Hidden from tab bar; opened via navigation
        }}
      />
      <TabsComponent.Screen
        name="consultation/[id]"
        options={{
          title: 'Active Room',
          headerTitle: 'Consultation Room',
          href: null, // Hidden from tab bar; opened when call starts
        }}
      />
      <TabsComponent.Screen
        name="records"
        options={{
          title: 'Medical Records',
          headerTitle: 'My Records & Rx',
          tabBarLabel: 'Records',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>📄</Text>,
        }}
      />
    </TabsComponent>
  );
}
