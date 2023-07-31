import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Title, Subheading, Divider, Button } from "react-native-paper";
import { firebase } from "../config";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";

const GuideBooking = ({ route }) => {
  const {
    guideId,
    price,
    services,
    benefits,
    route: guideRoute,
    days,
    vehicleType,
  } = route.params;
  let actualGuideRoute = guideRoute || "Default Route";

  if (guideRoute === "Intracity") {
    actualGuideRoute = "Intracity Tour";
  }

  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [key, setKey] = useState(0); // Add a state variable for the key

  const showDatePicker = () => {
    setSelectedDate(null);
    setIsDatePickerVisible(true);
    setKey((prevKey) => prevKey + 1); // Increment the key to force re-render
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirmDate = (date) => {
    const currentDate = new Date();

    // Check if the selected date is in the past
    if (date < currentDate) {
      alert("Please select a future date for booking.");
      return; // Do not hide the date picker here to allow the user to select another date
    }

    setSelectedDate(date);
    hideDatePicker();
  };
  const bookGuide = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userEmail = user.email;

        if (!selectedDate) {
          alert("Please select a date to book the guide.");
          return;
        }

        const bookingData = {
          guideId,
          price,
          services,
          benefits,
          route: actualGuideRoute,
          days,
          vehicleType,
          userEmail,
          selectedDate: selectedDate.toISOString(),
        };

        await firebase.firestore().collection("GuideBooked").add(bookingData);

        alert("Booking successful!");
        navigation.goBack();
      } else {
        alert("Please log in to book a guide.");
      }
    } catch (error) {
      console.log("Error booking guide:", error);
      alert("An error occurred while booking the guide. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Guide Information</Title>
      <Divider />

      {/* Guide details */}
      <Text style={styles.guideDetails}>
        <Text style={styles.boldText}>Guide ID:</Text>{" "}
        <Text style={styles.darkGreenText}>{guideId}</Text>
      </Text>
      <Text style={styles.guideDetails}>
        <Text style={styles.boldText}>Price:</Text>{" "}
        <Text style={styles.darkGreenText}>{price}</Text>
      </Text>
      <Text style={styles.guideDetails}>
        <Text style={styles.boldText}>Services:</Text>{" "}
        <Text style={styles.darkGreenText}>{services}</Text>
      </Text>
      <Text style={styles.guideDetails}>
        <Text style={styles.boldText}>Benefits:</Text>{" "}
        <Text style={styles.darkGreenText}>{benefits}</Text>
      </Text>
      <Text style={styles.guideDetails}>
        <Text style={styles.boldText}>Route:</Text>{" "}
        <Text style={styles.darkGreenText}>{guideRoute}</Text>
      </Text>
      <Text style={styles.guideDetails}>
        <Text style={styles.boldText}>Days:</Text>{" "}
        <Text style={styles.darkGreenText}>{days}</Text>
      </Text>
      <Text style={styles.guideDetails}>
        <Text style={styles.boldText}>Vehicle Type:</Text>{" "}
        <Text style={styles.darkGreenText}>{vehicleType}</Text>
      </Text>

      {/* Date picker */}
      <Button
        mode="outlined"
        onPress={showDatePicker}
        style={styles.datePickerButton}
        labelStyle={{ color: "#008080" }} // Set button label color
      >
        {selectedDate ? selectedDate.toDateString() : "Select Date"}
      </Button>

      {/* Book button with icon */}
      <Button
        mode="contained"
        onPress={bookGuide}
        style={styles.bookButton}
        icon={({ color, size }) => (
          <MaterialIcons name="event-available" color={color} size={size} />
        )}
      >
        <Text style={styles.buttonText}>Book Now</Text>
      </Button>

      {/* Date picker */}
      {isDatePickerVisible && (
        <DateTimePickerModal
          key={key}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "F0F0F5",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F1F29", // Set title color
  },
  boldText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F29",
  },
  darkGreenText: {
    margin: 10,
    marginBottom: 10,
    fontSize: 18,
    color: "#1F1F29", // Set dark green text color
  },
  guideDetails: {
    marginBottom: 12,
  },
  datePickerButton: {
    marginVertical: 10,
    alignSelf: "center",
    borderColor: "#008080", // Set border color
  },
  bookButton: {
    marginVertical: 20,
    backgroundColor: "#008080", // Set button background color
  },
  buttonText: {
    color: "#F0F0F5", // Set button text color
  },
});

export default GuideBooking;
