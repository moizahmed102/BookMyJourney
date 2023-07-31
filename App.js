import React, { useEffect } from "react";
import MainNavigator from "./mainnavigation";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar, Alert } from "react-native";
// import Constants from "expo-constants";
// import * as Notifications from "expo-notifications";

export default function AppWrapper() {
  //   // Function to request notification permissions and get FCM token
  //   const registerForPushNotificationsAsync = async () => {
  //     // Check if the app runs on a physical device (not in the Expo client)
  //     if (!Constants.isDevice) {
  //       Alert.alert("Notifications are not available in the Expo client.");
  //       return;
  //     }

  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;

  //     // If permission status is not granted, request permission
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }

  //     // If permission is still not granted, show an alert
  //     if (finalStatus !== "granted") {
  //       Alert.alert(
  //         "Notification Permissions",
  //         "You must grant notification permissions to receive notifications."
  //       );
  //       return;
  //     }

  //     // Get the FCM token
  //     const token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log("FCM Token:", token);
  //   };

  //   useEffect(() => {
  //     // Call the function to request permission and get FCM token
  //     registerForPushNotificationsAsync();
  //   }, []);

  return (
    <PaperProvider>
      <StatusBar backgroundColor="#008080" barStyle="light-content" />
      <App />
    </PaperProvider>
  );
}

function App() {
  return <MainNavigator />;
}
