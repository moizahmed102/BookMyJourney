import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import {
  Modal,
  Portal,
  Provider,
  Button as PaperButton,
} from "react-native-paper";
import { firebase } from "../config";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";

const CityPicker = ({ selectedValue, onValueChange, label, disabled }) => {
  return (
    <Picker
      style={styles.picker}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      enabled={!disabled}
    >
      <Picker.Item label={label} value="" />
      <Picker.Item label="Lahore" value="Lahore" />
      <Picker.Item label="Islamabad" value="Islamabad" />
      <Picker.Item label="Rawalpindi" value="Rawalpindi" />
      <Picker.Item label="Murree" value="Murree" />
    </Picker>
  );
};

const BusSearch = () => {
  const navigation = useNavigation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [busServices, setBusServices] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  const handleFromChange = (value) => {
    setFrom(value);
    if (value === to) {
      setTo("");
    }
  };

  const handleToChange = (value) => {
    setTo(value);
    if (value === from) {
      setFrom("");
    }
  };

  // Function to handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date); // Convert to string using toISOString()
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const db = firebase.firestore();
      const collectionRef = db.collection("busservices");
      const querySnapshot = await collectionRef
        .where("from", "==", from)
        .where("to", "==", to)
        .get();
      const busServices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusServices(busServices);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching bus services:", error);
    }
  };

  const renderBusService = ({ item }) => (
    <TouchableOpacity
      style={styles.busServiceItem}
      onPress={() => {
        setSelectedBus(item);
        setModalVisible(true);
      }}
    >
      <Text>
        Route: {item.from} To {item.to}
      </Text>
      <Text>Departure Time: {item.departureTime}</Text>
      <Text>Arrival Time: {item.arrivalTime}</Text>
      <Text>Bus Service: {item.busService}</Text>
      <PaperButton
        mode="contained"
        textColor="#F0F0F5"
        onPress={() => {
          navigation.navigate("Bus Booking", {
            selectedBus: item,
            selectedDate: selectedDate, // Pass the selectedDate here
          });

          setModalVisible(false);
        }}
        style={styles.bookSeatsButton}
      >
        Book Seats
      </PaperButton>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/bus.jpg")}
          style={styles.imageBackground}
        />
        <Text style={styles.welcomeText}>
          With BookMyJourney you can book bus seats, To explore Adventures
          cities of Pakistan.
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.pick}>
            <CityPicker
              selectedValue={from}
              onValueChange={handleFromChange}
              label="Select Departure City"
              disabled={false}
            />
          </View>
          <View style={styles.pick}>
            <CityPicker
              selectedValue={to}
              onValueChange={handleToChange}
              label="Select Arrival City"
              disabled={from === ""}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.dateText}>
            Select Date: {selectedDate.toDateString()}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()} // Set minimum date to prevent selection of past dates
          date={selectedDate}
          onConfirm={handleDateChange}
          onCancel={() => setDatePickerVisible(false)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Search Bus</Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bus Search Results</Text>
            <FlatList
              data={busServices}
              renderItem={renderBusService}
              keyExtractor={(item) => item.id}
              style={styles.resultContainer}
            />
            <PaperButton onPress={() => setModalVisible(false)}>
              Close
            </PaperButton>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#008080",
    //flex: 1, // Make sure the container takes up the entire screen
  },
  contentContainer: {
    padding: 10, // Add padding around the content
    width: "100%", // Make sure the content takes the full width of the screen
  },
  pick: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "#008080",
    width: "100%", // Make sure the content takes the full width of the screen
  },
  imageContainer: {
    width: "100%",
    height: 150, // Set the desired height for the image and text container
  },
  welcomeText: {
    fontSize: 16,
    paddingHorizontal: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add a semi-transparent background for better text readability
    paddingVertical: 10,
    color: "#ffffff", // Set the color of the text
  },
  imageBackground: {
    width: "100%",
    height: "100%", // Adjust the height as per your requirements
    resizeMode: "cover", // Resize the image to cover the container
  },
  picker: {
    width: "100%",
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 9,
    justifyContent: "center",
    paddingLeft: 10,
    color: "#008080",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#008080",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    width: "100%",
  },
  busServiceItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 9,
    padding: 10,
  },
  dateInput: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 9,
    padding: 10,
    height: 50,
    justifyContent: "center",

    marginBottom: 10,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008080",
    borderRadius: 10,
  },
  // New styles for the modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background color for the modal
    justifyContent: "center",
    alignItems: "center",
    margin: 0, // Remove default margin to occupy the entire screen
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "90%", // Adjust the width of the modal content as per your preference
    maxHeight: "80%", // Adjust the max height of the modal content as per your preference
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#008080",
  },
  bookSeatsButton: {
    marginTop: 10,
    backgroundColor: "#008080",
  },
});

export default BusSearch;
