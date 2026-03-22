import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      sound: 'default',
    });
  }

  const { status } = await Notifications.getPermissionsAsync();

  if (status === 'granted') {
    return true;
  }

  const permissionResponse = await Notifications.requestPermissionsAsync();

  return permissionResponse.status === 'granted';
}

export async function sendLocalNewNoteNotification(title: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New note created',
      body: `Nytt notat: ${title}`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}