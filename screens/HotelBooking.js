import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Button, Card, Divider, TextInput } from "react-native-paper";
import { firebase } from "../config";
import MapView, { Marker } from "react-native-maps";

const HotelBookingScreen = () => {
  const mapRef = useRef(null);
  const route = useRoute();
  const {
    hotelName,
    checkInDate,
    checkOutDate,
    roomCount,
    adultCount,
    childCount,
    pricePerNight,
    address,
    id,
  } = route.params;

  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    // Function to fetch the coordinates from Firestore
    const fetchCoordinates = async () => {
      try {
        const locationSnapshot = await firebase
          .firestore()
          .collection("Hotel-Location")
          .doc(id) // Assuming the id matches the document id in the Hotel-Location collection
          .get();
        console.log(id);

        if (locationSnapshot.exists) {
          const { latitude, longitude } = locationSnapshot.data().location;
          setCoordinates({ latitude, longitude });
        } else {
          console.warn("Location not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchCoordinates();
  }, [id]);

  useEffect(() => {
    // After the coordinates have been set, animate the map to the pin location
    if (
      coordinates.latitude !== 0 &&
      coordinates.longitude !== 0 &&
      mapRef.current
    ) {
      mapRef.current.animateToRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [coordinates]);

  const getFormattedDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const calculateNumberOfNights = () => {
    const checkInTimestamp = checkInDate ? new Date(checkInDate).getTime() : 0;
    const checkOutTimestamp = checkOutDate
      ? new Date(checkOutDate).getTime()
      : 0;
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    return Math.ceil(
      (checkOutTimestamp - checkInTimestamp) / millisecondsInDay
    );
  };

  const numberOfNights = calculateNumberOfNights();
  const totalPayment = pricePerNight * numberOfNights * roomCount;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleBookingRequest = async () => {
    try {
      const currentUser = firebase.auth().currentUser;

      if (!currentUser) {
        // User is not logged in
        console.error("User is not logged in.");
        return;
      }

      const uid = currentUser.uid;
      const bookingData = {
        hotelName,
        checkInDate,
        checkOutDate,
        roomCount,
        adultCount,
        childCount,
        pricePerNight,
        address,
        numberOfNights,
        totalPayment,
        name,
        email,
        phone,
        uid, // Add UID of the logged-in user
      };
      const confirmed = await showPaymentConfirmationAlert(); // Show the payment confirmation alert

      if (confirmed) {
        // User selected "Pay Now"
        await firebase
          .firestore()
          .collection("Hotel-Bookings")
          .add(bookingData);
        alert("Hotel booking request has been sent successfully.");
      } else {
        // User selected "Cancel"
        // Do nothing or handle cancellation as needed.
      }
    } catch (error) {
      console.error("Error saving hotel booking:", error);
      alert(
        "An error occurred while sending the hotel booking request. Please try again."
      );
    }
  };

  const showPaymentConfirmationAlert = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Payment Confirmation",
        `Total Payment: Rs.${totalPayment}`,
        [
          {
            text: "Cancel",
            onPress: () => resolve(false), // User selected "Cancel"
            style: "cancel",
          },
          {
            text: "Book Now, Pay at Check-In",
            onPress: () => resolve(true), // User selected "Pay Now"
          },
        ],
        { cancelable: false }
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={[styles.card, { backgroundColor: "#DAECEC" }]}>
        <Card.Title title={hotelName} titleStyle={styles.heading} />
        <Card.Content>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Address: {address}</Text>
            <Divider style={styles.divider} />
            <Text style={styles.infoText}>Room Count: {roomCount}</Text>
            <Text style={styles.infoText}>Adult Count: {adultCount}</Text>
            <Text style={styles.infoText}>Child Count: {childCount}</Text>
            <Divider style={styles.divider} />
            <Text style={styles.infoText}>
              Price Per Night: {pricePerNight}
            </Text>
            <Text style={styles.infoText}>
              Check-In Date: {getFormattedDate(checkInDate)}
            </Text>
            <Text style={styles.infoText}>
              Check-Out Date: {getFormattedDate(checkOutDate)}
            </Text>
            <Text style={styles.infoText}>
              Number of Nights: {numberOfNights}
            </Text>
          </View>
          {checkInDate && checkOutDate && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.highlightContainer}>
                <Text style={styles.highlightText}>
                  Number of Nights: {numberOfNights}
                </Text>
              </View>
              <View style={styles.highlightContainer}>
                <Text style={styles.highlightText}>
                  Total Payment: Rs.{totalPayment}
                </Text>
              </View>
            </>
          )}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              }}
              title={hotelName}
            />
          </MapView>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleBookingRequest}
            style={styles.button}
            textColor="#F0F0F5"
          >
            Continue Booking
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "F0F0F5",
  },
  card: {
    elevation: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F1F29",
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoText: {
    marginBottom: 4,
    color: "#1F1F29",
  },
  map: {
    height: 200,
    marginVertical: 16,
  },
  divider: {
    marginVertical: 8,
  },
  highlightContainer: {
    backgroundColor: "#DAECEC",
    padding: 12,
    marginBottom: 8,
  },
  highlightText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  formContainer: {
    marginTop: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: "#DAECEC",
  },
  actions: {
    justifyContent: "flex-end",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#008080",
  },
});

export default HotelBookingScreen;
