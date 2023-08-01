import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView
import {
  TextInput as PaperTextInput,
  Button,
  Text,
  Card,
  Title,
} from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { firebase } from "../config";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Alert } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const HotelMap = () => {
  const navigation = useNavigation();
  const [city, setCity] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [activeDateInput, setActiveDateInput] = useState(null);
  const [datePickerKey, setDatePickerKey] = useState(0); // Add a new state for the date picker key
  const [roomCount, setRoomCount] = useState("1");
  const [adultCount, setAdultCount] = useState("1");
  const [childCount, setChildCount] = useState("0");
  const [hotels, setHotels] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const carouselRef = useRef(null);

  const showDatePicker = (dateInput) => {
    setActiveDateInput(dateInput);
    setDatePickerKey((prevKey) => prevKey + 1); // Generate a new key to force re-render of the date picker
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setActiveDateInput(null); // Clear the active date input when hiding the date picker
    setDatePickerVisible(false);
  };

  const handleConfirmDate = (date) => {
    if (activeDateInput === "checkInDate") {
      setCheckInDate(date);
    } else if (activeDateInput === "checkOutDate") {
      // Check if the selected check-out date is after the check-in date
      if (date.getTime() > checkInDate.getTime()) {
        setCheckOutDate(date);
      } else {
        // Show an alert or some indication that the check-out date must be after the check-in date
        console.log("Check-out date must be after the check-in date.");
        Alert.alert("Error", "Check-out date must be after the check-in date.");
        return;
      }
    }
    hideDatePicker();
  };
  const handleSearch = async () => {
    // Check if the city is selected
    if (city.trim() === "") {
      Alert.alert("Error", "Please select a city.");
      return;
    }

    // Check if both check-in and check-out dates are selected
    if (!checkInDate || !checkOutDate) {
      Alert.alert("Error", "Please select both check-in and check-out dates.");
      return;
    }

    // Check if the check-out date is after the check-in date
    if (checkOutDate.getTime() <= checkInDate.getTime()) {
      Alert.alert("Error", "Check-out date must be after the check-in date.");
      return;
    }

    // Check if check-in date is not in the past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
    if (checkInDate.getTime() < currentDate.getTime()) {
      Alert.alert("Error", "Check-in date cannot be in the past.");
      return;
    }

    try {
      const snapshot = await firebase
        .firestore()
        .collection("Hotel-Location")
        .where("city", "==", city)
        .get();
      const hotelData = snapshot.docs.map((doc) => doc.data());
      setHotels(hotelData);
      setModalVisible(true);
    } catch (error) {
      console.log("Error fetching hotel data:", error);
    }
  };

  const handleBookHotel = (hotel) => {
    const { name, pricePerNight, address, id } = hotel;
    navigation.navigate("Hotel Booking", {
      hotelName: name,
      checkInDate: checkInDate ? checkInDate.toISOString() : null,
      checkOutDate: checkOutDate ? checkOutDate.toISOString() : null,
      roomCount: roomCount,
      adultCount: adultCount,
      childCount: childCount,
      pricePerNight: pricePerNight,
      address: address,
      id: id,
    });
    setModalVisible(false); // Close the modal after navigating
  };

  const renderHotelItem = ({ item }) => (
    <Card style={[styles.hotelItem, { backgroundColor: "#DAECEC" }]}>
      <Card.Content>
        <Title style={styles.hotelName}>{item.name}</Title>
        <Text style={[styles.hotelDetailText, styles.hotelDetailHeading]}>
          Price per Night: <Text>{item.pricePerNight}</Text>
        </Text>
        <Text style={[styles.hotelDetailText, styles.hotelDetailHeading]}>
          Address: <Text>{item.address}</Text>
        </Text>
        <Text style={styles.hotelDetailHeading}>
          Description: <Text>{item.description}</Text>
        </Text>
        <Text style={styles.hotelDetailHeading}>
          Rating: <Text>{item.rating}</Text>
        </Text>
        {/* <Text style={styles.hotelDetailText}>
          Available Rooms: {item.availableRooms}
        </Text>
        <Text style={styles.hotelDetailText}>Id: {item.id}</Text> */}
      </Card.Content>
      <Card.Actions>
        <Button
          style={styles.bookButton}
          onPress={() => handleBookHotel(item)}
          mode="contained"
          textColor="#F0F0F5"
        >
          Book
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.upperContainer}>
          <View>
            <Image
              source={require("../assets/hotel1.jpg")}
              style={styles.carouselImage}
              resizeMode="cover"
            />
            <Text style={styles.welcomeText}>
              Embark on your next unforgettable adventure in the vibrant cities
              of Pakistan, Book now with Book My Journey!
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.cityContainer}>
                <Text style={styles.cityText}>Select City:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={city}
                  onValueChange={(itemValue) => setCity(itemValue)}
                >
                  <Picker.Item label="Select a city" value="" />
                  <Picker.Item label="Lahore" value="Lahore" />
                  <Picker.Item label="Islamabad" value="Islamabad" />
                  <Picker.Item label="Murree" value="Murree" />
                </Picker>
              </View>
              {/* Rest of the form */}
            </View>
            <Text style={styles.dateText}>Select Date:</Text>
            <View style={styles.dateContainer}>
              <Button
                style={styles.dateInput}
                mode="outlined"
                onPress={() => showDatePicker("checkInDate")} // Pass 'checkInDate' as the date input name
                textColor="#008080"
                icon={({ size, color }) => (
                  <MaterialIcons name="date-range" size={18} color="#008080" />
                )}
              >
                {checkInDate ? checkInDate.toDateString() : "Check-In"}
              </Button>
              <Button
                style={styles.dateInput}
                mode="outlined"
                onPress={() => showDatePicker("checkOutDate")} // Pass 'checkOutDate' as the date input name
                textColor="#008080"
                icon={({ size, color }) => (
                  <MaterialIcons name="date-range" size={18} color="#008080" />
                )}
              >
                {checkOutDate ? checkOutDate.toDateString() : "Check-Out"}
              </Button>
            </View>
            <Text style={styles.dateText}>Members Count:</Text>
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>Rooms:</Text>
              <PaperTextInput
                value={roomCount}
                onChangeText={setRoomCount}
                style={styles.counterInput}
                keyboardType="numeric"
                textColor="#008080"
              />
              <Text style={styles.counterText}>Adults:</Text>
              <PaperTextInput
                value={adultCount}
                onChangeText={setAdultCount}
                style={styles.counterInput}
                keyboardType="numeric"
                textColor="#008080"
              />
              <Text style={styles.counterText}>Children:</Text>
              <PaperTextInput
                value={childCount}
                onChangeText={setChildCount}
                style={styles.counterInput}
                keyboardType="numeric"
                textColor="#008080"
              />
            </View>
            <Button
              style={styles.searchButton}
              onPress={handleSearch}
              mode="contained"
              textColor="#F0F0F5" // Set the color for the search and book button
            >
              Search and Book
            </Button>
          </View>
          <Modal visible={isModalVisible} animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  style={styles.hotelList}
                  data={hotels}
                  renderItem={renderHotelItem}
                  keyExtractor={(item) => item.id.toString()}
                />
                <Button
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                  mode="contained"
                  textColor="#F0F0F5" // Set the color for the close button
                >
                  Close
                </Button>
              </View>
            </View>
          </Modal>
          {isModalVisible && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
              style={styles.overlay}
            />
          )}
          <DateTimePickerModal
            key={datePickerKey} // Use the key prop to force re-mount and re-render
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F5",
  },

  welcomeText: {
    fontSize: 20,
    color: "#008080",
    marginBottom: 10,
    paddingHorizontal: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    backgroundColor: "#F0F0F5",
  },
  upperContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  carouselImage: {
    marginTop: 0.5,
    width: screenWidth,
    height: 250,
  },
  formContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  cityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#008080", // Add a border color
    borderWidth: 1, // Add a border width
    borderRadius: 35, // Add border radius for rounded corners
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cityText: {
    marginRight: 8,
    fontWeight: "bold",
    color: "#1F1F29", // Change the text color
  },
  picker: {
    flex: 1,
    height: 30,
    color: "#008080", // Change the picker text color
  },
  dateText: {
    fontWeight: "bold",
    marginRight: 8,
    color: "#1F1F29",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  dateInput: {
    flex: 1,
    justifyContent: "flex-start",
    borderColor: "#008080",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  counterText: {
    marginRight: 8,
    color: "#1F1F29",
  },
  counterInput: {
    textAlign: "center",
    width: 50,
    marginRight: 8,
    backgroundColor: "#F0F0F5",
  },
  searchButton: {
    marginTop: 16,
    alignSelf: "center",
    width: "80%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F0F0F5",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#F0F0F5", // Change the modal card background color
    borderRadius: 8, // Add border radius for rounded corners
    padding: 5, // Add padding to the modal content
  },
  hotelList: {
    marginBottom: 8,
  },
  hotelItem: {
    marginBottom: 8,
    backgroundColor: "#F0F0F5", // Change the hotel card background color
    padding: 16, // Add padding to the hotel card content
    borderRadius: 8, // Add border radius for rounded corners
  },
  hotelName: {
    marginBottom: 4,
    color: "#1F1F29",
    fontSize: 18,
    fontWeight: "bold",
  },
  hotelDetailText: {
    color: "#1F1F29",
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 2,
    marginVertical: 4,
    lineHeight: 20,
    textAlign: "left",
    //textShadowColor: "#000",
    //textShadowOffset: { width: 1, height: 1 },
    //textShadowRadius: 2,
  },
  hotelDetailHeading: {
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#008080",
    marginTop: 8,
  },
  closeButton: {
    bottom: 10,
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default HotelMap;
