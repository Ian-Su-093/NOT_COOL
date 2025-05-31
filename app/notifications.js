import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;

  try {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('New permission status:', finalStatus);
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      try {
        const tokenResponse = await Notifications.getExpoPushTokenAsync({
          projectId: "02c768ba-cfc4-4dec-9c78-7f6b256b3a89",
        });
        console.log("getToken");
        token = tokenResponse.data;
        console.log('Token response object:', JSON.stringify(tokenResponse));
        console.log('Expo Push Token:', token);
      } catch (tokenError) {
        console.log('Error getting push token:', tokenError);
        // Try alternative method for older Expo versions
        try {
          console.log("Trying alternative method");
          const legacyToken = await Notifications.getExpoPushTokenAsync();
          token = legacyToken.data;
          console.log('Legacy Expo Push Token:', token);
        } catch (legacyError) {
          console.log('Legacy method also failed:', legacyError);
        }
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Error in registerForPushNotificationsAsync:', error);
    return null;
  }
}