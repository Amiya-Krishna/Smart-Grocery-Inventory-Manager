export const askNotificationPermission = async () => {
  return await Notification.requestPermission();
};

export const sendNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icon.png",
    });
  }
};