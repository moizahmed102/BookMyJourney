import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { Button, Card, List } from "react-native-paper";
import { firebase } from "../config";

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingType, setSelectedBookingType] = useState("hotel");
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  useEffect(() => {
    const unsubscribeBookings = subscribeToBookings(selectedBookingType);

    return () => {
      unsubscribeBookings();
    };
  }, [selectedBookingType]);

  const subscribeToBookings = (bookingType) => {
    try {
      setIsLoading(true); // Start loading

      const currentUserUid = firebase.auth().currentUser.uid;

      let bookingsRef;
      if (bookingType === "hotel") {
        bookingsRef = firebase
          .firestore()
          .collection("Hotel-Bookings")
          .where("uid", "==", currentUserUid);
      } else if (bookingType === "bus") {
        bookingsRef = firebase
          .firestore()
          .collection("userBookings")
          .where("userEmail", "==", firebase.auth().currentUser.email);
      } else if (bookingType === "guide") {
        bookingsRef = firebase
          .firestore()
          .collection("GuideBooked")
          .where("userEmail", "==", firebase.auth().currentUser.email);
      } else {
        return; // Invalid booking type, do nothing
      }

      return bookingsRef.onSnapshot((snapshot) => {
        const bookingsData = snapshot.docs.map((doc) => doc.data());
        setBookings(bookingsData);
        setIsLoading(false); // Stop loading
      });
    } catch (error) {
      console.error("Error subscribing to bookings:", error);
      setIsLoading(false); // Stop loading in case of an error
      Alert.alert(
        "Error",
        "An error occurred while subscribing to bookings. Please try again."
      );
    }
  };

  const renderBookingItem = ({ item }) => {
    const isHotelBooking = selectedBookingType === "hotel";
    const isBusBooking = selectedBookingType === "bus";
    const isGuideBooking = selectedBookingType === "guide";

    return (
      <Card style={[styles.bookingCard, { backgroundColor: "#DAECEC" }]}>
        {isHotelBooking && (
          <View>
            <Text style={styles.bookingText}>Hotel Name: {item.hotelName}</Text>
            <Text style={styles.bookingText}>
              Check-In Date: {item.checkInDate}
            </Text>
            <Text style={styles.bookingText}>
              Check-Out Date: {item.checkOutDate}
            </Text>
            <Text style={styles.bookingText}>Room Count: {item.roomCount}</Text>
            <Text style={styles.bookingText}>
              Total Payment: {item.totalPayment}
            </Text>
          </View>
        )}
        {isBusBooking && (
          <View>
            <Text style={styles.bookingText}>
              Departure Time: {item.departureTime}
            </Text>
            <Text style={styles.bookingText}>
              Bus Service: {item.busService}
            </Text>
            {/* <Text style={styles.bookingText}>
              Arrival Time: {item.arrivalTime}
            </Text> */}
            <Text style={styles.bookingText}>Price: {item.totalPrice}</Text>
            <Text style={styles.bookingText}>Route: {item.route}</Text>
            <Text style={styles.bookingText}>Date: {item.date}</Text>
            {item.selectedSeats && (
              <Text style={styles.bookingText}>
                Selected Seats: {item.selectedSeats.join(", ")}
              </Text>
            )}
          </View>
        )}
        {isGuideBooking && (
          <View>
            <Text style={styles.bookingText}>Days: {item.days}</Text>
            <Text style={styles.bookingText}>Guide ID: {item.guideId}</Text>
            <Text style={styles.bookingText}>Price: {item.price}</Text>
            <Text style={styles.bookingText}>Route: {item.route}</Text>
            <Text style={styles.bookingText}>
              Selected Date: {item.selectedDate}
            </Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      <View style={styles.buttonContainer}>
        <Button
          mode={selectedBookingType === "hotel" ? "contained" : "outlined"}
          onPress={() => setSelectedBookingType("hotel")}
          style={[
            styles.bookingButton,
            {
              backgroundColor:
                selectedBookingType === "hotel" ? "#008080" : "#F0F0F5",
            },
          ]}
          labelStyle={{
            ...styles.buttonText,
            color: selectedBookingType === "hotel" ? "#F0F0F5" : "#008080",
          }}
        >
          Hotels
        </Button>

        <Button
          mode={selectedBookingType === "bus" ? "contained" : "outlined"}
          onPress={() => setSelectedBookingType("bus")}
          style={[
            styles.bookingButton,
            {
              backgroundColor:
                selectedBookingType === "bus" ? "#008080" : "#F0F0F5",
            },
          ]}
          labelStyle={{
            ...styles.buttonText,
            color: selectedBookingType === "bus" ? "#F0F0F5" : "#008080",
          }}
        >
          Bus
        </Button>

        <Button
          mode={selectedBookingType === "guide" ? "contained" : "outlined"}
          onPress={() => setSelectedBookingType("guide")}
          style={[
            styles.bookingButton,
            {
              backgroundColor:
                selectedBookingType === "guide" ? "#008080" : "#F0F0F5",
            },
          ]}
          labelStyle={{
            ...styles.buttonText,
            color: selectedBookingType === "guide" ? "#F0F0F5" : "#008080",
          }}
        >
          Guides
        </Button>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#008080"
          style={{ marginTop: 20 }}
        />
      ) : bookings.length > 0 ? (
        <SectionList
          sections={[{ data: bookings }]}
          renderItem={renderBookingItem}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section: { data } }) => (
            <List.Section
              title={`${data.length} ${selectedBookingType} bookings`}
            />
          )}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <Text style={styles.noBookingsText}>No bookings found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  bookingButton: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  bookingCard: {
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
  bookingText: {
    marginBottom: 5,
  },
  noBookingsText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default MyBookingsScreen;
