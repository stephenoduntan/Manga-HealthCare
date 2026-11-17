import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function DoctorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f3eb',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(8, 3, 49, 0.1)',
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
        tabBarActiveTintColor: '#080331',
        tabBarInactiveTintColor: '#747679',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Doctor Workspace',
          headerTitle: 'Doctor & Locum Portal',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="consultation/[id]"
        options={{
          title: 'Consultation & EHR',
          headerTitle: 'Active Clinical EHR',
          tabBarLabel: 'Consult Room',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🩺</Text>,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Availability',
          headerTitle: 'Schedule & Slots',
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📅</Text>,
        }}
      />
    </Tabs>
  );
}
