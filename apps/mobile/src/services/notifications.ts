import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure default notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission not granted for push notifications.');
      return null;
    }

    // In native builds, this fetches the real FCM token
    const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
    token = tokenData?.data || 'simulated-fcm-device-token-' + Date.now();

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('manga_telemed_channel', {
        name: 'Manga Telemedicine Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#ff643b',
      });
    }
  } catch (error) {
    console.log('Error registering for push notifications:', error);
  }

  return token;
}

export async function sendLocalNotification(title: string, body: string, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // deliver immediately
  });
}
