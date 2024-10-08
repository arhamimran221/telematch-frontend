import { PushNotifications } from "@capacitor/push-notifications";

export const registerPushNotifications = async () => {
  console.log("Initializing HomePage");
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === "granted") {
      PushNotifications.register();
    } else {
    }
  });

  PushNotifications.addListener("registration", (token) => {
    alert("Push registration success, token: " + token.value);
  });

  PushNotifications.addListener("registrationError", (error) => {
    alert("Error on registration: " + JSON.stringify(error));
  });

  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    alert("Push received: " + JSON.stringify(notification));
  });

  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {
      alert("Push action performed: " + JSON.stringify(notification));
    }
  );
};
