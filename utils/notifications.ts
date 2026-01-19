// Notifications disabled - not supported in Expo Go
// Will need to implement in standalone build with expo-notifications

// Placeholder functions to prevent errors
export async function requestNotificationPermissions(): Promise<boolean> {
  console.log('Notifications not available in Expo Go');
  return false;
}

export async function schedulePlannedJoyNotification(
  joyId: string,
  title: string,
  date: Date
): Promise<string | null> {
  console.log('Notifications not available in Expo Go');
  return null;
}

export async function cancelNotification(notificationId: string): Promise<void> {
  console.log('Notifications not available in Expo Go');
}

export async function updatePlannedJoyNotification(
  oldNotificationId: string | undefined,
  joyId: string,
  title: string,
  date: Date
): Promise<string | null> {
  console.log('Notifications not available in Expo Go');
  return null;
}
