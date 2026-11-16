import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f3eb',
        },
        headerTintColor: '#080331',
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: '#f8f3eb',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Manga Healthcare',
        }}
      />
      <Stack.Screen
        name="triage"
        options={{
          title: 'Emergency Triage Check',
          headerBackTitle: 'Cancel',
        }}
      />
    </Stack>
  );
}
