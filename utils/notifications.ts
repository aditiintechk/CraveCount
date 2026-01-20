import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // For Android, set up notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('planned-joys', {
        name: 'Planned Joys',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366f1',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

export async function schedulePlannedJoyNotification(
  joyId: string,
  title: string,
  date: Date
): Promise<string | null> {
  try {
    console.log('schedulePlannedJoyNotification called with:', { joyId, title, date });

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('No notification permission, skipping schedule');
      return null;
    }

    const trigger = new Date(date);
    const now = new Date();

    console.log('Trigger time:', trigger.toISOString());
    console.log('Current time:', now.toISOString());

    // Don't schedule notifications in the past
    if (trigger <= now) {
      console.log('Notification time is in the past, skipping');
      return null;
    }

    console.log('About to schedule notification...');

    // Calculate seconds until trigger time
    const secondsUntilTrigger = Math.floor((trigger.getTime() - now.getTime()) / 1000);
    console.log('Seconds until trigger:', secondsUntilTrigger);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌟 Time for Planned Joy!',
        body: title,
        data: { joyId },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: 'timeInterval',
        seconds: secondsUntilTrigger,
        channelId: Platform.OS === 'android' ? 'planned-joys' : undefined,
      } as any,
    });

    console.log(`✅ Scheduled notification ${notificationId} for ${trigger.toLocaleString()}`);
    return notificationId;
  } catch (error) {
    console.error('❌ Error scheduling notification:');
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Full error:', JSON.stringify(error, null, 2));
    }
    return null;
  }
}

export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Cancelled notification ${notificationId}`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

export async function updatePlannedJoyNotification(
  oldNotificationId: string | undefined,
  joyId: string,
  title: string,
  date: Date
): Promise<string | null> {
  try {
    // Cancel old notification if it exists
    if (oldNotificationId) {
      await cancelNotification(oldNotificationId);
    }

    // Schedule new notification
    return await schedulePlannedJoyNotification(joyId, title, date);
  } catch (error) {
    console.error('Error updating notification:', error);
    return null;
  }
}
