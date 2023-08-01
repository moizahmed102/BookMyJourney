import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { firebase } from "../config";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";

const HotelLocationScreen = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [city, setCity] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState("1");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [isCheckInPickerVisible, setCheckInPickerVisible] = useState(false);
  const [isCheckOutPickerVisible, setCheckOutPickerVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [location, setLocation] = useState(null);

  const handleCreateHotelLocation = async () => {
    if (
      name === "" ||
      rating === "" ||
      city === "" ||
      numberOfRooms === "" ||
      checkInDate === null ||
      checkOutDate === "" ||
      description === "" ||
      address === "" ||
      pricePerNight === ""
    ) {
      Alert.alert("Fill all the fields.");
      return;
    }

    if (parseInt(pricePerNight) > 40000) {
      Alert.alert(
        "Invalid price per night. Please enter a value less than Rs. 40000."
      );
      return;
    }

    try {
      const db = firebase.firestore();

      // Get the current count of documents in the "Hotel-Location" collection
      const collectionRef = db.collection("Hotel-Location");
      const querySnapshot = await collectionRef.get();
      const count = querySnapshot.size;

      // Create a new document with the sequential ID
      const sequentialId = (count + 1).toString().padStart(2, "0"); // Add leading zero if necessary
      await collectionRef.doc(sequentialId).set({
        // Other hotel details...
        location,
        availableRooms: parseInt(numberOfRooms),
        bookedRooms: 0,
        id: sequentialId,
        name,
        rating,
        city,
        numberOfRooms,
        checkInDate,
        checkOutDate,
        description,
        address,
        pricePerNight: parseInt(pricePerNight),
      });

      // Clear input fields after submission
      setName("");
      setRating("");
      setCity("");
      setNumberOfRooms("1");
      setCheckInDate(null);
      setCheckOutDate(null);
      setDescription("");
      setAddress("");
      setPricePerNight("");

      Alert.alert("Hotel information is successfully saved.");
    } catch (error) {
      console.error("Error creating hotel location:", error);
      Alert.alert("An error occurred while creating the hotel location.");
    }
  };

  const showCheckInPicker = () => {
    setCheckInPickerVisible(true);
  };

  const hideCheckInPicker = () => {
    setCheckInPickerVisible(false);
  };

  const handleCheckInConfirm = (date) => {
    setCheckInDate(date);
    hideCheckInPicker();
  };

  const showCheckOutPicker = () => {
    setCheckOutPickerVisible(true);
  };

  const hideCheckOutPicker = () => {
    setCheckOutPickerVisible(false);
  };

  const handleCheckOutConfirm = (date) => {
    setCheckOutDate(date);
    hideCheckOutPicker();
  };
  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setLocation(coordinate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MapView style={styles.map} onPress={handleMapPress}>
        {location && <Marker coordinate={location} />}
      </MapView>
      {/* <TouchableOpacity style={styles.input} onPress={showCheckInPicker}>
        <Text>
          {checkInDate ? checkInDate.toDateString() : "Select Check-in Date"}
        </Text>
      </TouchableOpacity> */}
      {/* <DateTimePickerModal
          isVisible={isCheckInPickerVisible}
          mode="date"
          onConfirm={handleCheckInConfirm}
          onCancel={hideCheckInPicker}
        />
        <TouchableOpacity style={styles.input} onPress={showCheckOutPicker}>
          <Text>{checkOutDate ? checkOutDate.toDateString() : 'Select Check-out Date'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isCheckOutPickerVisible}
          mode="date"
          onConfirm={handleCheckOutConfirm}
          onCancel={hideCheckOutPicker}
        /> */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#808080"
        />
        <TextInput
          style={styles.input}
          placeholder="Rating"
          value={rating}
          onChangeText={setRating}
          placeholderTextColor="#808080"
        />
        <TouchableOpacity
          style={styles.cityPicker}
          onPress={() =>
            Alert.alert("Select City", "", [
              { text: "Lahore", onPress: () => setCity("Lahore") },
              { text: "Islamabad", onPress: () => setCity("Islamabad") },
              { text: "Murree", onPress: () => setCity("Murree") },
            ])
          }
        >
          <Text style={styles.cityPickerText}>
            {city ? city : "Select City"}
          </Text>
        </TouchableOpacity>
        <Picker
          style={styles.picker}
          selectedValue={numberOfRooms}
          onValueChange={(value) => setNumberOfRooms(value)}
        >
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6" value="6" />
          <Picker.Item label="7" value="7" />
          <Picker.Item label="8" value="8" />
          <Picker.Item label="9" value="9" />
        </Picker>
        <TouchableOpacity style={styles.input} onPress={showCheckInPicker}>
          <Text>
            {checkInDate ? checkInDate.toDateString() : "Select Check-in Date"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input} onPress={showCheckOutPicker}>
          <Text>
            {checkOutDate
              ? checkOutDate.toDateString()
              : "Select Check-out Date"}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#808080"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#808080"
        />
        <TextInput
          style={styles.input}
          placeholder="Price per Night (Rs.)"
          value={pricePerNight}
          onChangeText={setPricePerNight}
          keyboardType="numeric"
          placeholderTextColor="#808080"
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateHotelLocation}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  formContainer: {
    width: "100%",
    marginBottom: 24,
    marginTop: 30,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  cityPicker: {
    width: "100%",
    height: 48,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 16,
  },
  cityPickerText: {
    fontSize: 16,
    color: "#000",
  },
  picker: {
    width: "100%",
    height: 48,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#6200EE",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
});

export default HotelLocationScreen;
