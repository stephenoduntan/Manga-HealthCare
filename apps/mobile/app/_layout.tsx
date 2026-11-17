import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { registerForPushNotificationsAsync } from '../src/services/notifications';

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor="#f8f3eb" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#f8f3eb',
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(patient-tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(doctor-tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
