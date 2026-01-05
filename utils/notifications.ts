import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when the app is running
// TEMPORARILY DISABLED FOR EXPO GO - Will work in production build
if (!__DEV__) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Request permissions for notifications
export async function requestNotificationPermissions(): Promise<boolean> {
  // Skip in dev mode (Expo Go)
  if (__DEV__) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// Schedule a notification for a planned joy
export async function schedulePlannedJoyNotification(
  joyId: string,
  title: string,
  date: Date
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return null;
    }

    // Use the exact date and time provided by the user
    const notificationDate = new Date(date);

    // Don't schedule if the date is in the past
    if (notificationDate < new Date()) {
      console.log('Joy date is in the past, not scheduling notification');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Today is your Planned Joy! 🎉",
        body: `${title} - Enjoy guilt-free, you deserve it! 💛`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { joyId, type: 'planned-joy' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      } as Notifications.DateTriggerInput,
    });

    console.log(`Scheduled notification ${notificationId} for ${title} on ${notificationDate}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

// Cancel a scheduled notification
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Cancelled notification ${notificationId}`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

// Update a notification (cancel old, schedule new)
export async function updatePlannedJoyNotification(
  oldNotificationId: string | undefined,
  joyId: string,
  title: string,
  date: Date
): Promise<string | null> {
  if (oldNotificationId) {
    await cancelNotification(oldNotificationId);
  }
  return await schedulePlannedJoyNotification(joyId, title, date);
}
