import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { firebase } from "../config";

const CreateGuideScreen = () => {
  const [guideId, setGuideId] = useState("");
  const [availability, setAvailability] = useState("Lahore");
  const [days, setDays] = useState("1 day");
  const [services, setServices] = useState("");
  const [price, setPrice] = useState("");
  const [benefits, setBenefits] = useState("");
  const [city, setCity] = useState("Lahore");
  const [vehicleType, setVehicleType] = useState("4 seater");
  const [rating, setRating] = useState(""); // Step 2

  const handleCreateGuide = () => {
    const db = firebase.firestore();

    const guideData = {
      guideId,
      availability,
      days,
      services,
      price,
      benefits,
      city,
      vehicleType,
      rating, // Step 4
    };

    db.collection("guides")
      .add(guideData)
      .then(() => {
        console.log("Guide created successfully!");
        Alert.alert("Success", "Guide created successfully!", [
          {
            text: "OK",
            onPress: () => {
              setGuideId("");
              setCity("Lahore");
              setAvailability("Lahore");
              setDays("1 day");
              setServices("");
              setPrice("");
              setBenefits("");
              setVehicleType("4 seater");
              setRating(""); // Clear the rating field
            },
          },
        ]);
      })
      .catch((error) => {
        console.error("Error creating guide:", error);
        Alert.alert("Error", "Failed to create guide.");
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Guide ID"
        value={guideId}
        onChangeText={(text) => setGuideId(text)}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>City:</Text>
        <Picker
          style={styles.picker}
          selectedValue={city}
          onValueChange={(itemValue) => setCity(itemValue)}
        >
          <Picker.Item label="Lahore" value="Lahore" />
          <Picker.Item label="Islamabad" value="Islamabad" />
          <Picker.Item label="Murree" value="Murree" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Availability:</Text>
        <Picker
          style={styles.picker}
          selectedValue={availability}
          onValueChange={(itemValue) => setAvailability(itemValue)}
        >
          <Picker.Item label="Lahore" value="Lahore" />
          <Picker.Item label="Islamabad" value="Islamabad" />
          <Picker.Item label="Murree" value="Murree" />
          <Picker.Item label="City to City" value="City to City" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Days:</Text>
        <Picker
          style={styles.picker}
          selectedValue={days}
          onValueChange={(itemValue) => setDays(itemValue)}
        >
          <Picker.Item label="1 day" value="1 day" />
          <Picker.Item label="2 days" value="2 days" />
          <Picker.Item label="3 days" value="3 days" />
          <Picker.Item label="4 days" value="4 days" />
          <Picker.Item label="5 days" value="5 days" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select vehicle type:</Text>
        <Picker
          style={styles.picker}
          selectedValue={vehicleType}
          onValueChange={(itemValue) => setVehicleType(itemValue)}
        >
          <Picker.Item label="4 seater" value="4 seater" />
          <Picker.Item label="7 seater" value="7 seater" />
          <Picker.Item label="11 seater" value="11 seater" />
          <Picker.Item label="15 seater" value="15 seater" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Services"
        value={services}
        onChangeText={(text) => setServices(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Benefits"
        value={benefits}
        onChangeText={(text) => setBenefits(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter the rating"
        value={rating}
        onChangeText={(text) => setRating(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateGuide}>
        <Text style={styles.buttonText}>Create Guide</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  picker: {
    flex: 1,
  },
  button: {
    backgroundColor: "#f86828",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateGuideScreen;
