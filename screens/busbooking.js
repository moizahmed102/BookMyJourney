import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { firebase } from "../config";

const BusBookingScreen = ({ route }) => {
  const { selectedBus, selectedDate } = route.params;
  console.log(route.params);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setTotalPrice(selectedSeats.length * selectedBus.price);
  }, [selectedSeats, selectedBus.price]);

  const handleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.filter((seat) => seat !== seatNumber)
      );
    } else {
      if (selectedSeats.length < 5) {
        setSelectedSeats((prevSelectedSeats) => [
          ...prevSelectedSeats,
          seatNumber,
        ]);
      }
    }
  };

  const handleConfirmSeats = () => {
    const totalPrice = selectedSeats.length * selectedBus.price;

    const bookingData = {
      userId: currentUser?.uid,
      userEmail: currentUser?.email,
      busServiceId: selectedBus.id,
      selectedSeats: selectedSeats,
      date: selectedDate.toISOString(),
      totalPrice: totalPrice,
      route: `${selectedBus.from} To ${selectedBus.to}`,
      departureTime: selectedBus.departureTime,
      busService: selectedBus.busService,
      humanFriendlyDate: selectedDate.toDateString(),
    };

    const db = firebase.firestore();

    db.collection("busservices")
      .doc(selectedBus.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const busServiceData = doc.data();
          const bookedSeats = busServiceData.bookedSeats || [];

          const alreadyBookedSeats = selectedSeats.filter((seatNumber) =>
            bookedSeats.includes(seatNumber)
          );

          if (alreadyBookedSeats.length > 0) {
            alert(
              `Selected seats ${alreadyBookedSeats.join(
                ", "
              )} are already booked. Please select different seats.`
            );
          } else {
            db.collection("userBookings")
              .add(bookingData)
              .then(() => {
                // Save booked seats to the bus service document
                const updatedBookedSeats = [...bookedSeats, ...selectedSeats];
                db.collection("busservices").doc(selectedBus.id).update({
                  bookedSeats: updatedBookedSeats,
                });

                alert(
                  `Seats booked successfully! Total Price: Rs.${totalPrice}`
                );
              })
              .catch((error) => {
                console.error("Error booking seats:", error);
              });
          }
        } else {
          console.log("Bus service data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching bus service data:", error);
      });

    setConfirmModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Bus Details</Text>
        <Text>
          Route: {selectedBus.from} To {selectedBus.to}
        </Text>
        <Text>Departure Time: {selectedBus.departureTime}</Text>
        <Text>Arrival Time: {selectedBus.arrivalTime}</Text>
        <Text>Bus Service: {selectedBus.busService}</Text>
        <Text>Price: Rs.{selectedBus.price}</Text>
        <Text>Seats Available: {selectedBus.seatsAvailable}</Text>
        <Text>Date: {selectedDate.toDateString()}</Text>

        <Text style={styles.seatSelectionTitle}>Select up to 5 seats:</Text>
        <View style={styles.seatContainer}>
          {[...Array(10)].map((_, index) => {
            const seatNumber = index + 1;
            const isSelected = selectedSeats.includes(seatNumber);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.seat,
                  isSelected && styles.selectedSeat,
                  selectedSeats.length === 5 &&
                    !isSelected &&
                    styles.disabledSeat,
                ]}
                onPress={() => handleSeatSelection(seatNumber)}
                disabled={selectedSeats.length === 5 && !isSelected}
              >
                <Text style={styles.seatText}>{seatNumber}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => setConfirmModalVisible(true)}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.bookButtonText}>Book Seat</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        visible={isConfirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.confirmModalContainer}>
          <Text style={styles.confirmModalTitle}>Confirm Selected Seats</Text>
          <Text>Total Price: {totalPrice}</Text>
          <Text>Selected Seats: {selectedSeats.join(", ")}</Text>
          <Text>Date: {selectedDate.toDateString()}</Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmSeats}
            disabled={selectedSeats.length === 0}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setConfirmModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderColor: "#008080",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  seatSelectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  seatContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  seat: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#008080",
    backgroundColor: "#fff",
  },
  selectedSeat: {
    backgroundColor: "#008080",
  },
  disabledSeat: {
    opacity: 0.5,
  },
  seatText: {
    color: "#008080",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#008080",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  confirmModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#008080",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#d3d3d3",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BusBookingScreen;
