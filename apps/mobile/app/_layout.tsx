import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { registerForPushNotificationsAsync } from '../src/services/notifications';

const StackComponent = Stack as any;

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor="#f8f3eb" />
      <StackComponent
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#f8f3eb',
          },
          animation: 'fade',
        }}
      >
        <StackComponent.Screen name="index" options={{ headerShown: false }} />
        <StackComponent.Screen name="(patient-tabs)" options={{ headerShown: false }} />
        <StackComponent.Screen name="(doctor-tabs)" options={{ headerShown: false }} />
      </StackComponent>
    </AuthProvider>
  );
}
